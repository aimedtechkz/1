#!/usr/bin/env node
/**
 * Static export for Plesk / hoster.kz (Apache httpdocs).
 * Does not change the live TanStack preview app.
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "hosting", "httpdocs");

const COMPANY = {
  name: "AiMedTech",
  tagline: "Медицинское оборудование для клиник Казахстана",
  description:
    "Поставка диагностического, хирургического, стоматологического и лабораторного оборудования. Подбор под задачу отделения, поставка, сервис и обучение персонала.",
  city: "Алматы",
  address: "г. Алматы, ул. Тимирязева, 15Б",
  phoneDisplay: "+7 (702) 204-11-81",
  phoneTel: "+77022041181",
  email: "info@aimedtech.kz",
  hours: "Пн–Пт, 9:00–18:00",
  whatsapp: "https://wa.me/77022041181",
  instagram: "https://instagram.com/aimedtech.kz",
  map: "https://2gis.kz/almaty/firm/70000001110701620",
  formspree: "https://formspree.io/f/xnnlaqjp",
  origin: "https://aimedtech.kz",
};

const CATEGORIES = [
  { id: "furniture", name: "Мебель и оснащение", blurb: "Шкафы, мойки, тележки и комплекты кабинетов" },
  { id: "urology", name: "Урология", blurb: "Резектоскопы, уретероскопы, литотрипсия" },
  { id: "gynecology", name: "Гинекология", blurb: "Гистероскопы, столы, манипуляторы" },
  { id: "ent", name: "ЛОР", blurb: "Отоскопы, ларингоскопы, аудиометрия" },
  { id: "orthopedics", name: "Ортопедия", blurb: "Тракционные системы и оснащение" },
  { id: "diagnostics", name: "Диагностика", blurb: "УЗИ, рентген, эндоскопическая визуализация" },
  { id: "resuscitation", name: "Реанимация", blurb: "Кислород и жизнеобеспечение" },
  { id: "therapy", name: "Терапия", blurb: "Лечебное оборудование отделения" },
  { id: "surgery", name: "Хирургия", blurb: "Лапароскопия, операционные столы, аспирация" },
  { id: "traumatology", name: "Травматология", blurb: "Диагностика плотности кости" },
  { id: "laboratory", name: "Лаборатория", blurb: "Гематология и клиническая химия" },
  { id: "dentistry", name: "Стоматология", blurb: "Установки, CAD/CAM, сканеры" },
  { id: "ophthalmology", name: "Офтальмология", blurb: "Щелевые лампы, рефрактометры, фундус" },
  { id: "electrical", name: "Электрооборудование", blurb: "Операционные лампы, ЭХВЧ, источники света" },
  { id: "transport", name: "Транспорт", blurb: "Коляски, носилки, процедурные тележки" },
];

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
];

const SERVICES = [
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

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (ch) => {
    if (ch === "&") return "\u0026amp;";
    if (ch === "<") return "\u0026lt;";
    if (ch === ">") return "\u0026gt;";
    if (ch === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}

function write(rel, content) {
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

function catById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function parseSpecs(description) {
  const match = String(description).split(/Характеристики:\s*/i);
  const body = (match[0] ?? "").trim();
  const specLine = (match[1] ?? "").trim();
  const specs = specLine
    ? specLine
        .split(/[;•]|(?:,\s+)(?=[А-ЯA-Z0-9])/)
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length > 1 && s.length < 80)
    : [];
  return { body, specs };
}

function plural(n) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "позиция";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "позиции";
  return "позиций";
}

const CSS = `*{box-sizing:border-box}html{color-scheme:light;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}body{margin:0;background:#f2f4f3;color:#0c1416;font-family:Manrope,ui-sans-serif,system-ui,sans-serif;min-height:100dvh;display:flex;flex-direction:column}img{max-width:100%;outline:1px solid rgb(12 20 22 / .08);outline-offset:-1px}a{color:inherit;text-decoration:none}button,a.btn{cursor:pointer;font-family:inherit}h1,h2,h3{text-wrap:balance}p{text-wrap:pretty}::selection{background:color-mix(in oklab,#0e5854 22%,white)}
.wrap{width:min(72rem,100% - 2rem);margin-inline:auto}
.font-d{font-family:"Instrument Serif",Georgia,serif}
header.top{position:sticky;top:0;z-index:40;border-bottom:1px solid #d4ddda;background:#f2f4f3cc;backdrop-filter:blur(10px)}
.top-in{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4rem}
.logo{display:flex;align-items:center;gap:.65rem;font-family:"Instrument Serif",Georgia,serif;font-size:1.25rem}
.mark{display:flex;width:2rem;height:2rem;align-items:center;justify-content:center;border-radius:.5rem;background:#071011;color:#fff;font-weight:600;font-size:.85rem;font-family:Manrope,sans-serif}
.med{color:#0e5854}nav.desk{display:none;gap:1.75rem;align-items:center}
nav.desk a{font-size:.875rem;font-weight:500;color:#4a5856}nav.desk a:hover,nav.desk a.on{color:#0c1416}
.top-act{display:flex;align-items:center;gap:.5rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:2.75rem;padding:0 1.25rem;border-radius:.5rem;border:0;font-size:.875rem;font-weight:500;background:#0e5854;color:#f3fffc}
.btn:hover{background:#0c4d49}.btn:active{transform:scale(.96)}
.btn-lg{height:3rem;padding:0 1.5rem;font-size:1rem}
.btn-out{background:transparent;color:#0c1416;border:1px solid #d4ddda}
.btn-out:hover{background:#fff}.btn-ghost{background:transparent;color:#0c1416;height:2.75rem}
.btn-ink{background:#fff;color:#071011}.btn-ink:hover{background:#f2f4f3}
.btn-dark-out{background:transparent;color:#fff;border:1px solid rgb(255 255 255 / .2)}
.btn-dark-out:hover{background:rgb(255 255 255 / .1)}
.icon-btn{width:2.75rem;padding:0;border:1px solid #d4ddda;background:#fff;border-radius:.5rem}
.hero{position:relative;overflow:hidden;background:#071011;color:#fff}
.hero-grid{position:absolute;inset:0;opacity:.5;background-image:linear-gradient(to right,rgb(255 255 255 / .07) 1px,transparent 1px),linear-gradient(to bottom,rgb(255 255 255 / .07) 1px,transparent 1px);background-size:56px 56px;pointer-events:none}
.hero-in{position:relative;display:grid;gap:3rem;padding:3.5rem 0 4rem}
.kicker{font-size:.75rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#7dd3c7}
.kicker.p{color:#0e5854}
h1.display{margin:.8rem 0 0;font-family:"Instrument Serif",Georgia,serif;font-weight:500;font-size:clamp(2.25rem,5vw,4.5rem);line-height:1.08;letter-spacing:-.03em}
.lead{margin:1.25rem 0 0;max-width:36rem;color:rgb(255 255 255 / .7);font-size:1.05rem;line-height:1.6}
.row{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:3rem}
.stats dt{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:rgb(255 255 255 / .45)}
.stats dd{margin:.25rem 0 0;font-family:"Instrument Serif",Georgia,serif;font-size:1.5rem}
.mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.mosaic a:first-child{grid-column:1/-1}
.thumb{display:block;overflow:hidden;border-radius:.75rem;background:rgb(255 255 255 / .05);aspect-ratio:16/10}
.thumb.sq{aspect-ratio:1}.thumb img{width:100%;height:100%;object-fit:contain;display:block}
.marquee{border-top:1px solid rgb(255 255 255 / .1);overflow:hidden;padding:1rem 0;color:rgb(255 255 255 / .5);font-size:.75rem;letter-spacing:.18em;text-transform:uppercase}
.marquee-track{display:flex;width:max-content;gap:2.5rem;padding:0 1.5rem;animation:mq 42s linear infinite}
@keyframes mq{to{transform:translateX(-50%)}}
.sec{padding:4rem 0}
h2.sec-t{margin:.4rem 0 0;font-size:clamp(1.6rem,3vw,2.25rem);font-weight:600;letter-spacing:-.02em}
.grid-3{display:grid;gap:.75rem}
.cat{display:flex;gap:1rem;align-items:flex-start;padding:1.25rem;border-radius:.75rem;background:#fff;box-shadow:0 0 0 1px rgb(12 20 22 / .06),0 2px 8px rgb(12 20 22 / .04)}
.cat:hover{box-shadow:0 0 0 1px rgb(12 20 22 / .1),0 8px 24px -8px rgb(12 20 22 / .12)}
.ico{display:flex;width:2.5rem;height:2.5rem;flex-shrink:0;align-items:center;justify-content:center;border-radius:.5rem;background:#e8edec;color:#0e5854;font-weight:600;font-size:.75rem}
.muted{color:#4a5856}.small{font-size:.875rem;line-height:1.55}
.band{border-block:1px solid #d4ddda;background:#fff6}
.cards{display:grid;gap:1.25rem}
.card{display:flex;flex-direction:column;overflow:hidden;border-radius:.75rem;background:#fff;box-shadow:0 0 0 1px rgb(12 20 22 / .06),0 2px 8px rgb(12 20 22 / .04)}
.card:hover{box-shadow:0 0 0 1px rgb(12 20 22 / .1),0 8px 24px -8px rgb(12 20 22 / .12)}
.card .pic{position:relative;aspect-ratio:4/3;background:#e8edec;overflow:hidden}
.card .pic img{width:100%;height:100%;object-fit:contain;display:block}
.badge{position:absolute;left:.75rem;top:.75rem;font-size:.7rem;padding:.2rem .6rem;border-radius:999px;background:#fffc;border:1px solid #d4ddda}
.card-b{display:flex;flex-direction:column;gap:.75rem;padding:1.25rem;flex:1}
.card-b h3{margin:0;font-size:1rem;font-weight:600;line-height:1.3}
.card-b p{margin:0;flex:1;color:#4a5856;font-size:.875rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card-act{display:flex;gap:.5rem}
.card-act .btn,.card-act .btn-out{flex:1;height:2.25rem;font-size:.8rem}
.feat{border-radius:.75rem;background:#fff;padding:1.5rem;box-shadow:0 0 0 1px rgb(12 20 22 / .06),0 2px 8px rgb(12 20 22 / .04)}
.feat-h{display:flex;justify-content:space-between;align-items:center}
.step{font-family:ui-monospace,monospace;font-size:.75rem;color:#4a5856}
.faq details{border-bottom:1px solid #d4ddda}
.faq summary{cursor:pointer;padding:1.15rem 0;font-weight:500;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq details p{margin:0 0 1.15rem;color:#4a5856;font-size:.875rem;line-height:1.6}
.cta-band{border-top:1px solid #d4ddda;background:#fff;padding:2.5rem 0}
.cta-in{display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:space-between;align-items:center}
foot.site,footer.site{background:#071011;color:#fff;margin-top:auto}
.ft-grid{display:grid;gap:2.5rem;padding:3.5rem 0}
.ft-grid a{color:rgb(255 255 255 / .8);font-size:.875rem}
.ft-grid a:hover{color:#fff}
.ft-h{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:rgb(255 255 255 / .5);margin:0 0 1rem}
.ft-list{list-style:none;margin:0;padding:0;display:grid;gap:.5rem}
.ft-copy{border-top:1px solid rgb(255 255 255 / .1);padding:1.15rem 0;display:flex;flex-wrap:wrap;gap:.5rem;justify-content:space-between;font-size:.75rem;color:rgb(255 255 255 / .5)}
.page-hero{background:#071011;color:#fff;padding:3.5rem 0;border-bottom:1px solid #d4ddda}
.page-hero .lead{color:rgb(255 255 255 / .7)}
.crumbs{font-size:.875rem;color:#4a5856;display:flex;flex-wrap:wrap;gap:.35rem;align-items:center}
.crumbs a:hover{color:#0c1416}
.prod{display:grid;gap:2.5rem;padding:2.5rem 0;align-items:start}
.prod-img{border-radius:.75rem;background:#fff;aspect-ratio:4/3;overflow:hidden;box-shadow:0 0 0 1px rgb(12 20 22 / .06)}
.prod-img img{width:100%;height:100%;object-fit:contain}
.panel{border-radius:.75rem;background:#fff;padding:2rem;box-shadow:0 0 0 1px rgb(12 20 22 / .06)}
.chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.25rem}
.chip{font-size:.75rem;padding:.3rem .7rem;border-radius:999px;border:1px solid #d4ddda}
.side{display:none}
.side a{display:flex;justify-content:space-between;gap:.5rem;padding:.5rem .6rem;border-radius:.5rem;font-size:.875rem}
.side a.on{background:#0e5854;color:#f3fffc}
.chips-m{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem}
.chips-m a{border:1px solid #d4ddda;background:#fff;border-radius:999px;padding:.45rem .9rem;font-size:.875rem;font-weight:500}
.chips-m a.on{background:#0e5854;color:#f3fffc;border-color:#0e5854}
.search{position:relative;max-width:32rem;margin-top:2rem}
.search input,.field,select,textarea{width:100%;height:2.75rem;border:1px solid #d4ddda;border-radius:.5rem;padding:0 .75rem;font:inherit;background:#fff}
.hero .search input{background:rgb(255 255 255 / .1);border-color:rgb(255 255 255 / .15);color:#fff}
.hero .search input::placeholder{color:rgb(255 255 255 / .45)}
textarea{height:auto;padding:.75rem;min-height:7rem}
.toolbar{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.75rem;align-items:center;margin-bottom:1.5rem}
.contact-list{display:grid;gap:.75rem;list-style:none;margin:0;padding:0}
.contact-list a,.contact-list li>div{display:flex;gap:1rem;align-items:flex-start;padding:1rem;border-radius:.75rem;background:#fff;box-shadow:0 0 0 1px rgb(12 20 22 / .06)}
.wa{position:fixed;right:1.25rem;bottom:6rem;z-index:30;width:3.5rem;height:3.5rem;border-radius:999px;background:#0e5854;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgb(12 20 22 / .18)}
.menu{display:none;position:fixed;inset:0;z-index:50;background:#fffc}
.menu.on{display:block;padding:1.5rem}
.menu nav{display:flex;flex-direction:column;gap:1.1rem;margin-top:2rem;font-size:1.1rem;font-weight:500}
.overlay{display:none;position:fixed;inset:0;z-index:50;background:rgb(7 16 17 / .5)}
.overlay.on{display:block}
.dialog{display:none;position:fixed;left:50%;top:50%;z-index:51;width:min(32rem,calc(100% - 2rem));transform:translate(-50%,-50%);background:#fff;border-radius:.75rem;padding:1.5rem;box-shadow:0 20px 50px rgb(12 20 22 / .2)}
.dialog.on{display:block}
.dialog h2{margin:0 0 .5rem;font-size:1.25rem}
.search-list{max-height:16rem;overflow:auto;margin-top:.75rem}
.search-list a{display:block;padding:.55rem .4rem;border-radius:.4rem;font-size:.875rem}
.search-list a:hover{background:#e8edec}
.form-grid{display:grid;gap:1rem;margin-top:1.25rem}
label{font-size:.8rem;font-weight:500}
.hide{display:none !important}
@media (min-width:640px){.cards{grid-template-columns:1fr 1fr}.stats{grid-template-columns:repeat(4,1fr)}.grid-3{grid-template-columns:1fr 1fr}}
@media (min-width:768px){nav.desk{display:flex}.mob-only{display:none}.ft-grid{grid-template-columns:1.2fr 1fr 1fr 1fr}.grid-3{grid-template-columns:1fr 1fr 1fr}}
@media (min-width:992px){.hero-in{grid-template-columns:7fr 5fr;align-items:center;padding-top:5rem}.prod{grid-template-columns:7fr 5fr}.layout{display:grid;grid-template-columns:16rem 1fr;gap:2.5rem}.side{display:block}.chips-m{display:none}.lg-2{grid-template-columns:5fr 7fr;display:grid;gap:2.5rem}}
@media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}
`;

const JS = `(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const menu = $("#menu");
  $("#menu-open")?.addEventListener("click", () => menu?.classList.add("on"));
  $("#menu-close")?.addEventListener("click", () => menu?.classList.remove("on"));
  $$("#menu a").forEach(a => a.addEventListener("click", () => menu?.classList.remove("on")));

  function openDialog(id) {
    $("#overlay")?.classList.add("on");
    $(id)?.classList.add("on");
  }
  function closeDialogs() {
    $("#overlay")?.classList.remove("on");
    $$(".dialog").forEach(d => d.classList.remove("on"));
  }
  $("#overlay")?.addEventListener("click", closeDialogs);
  $$("[data-close]").forEach(b => b.addEventListener("click", closeDialogs));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialogs();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });
  $$("[data-search]").forEach(b => b.addEventListener("click", openSearch));
  $$("[data-quote]").forEach(b => b.addEventListener("click", () => {
    const title = b.getAttribute("data-quote") || "";
    const p = $("#quote-product");
    if (p) p.value = title;
    const hint = $("#quote-hint");
    if (hint) hint.textContent = title ? ("Позиция: " + title) : "Опишите задачу клиники.";
    openDialog("#quote");
  }));

  async function openSearch() {
    openDialog("#search-dlg");
    const input = $("#search-dlg input");
    input?.focus();
    if (!window.__products) {
      try {
        const res = await fetch("/assets/products.json");
        window.__products = await res.json();
      } catch { window.__products = []; }
    }
    renderSearch(input?.value || "");
  }
  $("#search-dlg input")?.addEventListener("input", (e) => renderSearch(e.target.value));
  function renderSearch(q) {
    const box = $("#search-results");
    if (!box) return;
    const s = q.trim().toLowerCase();
    const list = (window.__products || []).filter(p => {
      if (!s) return true;
      return (p.title + " " + p.excerpt + " " + p.category).toLowerCase().includes(s);
    }).slice(0, 12);
    box.innerHTML = list.length
      ? list.map(p => '<a href="/product/'+p.slug+'/">'+escapeHtml(p.title)+"</a>").join("")
      : '<p class="muted small">Ничего не найдено</p>';
  }
  function escapeHtml(t){return String(t).replace(/[&<>"]/g,c=>({amp:"\u0026amp;",lt:"\u0026lt;",gt:"\u0026gt;",quot:"\u0026quot;"}[{"&":"amp","<":"lt",">":"gt",'"':"quot"}[c]]))}

  const qInput = $("#cat-q");
  function filterCards() {
    const q = (qInput?.value || "").trim().toLowerCase();
    let n = 0;
    $$("[data-card]").forEach(el => {
      const hay = (el.getAttribute("data-hay") || "");
      const ok = !q || hay.includes(q);
      el.classList.toggle("hide", !ok);
      if (ok) n++;
    });
    const c = $("#cat-count");
    if (c) c.textContent = n ? (n + " поз.") : "Ничего не найдено";
  }
  qInput?.addEventListener("input", filterCards);

  async function sendForm(form, okMsg) {
    const data = new FormData(form);
    data.set("_gotcha", "");
    const btn = form.querySelector("[type=submit]");
    if (btn) btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("fail");
      alert(okMsg);
      form.reset();
      closeDialogs();
    } catch {
      alert("Не отправилось. Позвоните или напишите в WhatsApp.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }
  $("#quote-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm(e.currentTarget, "Заявка отправлена. Свяжемся в рабочие часы.");
  });
  $("#contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm(e.currentTarget, "Сообщение отправлено. Ответим в рабочие часы.");
  });
})();
`;

function shell({ title, description, path, active, body }) {
  const url = COMPANY.origin + path;
  const nav = [
    ["/", "Главная", "home"],
    ["/catalog/", "Каталог", "catalog"],
    ["/services/", "Услуги", "services"],
    ["/about/", "О компании", "about"],
    ["/contacts/", "Контакты", "contacts"],
  ];
  const navHtml = nav
    .map(
      ([href, label, id]) =>
        `<a href="${href}" class="${active === id ? "on" : ""}">${label}</a>`,
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${COMPANY.origin}/og.jpg">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<a class="hide" href="#content">К содержанию</a>
<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="/" aria-label="AiMedTech — на главную"><span class="mark">A</span>Ai<span class="med">Med</span>Tech</a>
    <nav class="desk" aria-label="Основное меню">${navHtml}</nav>
    <div class="top-act">
      <button class="btn-out icon-btn" type="button" data-search aria-label="Поиск">⌕</button>
      <a class="btn" href="/contacts/">Заявка</a>
      <button class="icon-btn mob-only" type="button" id="menu-open" aria-label="Меню">☰</button>
    </div>
  </div>
</header>
<div class="menu" id="menu">
  <button class="icon-btn" type="button" id="menu-close" aria-label="Закрыть">✕</button>
  <nav>${navHtml}</nav>
  <p style="margin-top:2rem"><a href="tel:${COMPANY.phoneTel}">${COMPANY.phoneDisplay}</a></p>
</div>
<main id="content">${body}</main>
<div class="cta-band">
  <div class="wrap cta-in">
    <div>
      <p class="font-d" style="font-size:1.5rem;margin:0">Спецификация за один рабочий день</p>
      <p class="muted small" style="margin:.35rem 0 0">Опишите отделение — подберём позиции и сроки поставки.</p>
    </div>
    <div class="row" style="margin:0">
      <button class="btn" type="button" data-quote="">Запросить КП</button>
      <a class="btn-out btn" href="${COMPANY.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</div>
<footer class="site">
  <div class="wrap ft-grid">
    <div>
      <p class="logo" style="margin:0">Ai<span class="med">Med</span>Tech</p>
      <p class="small" style="color:rgb(255 255 255 / .7);max-width:16rem">${esc(COMPANY.tagline)}. Поставка, сервис и обучение персонала.</p>
    </div>
    <div>
      <p class="ft-h">Каталог</p>
      <ul class="ft-list">${CATEGORIES.slice(0, 8).map((c) => `<li><a href="/catalog/${c.id}/">${esc(c.name)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <p class="ft-h">Компания</p>
      <ul class="ft-list">
        <li><a href="/about/">О компании</a></li>
        <li><a href="/services/">Услуги</a></li>
        <li><a href="/contacts/">Контакты</a></li>
        <li><a href="/privacy/">Персональные данные</a></li>
      </ul>
    </div>
    <div>
      <p class="ft-h">Контакты</p>
      <ul class="ft-list">
        <li><a href="${COMPANY.map}" target="_blank" rel="noopener">${esc(COMPANY.address)}</a></li>
        <li><a href="tel:${COMPANY.phoneTel}">${COMPANY.phoneDisplay}</a></li>
        <li><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
        <li>${COMPANY.hours}</li>
      </ul>
    </div>
  </div>
  <div class="wrap ft-copy">
    <p>© ${new Date().getFullYear()} ${COMPANY.name}. Каталог оборудования.</p>
    <p>Цены и наличие — по запросу. Не является публичной офертой.</p>
  </div>
</footer>
<a class="wa" href="${COMPANY.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
<div class="overlay" id="overlay"></div>
<div class="dialog" id="quote" role="dialog" aria-labelledby="quote-title">
  <h2 id="quote-title">Запрос коммерческого предложения</h2>
  <p class="muted small" id="quote-hint">Опишите задачу клиники.</p>
  <form id="quote-form" class="form-grid" action="${COMPANY.formspree}" method="post">
    <input type="hidden" name="_gotcha" value="">
    <input type="hidden" name="product" id="quote-product" value="">
    <div><label for="qn">Имя</label><input class="field" id="qn" name="name" required autocomplete="name"></div>
    <div><label for="qp">Телефон</label><input class="field" id="qp" name="phone" type="tel" required autocomplete="tel"></div>
    <div><label for="qe">Email</label><input class="field" id="qe" name="email" type="email" required autocomplete="email"></div>
    <div><label for="qo">Клиника / организация</label><input class="field" id="qo" name="organization" autocomplete="organization"></div>
    <div><label for="qm">Комментарий</label><textarea id="qm" name="message" rows="4" placeholder="Отделение, количество, сроки"></textarea></div>
    <p class="muted" style="font-size:.75rem">Отправляя форму, вы соглашаетесь с обработкой данных для ответа на заявку.</p>
    <button class="btn" type="submit">Отправить заявку</button>
  </form>
</div>
<div class="dialog" id="search-dlg" role="dialog" aria-label="Поиск">
  <input class="field" type="search" placeholder="Модель, направление, кабинет…" aria-label="Поиск">
  <div class="search-list" id="search-results"></div>
</div>
<script src="/assets/site.js" defer></script>
</body></html>`;
}

function productCard(p) {
  const cat = catById(p.category);
  const hay = `${p.title} ${p.titleOriginal ?? ""} ${p.excerpt} ${p.description} ${cat?.name ?? ""}`.toLowerCase();
  return `<article class="card" data-card data-hay="${esc(hay)}">
    <a class="pic" href="/product/${esc(p.slug)}/">
      ${cat ? `<span class="badge">${esc(cat.name)}</span>` : ""}
      <img src="${esc(p.image)}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
    </a>
    <div class="card-b">
      <h3><a href="/product/${esc(p.slug)}/">${esc(p.title)}</a></h3>
      <p>${esc(p.excerpt)}</p>
      <div class="card-act">
        <a class="btn-out btn" href="/product/${esc(p.slug)}/">Подробнее</a>
        <button class="btn" type="button" data-quote="${esc(p.title)}">Запросить КП</button>
      </div>
    </div>
  </article>`;
}

function faqHtml() {
  return `<div class="faq">${FAQ.map(
    (f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`,
  ).join("")}</div>`;
}

function catalogPage(products, category) {
  const title = category ? category.name : "Каталог оборудования";
  const lead = category
    ? `${category.blurb}. В разделе ${products.length} ${plural(products.length)}.`
    : `Полная линейка: ${products.length} позиций. Цены и конфигурация — в коммерческом предложении.`;
  const side = `<aside class="side"><div class="panel" style="padding:1rem;position:sticky;top:5.5rem">
    <p class="muted" style="font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;margin:.25rem .5rem">Направления</p>
    <a href="/catalog/" class="${category ? "" : "on"}"><span>Все позиции</span></a>
    ${CATEGORIES.map((c) => {
      const n = productsAll.filter((p) => p.category === c.id).length;
      return `<a href="/catalog/${c.id}/" class="${category?.id === c.id ? "on" : ""}"><span>${esc(c.name)}</span><span>${n}</span></a>`;
    }).join("")}
  </div></aside>`;
  const chips = `<div class="chips-m">
    <a href="/catalog/" class="${category ? "" : "on"}">Все</a>
    ${CATEGORIES.map((c) => `<a href="/catalog/${c.id}/" class="${category?.id === c.id ? "on" : ""}">${esc(c.name)}</a>`).join("")}
  </div>`;
  return shell({
    title: `${title} — AiMedTech`,
    description: lead,
    path: category ? `/catalog/${category.id}/` : "/catalog/",
    active: "catalog",
    body: `<header class="page-hero"><div class="wrap">
      <p class="kicker">Каталог</p>
      <h1 class="display">${esc(title)}</h1>
      <p class="lead">${esc(lead)}</p>
      <div class="search"><input id="cat-q" type="search" placeholder="Поиск по названию, модели, назначению" aria-label="Поиск в каталоге"></div>
    </div></header>
    <div class="wrap sec layout">${side}<div>
      ${chips}
      <div class="toolbar"><p class="muted small" id="cat-count">${products.length} ${plural(products.length)}</p></div>
      <div class="cards">${products.map(productCard).join("")}</div>
    </div></div>`,
  });
}

let productsAll = [];

async function main() {
  const { readFileSync } = await import("node:fs");
  productsAll = JSON.parse(readFileSync(join(root, "src/data/products.json"), "utf8"));
  const featured = JSON.parse(readFileSync(join(root, "src/data/featured.json"), "utf8"));
  const mosaic = featured.slice(0, 3);
  const PRODUCT_COUNT = productsAll.length;

  mkdirSync(out, { recursive: true });
  write("assets/site.css", CSS);
  write("assets/site.js", JS);
  write(
    "assets/products.json",
    JSON.stringify(
      productsAll.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
      })),
    ),
  );
  if (existsSync(join(root, "public/favicon.svg"))) {
    copyFileSync(join(root, "public/favicon.svg"), join(out, "favicon.svg"));
  }
  if (existsSync(join(root, "public/og.jpg"))) {
    copyFileSync(join(root, "public/og.jpg"), join(out, "og.jpg"));
  }

  write(
    ".htaccess",
    `DirectoryIndex index.html
Options -Indexes
AddDefaultCharset UTF-8
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
</IfModule>
ErrorDocument 404 /404.html
`,
  );

  const catCards = CATEGORIES.map((c) => {
    const n = productsAll.filter((p) => p.category === c.id).length;
    return `<li><a class="cat" href="/catalog/${c.id}/"><span class="ico">${esc(c.name.slice(0, 1))}</span><span style="flex:1;min-width:0"><span style="display:flex;justify-content:space-between;gap:.5rem"><strong>${esc(c.name)}</strong><span class="muted small">${n}</span></span><span class="muted small">${esc(c.blurb)}</span></span></a></li>`;
  }).join("");

  const home = shell({
    title: "AiMedTech — медицинское оборудование, Алматы",
    description: COMPANY.description,
    path: "/",
    active: "home",
    body: `<section class="hero">
      <div class="hero-grid"></div>
      <div class="wrap hero-in">
        <div>
          <p class="kicker">Алматы · поставка в клиники Казахстана</p>
          <h1 class="display">Оборудование,<br>на котором<br>работает отделение</h1>
          <p class="lead">${esc(COMPANY.description)}</p>
          <div class="row">
            <a class="btn btn-lg btn-ink" href="/catalog/">Открыть каталог</a>
            <button class="btn btn-lg btn-dark-out" type="button" data-search>Найти модель</button>
          </div>
          <dl class="stats">
            <div><dt>позиций</dt><dd>${PRODUCT_COUNT}</dd></div>
            <div><dt>направлений</dt><dd>${CATEGORIES.length}</dd></div>
            <div><dt>на КП</dt><dd>1 день</dd></div>
            <div><dt>база</dt><dd>${COMPANY.city}</dd></div>
          </dl>
        </div>
        <div class="mosaic">
          ${mosaic
            .map(
              (p, i) =>
                `<a class="thumb${i ? " sq" : ""}" href="/product/${esc(p.slug)}/"><img src="${esc(p.image)}" alt="${esc(p.alt)}"></a>`,
            )
            .join("")}
        </div>
      </div>
      <div class="marquee"><div class="marquee-track">${[...CATEGORIES, ...CATEGORIES].map((c) => `<span>${esc(c.name)} ·</span>`).join("")}</div></div>
    </section>
    <section class="sec"><div class="wrap">
      <p class="kicker p">15 направлений</p>
      <h2 class="sec-t">Подберите по отделению</h2>
      <ul class="grid-3" style="list-style:none;padding:0;margin:2.5rem 0 0">${catCards}</ul>
    </div></section>
    <section class="band"><div class="wrap sec">
      <p class="kicker p">Витрина</p>
      <h2 class="sec-t">Избранные позиции</h2>
      <div class="cards" style="margin-top:2.5rem">${featured.map(productCard).join("")}</div>
    </div></section>
    <section class="sec"><div class="wrap">
      <p class="kicker p">Процесс</p>
      <h2 class="sec-t">От заявки до работающего кабинета</h2>
      <div class="grid-3" style="margin-top:2.5rem">
        ${["Поставка|Комплектация кабинета или отделения: от мебели до эндоскопических стоек.", "Сервис|Гарантийное и постгарантийное обслуживание, расходные материалы.", "Обучение|Ввод персонала в работу с оборудованием после поставки."]
          .map(
            (t, i) => {
              const [title, text] = t.split("|");
              return `<div class="feat"><div class="feat-h"><span class="ico">0${i + 1}</span><span class="step">0${i + 1}</span></div><h3 style="margin:1.1rem 0 .4rem">${title}</h3><p class="muted small">${text}</p></div>`;
            },
          )
          .join("")}
      </div>
      <div class="row"><a class="btn" href="/services/">Услуги</a><button class="btn-out btn" type="button" data-quote="">Оставить заявку</button></div>
    </div></section>
    <section class="band"><div class="wrap sec lg-2">
      <div>
        <p class="kicker p">Вопросы</p>
        <h2 class="sec-t">Коротко о поставке</h2>
        <p class="muted small">Каталог информационный. Цена, комплектация и сроки — в коммерческом предложении под ваш объект.</p>
      </div>
      ${faqHtml()}
    </div></section>`,
  });
  write("index.html", home);

  write("catalog/index.html", catalogPage(productsAll, null));
  for (const c of CATEGORIES) {
    write(
      `catalog/${c.id}/index.html`,
      catalogPage(
        productsAll.filter((p) => p.category === c.id),
        c,
      ),
    );
  }

  for (const p of productsAll) {
    const cat = catById(p.category);
    const { body, specs } = parseSpecs(p.description);
    const related = productsAll
      .filter((x) => x.category === p.category && x.slug !== p.slug)
      .slice(0, 4);
    write(
      `product/${p.slug}/index.html`,
      shell({
        title: `${p.title} — AiMedTech`,
        description: p.excerpt,
        path: `/product/${p.slug}/`,
        active: "catalog",
        body: `<div class="wrap" style="padding-top:2rem">
          <nav class="crumbs"><a href="/catalog/">Каталог</a> · ${cat ? `<a href="/catalog/${cat.id}/">${esc(cat.name)}</a> · ` : ""}<span>${esc(p.title)}</span></nav>
          <div class="prod">
            <div class="prod-img"><img src="${esc(p.image)}" alt="${esc(p.alt)}"></div>
            <div class="panel">
              ${cat ? `<a class="chip" href="/catalog/${cat.id}/">${esc(cat.name)}</a>` : ""}
              <h1 class="sec-t" style="margin-top:1rem">${esc(p.title)}</h1>
              ${p.titleOriginal ? `<p class="muted small">${esc(p.titleOriginal)}</p>` : ""}
              <p style="margin-top:1.1rem;line-height:1.6">${esc(p.excerpt)}</p>
              ${specs.length ? `<ul class="chips">${specs.map((s) => `<li class="chip">${esc(s)}</li>`).join("")}</ul>` : ""}
              <div class="row">
                <button class="btn btn-lg" type="button" data-quote="${esc(p.title)}">Запросить КП</button>
                <a class="btn-out btn btn-lg" href="${COMPANY.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
              </div>
              <p class="muted small">Цена, комплектация и срок поставки согласовываются индивидуально.</p>
            </div>
          </div>
          <section style="padding:2rem 0 3rem;border-top:1px solid #d4ddda">
            <h2 class="sec-t">Описание</h2>
            <p class="muted" style="max-width:40rem;line-height:1.65">${esc(body || p.description)}</p>
          </section>
          ${related.length ? `<section style="padding-bottom:3rem"><h2 class="sec-t">В этой категории</h2><div class="cards" style="margin-top:1.5rem">${related.map(productCard).join("")}</div></section>` : ""}
        </div>`,
      }),
    );
  }

  write(
    "about/index.html",
    shell({
      title: "О компании — AiMedTech",
      description: COMPANY.description,
      path: "/about/",
      active: "about",
      body: `<header class="page-hero"><div class="wrap"><p class="kicker">Компания</p><h1 class="display">Оснащаем лечебные учреждения, а не продаём «коробки»</h1></div></header>
      <div class="wrap sec lg-2">
        <div class="muted" style="line-height:1.7">
          <p>${esc(COMPANY.name)} поставляет медицинское оборудование клиникам, кабинетам и сервисным центрам в Казахстане. База — ${esc(COMPANY.city)}, ${esc(COMPANY.address)}.</p>
          <p>В каталоге ${PRODUCT_COUNT} позиций по ${CATEGORIES.length} направлениям. Каждая заявка разбирается под задачу отделения.</p>
          <p>Мы не публикуем цены на сайте: конфигурация и логистика зависят от объекта.</p>
        </div>
        <div class="grid-3">
          <div class="feat"><strong style="font-size:1.75rem">${PRODUCT_COUNT}</strong><p class="muted small">позиций в каталоге</p></div>
          <div class="feat"><strong style="font-size:1.75rem">${CATEGORIES.length}</strong><p class="muted small">клинических направлений</p></div>
          <div class="feat"><strong style="font-size:1.75rem">1 день</strong><p class="muted small">на подготовку КП</p></div>
        </div>
      </div>`,
    }),
  );

  write(
    "services/index.html",
    shell({
      title: "Услуги — AiMedTech",
      description: "Поставка, сервис и обучение — одна цепочка.",
      path: "/services/",
      active: "services",
      body: `<header class="page-hero"><div class="wrap"><p class="kicker">Услуги</p><h1 class="display">От заявки до работающего кабинета</h1><p class="lead">Не продаём оборудование в отрыве от внедрения.</p></div></header>
      <div class="wrap sec">
        <ol class="cards" style="list-style:none;padding:0">${SERVICES.map((s, i) => `<li class="panel"><p class="kicker p">0${i + 1}</p><h2 class="sec-t">${esc(s.title)}</h2><p class="muted small">${esc(s.text)}</p></li>`).join("")}</ol>
        <div class="row"><button class="btn btn-lg" type="button" data-quote="">Обсудить задачу</button></div>
        <div class="lg-2" style="margin-top:4rem">
          <div><h2 class="sec-t">Частые вопросы</h2></div>
          ${faqHtml()}
        </div>
      </div>`,
    }),
  );

  write(
    "contacts/index.html",
    shell({
      title: "Контакты — AiMedTech",
      description: "Заявка, звонок или WhatsApp — подготовим спецификацию и сроки.",
      path: "/contacts/",
      active: "contacts",
      body: `<header class="page-hero"><div class="wrap"><p class="kicker">Контакты</p><h1 class="display">Расскажите, что нужно отделению</h1><p class="lead">Заявка, звонок или WhatsApp — подготовим спецификацию и сроки.</p></div></header>
      <div class="wrap sec lg-2">
        <ul class="contact-list">
          <li><a href="${COMPANY.map}" target="_blank" rel="noopener"><span class="ico">Ад</span><span><span class="muted" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">Адрес</span><strong>${esc(COMPANY.address)}</strong></span></a></li>
          <li><a href="tel:${COMPANY.phoneTel}"><span class="ico">Т</span><span><span class="muted" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">Телефон</span><strong>${COMPANY.phoneDisplay}</strong></span></a></li>
          <li><a href="${COMPANY.whatsapp}" target="_blank" rel="noopener"><span class="ico">WA</span><span><span class="muted" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">WhatsApp</span><strong>Написать в мессенджер</strong></span></a></li>
          <li><a href="mailto:${COMPANY.email}"><span class="ico">@</span><span><span class="muted" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">Email</span><strong>${COMPANY.email}</strong></span></a></li>
          <li><div><span class="ico">ч</span><span><span class="muted" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">Режим</span><strong>${COMPANY.hours}</strong></span></div></li>
        </ul>
        <form id="contact-form" class="panel form-grid" action="${COMPANY.formspree}" method="post">
          <input type="hidden" name="_gotcha" value="">
          <h2 class="sec-t" style="margin:0">Форма заявки</h2>
          <div><label for="name">Имя</label><input class="field" id="name" name="name" required autocomplete="name"></div>
          <div><label for="phone">Телефон</label><input class="field" id="phone" name="phone" type="tel" required autocomplete="tel"></div>
          <div><label for="email">Email</label><input class="field" id="email" name="email" type="email" required autocomplete="email"></div>
          <div><label for="organization">Клиника / организация</label><input class="field" id="organization" name="organization" autocomplete="organization"></div>
          <div><label for="message">Сообщение</label><textarea id="message" name="message" required rows="5"></textarea></div>
          <p class="muted" style="font-size:.75rem">Отправляя форму, вы соглашаетесь с <a href="/privacy/" style="text-decoration:underline">обработкой данных</a>.</p>
          <button class="btn" type="submit">Отправить</button>
        </form>
      </div>`,
    }),
  );

  write(
    "privacy/index.html",
    shell({
      title: "Персональные данные — AiMedTech",
      description: "Как AiMedTech обрабатывает данные заявок.",
      path: "/privacy/",
      active: "",
      body: `<div class="wrap sec" style="max-width:48rem">
        <p class="kicker p">Документы</p>
        <h1 class="display">Обработка персональных данных</h1>
        <div class="muted" style="margin-top:2rem;line-height:1.7">
          <p>${esc(COMPANY.name)} обрабатывает данные из форм сайта (имя, телефон, email, организация, текст обращения), чтобы ответить на заявку и подготовить коммерческое предложение.</p>
          <p>Сообщения уходят через Formspree. Мы не ведём рекламную рассылку и не продаём контакты.</p>
          <p>Оператор: ${esc(COMPANY.email)}, ${COMPANY.phoneDisplay}, ${esc(COMPANY.address)}.</p>
          <p>Каталог носит информационный характер и не является публичной офертой.</p>
        </div>
      </div>`,
    }),
  );

  write(
    "404.html",
    shell({
      title: "Страница не найдена — AiMedTech",
      description: "Проверьте адрес или вернитесь в каталог.",
      path: "/404.html",
      active: "",
      body: `<div class="wrap sec" style="text-align:center;max-width:36rem">
        <p class="kicker p">404</p>
        <h1 class="display">Страница не найдена</h1>
        <p class="muted">Проверьте адрес или вернитесь в каталог.</p>
        <p style="margin-top:2rem"><a class="btn" href="/catalog/">В каталог</a></p>
      </div>`,
    }),
  );

  const urls = [
    "/",
    "/catalog/",
    "/about/",
    "/services/",
    "/contacts/",
    "/privacy/",
    ...CATEGORIES.map((c) => `/catalog/${c.id}/`),
    ...productsAll.map((p) => `/product/${p.slug}/`),
  ];
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${COMPANY.origin}${u}</loc></url>`).join("\n")}
</urlset>
`,
  );
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${COMPANY.origin}/sitemap.xml\n`);

  console.log(`Wrote static site to ${out} (${urls.length} urls, ${productsAll.length} products)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
