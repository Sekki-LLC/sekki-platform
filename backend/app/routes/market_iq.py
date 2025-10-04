from __future__ import annotations
import os, json, time, uuid
from typing import Dict, Any, Optional, List
from flask import Blueprint, request, jsonify, current_app
import anthropic

market_iq_bp = Blueprint("market_iq", __name__, url_prefix="/api")

# ---------- In-memory session storage (replace with Redis/DB in production) ----------
SESSIONS: Dict[str, Dict[str, Any]] = {}

def _new_id() -> str:
    return f"conv_{uuid.uuid4().hex[:12]}"

# ---------- Claude conversational intake ----------
CONVERSATION_SYSTEM_PROMPT = """You are a top 0.1% senior market analyst helping entrepreneurs and business leaders evaluate their projects through natural conversation.

Your goal: Extract key information to build a Market IQ scorecard covering these areas:
- Primary goal & objectives
- Target customers/market
- Problem being solved & solution approach
- Competitive differentiators & value proposition
- Market size & opportunity
- Pricing model & economics
- Budget & timeline
- Key performance indicators
- Risks & constraints
- Go-to-market channels
- Team capabilities
- Data availability & compliance

Guidelines:
- Have a NATURAL, flowing conversation - don't follow a rigid script
- Listen to what the user shares and ask relevant follow-up questions
- Pocket information as it comes up organically
- Never ask the same question twice
- If they mention something, acknowledge it and build on it
- Keep responses conversational and concise (2-4 sentences)
- Always end with ONE clear question that moves the conversation forward
- If the user is unsure, offer 2-3 practical options
- Track what you've learned internally, but don't make it feel like a checklist
- When you have enough information (usually 5-7 exchanges), naturally wrap up and suggest finishing

Be warm, professional, and genuinely curious about their project."""

def get_claude_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY") or current_app.config.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not configured")
    return anthropic.Anthropic(api_key=api_key)

def calculate_readiness(messages: List[Dict]) -> int:
    """Calculate how ready we are to generate a score based on conversation depth"""
    user_messages = [m for m in messages if m["role"] == "user"]
    num_exchanges = len(user_messages)
    
    # Simple heuristic: more exchanges = more readiness
    if num_exchanges >= 7:
        return 85
    elif num_exchanges >= 5:
        return 70
    elif num_exchanges >= 3:
        return 50
    elif num_exchanges >= 2:
        return 30
    else:
        return 15

@market_iq_bp.route("/conversation/start", methods=["POST"])
def conversation_start():
    """Start a natural conversation with Claude"""
    try:
        j = request.get_json(silent=True) or {}
        description = (j.get("description") or "").strip()
        
        if not description:
            return jsonify({"error": "description required"}), 400
        
        session_id = _new_id()
        
        # Initialize conversation with Claude
        client = get_claude_client()
        
        messages = [
            {"role": "user", "content": description}
        ]
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            temperature=0.7,
            system=CONVERSATION_SYSTEM_PROMPT,
            messages=messages
        )
        
        ai_message = (response.content[0].text or "").strip()
        
        # Store session
        messages.append({"role": "assistant", "content": ai_message})
        SESSIONS[session_id] = {
            "id": session_id,
            "messages": messages,
            "created_at": int(time.time()),
        }
        
        readiness = calculate_readiness(messages)
        
        return jsonify({
            "session_id": session_id,
            "message": ai_message,
            "readiness_score": readiness,
            "status": "gathering_info"
        }), 200
        
    except Exception as e:
        current_app.logger.exception("conversation_start_failed")
        return jsonify({"error": "conversation_start_failed", "details": str(e)}), 500

@market_iq_bp.route("/conversation/continue", methods=["POST"])
def conversation_continue():
    """Continue the natural conversation"""
    try:
        j = request.get_json(silent=True) or {}
        session_id = j.get("session_id")
        user_message = (j.get("message") or "").strip()
        
        if not session_id or not user_message:
            return jsonify({"error": "session_id and message required"}), 400
        
        session = SESSIONS.get(session_id)
        if not session:
            return jsonify({"error": "session not found"}), 404
        
        # Add user message to history
        session["messages"].append({"role": "user", "content": user_message})
        
        # Get Claude's response with full conversation context
        client = get_claude_client()
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            temperature=0.7,
            system=CONVERSATION_SYSTEM_PROMPT,
            messages=session["messages"]
        )
        
        ai_message = (response.content[0].text or "").strip()
        
        # Add AI response to history
        session["messages"].append({"role": "assistant", "content": ai_message})
        
        readiness = calculate_readiness(session["messages"])
        
        return jsonify({
            "message": ai_message,
            "readiness_score": readiness,
            "status": "gathering_info" if readiness < 60 else "ready_to_analyze"
        }), 200
        
    except Exception as e:
        current_app.logger.exception("conversation_continue_failed")
        return jsonify({"error": "conversation_continue_failed", "details": str(e)}), 500

@market_iq_bp.route("/analyze", methods=["POST"])
def analyze():
    """Generate Market IQ score from conversation"""
    try:
        j = request.get_json(silent=True) or {}
        session_id = j.get("session_id")
        transcript = j.get("transcript", "")
        
        session = SESSIONS.get(session_id) if session_id else None
        
        # Extract information from conversation
        conversation_text = ""
        if session:
            conversation_text = "\n".join([
                f"{m['role'].upper()}: {m['content']}" 
                for m in session["messages"]
            ])
        elif transcript:
            conversation_text = transcript
        else:
            return jsonify({"error": "No conversation data provided"}), 400
        
        # Use Claude to analyze and score
        client = get_claude_client()
        
        analysis_prompt = f"""Based on this conversation about a business project, generate a Market IQ scorecard.

Conversation:
{conversation_text}

Provide a JSON response with:
- market_iq_score: Overall score 1-99 (higher = better viability)
- project_name: Short name for the project
- summary: 2-3 sentence executive summary
- component_scores: Object with market, team, economics, risk (each 1-99)
- financial_impact: Object with ebitda_at_risk, roi_opportunity
- key_insights: Array of 3-5 key insights
- recommendations: Array of 3-5 actionable recommendations
- risks: Array of top 3-5 risks

Be realistic and analytical. Base scores on what was actually discussed."""

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            temperature=0.3,
            messages=[{"role": "user", "content": analysis_prompt}]
        )
        
        analysis_text = response.content[0].text
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
        if json_match:
            analysis_result = json.loads(json_match.group())
        else:
            # Fallback if JSON parsing fails
            analysis_result = {
                "market_iq_score": 65,
                "project_name": "Business Project",
                "summary": "Analysis generated from conversation",
                "component_scores": {"market": 65, "team": 60, "economics": 70, "risk": 55},
                "financial_impact": {"ebitda_at_risk": "TBD", "roi_opportunity": "TBD"},
                "key_insights": ["More information needed for detailed analysis"],
                "recommendations": ["Continue gathering market data"],
                "risks": ["Insufficient data for comprehensive risk assessment"]
            }
        
        return jsonify({"analysis_result": analysis_result}), 200
        
    except Exception as e:
        current_app.logger.exception("analyze_failed")
        return jsonify({"error": "analyze_failed", "details": str(e)}), 500

@market_iq_bp.route("/scenario", methods=["POST"])
def scenario():
    """Apply scenario changes to existing analysis"""
    try:
        j = request.get_json(silent=True) or {}
        analysis = j.get("analysis_result") or {}
        changes = j.get("changes") or {}
        
        # Simple scenario modeling - adjust scores based on changes
        out = dict(analysis)
        if "market_iq_score" in out and isinstance(changes.get("delta"), (int, float)):
            out["market_iq_score"] = int(max(1, min(99, out["market_iq_score"] + int(changes["delta"]))))
        
        return jsonify(out), 200
        
    except Exception as e:
        current_app.logger.exception("scenario_failed")
        return jsonify({"error": "scenario_failed", "details": str(e)}), 500
