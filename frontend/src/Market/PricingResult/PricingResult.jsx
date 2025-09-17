import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PricingResult.css';

export default function PricingResult() {
  const { search } = useLocation();
  const params    = new URLSearchParams(search);
  const status    = params.get('status');
  const sessionId = params.get('session_id');
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (status === 'success' && sessionId) {
      fetch(`/api/billing/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(setSession)
        .catch(console.error);
    }
  }, [status, sessionId]);

  return (
    <div className="pricing-result">
      {status === 'success' ? (
        <div className="status success">
          <h1>🎉 Subscription Confirmed!</h1>
          {session ? (
            <>
              <p>Your plan: <strong>{session.metadata.plan_key}</strong></p>
              <p>Next charge: {new Date(
                   session.invoice_upcoming_next_payment_attempt * 1000
                 ).toLocaleDateString()}</p>
            </>
          ) : (
            <p>Loading your subscription details…</p>
          )}
          <Link className="button" to="/dashboard">Go to Dashboard →</Link>
        </div>
      ) : (
        <div className="status cancel">
          <h1>Subscription Canceled</h1>
          <p>
            It looks like you canceled.{' '}
            <Link to="/pricing">Try again →</Link>
          </p>
        </div>
      )}
    </div>
  );
}
