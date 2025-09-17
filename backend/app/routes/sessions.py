# app/routes/sessions.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sessions_bp = Blueprint('sessions', __name__)

# Simple file-based storage for sessions (you can replace with database later)
SESSIONS_DIR = 'sessions_data'

def ensure_sessions_dir():
    """Ensure the sessions directory exists"""
    if not os.path.exists(SESSIONS_DIR):
        os.makedirs(SESSIONS_DIR)

def get_user_sessions_file(user_id):
    """Get the sessions file path for a user"""
    ensure_sessions_dir()
    return os.path.join(SESSIONS_DIR, f'user_{user_id}_sessions.json')

def load_user_sessions(user_id):
    """Load sessions for a user"""
    sessions_file = get_user_sessions_file(user_id)
    if os.path.exists(sessions_file):
        try:
            with open(sessions_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading sessions for user {user_id}: {e}")
            return {}
    return {}

def save_user_sessions(user_id, sessions):
    """Save sessions for a user"""
    sessions_file = get_user_sessions_file(user_id)
    try:
        with open(sessions_file, 'w') as f:
            json.dump(sessions, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving sessions for user {user_id}: {e}")
        return False

@sessions_bp.route('', methods=['POST'])
@jwt_required()
def save_session():
    """
    Save a session
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        session_id = data.get('session_id')
        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400
        
        # Load existing sessions
        sessions = load_user_sessions(current_user_id)
        
        # Add/update session
        sessions[session_id] = {
            'session_id': session_id,
            'name': data.get('name', ''),
            'document_type': data.get('document_type', ''),
            'current_phase': data.get('current_phase', 1),
            'chat_history': data.get('chat_history', []),
            'notes': data.get('notes', {}),
            'created': data.get('created', datetime.now().isoformat()),
            'timestamp': datetime.now().isoformat(),
            'status': data.get('status', 'in_progress'),
            'user_id': current_user_id
        }
        
        # Save sessions
        if save_user_sessions(current_user_id, sessions):
            logger.info(f"Session {session_id} saved for user {current_user_id}")
            return jsonify({'success': True, 'session_id': session_id})
        else:
            return jsonify({'error': 'Failed to save session'}), 500
            
    except Exception as e:
        logger.error(f"Error saving session: {e}")
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('', methods=['GET'])
@jwt_required()
def get_sessions():
    """
    Get all sessions for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        sessions = load_user_sessions(current_user_id)
        
        # Convert to list and sort by timestamp
        sessions_list = list(sessions.values())
        sessions_list.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'sessions': sessions_list
        })
        
    except Exception as e:
        logger.error(f"Error getting sessions: {e}")
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/<session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    """
    Get a specific session
    """
    try:
        current_user_id = get_jwt_identity()
        sessions = load_user_sessions(current_user_id)
        
        if session_id not in sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'session': sessions[session_id]
        })
        
    except Exception as e:
        logger.error(f"Error getting session {session_id}: {e}")
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/complete', methods=['POST'])
@jwt_required()
def complete_session():
    """
    Mark a session as completed
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        session_id = data.get('session_id')
        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400
        
        # Load existing sessions
        sessions = load_user_sessions(current_user_id)
        
        if session_id not in sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        # Update session status
        sessions[session_id]['status'] = 'completed'
        sessions[session_id]['completed_at'] = datetime.now().isoformat()
        
        # Save sessions
        if save_user_sessions(current_user_id, sessions):
            logger.info(f"Session {session_id} marked as completed for user {current_user_id}")
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to update session'}), 500
            
    except Exception as e:
        logger.error(f"Error completing session: {e}")
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/<session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    """
    Delete a session
    """
    try:
        current_user_id = get_jwt_identity()
        sessions = load_user_sessions(current_user_id)
        
        if session_id not in sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        # Remove session
        del sessions[session_id]
        
        # Save sessions
        if save_user_sessions(current_user_id, sessions):
            logger.info(f"Session {session_id} deleted for user {current_user_id}")
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to delete session'}), 500
            
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        return jsonify({'error': str(e)}), 500

