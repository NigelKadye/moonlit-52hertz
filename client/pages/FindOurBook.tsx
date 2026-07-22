import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PaynowInitiateResponse } from "@shared/api";
import BrandLockup from "@/components/BrandLockup";

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
  const [showEnvKeys, setShowEnvKeys] = useState(false);

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
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-12">
          <BrandLockup />
          <Link to="/" className="shrink-0 text-sm font-semibold text-lime transition hover:text-white">
            Back to home
          </Link>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <p className="eyebrow">Book</p>
          <h1 className="section-title mt-4">Find My Book</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
            Explore the front and back cover, then use Paynow to complete your order.
          </p>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2">
            <figure className="mx-auto w-full max-w-md rounded-3xl border border-ink/10 bg-white p-3 sm:max-w-none sm:p-4">
              <img
                src="/book/front-cover.jpeg"
                alt="Book front cover"
                className="w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-4 text-sm font-semibold text-ink/60">
                Front cover
              </figcaption>
            </figure>
            <figure className="mx-auto w-full max-w-md rounded-3xl border border-ink/10 bg-white p-3 sm:max-w-none sm:p-4">
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

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mx-auto grid max-w-[1320px] gap-6 sm:gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
          <article className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-7 lg:p-9">
            <p className="eyebrow">Paynow checkout</p>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
              Complete your order
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink/65 sm:text-base">
              You will be redirected to Paynow to finish payment securely.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
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
          </article>

          <article className="rounded-3xl border border-ink/10 bg-ink p-5 text-white sm:p-7 lg:p-9">
            <p className="eyebrow text-lime">Deployment setup</p>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
              Configure Paynow in Netlify
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
              API keys stay hidden server-side. Add them in Netlify environment variables.
            </p>
            <button
              type="button"
              onClick={() => setShowEnvKeys((current) => !current)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-lime transition hover:border-lime"
            >
              {showEnvKeys ? "Hide variable names" : "Show variable names"}
            </button>
            {showEnvKeys && (
              <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-6 text-lime">
PAYNOW_INTEGRATION_ID=your_integration_id
PAYNOW_INTEGRATION_KEY=your_integration_key
PAYNOW_RETURN_URL=https://52hertz.co.zw/find-my-book
PAYNOW_RESULT_URL=https://52hertz.co.zw/api/paynow/result
BOOK_PRICE_USD=20
              </pre>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
