import React from 'react';

const CurrencySelect = ({ currency, setCurrency }) => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'BTC'];

  return (
    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
      {currencies.map((curr) => (
        <option key={curr} value={curr}>
          {curr}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;