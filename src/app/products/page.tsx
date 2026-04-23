import { getCategories } from "@/lib/sanity-queries";
import { CategoryTile } from "@/components/sections/category-tile";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal, Stagger, staggerItem } from "@/components/motion/reveal";
import { MotionItem } from "@/components/motion/motion-item";

export const revalidate = 120;

export default async function ProductsPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHero
        eyebrow="Browse"
        title="Categories"
        description="Pick a vibe and dive in — every category curated by hand."
      />

      <div className="container-page py-12">
        {categories.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
              <p className="font-medium">No categories in your Sanity dataset.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Create some <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">Products</code> documents in Sanity Studio to populate this page.
              </p>
            </div>
          </Reveal>
        ) : (
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <MotionItem key={c._id} variants={staggerItem}>
                <CategoryTile category={c} />
              </MotionItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}
