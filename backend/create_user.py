import uuid
from wsgi import app
from app import db
from app.models import User
from werkzeug.security import generate_password_hash

# Plan definitions
PLAN_CONFIG = {
    'essential': {
        'seat_limit': 1,
        'credits_remaining': 3,
        'max_seats_purchase': 0,
        'unlimited_analysis': False,
        'max_concurrent_sessions': None,
    },
    'growth': {
        'seat_limit': 1,
        'credits_remaining': 10,
        'max_seats_purchase': 5,
        'unlimited_analysis': False,
        'max_concurrent_sessions': None,
    },
    'founder': {
        'seat_limit': 1,
        'credits_remaining': None,  # Unlimited
        'max_seats_purchase': 0,
        'unlimited_analysis': True,
        'max_concurrent_sessions': 5,
    },
}

def create_user(
    email: str,
    name: str,
    raw_password: str,
    plan_key: str = 'essential',
) -> User:
    """
    Factory to create a user with subscription attributes from PLAN_CONFIG.
    """
    plan = PLAN_CONFIG.get(plan_key)
    if plan is None:
        raise ValueError(f"Unknown plan: {plan_key}")

    password_hash = generate_password_hash(raw_password, method='pbkdf2:sha256')
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        name=name,
        password_hash=password_hash,
        subscription_plan=plan_key,
        seat_limit=plan['seat_limit'],
        credits_remaining=plan['credits_remaining'],
        max_seats=plan['seat_limit'] + plan.get('max_seats_purchase', 0),
        unlimited_analysis=plan.get('unlimited_analysis', False),
        max_concurrent_sessions=plan.get('max_concurrent_sessions'),
    )
    db.session.add(user)
    db.session.commit()
    return user


if __name__ == '__main__':
    with app.app_context():
        test_email = 'test@example.com'
        existing = User.query.filter_by(email=test_email).first()
        if existing:
            print("User already exists!")
        else:
            user = create_user(
                email=test_email,
                name='Test User',
                raw_password='password123',
                plan_key='essential'
            )
            print("User created:")
            print(f"  Email: {user.email}")
            print(f"  Plan: {user.subscription_plan}")
            print(f"  Seats: {user.seat_limit}/{user.max_seats}")
            print(f"  Credits: {user.credits_remaining}")
