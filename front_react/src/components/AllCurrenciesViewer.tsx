import React, { useState, useEffect } from "react";
import { fetchExchangeRate } from "../api";
import { CurrencyEnum } from "../constants";

const AllCurrenciesViewer: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [baseCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string>("");  
  const fetchRates = async () => {
    const newRates: { [key: string]: number } = {};
    const currencies = Object.values(CurrencyEnum);
//Кэширование через lockal storage
// 1 функция FetchRates либо FetchExchanges
//2 вначале проверить localstorage ключик на наличие данныз (данные={1Result:ответ бэка,2Date время кэширования}, )
//3 если данные есть и Date.now -24 часа > чем Date.cash то возвращаем данные с кэша 
//4если нету данных или Date.now -24 часа< чем Date.cash - делаем запрос на бэк, 
//5 сохраняем полученный ответ с бэка в кэш

// tofixed в api 
try {
      setLoading(true); 
      for (const currency of currencies) { //Promise.all,Promise.allSetalt 
        const rate = await fetchExchangeRate(baseCurrency, currency);
        newRates[currency] = rate;  
      }
      setRates(newRates);
    } catch (err) {
      setError("Не удалось загрузить данные о курсах.");
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchRates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency]);

  if (loading) {
    return <div>Загрузка курсов валют...</div>;  
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2>All Rates</h2>
        <div className="currency-list">
          {Object.entries(rates).map(([currency, rate]) => (
            <div key={currency} className="all-currency-item">
              <span>{currency}: {rate.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCurrenciesViewer;