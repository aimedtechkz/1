import { createFileRoute } from "@tanstack/react-router";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/_site/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: "Персональные данные — AiMedTech" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Документы
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        Обработка персональных данных
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {COMPANY.name} обрабатывает данные, которые вы оставляете в формах
          сайта (имя, телефон, email, название организации, текст обращения),
          исключительно чтобы ответить на заявку и подготовить коммерческое
          предложение.
        </p>
        <p>
          Сообщения с формы уходят через сервис Formspree. Мы не ведём
          рекламную рассылку, не продаём списки контактов и не подключаем
          аналитику без отдельного уведомления.
        </p>
        <p>
          Оператор связи: {COMPANY.email}, {COMPANY.phoneDisplay},{" "}
          {COMPANY.address}. Чтобы уточнить, исправить или удалить данные
          заявки, напишите на {COMPANY.email}.
        </p>
        <p>
          Каталог носит информационный характер и не является публичной
          офертой. Характеристики оборудования уточняются при согласовании
          спецификации.
        </p>
      </div>
    </div>
  );
}
