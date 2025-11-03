import React from 'react';

const partnerWallets = [
  {
    name: 'Zeta Corporate Dining',
    balance: 5600,
    perks: 'Use on curated tasting menus in Koramangala',
  },
  {
    name: 'HDFC Times Prime',
    balance: 1800,
    perks: 'Complimentary desserts every Friday',
  },
];

export default function Wallets() {
  return (
    <div className="page page--compact">
      <header className="page-header">
        <div>
          <h1>Connected dining wallets</h1>
          <p>Consolidate your corporate and reward credits for faster checkouts.</p>
        </div>
        <button className="btn btn--primary" type="button">
          Link new wallet
        </button>
      </header>

      <section className="card-grid card-grid--two">
        {partnerWallets.map((wallet) => (
          <article key={wallet.name} className="card">
            <h2>{wallet.name}</h2>
            <p>Balance usable on pre-paid dining</p>
            <strong>₹{wallet.balance}</strong>
            <p>{wallet.perks}</p>
            <button className="btn btn--ghost" type="button">
              View transactions
            </button>
          </article>
        ))}
        <article className="card card--dashed">
          <h2>Bring your own wallet</h2>
          <p>Supports Sodexo, Zeta, and more. We auto-detect eligible experiences.</p>
          <button className="btn btn--ghost" type="button">
            Share corporate email
          </button>
        </article>
      </section>
    </div>
  );
}
