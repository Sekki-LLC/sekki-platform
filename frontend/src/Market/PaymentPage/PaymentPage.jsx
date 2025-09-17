// src/pages/PaymentPage/PaymentPage.jsx
import React, { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import './PaymentPage.css';

const PLAN_INFO = {
  essential:    { label: 'Essential',    price: '$39.99/month' },
  growth:       { label: 'Growth',       price: '$99.99/month' },
  transform_standard:   { label: 'Transform Standard',   price: '$15,000/month' },
  transform_premium:    { label: 'Transform Premium',    price: '$25,000/month' },
  transform_enterprise: { label: 'Transform Enterprise', price: '$50,000/month' },
  founder:      { label: 'Founder',      price: '2,999/ONE TIME' },
};

export default function PaymentPage() {
  const stripePromise = useMemo(
    () => loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || ''),
    []
  );

  const planKey = new URLSearchParams(window.location.search).get('plan') || 'essential';
  const plan = PLAN_INFO[planKey] || PLAN_INFO['essential'];

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/billing/create-checkout-session', { plan: planKey });
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error(err);
      setError('Oops—something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
    return (
      <div className="payment-page">
        <h2>{plan.label}</h2>
        <p style={{ color: 'red' }}>
          Missing <code>REACT_APP_STRIPE_PUBLIC_KEY</code> in your environment
        </p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h2>Subscribe to {plan.label}</h2>
      <p className="price">{plan.price}</p>

      {error && <p className="error">{error}</p>}

      <button
        className="checkout-button"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : `Start ${plan.label}`}
      </button>
    </div>
  );
}
