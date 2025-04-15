// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BASE_URL = "https://v6.exchangerate-api.com/v6/";

interface FetchExchangeRateResponse {
  conversion_rates: { [key: string]: number };
}

export async function fetchExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  const response = await fetch(
    `http://localhost:3000/latest?base=${baseCurrency}&symbols=${targetCurrency}`
  );
// localhost:3000 перенести в .env 
  const data: FetchExchangeRateResponse = await response.json();

  if (!data.conversion_rates) {
    throw new Error("Ошибка: Некорректный ответ API");
  }

  const value = data.conversion_rates[targetCurrency];

  if (typeof value === "number") {
    return value;
  }

  throw new Error("incorrect value");
}