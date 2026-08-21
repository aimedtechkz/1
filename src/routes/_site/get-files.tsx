import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_site/get-files")({
  component: GetFiles,
  head: () => ({
    meta: [{ title: "Скачать сайт для Plesk — AiMedTech" }],
  }),
});

export function GetFiles() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Хостинг hoster.kz
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Скачать файлы сайта</h1>
      <p className="mt-4 text-muted-foreground">
        Архив для панели Plesk. Распакуйте и загрузите все файлы в папку{" "}
        <strong className="text-foreground">httpdocs</strong> домена aimedtech.kz.
        Папку images на сервере не удаляйте.
      </p>
      <a
        href="/skachat.html"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Download className="size-5" />
        Скачать AiMedTech-sait.zip
      </a>
      <ol className="mt-10 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>
          Войдите в{" "}
          <a
            className="text-foreground underline"
            href="https://pkz27.hoster.kz:8443/"
            target="_blank"
            rel="noreferrer"
          >
            pkz27.hoster.kz:8443
          </a>
        </li>
        <li>Сайты и домены → aimedtech.kz → Файлы → httpdocs</li>
        <li>Сохраните старые файлы архивом. Папку images оставьте</li>
        <li>Загрузите сюда содержимое скачанного ZIP</li>
        <li>Откройте aimedtech.kz</li>
      </ol>
    </div>
  );
}