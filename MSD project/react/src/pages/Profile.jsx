import React from 'react';
import { FiAward, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const journeys = [
  {
    title: 'Elite diner since Feb 2024',
    metric: '32 visits',
    description: 'Average spend ₹2,850 · Favourite cuisine: Progressive Indian',
  },
  {
    title: 'Priority booker',
    metric: '91% confirmations',
    description: 'You rarely cancel last minute. Restaurants love you for it.',
  },
];

export default function Profile() {
  return (
    <div className="page page--compact">
      <section className="profile-card">
        <div className="profile-card__avatar" aria-hidden>
          GE
        </div>
        <div>
          <h1>Gourmet Explorer</h1>
          <p>Member since January 2024 · Preferred concierge city: Bengaluru</p>
          <div className="profile-card__stats">
            <div>
              <FiCalendar />
              <strong>12 upcoming</strong>
              <span>pre-orders booked</span>
            </div>
            <div>
              <FiTrendingUp />
              <strong>₹68k</strong>
              <span>dining spend this year</span>
            </div>
            <div>
              <FiAward />
              <strong>Gold tier</strong>
              <span>Unlocks welcome champagne</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card-grid">
        {journeys.map((item) => (
          <article key={item.title} className="card">
            <h2>{item.title}</h2>
            <strong>{item.metric}</strong>
            <p>{item.description}</p>
            <button className="btn btn--ghost" type="button">
              View timeline
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
