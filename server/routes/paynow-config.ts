import { RequestHandler } from "express";
import { PaynowConfigResponse } from "@shared/api";

export const handlePaynowConfig: RequestHandler = (_req, res) => {
  const response: PaynowConfigResponse = {
    billPaymentUrl: process.env.PAYNOW_BILLPAYMENT_URL ?? null,
  };
  res.json(response);
};
