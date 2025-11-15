import express from "express";
import { paymentWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/webhook", paymentWebhook);

export default router;
