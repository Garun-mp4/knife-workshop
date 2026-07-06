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
      <div className="page-intro-admin">
        <p className="eyebrow">Витрина</p>
        <h1>{product.title}</h1>
        <p className="muted">Редактирование карточки, характеристик, публикации и фотографий.</p>
      </div>
      <ProductForm product={product} categories={categories} />
      <ImageManager product={product} />
    </div>
  );
}
