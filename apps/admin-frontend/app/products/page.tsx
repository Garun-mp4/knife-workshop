import Link from "next/link";
import { apiGetServer } from "../../lib/server-api";

export default async function Products() {
  const products = await apiGetServer<any[]>("/admin/products").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <h1>Товары</h1>
        <Link className="btn" href="/products/new">
          Новый товар
        </Link>
      </div>

      <div className="card table-card">
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
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <Link href={`/products/${product.id}`}>{product.title}</Link>
                </td>
                <td>{product.status}</td>
                <td>{product.price || "—"}</td>
                <td>{new Date(product.updatedAt).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
