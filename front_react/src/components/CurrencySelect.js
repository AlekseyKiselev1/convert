import React from "react";
import "./CurrencySelect.css";
import { CurrencyList } from "../constants";

const CurrencySelect = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {CurrencyList.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;