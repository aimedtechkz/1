import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES,
  PAGE_SIZE,
  searchProducts,
  type CategoryId,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function CatalogView({
  categoryId,
  title,
  lead,
}: {
  categoryId?: CategoryId;
  title: string;
  lead: string;
}) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(
    () => searchProducts(query, categoryId ?? "all"),
    [query, categoryId],
  );
  const shown = results.slice(0, visible);

  return (
    <div>
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Каталог
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {lead}
          </p>
          <div className="relative mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Поиск по названию, модели, назначению"
              className="pl-10"
              type="search"
              aria-label="Поиск в каталоге"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2 pb-4">
          <Link to="/catalog" className={chipClass(!categoryId)}>
            Все
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/catalog/$category"
              params={{ category: c.id }}
              className={chipClass(categoryId === c.id)}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          {results.length
            ? `${results.length} ${plural(results.length, "позиция", "позиции", "позиций")}`
            : "Ничего не найдено — измените запрос или категорию"}
        </p>

        {shown.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-xl">Нет совпадений</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Попробуйте другое слово или откройте категорию целиком.
            </p>
          </div>
        )}

        {visible < results.length ? (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Показать ещё
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function chipClass(active: boolean) {
  return cn(
    "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-foreground hover:border-primary/40",
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}
