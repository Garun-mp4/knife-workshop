import Link from "next/link";
import { ProductCard } from "../../components/ProductCard";
import { apiGet, type ProductList } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Галерея работ" };

export default async function Gallery() {
  const data = await apiGet<ProductList>("/public/products?status=SOLD&limit=50").catch(() => ({
    items: [],
    meta: { page: 1, limit: 50, total: 0, pages: 0 }
  }));

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <p className="section-kicker">Галерея работ</p>
          <h1 className="page-title">Выполненные изделия как ориентир для нового заказа</h1>
          <p className="page-copy">
            Здесь собраны ножи, которые уже нашли владельцев. Их можно использовать как референс для формы, материалов,
            упаковки и гравировки в индивидуальном заказе.
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
            <h2>Галерея скоро появится</h2>
            <p className="muted">Пока можно отправить пожелания и обсудить похожее изделие напрямую с мастером.</p>
            <div className="action-row">
              <Link className="btn-primary" href="/custom-order">Обсудить похожий нож</Link>
              <Link className="btn-secondary" href="/catalog">В каталог</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
