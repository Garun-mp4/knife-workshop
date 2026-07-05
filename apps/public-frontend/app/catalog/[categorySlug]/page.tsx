import Link from "next/link";
import { ProductCard } from "../../../components/ProductCard";
import { apiGet, type ProductList } from "../../../lib/api";
import { SITE_IMAGES } from "../../../lib/images";

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams(sp).toString();
  const data = await apiGet<ProductList>(`/public/categories/${categorySlug}/products${query ? `?${query}` : ""}`).catch(
    () => ({ items: [], meta: { page: 1, limit: 12, total: 0, pages: 0 } })
  );

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <p className="section-kicker">Категория</p>
          <h1 className="page-title">Изделия в выбранной категории</h1>
          <p className="page-copy">Если подходящей работы нет в наличии, можно обсудить похожий нож под ваши задачи.</p>
        </div>
        {data.items.length ? (
          <div className="grid-products">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ backgroundImage: `url(${SITE_IMAGES.emptyCatalog})` }}>
            <h2>В этой категории пока нет работ</h2>
            <p className="muted">Оставьте заявку, если нужен нож с похожим назначением или материалами.</p>
            <div className="action-row">
              <Link className="btn-primary" href="/custom-order">
                Обсудить заказ
              </Link>
              <Link className="btn-secondary" href="/catalog">
                Весь каталог
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
