const PROXY_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const HISTORICAL_API_URL = "https://api.frankfurter.app";

interface HistoricalRatesResponse {
  message?: string;
  rates: { [date: string]: { [currency: string]: number } };
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
}

export async function fetchExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  const response = await fetch(
    `${PROXY_API_URL}/latest?base=${baseCurrency}&symbols=${targetCurrency}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API response error:", errorText);
    throw new Error("Failed to fetch exchange rate");
  }

  const data = await response.json();

  if (!data.rates || !data.rates[targetCurrency]) {
    throw new Error("Rate not found in API response");
  }

  return data.rates[targetCurrency];
}

export async function fetchAllRates(
  baseCurrency: string,
  targetCurrencies: string[]
): Promise<Record<string, number>> {
  const symbolsString = targetCurrencies.join(',');

  const response = await fetch(
    `${PROXY_API_URL}/latest?base=${baseCurrency}&symbols=${symbolsString}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API response error:", errorText);
    throw new Error("Failed to fetch all exchange rates");
  }

  const data = await response.json();

  if (!data.rates) {
    throw new Error("Rates not found in API response");
  }

  return data.rates;
}

export async function fetchHistoricalRates(
  baseCurrency: string,
  days: number,
  targetCurrency: string
): Promise<HistoricalRatesResponse> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const url = `${HISTORICAL_API_URL}/${formatDate(startDate)}..${formatDate(endDate)}?from=${baseCurrency}&to=${targetCurrency}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch historical rates");
  }

  const data = await response.json();
  
  if (!data || !data.rates) {
    throw new Error("No historical data available for the selected currency pair.");
  }

  return data;
}