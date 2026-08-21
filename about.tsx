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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Компания
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Оснащаем лечебные учреждения, а не продаём «коробки»
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          {COMPANY.name} поставляет медицинское оборудование клиникам, кабинетам
          и сервисным центрам в Казахстане. База — {COMPANY.city},{" "}
          {COMPANY.address}.
        </p>
        <p>
          В каталоге {PRODUCT_COUNT} позиций по {CATEGORIES.length} направлениям:
          от медицинской мебели до эндоскопии, стоматологии и диагностики. Каждая
          заявка разбирается под задачу отделения — комплектация, совместимость,
          сервис.
        </p>
        <p>
          Мы не публикуем цены на сайте: конфигурация и логистика зависят от
          объекта. Коммерческое предложение готовим после уточнения требований.
        </p>
      </div>
      <dl className="mt-12 grid gap-6 border-t border-border pt-10 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Адрес</dt>
          <dd className="mt-1 font-medium">{COMPANY.address}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Режим</dt>
          <dd className="mt-1 font-medium">{COMPANY.hours}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</dt>
          <dd className="mt-1 font-medium">
            <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Почта</dt>
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
  );
}
