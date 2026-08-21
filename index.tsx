import { type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Headset, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import featuredJson from "@/data/featured.json";
import { CATEGORIES, PRODUCT_COUNT } from "@/lib/categories";
import type { Product } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { useQuoteStore } from "@/lib/quote-store";

export const Route = createFileRoute("/_site/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "AiMedTech — медицинское оборудование, Алматы",
      },
    ],
  }),
});

const featured = featuredJson as Product[];

function Home() {
  const openFor = useQuoteStore((s) => s.openFor);

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Алматы · поставка в клиники
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-tight tracking-tight text-foreground sm:text-6xl">
              Оборудование,
              <br />
              на котором работает отделение
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {COMPANY.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/catalog">
                  Открыть каталог
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contacts">Связаться</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-ink p-6 text-card sm:p-8">
              <p className="font-display text-5xl font-medium tabular-nums tracking-tight">
                {PRODUCT_COUNT}
              </p>
              <p className="mt-1 text-sm text-card/70">позиций в каталоге</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="text-card/50">Направлений</dt>
                  <dd className="mt-1 font-medium tabular-nums">{CATEGORIES.length}</dd>
                </div>
                <div>
                  <dt className="text-card/50">Город</dt>
                  <dd className="mt-1 font-medium">{COMPANY.city}</dd>
                </div>
                <div>
                  <dt className="text-card/50">Связь</dt>
                  <dd className="mt-1 font-medium">{COMPANY.hours}</dd>
                </div>
                <div>
                  <dt className="text-card/50">Заявка</dt>
                  <dd className="mt-1 font-medium">КП за 1 рабочий день</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight">
              Направления
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Фильтр каталога по специализации отделения
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/catalog">
              Все категории
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                to="/catalog/$category"
                params={{ category: c.id }}
                className="flex h-full items-start justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
              >
                <span>
                  <span className="block font-medium text-foreground">{c.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {c.blurb}
                  </span>
                </span>
                <span className="tabular-nums text-sm text-muted-foreground">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-medium tracking-tight">
              Избранные позиции
            </h2>
            <Button asChild variant="ghost">
              <Link to="/catalog">
                Весь каталог
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight">Как работаем</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Truck className="size-5" />}
            title="Поставка"
            text="Комплектация кабинета или отделения: от мебели до эндоскопических стоек."
          />
          <Feature
            icon={<Headset className="size-5" />}
            title="Сервис"
            text="Гарантийное и постгарантийное обслуживание, расходные материалы."
          />
          <Feature
            icon={<BadgeCheck className="size-5" />}
            title="Обучение"
            text="Ввод персонала в работу с оборудованием после поставки."
          />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/services">Услуги</Link>
          </Button>
          <Button variant="outline" onClick={() => openFor(null)}>
            Оставить заявку
          </Button>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex size-10 items-center justify-center rounded-md bg-muted text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
