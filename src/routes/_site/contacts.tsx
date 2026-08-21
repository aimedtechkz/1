import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
    <div>
      <header className="border-b border-border bg-ink text-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-mist">
            Контакты
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Расскажите, что нужно отделению
          </h1>
          <p className="mt-4 max-w-xl text-card/70">
            Заявка, звонок или WhatsApp — подготовим спецификацию и сроки.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="grid gap-3">
            <ContactRow
              icon={<MapPin className="size-4" />}
              label="Адрес"
              href={COMPANY.map}
              external
            >
              {COMPANY.address}
            </ContactRow>
            <ContactRow
              icon={<Phone className="size-4" />}
              label="Телефон"
              href={`tel:${COMPANY.phoneTel}`}
            >
              {COMPANY.phoneDisplay}
            </ContactRow>
            <ContactRow
              icon={<MessageCircle className="size-4" />}
              label="WhatsApp"
              href={COMPANY.whatsapp}
              external
            >
              Написать в мессенджер
            </ContactRow>
            <ContactRow
              icon={<Mail className="size-4" />}
              label="Email"
              href={`mailto:${COMPANY.email}`}
            >
              {COMPANY.email}
            </ContactRow>
            <ContactRow icon={<Clock className="size-4" />} label="Режим">
              {COMPANY.hours}
            </ContactRow>
          </ul>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)] sm:p-8 lg:col-span-7"
        >
          <input type="hidden" name="_gotcha" />
          <h2 className="font-display text-2xl font-medium">Форма заявки</h2>
          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organization">Клиника / организация</Label>
              <Input id="organization" name="organization" autoComplete="organization" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea id="message" name="message" required rows={5} />
            </div>
            <p className="text-xs text-muted-foreground">
              Отправляя форму, вы соглашаетесь с{" "}
              <Link to="/privacy" className="underline underline-offset-2">
                обработкой данных
              </Link>{" "}
              для ответа на обращение.
            </p>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Отправка…" : "Отправить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  href,
  external,
  children,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
        {icon}
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 block font-medium text-foreground">{children}</span>
      </span>
    </>
  );
  const className =
    "flex items-start gap-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]";
  if (!href) return <li className={className}>{inner}</li>;
  return (
    <li>
      <a
        href={href}
        className={`${className} transition-shadow hover:shadow-[var(--shadow-border-hover)]`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    </li>
  );
}
