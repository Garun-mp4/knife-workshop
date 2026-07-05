import Link from "next/link";
import { ProductCard } from "../../components/ProductCard";
import { apiGet, type ProductList } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Каталог", description: "Каталог ножей ручной работы" };

export default async function Catalog({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const query = new URLSearchParams(params).toString();
  const data = await apiGet<ProductList>(`/public/products${query ? `?${query}` : ""}`).catch(() => ({
    items: [],
    meta: { page: 1, limit: 12, total: 0, pages: 0 }
  }));

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <p className="section-kicker">Каталог</p>
          <h1 className="page-title">Готовые изделия и работы под похожий заказ</h1>
          <p className="page-copy">
            Используйте поиск по названию, стали или описанию. По каждому изделию можно уточнить наличие, цену и
            возможность похожего заказа.
          </p>
        </div>
        <form className="filter-form">
          <input
            className="input"
            name="search"
            placeholder="Поиск по названию, стали, описанию"
            defaultValue={params.search}
          />
          <select className="input" name="sort" defaultValue={params.sort}>
            <option value="">Новые</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
            <option value="featured">Избранные</option>
          </select>
          <button className="btn-primary" type="submit">
            Показать
          </button>
        </form>
        {data.items.length ? (
          <div className="grid-products">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ backgroundImage: `url(${SITE_IMAGES.emptyCatalog})` }}>
            <h2>Каталог пока пуст</h2>
            <p className="muted">Попробуйте изменить фильтры или оставьте заявку на индивидуальный заказ.</p>
            <div className="action-row">
              <Link className="btn-primary" href="/custom-order">
                Обсудить заказ
              </Link>
              <Link className="btn-secondary" href="/portfolio">
                Портфолио работ
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
