import { createFileRoute } from "@tanstack/react-router";
import { FaqList } from "@/components/faq-list";
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
    <div>
      <header className="border-b border-border bg-ink text-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-mist">
            Услуги
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-6xl">
            От заявки до работающего кабинета
          </h1>
          <p className="mt-4 max-w-xl text-card/70">
            Не продаём оборудование в отрыве от внедрения. Поставка, сервис и
            обучение — одна цепочка.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ol className="grid gap-5 md:grid-cols-2">
          {ITEMS.map((item, i) => (
            <li
              key={item.title}
              className="rounded-xl bg-card p-8 shadow-[var(--shadow-border)]"
            >
              <p className="font-mono text-xs text-primary">0{i + 1}</p>
              <h2 className="mt-3 font-sans text-2xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button size="lg" onClick={() => openFor(null)}>
            Обсудить задачу
          </Button>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
              Частые вопросы
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Если не нашли ответ — напишите, разберём ваш случай отдельно.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FaqList />
          </div>
        </div>
      </div>
    </div>
  );
}
