import os, json
from typing import Dict, List
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

# Config
MODEL_QGEN = os.getenv("OPENAI_MODEL_QGEN") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
TONE = os.getenv("MARKET_IQ_TONE", "friendly, pragmatic, concise")

# SINGLE client instance (the previous version accidentally recursed)
client = OpenAI()

def _safe_json(s: str) -> dict:
    try:
        return json.loads(s or "{}")
    except Exception:
        return {}

def extract_fields(description: str, answers: Dict, latest_text: str, remaining_fields: List[str]) -> Dict:
    """
    Infer any remaining fields from the user's latest answer and the description.
    Returns a dict of {field: inferred_value}. Be conservative.
    """
    if not remaining_fields:
        return {}

    sys = (
        "You are assisting with a short business intake. "
        "Extract values for any of the remaining fields from the provided text. "
        "Only include fields that are clearly present and map directly. "
        "Return STRICT JSON: {\"extracted\": {<field>: <value>, ...}}. "
        "If none, return {\"extracted\":{}}."
    )
    user = json.dumps({
        "description": description,
        "latest_user_text": latest_text,
        "already_answered": answers,
        "remaining_fields": remaining_fields
    }, ensure_ascii=False)

    resp = client.chat.completions.create(
        model=MODEL_QGEN,
        temperature=0.1,
        response_format={"type": "json_object"},
        messages=[{"role":"system","content":sys},{"role":"user","content":user}]
    )
    data = _safe_json(resp.choices[0].message.content)
    extracted = data.get("extracted") or {}
    # Keep only allowed keys
    return {k: v for k, v in extracted.items() if k in remaining_fields and v}

def propose_next_question(description: str, answers: Dict, remaining_fields: List[str]) -> Dict:
    """
    Choose ONE next most useful field and ask a short, conversational question.
    Returns: {"field": "<one of remaining_fields>", "question": "<string>"}
    """
    if not remaining_fields:
        return {"field": None, "question": None}

    sys = (
        f"You are Market IQ, interviewing a business user. Tone: {TONE}. "
        "Ask ONE next helpful question to fill a SINGLE missing field from the allowed list. "
        "Use plain, conversational wording. No multi-part questions, no lists. "
        "If something is already implied, choose the next most valuable field. "
        "Return STRICT JSON: {\"field\":\"<field>\", \"question\":\"<one sentence question>\"}."
    )
    user = json.dumps({
        "project_description": description,
        "answers_so_far": answers,
        "allowed_missing_fields": remaining_fields
    }, ensure_ascii=False)

    resp = client.chat.completions.create(
        model=MODEL_QGEN,
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[{"role":"system","content":sys},{"role":"user","content":user}]
    )
    data = _safe_json(resp.choices[0].message.content)
    field = data.get("field")
    question = data.get("question") or ""

    # Robust fallback if the model drifts
    if field not in remaining_fields:
        field = remaining_fields[0]
    if not question.strip():
        question = f"Could you share your {field.replace('_', ' ')}?"

    return {"field": field, "question": question}
