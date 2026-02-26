//backend/src/controllers/exchangeController.js
import { convertCurrency } from "../services/exchangeRate.service.js";

export const convert = async (req, res, next) => {
  try {
    const { amount, to } = req.query;

    if (!amount || !to) {
      return res.status(400).json({ message: "amount and to are required" });
    }

    const result = await convertCurrency({
      amount: Number(amount),
      from: "USD",
      to,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};