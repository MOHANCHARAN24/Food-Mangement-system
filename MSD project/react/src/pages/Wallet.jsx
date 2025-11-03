import React from 'react';
export default function Wallet() {
  const [balance, setBalance] = React.useState(500); // mock value
  const [amount, setAmount] = React.useState("");
  return (
    <div className="container">
      <h2>Wallet</h2>
      <div style={{ fontSize: '1.3rem', margin: '1rem 0', fontWeight: 'bold' }}>
        Cash in Wallet: ₹{balance}
      </div>
      <form onSubmit={e => { e.preventDefault(); if (amount) { setBalance(b => b + Number(amount)); setAmount(""); } }}>
        <label>Add Cash:</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" min="1" style={{ marginRight: '1rem' }} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
