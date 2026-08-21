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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <ProductImage
          src={product.image}
          alt={product.alt}
          className="aspect-[4/3]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {category ? <Badge variant="muted">{category.name}</Badge> : null}
        <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-foreground">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="hover:text-primary"
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
