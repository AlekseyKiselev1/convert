import React, { useMemo } from 'react';
import { CurrencyEnum, CurrencyList, CURRENCY_NAMES } from "../constants";
import { useFavorites } from '../context/FavoritesContext';
import './CurrencySelect.css';

interface CurrencySelectProps {
  value: CurrencyEnum;
  onChange: (value: CurrencyEnum) => void;
  className?: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange, className = '' }) => {
  const { isFavorite } = useFavorites();

  const sortedCurrencyList = useMemo(() => {
    return [...CurrencyList].sort((a, b) => {
      const aIsFavorite = isFavorite(a);
      const bIsFavorite = isFavorite(b);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return a.localeCompare(b);
    });
  }, [isFavorite]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as CurrencyEnum);
  };

  return (
    <div className={`select-wrapper ${className}`}>
      <select value={value} onChange={handleChange}>
        {sortedCurrencyList.map((currency) => (
          <option key={currency} value={currency}>
            {isFavorite(currency) ? '★ ' : ''}{currency} - {CURRENCY_NAMES[currency]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelect;