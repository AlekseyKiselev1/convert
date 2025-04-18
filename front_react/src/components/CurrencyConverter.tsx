import React, { useState, useEffect } from "react";
import { CurrencyEnum } from "../constants";
import { fetchExchangeRate } from "../api";
import CurrencySelect from "./CurrencySelect";
import { formatRate } from "../utils/formatRate";
import "./CurrencyConverter.css";

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [toCurrency, setToCurrency] = useState<CurrencyEnum>(CurrencyEnum.EUR);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRate = async () => {
    setIsLoading(true);
    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = () => {
    getRate();
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    handleConvert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toCurrency, fromCurrency]);

  useEffect(() => {
    if (!isLoading && exchangeRate !== null) {
      setResult(formatRate(amount * exchangeRate, 2));
    }
  }, [amount, exchangeRate, isLoading]);

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2 className="title">Check live foreign currency exchange rates</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input-field"
        />
        <div className="select-container">
          <CurrencySelect value={fromCurrency} onChange={setFromCurrency} />
          <div className="icon-box" onClick={handleSwapCurrencies}>
            <span>⇆</span>
          </div>
          <CurrencySelect value={toCurrency} onChange={setToCurrency} />
        </div>
        <h3 className="result">
          {isLoading
            ? "Loading..."
            : result !== null
            ? `Result: ${result} ${toCurrency}`
            : "Press Convert to see result"}
        </h3>
        <button className="convert-button" onClick={handleConvert}>
          Convert
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;