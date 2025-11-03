import React from 'react';
import { FiClock, FiPlusCircle, FiShield, FiSmartphone } from 'react-icons/fi';
import { formatCurrency } from '../utils/format';

const savedInstruments = [
  {
    last4: '4321',
    brand: 'Visa Signature',
    expires: '08/28',
    perks: '5% dining cashback',
  },
  {
    last4: '0098',
    brand: 'Amex Platinum',
    expires: '02/27',
    perks: 'Priority seating unlock',
  },
];

const paymentHistory = [
  {
    id: 'PAY-2025-10-01',
    restaurant: 'Masala Story Kitchen',
    amount: 3200,
    status: 'Success',
    method: 'Visa Signature',
    timestamp: 'Yesterday · 9:30 PM',
  },
  {
    id: 'PAY-2025-09-28',
    restaurant: 'Bao & Bun District',
    amount: 1480,
    status: 'Processing refund',
    method: 'UPI Autopay',
    timestamp: '28 Sep · 7:10 PM',
  },
  {
    id: 'PAY-2025-09-20',
    restaurant: 'Sourdough Society Café',
    amount: 2140,
    status: 'Success',
    method: 'Amex Platinum',
    timestamp: '20 Sep · 11:45 AM',
  },
];

export default function Payments() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Payments & preferences</h1>
          <p>Securely manage saved cards, UPI handles, and dining-specific cashback.</p>
        </div>
        <button className="btn btn--primary" type="button">
          <FiPlusCircle /> Add payment method
        </button>
      </header>

      <section className="card-grid card-grid--two">
        <article className="card">
          <h2>Saved cards</h2>
          <ul className="list">
            {savedInstruments.map((instrument) => (
              <li key={instrument.last4}>
                <div>
                  <strong>{instrument.brand}</strong>
                  <span>···· {instrument.last4} · Expires {instrument.expires}</span>
                  <small>{instrument.perks}</small>
                </div>
                <button className="btn btn--ghost" type="button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>UPI Autopay</h2>
          <p>Enable seamless checkouts and automatic table deposits through UPI mandate.</p>
          <button className="btn btn--ghost" type="button">
            <FiSmartphone /> Link UPI ID
          </button>
        </article>

        <article className="card">
          <h2>Recent payment activity</h2>
          <ul className="list list--compact">
            {paymentHistory.map((entry) => {
              const statusClass =
                entry.status === 'Success'
                  ? 'pill pill--success'
                  : entry.status.includes('refund')
                  ? 'pill pill--warning'
                  : 'pill pill--info';
              return (
                <li key={entry.id} className="payment-activity__item">
                  <div>
                    <strong>{entry.restaurant}</strong>
                    <span className="payment-activity__timestamp">
                      <FiClock /> {entry.timestamp}
                    </span>
                    <small>{entry.method}</small>
                  </div>
                  <div className="payment-activity__meta">
                    <span className="amount">{formatCurrency(entry.amount)}</span>
                    <span className={statusClass}>{entry.status}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Payment protections</h2>
        <div className="features">
          <div>
            <FiShield />
            <div>
              <strong>Instant refunds</strong>
              <p>Get automatic reversals if a restaurant declines your pre-order.</p>
            </div>
          </div>
          <div>
            <FiShield />
            <div>
              <strong>One-tap insurance</strong>
              <p>Optional ₹19 cover for delays, cancellations, and no-show charges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
