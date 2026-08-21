import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  to?: string;
  params?: Record<string, string>;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Навигация" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        let node: ReactNode = item.label;
        if (!last && item.to) {
          node = (
            <Link
              to={item.to}
              params={item.params as never}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          );
        }
        return (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? <ChevronRight className="size-3.5 opacity-60" /> : null}
            <span className={last ? "text-foreground" : undefined}>{node}</span>
          </Fragment>
        );
      })}
    </nav>
  );
}
