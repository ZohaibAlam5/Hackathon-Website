"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";

const CHANNELS = [
  { Icon: Phone, label: "Call us", value: "+1 (415) 555-0182" },
  { Icon: Mail, label: "Email", value: "hello@hekto.shop" },
  { Icon: MapPin, label: "Studio", value: "20 Margaret St, London W1W 8RF" },
  { Icon: Clock, label: "Hours", value: "24/7 chat · Mon–Fri 9am–6pm" },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast("Thanks! We'll get back to you within 24 hours.", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 700);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="We're here to help — whether you have a question, need a recommendation, or want to talk shop."
      />

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr,1.1fr]">
        <div className="space-y-4">
          {CHANNELS.map(({ Icon, label, value }) => (
            <Reveal key={label}>
              <m.div
                whileHover={{ y: -2 }}
                className="glass flex items-center gap-4 rounded-2xl p-5"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </m.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass space-y-4 rounded-3xl p-8"
          >
            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Subject">
              <Input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Field>
            <Field label="Message">
              <Textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Reveal>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
