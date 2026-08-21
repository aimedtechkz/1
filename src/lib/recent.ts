import { getProduct, type Product } from "@/lib/catalog";

const KEY = "aimedtech-recent";
const LIMIT = 8;

export function pushRecent(slug: string) {
  if (typeof window === "undefined") return;
  const prev = readSlugs().filter((s) => s !== slug);
  const next = [slug, ...prev].slice(0, LIMIT);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function getRecentProducts(): Product[] {
  return readSlugs()
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p));
}

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}
