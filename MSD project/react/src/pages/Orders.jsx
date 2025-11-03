import React from 'react';
import { FiClock, FiMapPin, FiStar } from 'react-icons/fi';
import { formatDateTime } from '../utils/format';

const sampleOrders = [
  {
    id: 'ORD-2025-09-18-1',
    restaurant: 'Masala Story Kitchen',
    scheduledFor: new Date(Date.now() + 3600000).toISOString(),
    status: 'confirmed',
    address: 'Indiranagar · Chef table',
    spend: 3200,
    ratingPending: true,
  },
  {
    id: 'ORD-2025-09-12-2',
    restaurant: 'Sourdough Society Café',
    scheduledFor: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    address: 'Church Street · Brunch tasting',
    spend: 1850,
    ratingPending: false,
  },
];

const statusCopy = {
  confirmed: 'Arrive 10 mins earlier to enjoy the amuse bouche.',
  completed: 'Hope you loved the experience! Rate your visit.',
};

export default function Orders() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Your upcoming experiences</h1>
          <p>Track confirmations, arrival windows, and add-ons in one place.</p>
        </div>
        <button className="btn btn--ghost" type="button">
          Download receipts
        </button>
      </header>

      <div className="card-grid">
        {sampleOrders.map((order) => (
          <article key={order.id} className="order-card">
            <header>
              <h3>{order.restaurant}</h3>
              <span className={`order-card__status order-card__status--${order.status}`}>
                {order.status}
              </span>
            </header>
            <p className="order-card__meta">
              <FiClock /> {formatDateTime(order.scheduledFor)}
            </p>
            <p className="order-card__meta">
              <FiMapPin /> {order.address}
            </p>
            <p className="order-card__note">{statusCopy[order.status]}</p>
            <footer>
              <span className="order-card__spend">Spent: ₹{order.spend}</span>
              {order.ratingPending && (
                <button type="button" className="btn btn--primary">
                  <FiStar /> Rate experience
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
