import React, { useState } from 'react';
import CurrencySelect from './CurrencySelect';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    // Здесь должна быть логика получения курса валюты и конвертации
    setResult(amount * 0.85); // Пример: 1 USD = 0.85 EUR
  };

  return (
    <div className="currency-converter">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <CurrencySelect
        currency={fromCurrency}
        setCurrency={setFromCurrency}
      />
      <CurrencySelect
        currency={toCurrency}
        setCurrency={setToCurrency}
      />
      <button onClick={handleConvert}>Convert</button>
      {result && <h2>Result: {result.toFixed(2)} {toCurrency}</h2>}
    </div>
  );
};

export default CurrencyConverter;