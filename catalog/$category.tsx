import { createFileRoute, notFound } from "@tanstack/react-router";
import { CatalogView } from "@/components/catalog-view";
import { getCategory, productsByCategory, type CategoryId } from "@/lib/catalog";

export const Route = createFileRoute("/_site/catalog/$category")({
  component: CategoryPage,
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { cat, count: productsByCategory(params.category as CategoryId).length };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.cat.name} — каталог AiMedTech`
          : "Каталог — AiMedTech",
      },
    ],
  }),
});

function CategoryPage() {
  const { cat, count } = Route.useLoaderData();
  return (
    <CatalogView
      categoryId={cat.id}
      title={cat.name}
      lead={`${cat.blurb}. В разделе ${count} позиций.`}
    />
  );
}
