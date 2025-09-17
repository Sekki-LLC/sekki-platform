# app/routes/chat.py

import os
import openai
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

# Initialize OpenAI client
def get_openai_client():
    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in configuration")
    return openai.OpenAI(api_key=api_key)

@chat_bp.route('/chat', methods=['POST'], strict_slashes=False)
@jwt_required()
def chat():
    """
    Handle chat requests from the Wizard component
    Updated from basic echo to full OpenAI integration
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get request data
        payload = request.get_json() or {}
        user_message = payload.get('message', '').strip()
        doc_type = payload.get('docType', 'market_analysis')
        detailed = payload.get('detailed', True)
        system_prompt = payload.get('systemPrompt', '')
        phase = payload.get('phase', 1)
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # If no system prompt provided, use a default one
        if not system_prompt:
            system_prompt = "You are a helpful business analyst assistant. Provide detailed, professional advice."
        
        logger.info(f"Chat request from user {current_user_id}: doc_type={doc_type}, phase={phase}, detailed={detailed}")
        
        # Initialize OpenAI client
        client = get_openai_client()
        
        # Prepare messages for OpenAI
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user", 
                "content": user_message
            }
        ]
        
        # Make request to OpenAI
        try:
            response = client.chat.completions.create(
                model="gpt-4o",  # Use GPT-4o or gpt-4-turbo
                messages=messages,
                max_tokens=2000,
                temperature=0.7,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            # Extract the reply
            if response.choices and len(response.choices) > 0:
                reply = response.choices[0].message.content
                
                logger.info(f"OpenAI response received for user {current_user_id}")
                
                return jsonify({
                    'success': True,
                    'reply': reply,
                    'usage': {
                        'prompt_tokens': response.usage.prompt_tokens if response.usage else 0,
                        'completion_tokens': response.usage.completion_tokens if response.usage else 0,
                        'total_tokens': response.usage.total_tokens if response.usage else 0
                    }
                })
            else:
                logger.error("No choices in OpenAI response")
                return jsonify({'error': 'No response from AI'}), 500
                
        except openai.RateLimitError as e:
            logger.error(f"OpenAI rate limit error: {e}")
            return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
            
        except openai.AuthenticationError as e:
            logger.error(f"OpenAI authentication error: {e}")
            return jsonify({'error': 'API authentication failed. Please check your OpenAI API key.'}), 500
            
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            return jsonify({'error': f'API error: {str(e)}'}), 500
            
        except Exception as e:
            logger.error(f"Unexpected OpenAI error: {e}")
            return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Keep your existing route structure but add the main route
@chat_bp.route('', methods=['POST'])
@jwt_required()
def chat_main():
    """
    Main chat route that matches the Wizard component's expected endpoint
    This handles requests to /api/chat (without /chat suffix)
    """
    return chat()

@chat_bp.route('/test', methods=['GET'])
def test_chat():
    """
    Test endpoint to verify chat route is working
    """
    return jsonify({
        'message': 'Chat route is working',
        'openai_configured': bool(current_app.config.get('OPENAI_API_KEY'))
    })

@chat_bp.route('/models', methods=['GET'])
@jwt_required()
def get_available_models():
    """
    Get available OpenAI models
    """
    try:
        client = get_openai_client()
        models = client.models.list()
        
        # Filter for chat models
        chat_models = [
            model.id for model in models.data 
            if 'gpt' in model.id.lower() and any(x in model.id for x in ['3.5', '4'])
        ]
        
        return jsonify({
            'success': True,
            'models': sorted(chat_models)
        })
        
    except Exception as e:
        logger.error(f"Error fetching models: {e}")
        return jsonify({'error': str(e)}), 500

