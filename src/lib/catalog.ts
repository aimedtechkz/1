import productsJson from "@/data/products.json";
import { getCategory, type CategoryId } from "@/lib/categories";

export type { CategoryId };
export { CATEGORIES, getCategory, PRODUCT_COUNT } from "@/lib/categories";

export type Product = {
  id: string;
  slug: string;
  category: CategoryId;
  title: string;
  titleOriginal: string | null;
  excerpt: string;
  description: string;
  image: string;
  imageFile: string;
  alt: string;
  featured: boolean;
};

export const products = productsJson as Product[];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byCategory = new Map<CategoryId, Product[]>();
for (const p of products) {
  const list = byCategory.get(p.category) ?? [];
  list.push(p);
  byCategory.set(p.category, list);
}

export function getProduct(slug: string) {
  return bySlug.get(slug);
}

export function productsByCategory(id: CategoryId) {
  return byCategory.get(id) ?? [];
}

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function searchProducts(query: string, category?: CategoryId | "all") {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (category && category !== "all" && p.category !== category) return false;
    if (!q) return true;
    const catName = getCategory(p.category)?.name ?? "";
    const hay = `${p.title} ${p.titleOriginal ?? ""} ${p.excerpt} ${p.description} ${catName} ${p.imageFile}`.toLowerCase();
    return hay.includes(q);
  });
}

export type SortId = "relevance" | "name" | "category";

export function sortProducts(list: Product[], sort: SortId): Product[] {
  const copy = [...list];
  if (sort === "name") {
    copy.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  } else if (sort === "category") {
    copy.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.title.localeCompare(b.title, "ru"),
    );
  }
  return copy;
}

export function parseDescription(description: string) {
  const match = description.split(/Характеристики:\s*/i);
  const body = (match[0] ?? "").trim();
  const specLine = (match[1] ?? "").trim();
  const specs = specLine
    ? specLine
        .split(/[;•]|(?:,\s+)(?=[А-ЯA-Z0-9])/)
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length > 1 && s.length < 80)
    : [];
  return { body, specs };
}

export const PAGE_SIZE = 12;
