import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Как получить коммерческое предложение?",
    a: "Откройте карточку оборудования и нажмите «Запросить КП», либо напишите в WhatsApp. Укажите отделение и количество — спецификацию готовим в течение рабочего дня.",
  },
  {
    q: "Почему на сайте нет цен?",
    a: "Комплектация, логистика и регистрационные документы зависят от объекта. Публичная цена ввела бы в заблуждение. Стоимость фиксируем в КП под вашу задачу.",
  },
  {
    q: "Работаете ли вы с регионами Казахстана?",
    a: "Да. База в Алматы, поставка по стране. Срок и условия доставки согласуем в спецификации.",
  },
  {
    q: "Есть ли сервис и обучение?",
    a: "Гарантийное и постгарантийное обслуживание, расходные материалы и ввод персонала в работу с поставленным оборудованием — часть поставки, не отдельная «опция».",
  },
] as const;

export function FaqList() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {FAQ.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
