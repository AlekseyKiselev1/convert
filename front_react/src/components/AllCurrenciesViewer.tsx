import React, { useState, useEffect } from "react";
import { fetchExchangeRate } from "../api";
import { CurrencyEnum } from "../constants";
import { formatRate } from "../utils/formatRate";

const CACHE_KEY = "exchangeRatesCache";
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface CachedData {
  rates: Record<string, number>;
  timestamp: number;
}

const AllCurrenciesViewer: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchRates = async () => {
    setLoading(true);
    setError("");

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedData = JSON.parse(cached);
        const isFresh = Date.now() - parsed.timestamp < CACHE_TTL;

        if (isFresh) {
          setRates(parsed.rates);
          setLoading(false);
          return;
        }
      }

      const newRates: Record<string, number> = {};
      const currencies = Object.values(CurrencyEnum);

      const promises = currencies.map(async (currency) => {
        const rate = await fetchExchangeRate(baseCurrency, currency);
        newRates[currency] = rate;
      });

      await Promise.all(promises);

      setRates(newRates);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ rates: newRates, timestamp: Date.now() })
      );
    } catch {
      setError("Не удалось загрузить данные о курсах.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency]);

  if (loading) {
    return <div>Загрузка курсов валют...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2>All Rates</h2>
        <div className="currency-list">
          {Object.entries(rates).map(([currency, rate]) => (
            <div key={currency} className="all-currency-item">
              <span>{currency}: {formatRate(rate)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCurrenciesViewer;