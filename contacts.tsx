import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/_site/contacts")({
  component: ContactsPage,
  head: () => ({
    meta: [{ title: "Контакты — AiMedTech" }],
  }),
});

function ContactsPage() {
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setPending(true);
    try {
      const res = await fetch(COMPANY.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("fail");
      toast.success("Сообщение отправлено. Ответим в рабочие часы.");
      form.reset();
    } catch {
      toast.error("Ошибка отправки. Позвоните или напишите в WhatsApp.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Контакты
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Расскажите, что нужно отделению
        </h1>
        <p className="mt-4 text-muted-foreground">
          Заявка, звонок или WhatsApp — подготовим спецификацию и сроки.
        </p>
        <ul className="mt-10 space-y-5 text-sm">
          <li>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Адрес</p>
            <a
              href={COMPANY.map}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block font-medium text-foreground hover:text-primary"
            >
              {COMPANY.address}
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</p>
            <a href={`tel:${COMPANY.phoneTel}`} className="mt-1 inline-block font-medium">
              {COMPANY.phoneDisplay}
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</p>
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block font-medium"
            >
              Написать в WhatsApp
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="mt-1 inline-block font-medium">
              {COMPANY.email}
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Режим</p>
            <p className="mt-1 font-medium">{COMPANY.hours}</p>
          </li>
        </ul>
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-card p-6 sm:p-8"
      >
        <input type="hidden" name="_gotcha" />
        <h2 className="font-display text-2xl font-medium">Форма заявки</h2>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea id="message" name="message" required rows={5} />
          </div>
          <p className="text-xs text-muted-foreground">
            Отправляя форму, вы соглашаетесь с обработкой данных для ответа на
            обращение. Подробнее — на странице персональных данных.
          </p>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Отправка…" : "Отправить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
