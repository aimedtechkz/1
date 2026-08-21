import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { COMPANY } from "@/lib/company";
import { useSearchStore } from "@/lib/search-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Главная" },
  { to: "/catalog", label: "Каталог" },
  { to: "/services", label: "Услуги" },
  { to: "/about", label: "О компании" },
  { to: "/contacts", label: "Контакты" },
] as const;

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2.5 text-foreground"
      aria-label="AiMedTech — на главную"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-ink text-sm font-semibold tracking-tight text-card">
        A
      </span>
      <span className="font-display text-xl tracking-tight">
        Ai<span className="text-primary">Med</span>Tech
      </span>
    </Link>
  );
}

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className={className} aria-label="Основное меню">
      {NAV.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "relative text-sm font-medium transition-colors duration-150 hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
            {active ? (
              <span className="absolute -bottom-1 left-0 h-px w-full bg-primary" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const setSearchOpen = useSearchStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <NavLinks className="hidden items-center gap-7 md:flex" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 gap-2 px-3 text-muted-foreground lg:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-3.5" />
            Поиск
            <kbd className="ml-1 rounded-sm border border-border bg-muted px-1.5 font-mono text-xs">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Поиск"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <a href={`tel:${COMPANY.phoneTel}`}>
              <Phone />
              {COMPANY.phoneDisplay}
            </a>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="/aimedtech-sait.zip" download="AiMedTech-sait.zip">
              Скачать ZIP
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/contacts">Заявка</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Открыть меню"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetTitle className="sr-only">Меню</SheetTitle>
          <Logo onClick={() => setOpen(false)} />
          <NavLinks
            className="mt-10 flex flex-col gap-5"
            onNavigate={() => setOpen(false)}
          />
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="mt-10 text-sm font-medium text-primary"
          >
            {COMPANY.phoneDisplay}
          </a>
        </SheetContent>
      </Sheet>
    </header>
  );
}
