# backend/app/routes/billing.py

import json
from flask import Blueprint, request, jsonify, current_app, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe

from app import db
from app.models import User

billing_bp = Blueprint('billing', __name__, url_prefix='/api/billing')

@billing_bp.before_app_request
def _set_stripe_key():
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']


@billing_bp.route('/plans', methods=['GET'])
def list_plans():
    """
    Return your plan_key → Stripe Price ID map for the frontend.
    """
    return jsonify(current_app.config.get('STRIPE_PRICE_IDS', {})), 200


@billing_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """
    Legacy one-off PaymentIntent flow (amount in cents).
    """
    data = request.get_json() or {}
    amount = int(data.get('amount', 0))
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='usd',
    )
    return jsonify({ "client_secret": intent.client_secret }), 200


@billing_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """
    Create a Subscription‐mode Checkout Session.
    Expects { "plan_key": "essential" } in the JSON body.
    """
    data     = request.get_json() or {}
    plan_key = data.get('plan_key')
    if not plan_key:
        return jsonify({ "msg": "Missing plan_key" }), 400

    price_id = current_app.config.get('STRIPE_PRICE_IDS', {}).get(plan_key)
    if not price_id:
        return jsonify({ "msg": f"Unknown plan_key {plan_key}" }), 400

    user_id = get_jwt_identity()
    frontend = current_app.config.get('FRONTEND_BASE_URL').rstrip('/')
    success_url = f"{frontend}/pricing?session_id={{CHECKOUT_SESSION_ID}}&status=success"
    cancel_url  = f"{frontend}/pricing?status=cancel"

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        mode='subscription',
        line_items=[{ 'price': price_id, 'quantity': 1 }],
        metadata={ 'user_id': user_id, 'plan_key': plan_key },
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return jsonify({ 'sessionId': session.id }), 200


@billing_bp.route('/checkout-session', methods=['GET'])
def get_checkout_session():
    """
    Optional helper: fetch a Checkout Session (expand subscription if you like).
    Frontend can call /api/billing/checkout-session?session_id=...
    """
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({ "msg": "Missing session_id" }), 400

    try:
        sess = stripe.checkout.Session.retrieve(session_id, expand=['subscription'])
        return jsonify(sess.to_dict()), 200
    except stripe.error.StripeError as e:
        return jsonify({ "msg": str(e) }), 400


@billing_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """
    Receive events from Stripe to keep your DB in sync.
    Be sure to set STRIPE_WEBHOOK_SECRET in your .env.
    """
    payload    = request.data
    sig_header = request.headers.get('Stripe-Signature')
    secret     = current_app.config.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return abort(400)

    # ----- handle relevant events -----
    if event.type == 'checkout.session.completed':
        sess = event.data.object
        user = User.query.get(sess.metadata.get('user_id'))
        if user:
            user.stripe_customer_id     = sess.customer
            user.stripe_subscription_id = sess.subscription
            user.subscription_plan      = sess.metadata.get('plan_key')
            db.session.commit()

    elif event.type == 'invoice.payment_succeeded':
        inv = event.data.object
        # e.g. send receipt, top up credits, etc.

    elif event.type == 'customer.subscription.deleted':
        sub = event.data.object
        user = User.query.filter_by(stripe_subscription_id=sub.id).first()
        if user:
            # downgrade them or mark inactive
            user.subscription_plan      = 'essential'
            user.stripe_subscription_id = None
            db.session.commit()

    # …add any other handlers you need…

    return '', 200


@billing_bp.route('/cancel-subscription', methods=['POST'])
@jwt_required()
def cancel_subscription():
    """
    Cancel the logged‐in user’s active subscription.
    """
    user = User.query.get(get_jwt_identity())
    if not user or not user.stripe_subscription_id:
        return jsonify({ "msg": "No active subscription" }), 400

    try:
        # Cancel at period end:
        stripe.Subscription.modify(user.stripe_subscription_id, cancel_at_period_end=True)
        user.subscription_plan = 'essential'
        db.session.commit()
    except stripe.error.StripeError as e:
        return jsonify({ "msg": str(e) }), 400

    return jsonify({ "msg": "Will cancel at period end" }), 200
