import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCategory,
  getProduct,
  parseDescription,
  relatedProducts,
} from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { getRecentProducts, pushRecent } from "@/lib/recent";
import { useQuoteStore } from "@/lib/quote-store";
import type { Product } from "@/lib/catalog";

export const Route = createFileRoute("/_site/product/$slug")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product, related: relatedProducts(product) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.product.title} — AiMedTech`
          : "Оборудование — AiMedTech",
      },
      {
        name: "description",
        content: loaderData?.product.excerpt,
      },
    ],
  }),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const category = getCategory(product.category);
  const openFor = useQuoteStore((s) => s.openFor);
  const { body, specs } = parseDescription(product.description);
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => {
    pushRecent(product.slug);
    setRecent(
      getRecentProducts()
        .filter((p) => p.slug !== product.slug)
        .slice(0, 4),
    );
  }, [product.slug]);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "Каталог", to: "/catalog" },
          ...(category
            ? [
                {
                  label: category.name,
                  to: "/catalog/$category",
                  params: { category: category.id },
                },
              ]
            : []),
          { label: product.title },
        ]}
      />

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductImage
            src={product.image}
            alt={product.alt}
            className="aspect-[4/3] rounded-xl bg-card shadow-[var(--shadow-border)]"
            zoom
          />
        </div>
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)] sm:p-8">
            {category ? (
              <Link
                to="/catalog/$category"
                params={{ category: category.id }}
              >
                <Badge variant="muted">{category.name}</Badge>
              </Link>
            ) : null}
            <h1 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {product.title}
            </h1>
            {product.titleOriginal ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {product.titleOriginal}
              </p>
            ) : null}
            <p className="mt-5 text-base leading-relaxed text-foreground/90">
              {product.excerpt}
            </p>
            {specs.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {specs.map((s) => (
                  <li key={s}>
                    <Badge variant="outline">{s}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => openFor(product)}>
                Запросить КП
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href={COMPANY.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Цена, комплектация и срок поставки согласовываются индивидуально.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold text-foreground">Описание</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {body || product.description}
        </p>
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-sans text-2xl font-semibold text-foreground">В этой категории</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {recent.length ? (
        <section className="mt-16">
          <h2 className="font-sans text-2xl font-semibold text-foreground">Вы смотрели</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
