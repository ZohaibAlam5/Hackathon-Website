import { Award, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal, Stagger, staggerItem } from "@/components/motion/reveal";
import { MotionItem } from "@/components/motion/motion-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VALUES = [
  {
    Icon: Sparkles,
    title: "Future-forward design",
    desc: "Every piece is chosen to feel iconic in five years, not just five minutes.",
  },
  {
    Icon: Leaf,
    title: "Sustainable materials",
    desc: "Responsibly sourced fabrics, woods and metals — better for you and the planet.",
  },
  {
    Icon: Award,
    title: "Built to last",
    desc: "Two-year warranty on the entire catalog. We stand behind the craft.",
  },
  {
    Icon: HeartHandshake,
    title: "Real human support",
    desc: "Talk to a person, not a script. We're here whenever you need us.",
  },
];

const STATS = [
  { k: "120+", v: "Designers" },
  { k: "50k+", v: "Orders shipped" },
  { k: "98%", v: "Happy customers" },
  { k: "24h", v: "Avg. dispatch" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Hekto"
        title="Furniture, reimagined."
        description="We started Hekto to bring future-forward design to every home — without the gallery markup."
      />

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <Reveal>
            <div className="glass relative overflow-hidden rounded-3xl p-10">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
              />
              <h2 className="font-display text-3xl font-bold">Our story</h2>
              <p className="mt-4 text-muted-foreground">
                Hekto was born from a simple frustration: great furniture
                shouldn&apos;t feel out of reach. We work directly with
                independent designers and artisans to deliver bold, well-made
                pieces at honest prices.
              </p>
              <p className="mt-3 text-muted-foreground">
                Every product on Hekto is hand-picked. We sweat the details so
                you don&apos;t have to.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/shop">Shop the collection</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <MotionItem
                key={s.v}
                variants={staggerItem}
                className="glass rounded-2xl p-6 text-center"
              >
                <p className="font-display text-4xl font-bold neon-text">{s.k}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.v}
                </p>
              </MotionItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-border/60 py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">What we stand for</h2>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, desc }) => (
              <MotionItem
                key={title}
                variants={staggerItem}
                className="glass rounded-2xl p-6"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </MotionItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
