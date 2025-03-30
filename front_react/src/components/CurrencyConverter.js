import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import CurrencySelect from "./CurrencySelect";
import "./CurrencyConverter.css"; // Подключаем стили

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

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
        <button className="convert-button">Convert</button>
      </div>
    </div>
  );
};

export default CurrencyConverter;