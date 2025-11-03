import React from 'react';

const preferences = [
  {
    title: 'Dining notifications',
    description: 'Get SMS, email, and WhatsApp reminders 30 minutes before your reservation.',
  },
  {
    title: 'Waitlist alerts',
    description: 'Be notified when a seat opens up at your shortlisted chef tables.',
  },
  {
    title: 'Allergy profile',
    description: 'Share allergies and dietary preferences automatically with partner restaurants.',
  },
];

export default function Account() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Account settings</h1>
          <p>Personalise your dining journey, manage alerts, and update your profile.</p>
        </div>
        <button className="btn btn--ghost" type="button">
          Update profile photo
        </button>
      </header>

      <section className="card-grid card-grid--two">
        <article className="card">
          <h2>Contact information</h2>
          <dl className="definition-list">
            <dt>Name</dt>
            <dd>Gourmet Explorer</dd>
            <dt>Email</dt>
            <dd>foodie@preorder.io</dd>
            <dt>Mobile</dt>
            <dd>+91 98765 43210</dd>
          </dl>
          <button className="btn btn--ghost" type="button">
            Edit details
          </button>
        </article>

        <article className="card">
          <h2>Dining preferences</h2>
          <ul className="list list--compact">
            {preferences.map((preference) => (
              <li key={preference.title}>
                <strong>{preference.title}</strong>
                <p>{preference.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Security & privacy</h2>
        <div className="features">
          <div>
            <strong>Login methods</strong>
            <p>Enable passkeys, Google, or OTP-only logins for faster access.</p>
          </div>
          <div>
            <strong>Data sharing</strong>
            <p>We share only dietary preferences and arrival windows with partner restaurants.</p>
          </div>
        </div>
        <button className="btn btn--ghost" type="button">
          Manage security
        </button>
      </section>
    </div>
  );
}
