// src/services/api.js
const API = {
  login: creds =>
    fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(creds) })
      .then(res => res.json()),

  signup: creds =>
    fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(creds) })
      .then(res => res.json()),

  createPaymentIntent: amount =>
    fetch('/api/billing/create-payment-intent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount}) })
      .then(res => res.json()),

  chat: message =>
    fetch('/api/chat/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message}) })
      .then(res => res.json()),
};

export default API;
