import React, { useState, useEffect } from "react";
import { fetchExchangeRate } from "../api";
import { CurrencyEnum } from "../constants";

const AllCurrenciesViewer: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string>("");  
  const fetchRates = async () => {
    const newRates: { [key: string]: number } = {};
    const currencies = Object.values(CurrencyEnum);

    try {
      setLoading(true); 
      for (const currency of currencies) {
        const rate = await fetchExchangeRate(baseCurrency, currency);
        newRates[currency] = rate;
      }
      setRates(newRates);
    } catch (err) {
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
        <h2>Все валюты - Курсы</h2>
        <div className="currency-list">
          {Object.entries(rates).map(([currency, rate]) => (
            <div key={currency} className="all-currency-item">
              <span>{currency}: {rate.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCurrenciesViewer;