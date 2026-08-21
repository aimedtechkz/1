import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";
import { COMPANY } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl tracking-tight">
            Ai<span className="text-accent">Med</span>Tech
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-card/70">
            {COMPANY.tagline}. Поставка, сервис и обучение персонала.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-card/50">
            Каталог
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {CATEGORIES.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link
                  to="/catalog/$category"
                  params={{ category: c.id }}
                  className="text-card/80 hover:text-card"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-card/50">
            Компания
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <Link to="/about" className="text-card/80 hover:text-card">
                О компании
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-card/80 hover:text-card">
                Услуги
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="text-card/80 hover:text-card">
                Контакты
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-card/80 hover:text-card">
                Персональные данные
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-card/50">
            Контакты
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-card/80">
            <li>
              <a
                href={COMPANY.map}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-card"
              >
                {COMPANY.address}
              </a>
            </li>
            <li>
              <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-card">
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-card">
                {COMPANY.email}
              </a>
            </li>
            <li>{COMPANY.hours}</li>
            <li>
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-card"
              >
                WhatsApp
              </a>
              {" · "}
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-card"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-card/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-card/50 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {COMPANY.name}. Каталог оборудования.</p>
          <p>Цены и наличие — по запросу. Не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
