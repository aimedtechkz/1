import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  zoom = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  zoom?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        zoom && "group/img",
        className,
      )}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            zoom && "group-hover/img:scale-105",
            imgClassName,
          )}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-40 w-full items-center justify-center text-muted-foreground">
          <Package className="size-10 opacity-40" />
        </div>
      )}
    </div>
  );
}
