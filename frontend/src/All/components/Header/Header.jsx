import React from 'react';
import './Header.css';

export default function Header({ onFounderClick }) {
  return (
    <header className="header">
      <div className="container header-content">
        <a href="/" className="logo-text">SEKKI</a>
        <nav>
          <ul className="nav-list">
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="#tools" className="nav-link">Tools</a></li>
            <li><a href="#pricing" className="nav-link">Pricing</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <a href="/login" className="btn btn-secondary">Login</a>
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={onFounderClick}
          >
            Get Founder Access
          </button>
        </div>
      </div>
    </header>
  );
}
