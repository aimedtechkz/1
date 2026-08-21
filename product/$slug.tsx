import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory, getProduct, relatedProducts } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { useQuoteStore } from "@/lib/quote-store";

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

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {category ? (
        <Link
          to="/catalog/$category"
          params={{ category: category.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {category.name}
        </Link>
      ) : (
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Каталог
        </Link>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ProductImage
            src={product.image}
            alt={product.alt}
            className="aspect-[4/3] rounded-xl border border-border bg-card"
          />
        </div>
        <div className="lg:col-span-6">
          {category ? <Badge variant="muted">{category.name}</Badge> : null}
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {product.title}
          </h1>
          {product.titleOriginal ? (
            <p className="mt-2 text-sm text-muted-foreground">{product.titleOriginal}</p>
          ) : null}
          <p className="mt-5 text-base leading-relaxed text-foreground/90">
            {product.excerpt}
          </p>
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

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-medium">Описание</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {product.description}
        </p>
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium">В этой категории</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
