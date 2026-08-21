import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/company";

export function WhatsappDock() {
  return (
    <a
      href={COMPANY.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-border-hover)] transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/90 active:scale-[0.96]"
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
