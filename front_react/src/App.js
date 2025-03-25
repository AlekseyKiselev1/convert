import React from 'react';
import CurrencyConverter from './components/CurrencyConverter'; // Импортируйте CurrencyConverter
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Check live foreign currency exchange rates</h1>
      <CurrencyConverter />
    </div>
  );
}

export default App;