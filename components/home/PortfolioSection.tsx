import { ProductCard } from "@/components/products/ProductCard";
import { featuredProducts, portfolioSection, visibleTagCount } from "@/content/homepage";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="scroll-mt-24" aria-labelledby="portfolio-heading">
      <div className="home-panel relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-accent/8 blur-3xl dark:bg-accent/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-secondary-accent/6 blur-3xl dark:bg-secondary-accent/12"
          aria-hidden
        />
        <div className="animate-on-scroll relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {portfolioSection.eyebrow}
          </p>
          <h2
            id="portfolio-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            {portfolioSection.title}{" "}
            <span className="text-secondary-accent">{portfolioSection.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {portfolioSection.description}
          </p>
        </div>

        <div className="relative mt-8 grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {featuredProducts.map((product, i) => (
            <ProductCard
              key={product.title}
              product={product}
              visibleTagCount={visibleTagCount}
              animationDelayClass={`delay-${Math.min(i + 1, 6)}`}
              anchorId={
                product.title === "ProFeed"
                  ? "profeed"
                  : product.title === "ProDoc"
                    ? "prodoc-card"
                    : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
