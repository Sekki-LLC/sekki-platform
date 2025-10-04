from __future__ import annotations
import json, os, re, uuid
from copy import deepcopy
from pathlib import Path
from typing import Dict, Any
from flask import Blueprint, request, jsonify, current_app

market_iq_analyze_bp = Blueprint("market_iq_analyze", __name__)

ROOT = Path(__file__).resolve().parents[2]
SESS_DIR = Path(os.getenv("SESSION_DIR", ROOT / "runtime" / "sessions"))

def _load_transcript(session_id: str) -> str:
    p = SESS_DIR / f"{session_id}.json"
    if p.exists():
        try:
            j = json.loads(p.read_text()); hist = j.get("history", [])
            lines=[]
            for m in hist:
                role = "User" if m.get("role")=="user" else "AI"
                c = (m.get("content") or "").strip()
                if c: lines.append(f"{role}: {c}")
            return "\n".join(lines)
        except Exception:
            return ""
    return ""

def _heuristic_analysis(transcript: str) -> Dict[str, Any]:
    ln = max(1, len(transcript.splitlines()))
    score = max(40, min(92, 55 + min(30, ln//4)))
    return {
        "project_name": "Market IQ Project",
        "market_iq_score": score,
        "summary": "Auto-generated from conversation transcript.",
        "component_scores": {
            "financial_health": score-7, "operational_efficiency": score-6,
            "market_position": score-5, "execution_readiness": score-8
        },
        "financial_impact": {
            "ebitda_at_risk": "Medium", "roi_opportunity": "Moderate",
            "projected_ebitda": "$1.2M", "potential_loss": "$0"
        },
        "key_insights": [], "top_risks": [], "recommendations": []
    }

@market_iq_analyze_bp.route("/analyze", methods=["POST"])
def analyze_from_conversation():
    """Accepts {session_id, transcript, docType} -> {analysis_result}"""
    p = request.get_json(silent=True) or {}
    sid = (p.get("session_id") or "").strip()
    transcript = (p.get("transcript") or "").strip() or (_load_transcript(sid) if sid else "")
    current_app.logger.info("analyze: sid=%s chars=%d", sid or "-", len(transcript))
    if not transcript:
        return jsonify({"error":"No transcript"}), 400
    result = _heuristic_analysis(transcript)
    result["analysis_id"] = sid or f"analysis_{uuid.uuid4().hex[:8]}"
    return jsonify({"analysis_result": result, "analysis_id": result["analysis_id"]})

@market_iq_analyze_bp.route("/scenario", methods=["POST"])
def scenario_apply():
    """
    Accepts {analysis_id, analysis_result, changes}
    Supports:
      - market_iq_score: +/− int
      - component_scores: {key: +/−int}
      - financial_impact: {key: any}
      - budget: { deltaPercent: number }  # optional convenience
    """
    p = request.get_json(silent=True) or {}
    analysis = deepcopy(p.get("analysis_result") or {})
    if not analysis:
        return jsonify({"error":"analysis_result_required"}), 400
    changes = p.get("changes") or {}

    def clamp(v, lo, hi):
        try: return int(max(lo, min(hi, int(v))))
        except Exception: return v

    if isinstance(changes.get("market_iq_score"), (int, float)):
        analysis["market_iq_score"] = clamp(
            analysis.get("market_iq_score", 60) + int(changes["market_iq_score"]), 1, 99
        )

    comps = analysis.setdefault("component_scores", {})
    for k, v in (changes.get("component_scores") or {}).items():
        try: comps[k] = clamp(int(comps.get(k, 60)) + int(v), 0, 100)
        except Exception: pass

    fin = analysis.setdefault("financial_impact", {})
    for k, v in (changes.get("financial_impact") or {}).items(): fin[k] = v

    # budget.deltaPercent → simple, explainable mapping
    b = (changes.get("budget") or {})
    try: dp = float(b.get("deltaPercent", None))
    except Exception: dp = None
    if dp is not None:
        delta_score = clamp(round(dp/20.0), -5, 5)
        delta_exec  = clamp(round(dp/10.0), -6, 6)
        delta_fin   = clamp(round(dp/15.0), -6, 6)
        analysis["market_iq_score"] = clamp(analysis.get("market_iq_score", 60) + delta_score, 1, 99)
        comps["execution_readiness"] = clamp(int(comps.get("execution_readiness", 60)) + delta_exec, 0, 100)
        comps["financial_health"]    = clamp(int(comps.get("financial_health", 60)) + delta_fin, 0, 100)
        roi = fin.get("roi_opportunity", "Moderate")
        if dp >= 20: roi = "Higher"
        elif dp <= -20: roi = "Lower"
        fin["roi_opportunity"] = roi
        analysis.setdefault("scenario_changes_applied", {})["budget"] = {"deltaPercent": dp}

    return jsonify(analysis)
