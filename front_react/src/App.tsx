import React from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import "./App.css";
import bitcoin from "./images/bitcoin.png";
import ethereum from "./images/ethereum.png";

function App() {
  return (
    <div className="App">
      <img src={bitcoin} alt="Bitcoin" className="top-left-image" />
      <CurrencyConverter />
      <img src={ethereum} alt="Ethereum" className="bottom-right-image" />
    </div>
  );
}

export default App;