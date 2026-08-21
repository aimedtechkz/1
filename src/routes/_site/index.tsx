import { type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Headset, Search, Truck } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import featuredJson from "@/data/featured.json";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { CATEGORIES, PRODUCT_COUNT } from "@/lib/categories";
import type { Product } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { useQuoteStore } from "@/lib/quote-store";
import { useSearchStore } from "@/lib/search-store";

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
const mosaic = featured.slice(0, 3);

function Home() {
  const openFor = useQuoteStore((s) => s.openFor);
  const setSearchOpen = useSearchStore((s) => s.setOpen);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-card">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-12 lg:pb-20 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="reveal text-xs font-medium uppercase tracking-widest text-mist">
              Алматы · поставка в клиники Казахстана
            </p>
            <h1 className="reveal mt-5 font-display text-5xl font-medium leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Оборудование,
              <br />
              на котором
              <br />
              работает отделение
            </h1>
            <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-card/70 sm:text-lg">
              {COMPANY.description}
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-card text-ink hover:bg-card/90">
                <Link to="/catalog">
                  Открыть каталог
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-card/20 bg-transparent text-card hover:bg-card/10"
                onClick={() => setSearchOpen(true)}
              >
                <Search />
                Найти модель
              </Button>
            </div>
            <dl className="reveal mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat value={String(PRODUCT_COUNT)} label="позиций" />
              <Stat value={String(CATEGORIES.length)} label="направлений" />
              <Stat value="1 день" label="на КП" />
              <Stat value={COMPANY.city} label="база" />
            </dl>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {mosaic[0] ? (
                <Link
                  to="/product/$slug"
                  params={{ slug: mosaic[0].slug }}
                  className="col-span-2 overflow-hidden rounded-xl bg-card/5 shadow-[var(--shadow-ink)]"
                >
                  <ProductImage
                    src={mosaic[0].image}
                    alt={mosaic[0].alt}
                    className="aspect-[16/10] bg-card/5"
                    zoom
                  />
                </Link>
              ) : null}
              {mosaic.slice(1, 3).map((p) => (
                <Link
                  key={p.slug}
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="overflow-hidden rounded-lg bg-card/5 shadow-[var(--shadow-ink)]"
                >
                  <ProductImage
                    src={p.image}
                    alt={p.alt}
                    className="aspect-square bg-card/5"
                    zoom
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="relative border-t border-card/10">
          <div className="overflow-hidden py-4">
            <div className="marquee-track flex w-max gap-10 px-6 text-xs font-medium uppercase tracking-widest text-card/50">
              {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
                <span key={`${c.id}-${i}`} className="flex items-center gap-10">
                  {c.name}
                  <span className="text-mist">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              15 направлений
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Подберите по отделению
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/catalog">
              Весь каталог
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id];
            return (
              <li key={c.id}>
                <Link
                  to="/catalog/$category"
                  params={{ category: c.id }}
                  className="group flex h-full items-start gap-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="tabular-nums text-sm text-muted-foreground">
                        {c.count}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {c.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Витрина
              </p>
              <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Избранные позиции
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/catalog">
                Все {PRODUCT_COUNT}
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Процесс
        </p>
        <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          От заявки до работающего кабинета
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Truck className="size-5" />}
            step="01"
            title="Поставка"
            text="Комплектация кабинета или отделения: от мебели до эндоскопических стоек."
          />
          <Feature
            icon={<Headset className="size-5" />}
            step="02"
            title="Сервис"
            text="Гарантийное и постгарантийное обслуживание, расходные материалы."
          />
          <Feature
            icon={<BadgeCheck className="size-5" />}
            step="03"
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

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Вопросы
            </p>
            <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Коротко о поставке
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Каталог информационный. Цена, комплектация и сроки — в коммерческом
              предложении под ваш объект.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FaqList />
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-card/45">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums tracking-tight">{value}</dd>
    </div>
  );
}

function Feature({
  icon,
  step,
  title,
  text,
}: {
  icon: ReactNode;
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-md bg-muted text-primary">
          {icon}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{step}</span>
      </div>
      <h3 className="mt-5 font-sans text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
