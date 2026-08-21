import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { CATEGORIES, PRODUCT_COUNT } from "@/lib/categories";

export const Route = createFileRoute("/_site/about")({
  component: AboutPage,
  head: () => ({
    meta: [{ title: "О компании — AiMedTech" }],
  }),
});

function AboutPage() {
  return (
    <div>
      <header className="border-b border-border bg-ink text-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-mist">
            Компания
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-6xl">
            Оснащаем лечебные учреждения, а не продаём «коробки»
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              {COMPANY.name} поставляет медицинское оборудование клиникам,
              кабинетам и сервисным центрам в Казахстане. База — {COMPANY.city},{" "}
              {COMPANY.address}.
            </p>
            <p>
              В каталоге {PRODUCT_COUNT} позиций по {CATEGORIES.length}{" "}
              направлениям: от медицинской мебели до эндоскопии, стоматологии и
              диагностики. Каждая заявка разбирается под задачу отделения —
              комплектация, совместимость, сервис.
            </p>
            <p>
              Мы не публикуем цены на сайте: конфигурация и логистика зависят от
              объекта. Коммерческое предложение готовим после уточнения
              требований.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
            <Stat n={String(PRODUCT_COUNT)} l="позиций в каталоге" />
            <Stat n={String(CATEGORIES.length)} l="клинических направлений" />
            <Stat n="1 день" l="на подготовку КП" />
            <Stat n={COMPANY.city} l="офис и склад" />
          </dl>
        </div>

        <dl className="mt-16 grid gap-6 border-t border-border pt-10 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Адрес
            </dt>
            <dd className="mt-1 font-medium">{COMPANY.address}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Режим
            </dt>
            <dd className="mt-1 font-medium">{COMPANY.hours}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Телефон
            </dt>
            <dd className="mt-1 font-medium">
              <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Почта
            </dt>
            <dd className="mt-1 font-medium">
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </dd>
          </div>
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/contacts">Контакты</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/catalog">Каталог</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <dt className="font-display text-3xl tabular-nums tracking-tight">{n}</dt>
      <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
    </div>
  );
}
