import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product-image";
import { getCategory } from "@/lib/categories";
import type { Product } from "@/lib/catalog";
import { useQuoteStore } from "@/lib/quote-store";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const openFor = useQuoteStore((s) => s.openFor);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block"
      >
        <ProductImage
          src={product.image}
          alt={product.alt}
          className="aspect-[4/3]"
          zoom
        />
        {category ? (
          <Badge className="absolute left-3 top-3 bg-card/90 backdrop-blur-sm" variant="outline">
            {category.name}
          </Badge>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-sans text-base font-semibold leading-snug tracking-tight text-foreground">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.title}
          </Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.excerpt}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/product/$slug" params={{ slug: product.slug }}>
              Подробнее
              <ArrowUpRight />
            </Link>
          </Button>
          <Button size="sm" className="flex-1" onClick={() => openFor(product)}>
            Запросить КП
          </Button>
        </div>
      </div>
    </article>
  );
}
