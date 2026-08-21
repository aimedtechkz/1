export type CategoryId =
  | "furniture"
  | "urology"
  | "gynecology"
  | "ent"
  | "orthopedics"
  | "diagnostics"
  | "resuscitation"
  | "therapy"
  | "surgery"
  | "traumatology"
  | "laboratory"
  | "dentistry"
  | "ophthalmology"
  | "electrical"
  | "transport";

export const CATEGORIES: {
  id: CategoryId;
  name: string;
  blurb: string;
  count: number;
}[] = [
  { id: "furniture", name: "Мебель и оснащение", blurb: "Шкафы, мойки, тележки и комплекты кабинетов", count: 21 },
  { id: "urology", name: "Урология", blurb: "Резектоскопы, уретероскопы, литотрипсия", count: 10 },
  { id: "gynecology", name: "Гинекология", blurb: "Гистероскопы, столы, манипуляторы", count: 23 },
  { id: "ent", name: "ЛОР", blurb: "Отоскопы, ларингоскопы, аудиометрия", count: 9 },
  { id: "orthopedics", name: "Ортопедия", blurb: "Тракционные системы и оснащение", count: 2 },
  { id: "diagnostics", name: "Диагностика", blurb: "УЗИ, рентген, эндоскопическая визуализация", count: 9 },
  { id: "resuscitation", name: "Реанимация", blurb: "Кислород и жизнеобеспечение", count: 2 },
  { id: "therapy", name: "Терапия", blurb: "Лечебное оборудование отделения", count: 3 },
  { id: "surgery", name: "Хирургия", blurb: "Лапароскопия, операционные столы, аспирация", count: 19 },
  { id: "traumatology", name: "Травматология", blurb: "Диагностика плотности кости", count: 2 },
  { id: "laboratory", name: "Лаборатория", blurb: "Гематология и клиническая химия", count: 2 },
  { id: "dentistry", name: "Стоматология", blurb: "Установки, CAD/CAM, сканеры", count: 14 },
  { id: "ophthalmology", name: "Офтальмология", blurb: "Щелевые лампы, рефрактометры, фундус", count: 8 },
  { id: "electrical", name: "Электрооборудование", blurb: "Операционные лампы, ЭХВЧ, источники света", count: 10 },
  { id: "transport", name: "Транспорт", blurb: "Коляски, носилки, процедурные тележки", count: 12 },
];

export const PRODUCT_COUNT = CATEGORIES.reduce((n, c) => n + c.count, 0);

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}
