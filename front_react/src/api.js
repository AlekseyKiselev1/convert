const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;
const BASE_URL = "https://v6.exchangerate-api.com/v6/";

export async function fetchExchangeRate(baseCurrency, targetCurrency) {
    try {
        const response = await fetch(`${BASE_URL}${API_KEY}/latest/${baseCurrency}`);
        const data = await response.json();

        if (!data.conversion_rates) {
            throw new Error("Ошибка: Некорректный ответ API");
        }

        return data.conversion_rates[targetCurrency];
    } catch (error) {
        console.error("Ошибка при получении курса валют:", error);
        return null;
    }
}