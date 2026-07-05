import { ProductForm } from "../../../components/ProductForm";
import { apiGetServer } from "../../../lib/server-api";

export default async function NewProduct() {
  const categories = await apiGetServer<any[]>("/admin/categories").catch(() => []);

  return (
    <div className="page-stack">
      <h1>Новый товар</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
