import React from 'react';
import { FiGift, FiBell, FiZap } from 'react-icons/fi';

const cashbackCampaigns = [
  {
    title: 'Prepay weekend brunch',
    description: 'Earn flat ₹500 back on bookings before noon at partner cafés.',
    expires: 'Ends Sun · limited slots',
  },
  {
    title: 'Chef table tasting menu',
    description: '15% back up to ₹1,200 on curated 5-course menus in Indiranagar.',
    expires: 'Ends 5 Oct',
  },
];

export default function Cashback() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Cashback vault</h1>
          <p>Stackable offers and event-led bonuses tailored to your dining style.</p>
        </div>
        <button className="btn btn--primary" type="button">
          <FiBell /> Notify me about drops
        </button>
      </header>

      <section className="card-grid card-grid--two">
        {cashbackCampaigns.map((campaign) => (
          <article key={campaign.title} className="card">
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            <span className="pill pill--accent">{campaign.expires}</span>
            <button className="btn btn--ghost" type="button">
              Activate offer
            </button>
          </article>
        ))}
        <article className="card card--highlight">
          <FiGift size={32} />
          <h2>Boost your benefits</h2>
          <p>Invite three friends who dine this month to unlock a guaranteed ₹1,000 cashback drop.</p>
          <button className="btn btn--ghost" type="button">
            Share referral link
          </button>
        </article>
      </section>

      <section className="card">
        <h2>How cashback works</h2>
        <ul className="bullet-list">
          <li><FiZap /> Prepay to lock-in offers; cashback is added post visit.</li>
          <li><FiZap /> Combine with wallet balance for higher tier experiences.</li>
          <li><FiZap /> Withdraw to bank when you cross ₹2,000 or spend directly at checkout.</li>
        </ul>
      </section>
    </div>
  );
}
