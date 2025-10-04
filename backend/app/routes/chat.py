# app/routes/chat.py

import os
import anthropic
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

# Initialize Anthropic client
def get_anthropic_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY") or current_app.config.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in configuration")
    return anthropic.Anthropic(api_key=api_key)

@chat_bp.route('/chat', methods=['POST'], strict_slashes=False)
@jwt_required()
def chat():
    """
    Handle chat requests with full conversation history support for Claude
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get request data
        payload = request.get_json() or {}
        user_message = payload.get('message', '').strip()
        conversation_history = payload.get('conversation_history', [])
        doc_type = payload.get('docType', 'market_analysis')
        detailed = payload.get('detailed', True)
        system_prompt = payload.get('systemPrompt', '')
        analysis_context = payload.get('analysis_context', {})
        phase = payload.get('phase', 1)
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # If no system prompt provided, use a default one
        if not system_prompt:
            system_prompt = "You are a top 0.1% senior market analyst providing detailed, conversational insights on business projects. Reference the analysis context when relevant and maintain a natural, helpful tone."
        
        # Add analysis context to system prompt if provided
        if analysis_context:
            import json
            context_str = json.dumps(analysis_context, indent=2)
            system_prompt += f"\n\nAnalysis Context:\n{context_str}"
        
        logger.info(f"Chat request from user {current_user_id}: doc_type={doc_type}, phase={phase}, history_length={len(conversation_history)}")
        
        # Initialize Anthropic client
        client = get_anthropic_client()
        
        # Prepare messages for Claude
        # If conversation_history is provided, use it; otherwise start fresh
        messages = []
        
        if conversation_history:
            # Use the provided conversation history
            messages = conversation_history
        else:
            # Start a new conversation
            messages = [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        
        # Make request to Claude
        try:
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.7,
                system=system_prompt,
                messages=messages
            )
            
            # Extract the reply
            if response.content and len(response.content) > 0:
                reply = response.content[0].text
                
                logger.info(f"Claude response received for user {current_user_id}")
                
                return jsonify({
                    'success': True,
                    'response': reply,
                    'reply': reply,
                    'usage': {
                        'input_tokens': response.usage.input_tokens if response.usage else 0,
                        'output_tokens': response.usage.output_tokens if response.usage else 0,
                    }
                })
            else:
                logger.error("No content in Claude response")
                return jsonify({'error': 'No response from AI'}), 500
                
        except anthropic.RateLimitError as e:
            logger.error(f"Claude rate limit error: {e}")
            return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
            
        except anthropic.AuthenticationError as e:
            logger.error(f"Claude authentication error: {e}")
            return jsonify({'error': 'API authentication failed. Please check your Anthropic API key.'}), 500
            
        except anthropic.APIError as e:
            logger.error(f"Claude API error: {e}")
            return jsonify({'error': f'API error: {str(e)}'}), 500
            
        except Exception as e:
            logger.error(f"Unexpected Claude error: {e}")
            return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat_main():
    """
    Main chat route that matches the Wizard component's expected endpoint
    """
    return chat()

@chat_bp.route('/test', methods=['GET'])
def test_chat():
    """
    Test endpoint to verify chat route is working
    """
    return jsonify({
        'message': 'Chat route is working',
        'anthropic_configured': bool(os.environ.get("ANTHROPIC_API_KEY") or current_app.config.get('ANTHROPIC_API_KEY'))
    })
