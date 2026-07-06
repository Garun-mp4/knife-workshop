import Link from "next/link";
import { formatDateTime, formatPrice, productStatusText } from "../../lib/labels";
import { apiGetServer } from "../../lib/server-api";

export default async function Products() {
  const products = await apiGetServer<any[]>("/admin/products").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Витрина</p>
          <h1>Товары</h1>
          <p className="muted">Управляйте тем, что видно клиентам в каталоге и портфолио.</p>
        </div>
        <Link className="btn" href="/products/new">
          Новый товар
        </Link>
      </div>

      <div className="card table-card">
        {products.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Цена</th>
                <th>Обновлен</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id}>
                  <td>
                    {product.images?.[0]?.thumbUrl ? (
                      <img
                        src={product.images[0].thumbUrl}
                        alt={product.images[0].alt || product.title}
                        width={56}
                        height={56}
                        className="table-thumb"
                      />
                    ) : (
                      <span className="table-thumb table-thumb--empty">Нет фото</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/products/${product.id}`}>{product.title}</Link>
                    <p className="table-note">{product.category?.name || "Без категории"}</p>
                  </td>
                  <td>
                    <span className="status-chip">{productStatusText(product.status)}</span>
                  </td>
                  <td>{formatPrice(product.price, product.pricePrefix)}</td>
                  <td>{formatDateTime(product.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Товаров пока нет</h2>
            <p className="muted">Создайте первый товар, добавьте статус, цену и фотографии для каталога.</p>
            <Link className="btn" href="/products/new">
              Создать товар
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
