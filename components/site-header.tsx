import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { COMPANY } from "@/lib/company";
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
      className="flex items-baseline gap-0 font-display text-xl tracking-tight text-foreground"
      aria-label="AiMedTech — на главную"
    >
      Ai<span className="text-primary">Med</span>Tech
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
              "text-sm font-medium transition-colors hover:text-primary",
              active ? "text-primary" : "text-foreground/80",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <NavLinks className="hidden items-center gap-7 md:flex" />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <a href={`tel:${COMPANY.phoneTel}`}>
              <Phone />
              {COMPANY.phoneDisplay}
            </a>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
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
            className="mt-8 flex flex-col gap-5"
            onNavigate={() => setOpen(false)}
          />
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="mt-8 text-sm font-medium text-primary"
          >
            {COMPANY.phoneDisplay}
          </a>
        </SheetContent>
      </Sheet>
    </header>
  );
}
