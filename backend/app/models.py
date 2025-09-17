# backend/app/models.py

import uuid
from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = 'users'

    # Use UUID strings for primary keys
    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    # Core user fields
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # Stripe integration
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    stripe_subscription_id = db.Column(db.String(255), nullable=True)

    # Subscription & seat limits
    subscription_plan = db.Column(
        db.String(50),
        nullable=False,
        default='essential'
    )
    seat_limit = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )
    max_seats = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )
    unlimited_analysis = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )
    max_concurrent_sessions = db.Column(
        db.Integer,
        nullable=True
    )

    # Credits
    # None = unlimited, else track remaining
    credits_remaining = db.Column(
        db.Integer,
        nullable=True,
        default=0
    )

    # Referrals & feedback
    referral_code = db.Column(
        db.String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )
    referrals_earned = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )
    feedback_earned = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    # Timestamps
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'subscription_plan': self.subscription_plan,
            'seat_limit': self.seat_limit,
            'max_seats': self.max_seats,
            'unlimited_analysis': self.unlimited_analysis,
            'max_concurrent_sessions': self.max_concurrent_sessions,
            'credits_remaining': self.credits_remaining,
            'referral_code': self.referral_code,
            'referrals_earned': self.referrals_earned,
            'feedback_earned': self.feedback_earned,
            'stripe_customer_id': self.stripe_customer_id,
            'stripe_subscription_id': self.stripe_subscription_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
