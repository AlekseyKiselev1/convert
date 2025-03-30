import "./CurrencySelect.css"; // Подключаем стили

const CurrencySelect = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="select-field">
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
  );
};

export default CurrencySelect;