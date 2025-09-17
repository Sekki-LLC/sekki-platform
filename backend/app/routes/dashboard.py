from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app import db
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Mock data for now - you can replace with real database queries later
        dashboard_data = {
            'sessions': [
                {
                    'id': 1,
                    'name': 'Market Analysis Q1',
                    'created_at': '2025-01-15',
                    'status': 'completed'
                },
                {
                    'id': 2,
                    'name': 'SWOT Analysis - Product Launch',
                    'created_at': '2025-01-10',
                    'status': 'in_progress'
                },
                {
                    'id': 3,
                    'name': 'Gap Analysis - Customer Service',
                    'created_at': '2025-01-05',
                    'status': 'completed'
                }
            ],
            'metrics': {
                'pending': 1,  # Sessions in progress
                'all': 3       # Total sessions
            },
            'docTypeCounts': {
                'market_analysis': 1,
                'swot_analysis': 1,
                'gap_analysis': 1
            },
            'planInfo': {
                'used': 25,
                'limit': 100,
                'remaining': 75,
                'percentRemaining': 75
            }
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500
