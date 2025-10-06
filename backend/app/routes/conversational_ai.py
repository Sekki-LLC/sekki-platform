"""
Conversational AI Route for Sekki Market IQ — file-backed sessions (multi-worker safe)
"""
from __future__ import annotations
import os, json, time, uuid
from pathlib import Path
from typing import Any, Dict, List, Optional
from flask import Blueprint, request, jsonify, current_app, make_response
from dotenv import load_dotenv
import anthropic

# Load .env early; systemd also injects env
load_dotenv(dotenv_path='/home/sekki/sekki-platform/backend/.env')

# Anthropic client / model from env (defaults to a stable "latest" alias)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL   = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-5")
CLIENT: Optional[anthropic.Anthropic] = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

# File-backed sessions (shared by all Gunicorn workers)
SESS_DIR = Path(os.getenv("SESSION_DIR", "/home/sekki/sekki-platform/backend/runtime/sessions"))
SESS_DIR.mkdir(parents=True, exist_ok=True)

# History caps (avoid token bloat)
MAX_HISTORY_CHARS = int(os.getenv("MAX_HISTORY_CHARS", "20000"))
MAX_TOKENS        = int(os.getenv("ANTHROPIC_MAX_TOKENS", "1024"))
TEMPERATURE       = float(os.getenv("ANTHROPIC_TEMPERATURE", "0.2"))

SYSTEM_PROMPT = """You are Sekki's market analysis copilot. Be conversational and avoid repeating questions already answered in this session. Build on prior context to advance the analysis for sekki.io."""

conversational_ai_bp = Blueprint("conversational_ai", __name__)

def _sid_from_request() -> str:
    sid = request.headers.get("X-Session-ID") or request.cookies.get("sekki_sid")
    return sid or f"conv_{uuid.uuid4().hex[:12]}"

def _p(sid: str) -> Path:
    return SESS_DIR / f"{sid}.json"

def _load_session(sid: str) -> Dict[str, Any]:
    fp = _p(sid)
    if not fp.exists():
        return {"id": sid, "messages": [], "created_at": int(time.time())}
    try:
        return json.loads(fp.read_text(encoding="utf-8"))
    except Exception as e:
        current_app.logger.error(f"session_load_error sid={sid}: {e}")
        return {"id": sid, "messages": [], "created_at": int(time.time())}

def _save_session(sess: Dict[str, Any]) -> None:
    sid = sess["id"]
    tmp = _p(f"{sid}.{int(time.time()*1000)}.tmp")
    dst = _p(sid)
    try:
        tmp.write_text(json.dumps(sess, ensure_ascii=False), encoding="utf-8")
        tmp.replace(dst)  # atomic
    except Exception as e:
        current_app.logger.error(f"session_save_error sid={sid}: {e}")

def _trim_by_chars(history: List[Dict[str, str]], max_chars: int) -> List[Dict[str, str]]:
    total = 0
    out: List[Dict[str, str]] = []
    for m in reversed(history):
        c = m.get("content") or ""
        if total + len(c) > max_chars and out:
            break
        out.append(m)
        total += len(c)
    return list(reversed(out))


def _anthropic_reply(history: List[Dict[str, str]]) -> str:
    if not CLIENT:
        return "(server missing ANTHROPIC_API_KEY)"
    msgs = [
        {"role": m.get("role"), "content": m.get("content", "")}
        for m in history
        if m.get("role") in ("user", "assistant") and (m.get("content") or "").strip()
    ]
    for _ in range(2):
        try:
            resp = CLIENT.messages.create(
                model=ANTHROPIC_MODEL,
                system=SYSTEM_PROMPT,  # <-- top-level system, not a message
                max_tokens=MAX_TOKENS,
                temperature=TEMPERATURE,
                messages=msgs,
            )
            parts = []
            for blk in resp.content:
                if getattr(blk, "type", None) == "text":
                    parts.append(blk.text)
            return ("".join(parts)).strip() or "(no content)"
        except Exception as e:
            current_app.logger.warning(f"anthropic_call_failed: {e}")
    return "(anthropic error)"

@conversational_ai_bp.route("/health", methods=["GET"])
def health() -> Any:
    return jsonify({"ok": True, "model": ANTHROPIC_MODEL, "client": bool(CLIENT)}), 200

@conversational_ai_bp.route("/chat", methods=["POST"])
def chat() -> Any:
    data = request.get_json(silent=True) or {}
    user_text = (data.get("message") or "").strip()
    if not user_text:
        return jsonify({"error": "message is required"}), 400

    sid = _sid_from_request()
    sess = _load_session(sid)

    # Append user turn
    sess.setdefault("messages", []).append({"role": "user", "content": user_text, "ts": int(time.time())})

    # Trim and get reply
    history = _trim_by_chars(sess["messages"], MAX_HISTORY_CHARS)
    reply = _anthropic_reply(history)

    # Append assistant turn and persist
    sess["messages"].append({"role": "assistant", "content": reply, "ts": int(time.time())})
    _save_session(sess)

    # Response (sets cookie if needed)
    resp = make_response(jsonify({"session_id": sid, "reply": reply}))
    if not request.cookies.get("sekki_sid"):
        # Cookie must be accessible by frontend JS for fetch; httponly False by design.
        resp.set_cookie(
            "sekki_sid",
            value=sid,
            max_age=30 * 24 * 3600,
            secure=True,
            httponly=False,
            samesite="None",
        )
    return resp
