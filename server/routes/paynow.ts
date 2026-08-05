import crypto from "node:crypto";
import { RequestHandler } from "express";
import {
  PaynowInitiateRequest,
  PaynowInitiateResponse,
} from "@shared/api";

const PAYNOW_INITIATE_URL =
  process.env.PAYNOW_INITIATE_URL ??
  "https://www.paynow.co.zw/interface/initiatetransaction";
const BOOK_PRICES_USD = {
  digital: Number(process.env.BOOK_PRICE_DIGITAL_USD ?? "12.95"),
  hard: Number(process.env.BOOK_PRICE_HARD_USD ?? "19.95"),
} as const;

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

  const body = req.body as PaynowInitiateRequest;
  const quantity = Number(body.quantity);
  const customerName = body.customerName?.trim();
  const customerEmail = body.customerEmail?.trim();
  const customerPhone = body.customerPhone?.trim();
  const bookFormat = body.bookFormat;
  const unitPrice = BOOK_PRICES_USD[bookFormat];

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    (bookFormat !== "digital" && bookFormat !== "hard") ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message: "Please provide name, email, phone, book format and a valid quantity.",
    };
    res.status(400).json(response);
    return;
  }

  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message: "Book price configuration is invalid.",
    };
    res.status(500).json(response);
    return;
  }

  const reference = `BOOK-${Date.now()}`;
  const totalAmount = (unitPrice * quantity).toFixed(2);
  const formatLabel = bookFormat === "digital" ? "Digital Book" : "Hard Book";
  const fields: Array<[string, string]> = [
    ["id", integrationId],
    ["reference", reference],
    ["amount", totalAmount],
    ["additionalinfo", `${formatLabel} order x${quantity}`],
    ["returnurl", returnUrl],
    ["resulturl", resultUrl],
    ["authemail", customerEmail],
    ["authphone", customerPhone],
    ["authname", customerName],
    ["status", "Message"],
  ];

  const hash = generatePaynowHash(fields, integrationKey);
  const payload = new URLSearchParams([...fields, ["hash", hash]]);

  let paynowResponse: Response;
  let responseText: string;
  try {
    paynowResponse = await fetch(PAYNOW_INITIATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });
    responseText = await paynowResponse.text();
  } catch (err) {
    const response: PaynowInitiateResponse = {
      ok: false,
      message: "Could not reach Paynow. Please check your connection and try again.",
    };
    res.status(502).json(response);
    return;
  }

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
