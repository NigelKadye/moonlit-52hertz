import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PaynowConfigResponse, PaynowInitiateResponse } from "@shared/api";

type PaymentForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
};

const initialForm: PaymentForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  quantity: 1,
};

export default function FindOurBook() {
  const [form, setForm] = useState<PaymentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<"hosted" | "direct">("hosted");
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/paynow/config")
      .then((res) => res.json())
      .then((data: PaynowConfigResponse) => {
        setHostedUrl(data.billPaymentUrl);
        if (!data.billPaymentUrl) setPaymentMode("direct");
      })
      .catch(() => {
        setHostedUrl(null);
        setPaymentMode("direct");
      });
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/paynow/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: PaynowInitiateResponse = await response.json();

      if (!response.ok || !data.redirectUrl) {
        setError(data.message || "Could not start payment.");
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError("Could not connect to Paynow. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sand text-ink">
      <header className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 lg:px-12">
          <Link to="/" className="group flex items-center gap-3" aria-label="52Hertz home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-lg font-bold text-ink transition-transform group-hover:scale-105">52</span>
            <span className="text-lg font-semibold tracking-[-0.04em]">hertz</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-lime transition hover:text-white">
            Back to home
          </Link>
        </div>
      </header>

      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="eyebrow">Book</p>
          <h1 className="section-title mt-5">Find our Book</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
            Explore the front and back cover, then use Paynow to complete your order.
          </p>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            <figure className="rounded-3xl border border-ink/10 bg-white p-4">
              <img
                src="/book/front-cover.jpeg"
                alt="Book front cover"
                className="w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-4 text-sm font-semibold text-ink/60">
                Front cover
              </figcaption>
            </figure>
            <figure className="rounded-3xl border border-ink/10 bg-white p-4">
              <img
                src="/book/back-cover.jpeg"
                alt="Book back cover"
                className="w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-4 text-sm font-semibold text-ink/60">
                Back cover
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_0.95fr]">
          <article className="rounded-3xl border border-ink/10 bg-white p-7 lg:p-9">
            <p className="eyebrow">Paynow checkout</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
              Complete your order
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-ink/65">
              You will be redirected to Paynow to finish payment securely.
            </p>

            {/* Payment mode toggle – only show hosted option when the URL is available */}
            <div className="mt-6 inline-flex rounded-full border border-ink/15 bg-sand p-1">
              {hostedUrl && (
              <button
                type="button"
                onClick={() => setPaymentMode("hosted")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  paymentMode === "hosted"
                    ? "bg-ink text-lime"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Hosted Paynow Link
              </button>
              )}
              <button
                type="button"
                onClick={() => setPaymentMode("direct")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  paymentMode === "direct"
                    ? "bg-ink text-lime"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Direct API Initiation
              </button>
            </div>

            {paymentMode === "hosted" ? (
              <div className="mt-8">
                <p className="text-sm leading-6 text-ink/65">
                  Opens the secure Paynow BillPayment page in a new tab. No form
                  data is sent to our server — payment is handled entirely by
                  Paynow.
                </p>
                {hostedUrl ? (
                  <a
                    href={hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-bold text-lime transition hover:bg-olive"
                  >
                    Pay with Paynow (Hosted)
                    <ExternalLink size={17} />
                  </a>
                ) : (
                  <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Hosted payment link is not configured. Set{" "}
                    <code className="font-mono">PAYNOW_BILLPAYMENT_URL</code> in
                    your environment or switch to Direct API Initiation.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <p className="text-sm leading-6 text-ink/65">
                  Submits your details to our server, which calls the Paynow API
                  directly and redirects you to a unique payment page.
                </p>
                <label className="block text-sm font-semibold text-ink/70">
                  Full name
                  <input
                    required
                    value={form.customerName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customerName: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-ink/20 bg-sand px-4 py-3 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive"
                    placeholder="Your name"
                  />
                </label>
                <label className="block text-sm font-semibold text-ink/70">
                  Email
                  <input
                    required
                    type="email"
                    value={form.customerEmail}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customerEmail: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-ink/20 bg-sand px-4 py-3 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block text-sm font-semibold text-ink/70">
                  Phone number
                  <input
                    required
                    value={form.customerPhone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, customerPhone: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-ink/20 bg-sand px-4 py-3 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive"
                    placeholder="+263..."
                  />
                </label>
                <label className="block text-sm font-semibold text-ink/70">
                  Quantity
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        quantity: Number(event.target.value),
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-ink/20 bg-sand px-4 py-3 text-sm outline-none focus:border-olive focus:ring-1 focus:ring-olive"
                  />
                </label>

                {error && (
                  <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-bold text-lime transition hover:bg-olive disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Preparing payment..." : "Pay with Paynow"}
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </article>

          <article className="rounded-3xl border border-ink/10 bg-ink p-7 text-white lg:p-9">
            <p className="eyebrow text-lime">Where to add API keys</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
              Configure these in your environment
            </h2>
            <p className="mt-4 leading-7 text-white/70">
              Add these variables to your Netlify site environment variables:
            </p>
            <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-6 text-lime">
PAYNOW_INTEGRATION_ID=your_integration_id
PAYNOW_INTEGRATION_KEY=your_integration_key
PAYNOW_RETURN_URL=https://52hertz.co.zw/find-our-book
PAYNOW_RESULT_URL=https://52hertz.co.zw/api/paynow/result
BOOK_PRICE_USD=20
PAYNOW_BILLPAYMENT_URL=https://www.paynow.co.zw/Payment/BillPaymentLink/?q=...
            </pre>
          </article>
        </div>
      </section>
    </main>
  );
}
