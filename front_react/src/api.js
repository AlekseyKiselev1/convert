const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;
const BASE_URL = "https://v6.exchangerate-api.com/v6/";

export async function fetchExchangeRate(baseCurrency, targetCurrency) {
  const response = await fetch(
    `${BASE_URL}${API_KEY}/latest/${baseCurrency}`
  );

  const data = await response.json();

  if (!data.conversion_rates) {
    throw new Error("Ошибка: Некорректный ответ API");
  }

  const value = data.conversion_rates[targetCurrency];

  if (typeof value === "number") {
    return value;
  }

  throw new Error("incorrect value");
}