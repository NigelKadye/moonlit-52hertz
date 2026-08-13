import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PaynowInitiateResponse } from "@shared/api";

type PaymentForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  bookFormat: "digital" | "hard";
};

const initialForm: PaymentForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  quantity: 1,
  bookFormat: "digital",
};

const bookOptions = [
  {
    value: "digital" as const,
    label: "Digital Book",
    price: 14.95,
    description: "Instant digital access.",
  },
  {
    value: "hard" as const,
    label: "Hard Book",
    price: 19.95,
    description: "Printed copy delivered to you.",
  },
];

export default function FindOurBook() {
  const [form, setForm] = useState<PaymentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <h1 className="section-title mt-5">Find my Book</h1>
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
              Choose your format and continue to Paynow to complete your order securely.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {bookOptions.map((option) => {
                const isSelected = form.bookFormat === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, bookFormat: option.value }))
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 bg-sand text-ink hover:border-ink/30"
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-70">
                      {option.label}
                    </p>
                    <p className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                      ${option.price.toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm leading-6 opacity-75">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <p className="text-sm leading-6 text-ink/65">
                Submits your details to our server, which starts a payment using the
                platform-owned Paynow integration and redirects you to a unique checkout page.
              </p>
              <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink/70">
                Selected:{" "}
                <span className="font-semibold text-ink">
                  {bookOptions.find((option) => option.value === form.bookFormat)?.label}
                </span>{" "}
                · $
                {bookOptions
                  .find((option) => option.value === form.bookFormat)
                  ?.price.toFixed(2)}
              </div>
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-bold text-lime transition hover:bg-olive disabled:cursor-not-allowed dis[...]"
              >
                {isSubmitting ? "Preparing payment..." : "Pay with Paynow"}
                <ArrowRight size={17} />
              </button>
            </form>
          </article>

          <article className="rounded-3xl border border-ink/10 bg-ink p-7 text-white lg:p-9">
            <p className="eyebrow text-lime">Paynow details</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">
              Paynow checkout
            </h2>
            <p className="mt-4 leading-7 text-white/70">
              Complete your order using the platform-owned Paynow checkout.
            </p>
            <div className="mt-6 space-y-4 rounded-2xl border border-white/15 bg-white/5 p-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
                  Digital Book
                </p>
                <p className="mt-2 text-2xl font-medium">$14.95</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Best for instant access through Paynow checkout.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
                  Hard Book
                </p>
                <p className="mt-2 text-2xl font-medium">$19.95</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Choose the printed edition and finish payment with Paynow.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <a
                href='https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPXZ0c2FuZHVyYSU0MGljbG91ZC5jb20mYW1vdW50PTE0Ljk1JnJlZmVyZW5jZT0mbD0w'
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_buy-now_medium.png"
                  alt="Buy now with Paynow - Digital Copy"
                  className="h-auto"
                />
              </a>
              <a
                href="https://www.paynow.co.zw/Payment/BillPaymentLink/?q=aWQ9MjYwNjcmYW1vdW50PTE5Ljk1JmFtb3VudF9xdWFudGl0eT0wLjAwJmw9MQ%3d%3d"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_buy-now_medium.png"
                  alt="Buy now with Paynow - Hard Copy"
                  className="h-auto"
                />
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
