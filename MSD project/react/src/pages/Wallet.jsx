import React from 'react';
import { FiTrendingUp, FiGift, FiDownload } from 'react-icons/fi';

const credits = [
  {
    id: 'WAL-2025-09-14',
    label: 'Cashback from Masala Story Kitchen',
    amount: 420,
    status: 'Available',
  },
  {
    id: 'WAL-2025-09-02',
    label: 'Referral bonus',
    amount: 250,
    status: 'Locked · unlock on second visit',
  },
];

const redemptionOptions = [
  {
    title: 'Auto-apply at checkout',
    description: 'Wallet balance is used first on eligible pre-paid experiences.',
  },
  {
    title: 'Convert to gift cards',
    description: 'Send curated dining passes to friends straight from your wallet.',
  },
];

const upcomingUnlocks = [
  {
    title: '₹600 bonus',
    description: 'Book any chef table before 10 Oct to unlock a guaranteed bonus drop.',
  },
  {
    title: 'Corporate credits',
    description: 'Link your Zeta ID to merge office meal credits with PreOrder wallet.',
  },
];

export default function Wallet() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Dining wallet</h1>
          <p>Your instant cashback from prepaid reservations and tasting menus.</p>
        </div>
        <button className="btn btn--ghost" type="button">
          <FiDownload /> Statement
        </button>
      </header>

      <section className="balance-card">
        <div>
          <span>Current balance</span>
          <h2>₹1,870</h2>
          <p>Auto-applied on your next pre-order.</p>
        </div>
        <div className="balance-card__stats">
          <div>
            <FiTrendingUp />
            <div>
              <strong>₹6,450</strong>
              <span>Earned this quarter</span>
            </div>
          </div>
          <div>
            <FiGift />
            <div>
              <strong>3 offers</strong>
              <span>Expiring within 7 days</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Recent credits</h2>
        <ul className="list">
          {credits.map((credit) => (
            <li key={credit.id}>
              <div>
                <strong>{credit.label}</strong>
                <span>{credit.status}</span>
              </div>
              <div className="amount">+₹{credit.amount}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-grid card-grid--two">
        <article className="card">
          <h2>Redemption options</h2>
          <ul className="list list--compact">
            {redemptionOptions.map((option) => (
              <li key={option.title}>
                <strong>{option.title}</strong>
                <p>{option.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Upcoming unlocks</h2>
          <ul className="list list--compact">
            {upcomingUnlocks.map((unlock) => (
              <li key={unlock.title} className="wallet-unlock">
                <div>
                  <strong>{unlock.title}</strong>
                  <p>{unlock.description}</p>
                </div>
                <span className="pill pill--info">On radar</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
