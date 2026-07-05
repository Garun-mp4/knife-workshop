import Link from "next/link";
import { ProductCard } from "../../components/ProductCard";
import { apiGet, type ProductList } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Портфолио проданных работ" };

export default async function Portfolio() {
  const data = await apiGet<ProductList>("/public/products?status=SOLD&limit=50").catch(() => ({
    items: [],
    meta: { page: 1, limit: 50, total: 0, pages: 0 }
  }));

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <p className="section-kicker">Портфолио</p>
          <h1 className="page-title">Проданные работы как ориентир для нового заказа</h1>
          <p className="page-copy">
            Эти изделия уже нашли владельцев. Можно обсудить похожий нож с другими материалами, размерами или
            упаковкой.
          </p>
        </div>
        {data.items.length ? (
          <div className="grid-products">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ backgroundImage: `url(${SITE_IMAGES.portfolioSold})` }}>
            <h2>Портфолио скоро появится</h2>
            <p className="muted">Пока можно отправить пожелания и обсудить похожее изделие напрямую с мастером.</p>
            <div className="action-row">
              <Link className="btn-primary" href="/custom-order">
                Обсудить похожий нож
              </Link>
              <Link className="btn-secondary" href="/catalog">
                В каталог
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
