import React from 'react';

const Wallet = () => {
  // You’ll connect this with backend wallet/disbursement data later
  return (
    <div>
      <h2>My Wallet</h2>
      <div style={card}>
        <h3>Wallet Balance</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>FCFA 250,000</p>
      </div>

      <div style={card}>
        <h3>Recent Transactions</h3>
        <ul>
          <li>+ FCFA 100,000 – Disbursement – 03/04/2025</li>
          <li>- FCFA 10,000 – Withdrawal – 01/04/2025</li>
          <li>+ FCFA 160,000 – Profit Share – 21/03/2025</li>
        </ul>
      </div>
    </div>
  );
};

const card = {
  padding: '20px',
  margin: '20px 0',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
};

export default Wallet;