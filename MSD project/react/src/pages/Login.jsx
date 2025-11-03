import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppContext();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email) {
      setError('Enter your registered email address.');
      return;
    }
    setUser({ name: 'Gourmet Explorer', email: form.email });
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-card">
        <span className="auth-card__eyebrow">PreOrder Dining</span>
        <h1>Welcome back</h1>
        <p>Log in to manage your reservations and unlock personalised dining benefits.</p>

        <form onSubmit={handleSubmit} className="form">
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
          />

          {error && <p className="form__error">{error}</p>}

          <button className="btn btn--primary" type="submit">
            Sign in
          </button>
        </form>

        <p className="auth-card__footer">
          New to PreOrder? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
