import { ImageManager } from "../../../components/ImageManager";
import { ProductForm } from "../../../components/ProductForm";
import { apiGetServer } from "../../../lib/server-api";

export default async function ProductEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    apiGetServer<any>(`/admin/products/${id}`),
    apiGetServer<any[]>("/admin/categories").catch(() => [])
  ]);

  return (
    <div className="page-stack">
      <h1>Редактирование товара</h1>
      <ProductForm product={product} categories={categories} />
      <ImageManager product={product} />
    </div>
  );
}
