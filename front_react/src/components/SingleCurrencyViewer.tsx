import React, { useState, useEffect } from "react";
import { CurrencyEnum, CURRENCY_NAMES } from "../constants";
import { fetchExchangeRate } from "../api";
import CurrencySelect from "./CurrencySelect";
import { formatRate } from "../utils/formatRate";
import "./CurrencyConverter.css"; 
import "./SingleCurrencyViewer.css";

const SingleCurrencyViewer: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currenciesToCompare, setCurrenciesToCompare] = useState<CurrencyEnum[]>([]);

  useEffect(() => {
    const fetchRatesForComparison = async () => {
      if (currenciesToCompare.length === 0) {
        setRates({});
        return;
      }
      setIsLoading(true);
      try {
        const newRates: { [key: string]: number } = {};
        await Promise.all(
            currenciesToCompare.map(async (target) => {
                if (target !== baseCurrency) {
                    const rate = await fetchExchangeRate(baseCurrency, target);
                    newRates[target] = rate;
                } else {
                    newRates[target] = 1; 
                }
            })
        );
        setRates(newRates);
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatesForComparison();
  }, [baseCurrency, currenciesToCompare]);

  const addCurrency = (currency: CurrencyEnum) => {
    if (!currenciesToCompare.includes(currency)) {
      setCurrenciesToCompare((prev) => [...prev, currency].sort());
    }
  };

  const removeCurrency = (currency: CurrencyEnum) => {
    setCurrenciesToCompare((prev) => prev.filter((c) => c !== currency));
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2 className="converter-title">Курсы валют</h2>
        
        <div className="input-group">
          <label>Базовая валюта</label>
          <CurrencySelect value={baseCurrency} onChange={setBaseCurrency} />
        </div>

        <div className="comparison-list">
          {isLoading && currenciesToCompare.length > 0 && <p className="loading-text">Обновление курсов...</p>}
          
          {currenciesToCompare.length > 0 ? (
            currenciesToCompare.map((currency) => (
              <div key={currency} className="comparison-item">
                <div className="comparison-info">
                  <span className="comparison-code">{currency}</span>
                  <span className="comparison-name">{CURRENCY_NAMES[currency]}</span>
                </div>
                <div className="comparison-rate">
                  {rates[currency] ? formatRate(rates[currency], 4) : '...'}
                </div>
                <button onClick={() => removeCurrency(currency)} className="remove-button">
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="placeholder-text">Добавьте валюты для сравнения</p>
          )}
        </div>

        <div className="input-group">
           <label>Добавить валюту для сравнения</label>
           <CurrencySelect
              value={baseCurrency} 
              onChange={(value) => addCurrency(value)}
            />
        </div>

      </div>
    </div>
  );
};

export default SingleCurrencyViewer;