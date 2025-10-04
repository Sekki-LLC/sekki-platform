import os, json
from typing import Dict, List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

MODEL_QGEN = os.getenv("OPENAI_MODEL_QGEN") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
TONE = os.getenv("MARKET_IQ_TONE", "warm, consultative, concise, pragmatic")
MAX_AUTOFILL = max(0, int(os.getenv("MARKET_IQ_MAX_AUTOFILL", "1")))
CONFIDENCE_THRESHOLD = float(os.getenv("MARKET_IQ_CONFIDENCE_THRESHOLD", "0.68"))
MIN_ANSWERS = max(1, int(os.getenv("MARKET_IQ_MIN_ANSWERS", "6")))

_client = OpenAI()

def _safe_json(s: str) -> dict:
    try:
        return json.loads(s or "{}")
    except Exception:
        return {}

def interview_step(description: str, answers: Dict[str, str], latest_text: str, remaining_fields: List[str]) -> Dict:
    """
    Returns JSON like:
      {"added": {...}, "next_field": str|None, "next_question": str|None, "finalize": bool, "confidence": float}
    Always returns a valid dict (never raises).
    """
    # Default fallback (used if LLM is down or weird)
    fallback = {
        "added": {},
        "next_field": (remaining_fields[0] if remaining_fields else None),
        "next_question": None,
        "finalize": False,
        "confidence": 0.0,
    }

    if fallback["next_field"] is None:
        # Nothing left to ask; suggest finalizing
        fallback["finalize"] = True
        return fallback

    sys = (
        "You are Market IQ, an expert consultant running a short intake.\n"
        f"Tone: {TONE}. Ask at most one crisp, natural question per turn.\n"
        "Tasks this turn:\n"
        "1) From the user's latest text, infer up to MAX_AUTOFILL missing fields only if explicit.\n"
        "2) Decide if we have enough to score (confidence 0..1).\n"
        "3) If not finalizing, choose ONE next field from remaining_fields and ask ONE short question.\n"
        "Return STRICT JSON only:\n"
        "{ \"added\": {\"<field>\": \"<value>\"}, \"confidence\": 0.0, \"finalize\": false, "
        "\"next_field\": \"<field or null>\", \"next_question\": \"<one sentence or null>\" }"
    )

    user = {
        "project_description": description or "",
        "latest_user_text": latest_text or "",
        "already_answered": answers or {},
        "remaining_fields": remaining_fields or [],
        "MAX_AUTOFILL": MAX_AUTOFILL,
    }

    try:
        resp = _client.chat.completions.create(
            model=MODEL_QGEN,
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[{"role":"system","content":sys},
                      {"role":"user","content":json.dumps(user, ensure_ascii=False)}],
        )
        data = _safe_json(resp.choices[0].message.content)
    except Exception:
        return fallback

    added = data.get("added") or {}
    ordered = [k for k in remaining_fields if k in added and str(added[k]).strip()]
    added_limited = {k: added[k] for k in ordered[:MAX_AUTOFILL]}

    next_field = data.get("next_field") if data.get("next_field") in remaining_fields else None
    next_question = (data.get("next_question") or "").strip() or None
    try:
        confidence = float(data.get("confidence") or 0.0)
    except Exception:
        confidence = 0.0
    finalize = bool(data.get("finalize")) and (confidence >= CONFIDENCE_THRESHOLD)

    out = {
        "added": added_limited,
        "next_field": next_field or fallback["next_field"],
        "next_question": next_question,
        "finalize": finalize,
        "confidence": confidence,
    }
    if out["next_question"] is None and out["next_field"]:
        # Minimal, friendly default if the model didn't provide one
        out["next_question"] = f"Could you share a quick detail for {out['next_field'].replace('_',' ')}?"
    return out
