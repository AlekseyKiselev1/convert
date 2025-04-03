import React from "react";
import "./CurrencySelect.css"; 

const CurrencySelect = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="RUB">RUB</option>
      <option value="BYN">BYN</option>
    </select>
  );
};

export default CurrencySelect;