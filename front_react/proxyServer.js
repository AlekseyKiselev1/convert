const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
require('dotenv').config();

if (!process.env.REACT_APP_EXCHANGE_RATE_API_KEY) {
  console.error("Ошибка: API ключ не установлен. Проверьте .env файл.");
  process.exit(1);
}

const app = express();
const cache = new NodeCache();

const API_URL = "https://v6.exchangerate-api.com/v6";

app.get("/latest", async (req, res) => {
  const { base, symbols } = req.query;

  const cacheKey = `${base}_${symbols}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `${API_URL}/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/${base}`,
      {
        params: { symbols }
      }
    );

    cache.set(cacheKey, response.data, 600);

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching exchange rates" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});