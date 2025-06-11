import React, { useState, useEffect } from "react";
import { CurrencyEnum } from "../constants";
import { fetchExchangeRate } from "../api";
import CurrencySelect from "./CurrencySelect";
import { formatRate } from "../utils/formatRate";
import { saveConversionToHistory } from "../utils/historyUtils";
import "./CurrencyConverter.css";

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
);

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number | string>(1);
  const [fromCurrency, setFromCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [toCurrency, setToCurrency] = useState<CurrencyEnum>(CurrencyEnum.EUR);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const getRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }
      
      setIsLoading(true);
      setExchangeRate(null);

      try {
        const rate = await fetchExchangeRate(fromCurrency, toCurrency);
        setExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        setExchangeRate(null);
      } finally {
        setIsLoading(false);
      }
    };

    getRate();
    setIsSaved(false);
    setIsCopied(false); 
  }, [fromCurrency, toCurrency]);

  const convertedAmount = exchangeRate !== null && typeof amount === 'number'
    ? formatRate(amount * exchangeRate, 4)
    : '...';

  const handleCopyToClipboard = () => {
    if (convertedAmount !== '...' && !isCopied) {
      navigator.clipboard.writeText(convertedAmount).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const handleSaveToHistory = () => {
    if (!isLoading && exchangeRate !== null && typeof amount === 'number' && amount > 0) {
      saveConversionToHistory({
        fromCurrency, toCurrency, amount, result: convertedAmount, rate: exchangeRate
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2 className="converter-title">Конвертер валют</h2>
        
        <div className="input-group">
          <label htmlFor="amount">Сумма</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value === '' ? '' : Number(e.target.value));
              setIsSaved(false);
              setIsCopied(false);
            }}
            className="input-field"
          />
        </div>

        <div className="controls-row">
            <CurrencySelect className="currency-select-from" value={fromCurrency} onChange={setFromCurrency} />
            <button className="swap-button" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} aria-label="Поменять валюты">⇆</button>
            <CurrencySelect className="currency-select-to" value={toCurrency} onChange={setToCurrency} />
        </div>

        <div className="result-area-wrapper">
            {isLoading ? (
                <div className="result-area loading">Загрузка курса...</div>
            ) : (
                <div className="result-area">
                    <div className="result-content">
                        <span className="result-amount">{convertedAmount}</span>
                        <span className="result-currency">{toCurrency}</span>
                    </div>
                    <button 
                        className={`copy-button ${isCopied ? 'copied' : ''}`} 
                        onClick={handleCopyToClipboard}
                        disabled={convertedAmount === '...'}
                    >
                        {isCopied ? '✓' : <CopyIcon />}
                    </button>
                </div>
            )}
        </div>

        {!isLoading && exchangeRate !== null && (
          <div className="rate-info">1 {fromCurrency} = {formatRate(exchangeRate, 4)} {toCurrency}</div>
        )}

        <button className="action-button" onClick={handleSaveToHistory} disabled={isSaved}>
          {isSaved ? '✓ Сохранено!' : 'Сохранить конвертацию'}
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;