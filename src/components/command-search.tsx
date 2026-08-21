import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Folder, MessageCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/categories";
import { products } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { useSearchStore } from "@/lib/search-store";
import { useQuoteStore } from "@/lib/quote-store";

export function CommandSearch() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);
  const navigate = useNavigate();
  const openQuote = useQuoteStore((s) => s.openFor);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        if (
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.tagName === "SELECT" ||
            t.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showClose={false} className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Поиск по каталогу</DialogTitle>
        <Command
          className="bg-card text-foreground"
          shouldFilter
          loop
        >
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 text-muted-foreground" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Модель, направление, кабинет…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
              Ничего не найдено. Попробуйте другое слово.
            </Command.Empty>
            <Command.Group
              heading="Действия"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <Command.Item
                value="заявка коммерческое предложение"
                onSelect={() => {
                  setOpen(false);
                  openQuote(null);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-muted"
              >
                <FileText className="size-4 text-primary" />
                Запросить коммерческое предложение
              </Command.Item>
              <Command.Item
                value="whatsapp"
                onSelect={() => {
                  setOpen(false);
                  window.open(COMPANY.whatsapp, "_blank", "noopener,noreferrer");
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-muted"
              >
                <MessageCircle className="size-4 text-primary" />
                Написать в WhatsApp
              </Command.Item>
            </Command.Group>
            <Command.Group
              heading="Направления"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {CATEGORIES.map((c) => (
                <Command.Item
                  key={c.id}
                  value={`${c.name} ${c.blurb} категория`}
                  onSelect={() => {
                    setOpen(false);
                    void navigate({
                      to: "/catalog/$category",
                      params: { category: c.id },
                    });
                  }}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-muted"
                >
                  <span className="flex items-center gap-3">
                    <Folder className="size-4 text-primary" />
                    {c.name}
                  </span>
                  <span className="tabular-nums text-xs text-muted-foreground">
                    {c.count}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group
              heading="Оборудование"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {products.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`${p.title} ${p.titleOriginal ?? ""} ${p.excerpt}`}
                  onSelect={() => {
                    setOpen(false);
                    void navigate({
                      to: "/product/$slug",
                      params: { slug: p.slug },
                    });
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-muted"
                >
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-1">{p.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
