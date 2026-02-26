//backend/src/utils/exchangeRateClient.js
import axios from "axios";

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const CACHE_MINUTES = Number(process.env.EXCHANGE_RATE_CACHE_MINUTES || 60);

// simple in-memory cache
let cache = {
  base: "USD",
  fetchedAt: null,
  rates: null,
};

const isCacheValid = () => {
  if (!cache.fetchedAt || !cache.rates) return false;
  const ageMs = Date.now() - cache.fetchedAt.getTime();
  return ageMs < CACHE_MINUTES * 60 * 1000;
};

export const getRatesFromExchangeAPI = async (base = "USD") => {
  if (!API_KEY) {
    const err = new Error("EXCHANGE_RATE_API_KEY is missing in .env");
    err.statusCode = 500;
    throw err;
  }

  // use cache if valid
  if (cache.base === base && isCacheValid()) {
    return { rates: cache.rates, fetchedAt: cache.fetchedAt, cached: true };
  }

  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;

  const response = await axios.get(url);

  if (response.data?.result !== "success") {
    const err = new Error(
      response.data?.["error-type"] || "ExchangeRate API request failed"
    );
    err.statusCode = 502;
    throw err;
  }

  cache = {
    base,
    fetchedAt: new Date(),
    rates: response.data.conversion_rates,
  };

  return { rates: cache.rates, fetchedAt: cache.fetchedAt, cached: false };
};