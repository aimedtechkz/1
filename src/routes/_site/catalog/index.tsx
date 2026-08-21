import { createFileRoute } from "@tanstack/react-router";
import { CatalogView } from "@/components/catalog-view";
import { PRODUCT_COUNT } from "@/lib/categories";

export const Route = createFileRoute("/_site/catalog/")({
  component: CatalogIndex,
  head: () => ({
    meta: [{ title: "Каталог оборудования — AiMedTech" }],
  }),
});

function CatalogIndex() {
  return (
    <CatalogView
      title="Каталог оборудования"
      lead={`Полная линейка: ${PRODUCT_COUNT} позиций. Цены и конфигурация — в коммерческом предложении.`}
    />
  );
}
