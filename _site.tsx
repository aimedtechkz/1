import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { QuoteDialog } from "@/components/quote-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
  notFoundComponent: NotFound,
});

function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        К содержанию
      </a>
      <SiteHeader />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <QuoteDialog />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Страница не найдена</h1>
      <p className="mt-3 text-muted-foreground">
        Проверьте адрес или вернитесь в каталог.
      </p>
      <Button asChild className="mt-8">
        <Link to="/catalog">В каталог</Link>
      </Button>
    </div>
  );
}
