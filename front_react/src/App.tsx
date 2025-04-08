import React, { useState } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import SingleCurrencyViewer from "./components/SingleCurrencyViewer";
import "./App.css";
import bitcoin from "./images/bitcoin.png";
import ethereum from "./images/ethereum.png";

function App() {
  const [mode, setMode] = useState<"converter" | "single">("converter");

  return (
    <div className="App">
      <img src={bitcoin} alt="Bitcoin" className="top-left-image" />

      <div className="mode-switch">
        <button
          className={`mode-button ${mode === "converter" ? "active" : ""}`}
          onClick={() => setMode("converter")}
        >
          Converter
        </button>
        <button
          className={`mode-button ${mode === "single" ? "active" : ""}`}
          onClick={() => setMode("single")}
        >
          Single
        </button>
        <div className={`underline ${mode === "single" ? "single" : "converter"}`}></div>
      </div>

      {mode === "converter" ? <CurrencyConverter /> : <SingleCurrencyViewer />}

      <img src={ethereum} alt="Ethereum" className="bottom-right-image" />
    </div>
  );
}

export default App;