import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo">Pre-Order</Link>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/wallets">Wallets</Link>
        <Link to="/account">Account</Link>
        <Link to="/cashback">Cashback</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={onLogout} style={{ marginLeft: '1rem' }}>Logout</button>
      </div>
    </nav>
  );
}
