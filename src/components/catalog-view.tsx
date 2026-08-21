import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import {
  CATEGORIES,
  PAGE_SIZE,
  searchProducts,
  sortProducts,
  type CategoryId,
  type SortId,
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
  const [sort, setSort] = useState<SortId>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const found = searchProducts(query, categoryId ?? "all");
    return sortProducts(found, sort);
  }, [query, categoryId, sort]);
  const shown = results.slice(0, visible);

  return (
    <div>
      <header className="border-b border-border bg-ink text-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-mist">
            Каталог
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-card/70">
            {lead}
          </p>
          <div className="relative mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-card/50" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Поиск по названию, модели, назначению"
              className="border-card/15 bg-card/10 pl-10 text-card placeholder:text-card/45 focus-visible:ring-mist"
              type="search"
              aria-label="Поиск в каталоге"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Направления
            </p>
            <ul className="mt-3 grid gap-0.5">
              <li>
                <Link
                  to="/catalog"
                  className={sideClass(!categoryId)}
                >
                  Все позиции
                </Link>
              </li>
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c.id];
                return (
                  <li key={c.id}>
                    <Link
                      to="/catalog/$category"
                      params={{ category: c.id }}
                      className={sideClass(categoryId === c.id)}
                    >
                      <Icon className="size-3.5 shrink-0 opacity-70" />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="tabular-nums text-xs opacity-70">{c.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
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

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {results.length
                ? `${results.length} ${plural(results.length, "позиция", "позиции", "позиций")}`
                : "Ничего не найдено — измените запрос или категорию"}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              <span className="sr-only">Сортировка</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground"
              >
                <option value="relevance">По релевантности</option>
                <option value="name">По названию</option>
                <option value="category">По направлению</option>
              </select>
            </label>
          </div>

          {shown.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
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
                Показать ещё · {results.length - visible}
              </Button>
            </div>
          ) : null}
        </div>
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

function sideClass(active: boolean) {
  return cn(
    "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
    active
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-muted",
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}
