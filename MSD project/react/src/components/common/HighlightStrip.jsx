import React from 'react';
import { FiTrendingUp, FiGift, FiShield, FiClock } from 'react-icons/fi';

const highlights = [
  {
    icon: <FiTrendingUp size={20} />,
    title: 'Curated to impress',
    description: 'Handpicked chef specials and trending tasting menus updated daily.',
  },
  {
    icon: <FiClock size={20} />,
    title: 'Guaranteed slot',
    description: 'Reserve tables or pre-order meals with instant confirmations and reminders.',
  },
  {
    icon: <FiShield size={20} />,
    title: 'Hygiene verified',
    description: 'We audit each partner restaurant for hygiene, kitchen quality, and experience.',
  },
  {
    icon: <FiGift size={20} />,
    title: 'Rewards built-in',
    description: 'Earn cashback, unlock chef tastings, and get priority seating on repeat visits.',
  },
];

const HighlightStrip = () => (
  <section className="highlight-strip">
    {highlights.map((item) => (
      <div key={item.title} className="highlight-strip__item">
        {item.icon}
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    ))}
  </section>
);

export default HighlightStrip;
