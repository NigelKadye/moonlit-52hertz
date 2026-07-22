import crypto from "node:crypto";
import { RequestHandler } from "express";
import {
  PaynowInitiateRequest,
  PaynowInitiateResponse,
} from "@shared/api";

const PAYNOW_INITIATE_URL =
  process.env.PAYNOW_INITIATE_URL ??
  "https://www.paynow.co.zw/interface/initiatetransaction";
const BOOK_PRICE_USD = Number(process.env.BOOK_PRICE_USD ?? "20");

function generatePaynowHash(fields: Array<[string, string]>, integrationKey: string) {
  const concatenatedValues = fields
    .filter(([key]) => key.toLowerCase() !== "hash")
    .map(([, value]) => value.trim())
    .join("");

  return crypto
    .createHash("sha512")
    .update(`${concatenatedValues}${integrationKey}`, "utf8")
    .digest("hex")
    .toUpperCase();
}

export const handlePaynowInitiate: RequestHandler = async (req, res) => {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
  const returnUrl = process.env.PAYNOW_RETURN_URL;
  const resultUrl = process.env.PAYNOW_RESULT_URL;

  if (!integrationId || !integrationKey || !returnUrl || !resultUrl) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message:
        "Paynow is not configured. Set PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY, PAYNOW_RETURN_URL and PAYNOW_RESULT_URL.",
    };
    res.status(500).json(response);
    return;
  }

  if (!Number.isFinite(BOOK_PRICE_USD) || BOOK_PRICE_USD <= 0) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message: "BOOK_PRICE_USD must be a valid positive number.",
    };
    res.status(500).json(response);
    return;
  }

  const body = req.body as PaynowInitiateRequest;
  const quantity = Number(body.quantity);
  const customerName = body.customerName?.trim();
  const customerEmail = body.customerEmail?.trim();
  const customerPhone = body.customerPhone?.trim();

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message: "Please provide name, email, phone and a valid quantity.",
    };
    res.status(400).json(response);
    return;
  }

  const reference = `BOOK-${Date.now()}`;
  const totalAmount = (BOOK_PRICE_USD * quantity).toFixed(2);
  const fields: Array<[string, string]> = [
    ["id", integrationId],
    ["reference", reference],
    ["amount", totalAmount],
    ["additionalinfo", `Book order x${quantity}`],
    ["returnurl", returnUrl],
    ["resulturl", resultUrl],
    ["authemail", customerEmail],
    ["authphone", customerPhone],
    ["authname", customerName],
    ["status", "Message"],
  ];

  const hash = generatePaynowHash(fields, integrationKey);
  const payload = new URLSearchParams([...fields, ["hash", hash]]);

  const paynowResponse = await fetch(PAYNOW_INITIATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  const responseText = await paynowResponse.text();
  const params = new URLSearchParams(responseText);

  if (!paynowResponse.ok || params.get("status")?.toLowerCase() !== "ok") {
    const response: PaynowInitiateResponse = {
      ok: false,
      message:
        params.get("error") ??
        "Paynow could not initiate this transaction. Check your API keys and callback URLs.",
    };
    res.status(502).json(response);
    return;
  }

  const response: PaynowInitiateResponse = {
    ok: true,
    message: "Payment initiated.",
    redirectUrl: params.get("browserurl") ?? undefined,
    pollUrl: params.get("pollurl") ?? undefined,
    reference,
  };

  res.status(200).json(response);
};

export const handlePaynowResult: RequestHandler = (req, res) => {
  res.status(200).json({ ok: true, message: "Paynow result received." });
};
