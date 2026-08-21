import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { COMPANY } from "@/lib/company";
import { useQuoteStore } from "@/lib/quote-store";

export function QuoteDialog() {
  const open = useQuoteStore((s) => s.open);
  const product = useQuoteStore((s) => s.product);
  const close = useQuoteStore((s) => s.close);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("_gotcha", "");
    if (product) data.set("product", product.title);
    setPending(true);
    try {
      const res = await fetch(COMPANY.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("fail");
      toast.success("Заявка отправлена. Мы свяжемся с вами в рабочие часы.");
      form.reset();
      close();
    } catch {
      toast.error("Не удалось отправить. Напишите в WhatsApp или на почту.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? close() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Запрос коммерческого предложения</DialogTitle>
          <DialogDescription>
            {product
              ? `Позиция: ${product.title}. Укажите контакты — подготовим спецификацию и сроки.`
              : "Опишите задачу клиники. Подберём оборудование и подготовим спецификацию."}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <input type="hidden" name="_gotcha" />
          <div className="grid gap-2">
            <Label htmlFor="quote-name">Имя</Label>
            <Input id="quote-name" name="name" required autoComplete="name" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="quote-phone">Телефон</Label>
              <Input
                id="quote-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+7"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quote-email">Email</Label>
              <Input
                id="quote-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-org">Клиника / организация</Label>
            <Input id="quote-org" name="organization" autoComplete="organization" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-message">Комментарий</Label>
            <Textarea
              id="quote-message"
              name="message"
              rows={4}
              placeholder="Отделение, количество, сроки поставки"
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных для
            ответа на заявку. Реквизиты не передаём третьим лицам, кроме сервиса
            доставки писем.
          </p>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Отправка…" : "Отправить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
