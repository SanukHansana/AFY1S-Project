//backend/src/routes/exchangeRoutes.js
import express from "express";
import { convert } from "../controllers/exchangeController.js";

const router = express.Router();

router.get("/convert", convert);

export default router;