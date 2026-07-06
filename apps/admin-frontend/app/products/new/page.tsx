import { ProductForm } from "../../../components/ProductForm";
import { apiGetServer } from "../../../lib/server-api";

export default async function NewProduct() {
  const categories = await apiGetServer<any[]>("/admin/categories").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Витрина</p>
        <h1>Новый товар</h1>
        <p className="muted">Заполните основу карточки. Фотографии можно добавить после сохранения товара.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
