import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import CurrencyConverter from "./components/CurrencyConverter";
import SingleCurrencyViewer from "./components/SingleCurrencyViewer";
import AllCurrenciesViewer from "./components/AllCurrenciesViewer";
import NotFound from "./components/NotFound";
import { classNames } from "./utils/classNames";
import "./App.css";
import bitcoin from "./images/bitcoin.png";
import ethereum from "./images/ethereum.png";

function App() {
  return (
    <div className="App">
      <img src={bitcoin} alt="Bitcoin" className="top-left-image" />
      <div className="mode-switch">
        <NavLink
          to="/"
          end
          className={({ isActive }) => classNames("mode-button", isActive && "active")}
        >
          Converter
        </NavLink>
        <NavLink
          to="/single"
          className={({ isActive }) => classNames("mode-button", isActive && "active")}
        >
          Single
        </NavLink>
        <NavLink
          to="/all-currencies"
          className={({ isActive }) => classNames("mode-button", isActive && "active")}
        >
          All Currencies
        </NavLink>
        <div className="underline-container">
          <div className="underline-bg"></div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<CurrencyConverter />} />
        <Route path="/single" element={<SingleCurrencyViewer />} />
        <Route path="/all-currencies" element={<AllCurrenciesViewer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <img src={ethereum} alt="Ethereum" className="bottom-right-image" />
    </div>
  );
}

export default App;