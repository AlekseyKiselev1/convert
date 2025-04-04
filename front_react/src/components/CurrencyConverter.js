import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import CurrencySelect from "./CurrencySelect";
import { fetchExchangeRate } from "../api";
import "./CurrencyConverter.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [result, setResult] = useState(null);
  const [isConverted, setIsConverted] = useState(false);

  const getRate = async () => {
    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      if (typeof rate === "number") {
        setExchangeRate(rate);
      } else {
        console.error("Invalid exchange rate received:", rate);
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  const handleConvert = () => {
    getRate();
    setIsConverted(true);
  };

  useEffect(() => {
    if (isConverted && exchangeRate) {
      setResult((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate, isConverted]);

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2 className="title">Check live foreign currency exchange rates</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
        />
        <div className="select-container">
          <CurrencySelect value={fromCurrency} onChange={setFromCurrency} />
          <div className="icon-box">
            <ArrowLeftRight className="icon" />
          </div>
          <CurrencySelect value={toCurrency} onChange={setToCurrency} />
        </div>
        <h3 className="result">
          {isConverted
            ? exchangeRate
              ? `Result: ${result} ${toCurrency}`
              : "Loading..."
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