import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useQuoteStore } from "@/lib/quote-store";

export const Route = createFileRoute("/_site/services")({
  component: ServicesPage,
  head: () => ({
    meta: [{ title: "Услуги — AiMedTech" }],
  }),
});

const ITEMS = [
  {
    title: "Поставка оборудования",
    text: "Подбор и комплектация от ведущих производителей. Согласование спецификации под процедуры отделения, логистика до объекта.",
  },
  {
    title: "Сервисное обслуживание",
    text: "Гарантийный и постгарантийный ремонт, расходные материалы, техническая поддержка по поставленным позициям.",
  },
  {
    title: "Обучение персонала",
    text: "Ввод врачей и среднего персонала в работу с поставленным оборудованием — на площадке клиники.",
  },
  {
    title: "Оснащение «под ключ»",
    text: "Кабинет или операционный блок: мебель, мойки, свет, стойки, инструменты — единым проектом.",
  },
];

function ServicesPage() {
  const openFor = useQuoteStore((s) => s.openFor);
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Услуги
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
        От заявки до работающего кабинета
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Не продаём оборудование в отрыве от внедрения. Поставка, сервис и обучение — одна цепочка.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {ITEMS.map((item, i) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-card p-8"
          >
            <p className="font-display text-sm text-primary">0{i + 1}</p>
            <h2 className="mt-3 font-display text-2xl font-medium">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Button size="lg" onClick={() => openFor(null)}>
          Обсудить задачу
        </Button>
      </div>
    </div>
  );
}
