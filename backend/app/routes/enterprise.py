from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message
from app import mail
import stripe
import os

bp = Blueprint('enterprise', __name__)

@bp.route('/apply', methods=['POST'])
def apply_enterprise():
    """
    Called by your pricing‐page modal. JSON payload:
      { name, company_email, company_name, seats_needed, budget_range, notes }
    """
    data = request.get_json()

    # 1) Email you/sales ops
    admin_msg = Message(
        subject=f"[Enterprise Application] {data['company_name']}",
        recipients=[os.environ['ADMIN_NOTIFICATION_EMAIL']],
    )
    admin_msg.body = f"""
New enterprise application:

Name:       {data['name']}
Company:    {data['company_name']}
Email:      {data['company_email']}
Seats:      {data['seats_needed']}
Budget:     {data['budget_range']}
Notes:      {data['notes']}
"""
    mail.send(admin_msg)

    # 2) Create Stripe Checkout session for Enterprise
    session = stripe.checkout.Session.create(
        customer_email=data['company_email'],
        payment_method_types=['card'],
        line_items=[{
            'price': os.environ['ENTERPRISE_PRICE_ID'],
            'quantity': 1,
        }],
        mode='subscription',
        success_url = f"{os.environ['FRONTEND_BASE_URL']}/enterprise/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url  = f"{os.environ['FRONTEND_BASE_URL']}/enterprise/cancel",
    )

    # 3) Email applicant the link
    user_msg = Message(
        subject="Your Enterprise Signup Link",
        recipients=[data['company_email']],
    )
    user_msg.body = f"""
Thanks for your interest in our Enterprise plan!

Please complete your subscription here:
{session.url}

(If you have any trouble, reply to this email and we’ll help you out.)
"""
    mail.send(user_msg)

    return jsonify(status="ok"), 200
