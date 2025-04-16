const API_URL = process.env.REACT_APP_API_URL;

interface FetchExchangeRateResponse {
  conversion_rates: { [key: string]: number };
}

export async function fetchExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  const response = await fetch(
    `${API_URL}/latest?base=${baseCurrency}&symbols=${targetCurrency}`
  );

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