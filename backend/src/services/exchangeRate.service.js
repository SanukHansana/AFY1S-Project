//backend/src/services/exchangeRate.service.js
import { getRatesFromExchangeAPI } from "../utils/exchangeRateClient.js";

export const convertCurrency = async ({
  amount,
  from = "USD",
  to = "LKR",
}) => {
  const { rates, fetchedAt, cached } = await getRatesFromExchangeAPI(from);

  const rate = rates?.[to];
  if (!rate) {
    const err = new Error(`Currency not supported: ${to}`);
    err.statusCode = 400;
    throw err;
  }

  const converted = Number(amount) * Number(rate);

  return {
    from,
    to,
    amount: Number(amount),
    rate: Number(rate),
    convertedAmount: Number(converted.toFixed(2)),
    fetchedAt,
    cached,
  };
};