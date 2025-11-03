import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUser({ name: form.name || 'New Diner', email: form.email });
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-card">
        <span className="auth-card__eyebrow">Join the waitlist-free club</span>
        <h1>Create your dining profile</h1>
        <p>Unlock premium reservations, curated menus, and wallet bonuses.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            placeholder="Gourmet Explorer"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn--primary" type="submit">
            Sign up & explore
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
