import React, { useState, useEffect } from "react";
import { CurrencyEnum } from "../constants";
import { fetchExchangeRate } from "../api";
import CurrencySelect from "./CurrencySelect";
import "./SingleCurrencyViewer.css";

const SingleCurrencyViewer: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currenciesToCompare, setCurrenciesToCompare] = useState<CurrencyEnum[]>([]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const newRates: { [key: string]: number } = {};
      const targets = [...currenciesToCompare];
      for (const target of targets) {
        const rate = await fetchExchangeRate(baseCurrency, target);
        newRates[target] = rate;
      }
      setRates(newRates);
    } catch (error) {
      console.error("Error fetching rates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currenciesToCompare.length > 0) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency, currenciesToCompare]);

  const addCurrency = (currency: CurrencyEnum) => {
    if (!currenciesToCompare.includes(currency) && currency !== baseCurrency) {
      setCurrenciesToCompare((prev) => [...prev, currency]);
    }
  };

  const removeCurrency = (currency: CurrencyEnum) => {
    setCurrenciesToCompare((prev) => prev.filter((c) => c !== currency));
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2 className="title">Exchange rates from one base currency</h2>
        <CurrencySelect value={baseCurrency} onChange={(value: CurrencyEnum) => setBaseCurrency(value)} />
        
        <div className="currency-list">
          <h3>Compare with:</h3>
          <div className="added-currencies">
            {currenciesToCompare.length > 0 ? (
              currenciesToCompare.map((currency) => (
                <div key={currency} className="currency-item">
                  <span className="currency-info">
                    {rates[currency] ? `${rates[currency].toFixed(4)} ${currency}` : "Loading..."}
                  </span>
                  <div className="icon-box">
                    <button onClick={() => removeCurrency(currency)} className="remove-button">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No currencies added for comparison</p>
            )}
          </div>

          <div className="add-currency">
            <CurrencySelect
              value={baseCurrency}
              onChange={(value) => addCurrency(value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="result">Loading...</p>
        ) : (
          <div className="result">
            {Object.entries(rates).map(([currency, rate]) => (
              !currenciesToCompare.includes(currency as CurrencyEnum) && currency !== baseCurrency && (
                <p key={currency}>
                  1 {baseCurrency} = {rate.toFixed(4)} {currency}
                </p>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCurrencyViewer;