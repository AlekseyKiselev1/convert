import React from 'react';
import { CurrencyEnum } from "../constants";
import { CurrencyList } from "../constants";
import './CurrencySelect.css';

interface CurrencySelectProps {
  value: CurrencyEnum;
  onChange: (value: CurrencyEnum) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value as CurrencyEnum;
    onChange(selectedCurrency);
  };

  return (
    <select value={value} onChange={handleChange}>
      {CurrencyList.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;