require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

const API_KEY = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;
if (!API_KEY) {
  console.error("API key missing! Please set REACT_APP_EXCHANGE_RATE_API_KEY in .env");
  process.exit(1);
}

app.use(cors());

app.get("/latest", async (req, res) => {
  try {
    const { base, symbols } = req.query;
    if (!base || !symbols) {
      return res.status(400).json({ error: "Missing base or symbols" });
    }

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;
    const response = await axios.get(url);

    if (response.data.result !== "success") {
      return res.status(500).json({ error: response.data["error-type"] || "API error" });
    }

    const requestedSymbols = symbols.split(",");
    const filteredRates = {};
    requestedSymbols.forEach((sym) => {
      if (response.data.conversion_rates[sym]) {
        filteredRates[sym] = response.data.conversion_rates[sym];
      }
    });

    res.json({
      base: base,
      rates: filteredRates,
      time_last_update_unix: response.data.time_last_update_unix,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch latest rates" });
  }
});

app.get("/chart-timeseries", async (req, res) => {
  try {
    const { base, symbols, start_date, end_date } = req.query;
    if (!base || !symbols || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required query parameters" });
    }

    const url = "https://api.exchangerate.host/timeseries";
    const response = await axios.get(url, {
      params: {
        base,
        symbols,
        start_date,
        end_date,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch historical rates" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});