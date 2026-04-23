"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart, cartSelectors } from "@/lib/cart-store";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui/page-hero";
import { toast } from "@/components/ui/toaster";

const SHIPPING_FLAT = 9.99;
const FREE_SHIPPING_OVER = 99;

type Step = "address" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(cartSelectors.subtotal);
  const shipping = subtotal === 0
    ? 0
    : subtotal >= FREE_SHIPPING_OVER
    ? 0
    : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>("address");
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    email: session?.user.email ?? "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    if (session?.user.email && !address.email) {
      setAddress((a) => ({ ...a, email: session.user.email }));
    }
  }, [session, address.email]);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  async function placeOrder() {
    if (!session?.user) {
      toast("Sign in to complete checkout.", "error");
      router.push(`/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, address, shipping }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      toast(data?.error ?? "Something went wrong placing your order.", "error");
      return;
    }
    const data = (await res.json()) as { id: string };
    clear();
    router.push(`/ordercompleted?id=${encodeURIComponent(data.id)}`);
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Almost yours"
        description="Three quick steps and your order ships."
      />

      <div className="container-page py-10">
        <Stepper step={step} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="glass rounded-2xl p-6">
            {step === "address" && (
              <AddressForm
                address={address}
                setAddress={setAddress}
                onNext={() => setStep("payment")}
              />
            )}
            {step === "payment" && (
              <PaymentForm
                card={card}
                setCard={setCard}
                onBack={() => setStep("address")}
                onNext={() => setStep("review")}
              />
            )}
            {step === "review" && (
              <Review
                address={address}
                items={items}
                onBack={() => setStep("payment")}
                onPlace={placeOrder}
                submitting={submitting}
                isAuthed={Boolean(session?.user)}
                isAuthLoading={isPending}
              />
            )}
          </div>

          <aside className="glass h-fit rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold">Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
                    {i.image && (
                      <Image
                        src={i.image}
                        alt={i.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {i.quantity} · ${i.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    ${(i.price * i.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-sm">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
              <Row label="Total" value={`$${total.toFixed(2)}`} emphasis />
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Encrypted in transit (HTTPS).
              Passwords are never sent to checkout.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <div
              className={
                "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition " +
                (done
                  ? "border-primary bg-primary text-background"
                  : active
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground")
              }
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={
                "text-sm " +
                (active
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground")
              }
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={
                  "h-px flex-1 transition " +
                  (i < currentIdx ? "bg-primary" : "bg-border")
                }
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "flex items-baseline justify-between border-t border-border/60 pt-2 text-base font-bold"
          : "flex items-baseline justify-between text-muted-foreground"
      }
    >
      <span>{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function AddressForm({
  address,
  setAddress,
  onNext,
}: {
  address: ReturnType<typeof Object>;
  setAddress: (a: typeof address) => void;
  onNext: () => void;
}) {
  return (
    <m.form
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="font-display text-xl font-bold">Shipping address</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            required
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={address.email}
            onChange={(e) => setAddress({ ...address, email: e.target.value })}
            required
          />
        </Field>
      </div>
      <Field label="Address line 1" required>
        <Input
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          required
        />
      </Field>
      <Field label="Address line 2 (optional)">
        <Input
          value={address.line2}
          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" required>
          <Input
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </Field>
        <Field label="Postal code" required>
          <Input
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            required
          />
        </Field>
        <Field label="Country" required>
          <Input
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit">
          Continue to payment <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </m.form>
  );
}

function PaymentForm({
  card,
  setCard,
  onBack,
  onNext,
}: {
  card: { number: string; name: string; expiry: string; cvc: string };
  setCard: (c: typeof card) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <m.form
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="font-display text-xl font-bold">Payment</h2>
      <p className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-foreground/80">
        This is a demo storefront — no real charge is made. Card details are not
        sent anywhere or saved.
      </p>
      <Field label="Card number" required>
        <Input
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e.target.value })}
          required
        />
      </Field>
      <Field label="Name on card" required>
        <Input
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })}
          required
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expiry" required>
          <Input
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
            required
          />
        </Field>
        <Field label="CVC" required>
          <Input
            inputMode="numeric"
            placeholder="123"
            value={card.cvc}
            onChange={(e) => setCard({ ...card, cvc: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Review order <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </m.form>
  );
}

function Review({
  address,
  items,
  onBack,
  onPlace,
  submitting,
  isAuthed,
  isAuthLoading,
}: {
  address: { fullName: string; email: string; line1: string; line2: string; city: string; postalCode: string; country: string };
  items: ReturnType<typeof useCart.getState>["items"];
  onBack: () => void;
  onPlace: () => void;
  submitting: boolean;
  isAuthed: boolean;
  isAuthLoading: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-xl font-bold">Review &amp; place order</h2>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ship to
        </h3>
        <p className="mt-2 text-sm">
          {address.fullName}
          <br />
          {address.line1}
          {address.line2 && (
            <>
              <br />
              {address.line2}
            </>
          )}
          <br />
          {address.city}, {address.postalCode}
          <br />
          {address.country}
        </p>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Items ({items.length})
        </h3>
        <ul className="mt-2 divide-y divide-border/40 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span className="tabular-nums">
                ${(i.price * i.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {!isAuthed && !isAuthLoading && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100/90">
          You&apos;ll need to{" "}
          <Link href={`/login?next=${encodeURIComponent("/checkout")}`} className="underline">
            sign in
          </Link>{" "}
          to place this order so we can save it to your account.
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onPlace} disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {submitting ? "Placing order…" : "Place order"}
        </Button>
      </div>
    </m.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-rose-300">*</span>}
      </span>
      {children}
    </label>
  );
}
