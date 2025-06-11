import React, { useState, useEffect, useMemo } from "react";
import { CurrencyChart } from "./CurrencyChart";
import { fetchAllRates } from "../api";
import { CurrencyEnum, CURRENCY_NAMES } from "../constants";
import { formatRate } from "../utils/formatRate";
import { useFavorites } from "../context/FavoritesContext";
import "./AllCurrenciesViewer.css";

const SearchIcon = () => (
  <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`star-icon ${filled ? 'filled' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const AllCurrenciesViewer: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        const currenciesToFetch = Object.values(CurrencyEnum).filter(
          (currency) => currency !== baseCurrency
        );
        
        const allRates = await fetchAllRates(baseCurrency, currenciesToFetch);

        setRates(allRates);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load rates: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [baseCurrency]);

  const filteredRates = useMemo(() => {
    if (!searchTerm) return rates;
    const lowercasedSearch = searchTerm.toLowerCase();
    return Object.entries(rates).reduce((acc, [currency, rate]) => {
      const currencyName = CURRENCY_NAMES[currency as CurrencyEnum]?.toLowerCase() || '';
      const currencyCode = currency.toLowerCase();
      if (currencyName.includes(lowercasedSearch) || currencyCode.includes(lowercasedSearch)) {
        acc[currency] = rate;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [rates, searchTerm]);

  const sortedAndFilteredRates = useMemo(() => {
    return Object.entries(filteredRates).sort(([currencyA], [currencyB]) => {
      const aIsFavorite = isFavorite(currencyA);
      const bIsFavorite = isFavorite(currencyB);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return currencyA.localeCompare(currencyB);
    });
  }, [filteredRates, isFavorite]);

  const handleFavoriteToggle = (e: React.MouseEvent, currency: string) => {
    e.stopPropagation();
    if (isFavorite(currency)) {
      removeFavorite(currency);
    } else {
      addFavorite(currency);
    }
  };

  if (loading) return <div className="loading">Loading currencies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="all-currencies-container">
      <div className="all-currencies-header">
        <h2 className="base-currency">Base: {baseCurrency}</h2>
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            placeholder="Поиск по названию или коду..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="currencies-grid">
        {sortedAndFilteredRates.map(([currency, rate]) => (
          <div
            key={currency}
            className={`currency-card ${selectedCurrency === currency ? 'selected' : ''}`}
            onClick={() => setSelectedCurrency(selectedCurrency === currency ? null : currency)}
          >
            <button className="favorite-button" onClick={(e) => handleFavoriteToggle(e, currency)}>
              <StarIcon filled={isFavorite(currency)} />
            </button>
            <div className="currency-code">{currency}</div>
            <div className="currency-name">{CURRENCY_NAMES[currency as CurrencyEnum]}</div>
            <div className="currency-rate">{formatRate(rate)}</div>
          </div>
        ))}
      </div>
      {Object.keys(filteredRates).length === 0 && !loading && (
        <p className="placeholder-text">Валюта не найдена.</p>
      )}
      {selectedCurrency && (
        <CurrencyChart
          baseCurrency={baseCurrency}
          targetCurrency={selectedCurrency}
          onClose={() => setSelectedCurrency(null)}
          days={180}
        />
      )}
    </div>
  );
};

export default AllCurrenciesViewer;