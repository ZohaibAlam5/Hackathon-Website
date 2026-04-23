import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal, Stagger, staggerItem } from "@/components/motion/reveal";
import { MotionItem } from "@/components/motion/motion-item";

const POSTS = [
  {
    title: "10 design trends shaping 2026 interiors",
    excerpt:
      "From quiet luxury to bio-materials, here's what's defining the year's most-loved interiors.",
    date: "2026-04-12",
    minutes: 6,
    tag: "Trends",
  },
  {
    title: "How to mix vintage and modern without it feeling forced",
    excerpt:
      "A practical guide to blending eras so the result feels intentional rather than chaotic.",
    date: "2026-03-28",
    minutes: 8,
    tag: "Guides",
  },
  {
    title: "Small space, big personality: studio apartment ideas",
    excerpt:
      "Five furniture choices that make a 400-sqft room feel like a designer&apos;s playground.",
    date: "2026-03-14",
    minutes: 5,
    tag: "Inspiration",
  },
  {
    title: "Materials matter: a beginner's guide to upholstery",
    excerpt:
      "What boucle, performance velvet, and saddle leather actually mean for your living room.",
    date: "2026-02-20",
    minutes: 9,
    tag: "Guides",
  },
];

export default function BlogPage() {
  const [feature, ...rest] = POSTS;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes from the studio"
        description="Design ideas, behind-the-scenes craft, and the occasional rant about good chairs."
      />

      <div className="container-page py-14">
        <Reveal>
          <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 transition hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)] sm:p-12">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-25 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
            />
            <div
              aria-hidden
              className="absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 font-semibold uppercase tracking-wider text-primary">
                {feature.tag}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(feature.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {feature.minutes} min read
              </span>
            </div>
            <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {feature.title}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {feature.excerpt}
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Read article →
            </Link>
          </article>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <MotionItem
              key={p.title}
              variants={staggerItem}
              className="group glass overflow-hidden rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold uppercase tracking-wider text-primary">
                  {p.tag}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {p.minutes} min
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug transition group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <Link
                href="#"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Read more →
              </Link>
            </MotionItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}
