import type { LeadType, ProductDto } from "@knife/shared";
import { productCta, statusLabel } from "@knife/shared";
import type { Metadata } from "next";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { LeadForm } from "../../../components/LeadForm";
import { ProductGallery } from "../../../components/ProductGallery";
import { apiGet } from "../../../lib/api";

export async function generateMetadata({
  params
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await apiGet<ProductDto>(`/public/products/${productSlug}`).catch(() => null);
  return {
    title: product?.seoTitle || product?.title || "Товар",
    description: product?.seoDescription || product?.shortDescription || "Карточка изделия"
  };
}

export default async function ProductPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const product = await apiGet<ProductDto>(`/public/products/${productSlug}`);
  const reviews = await apiGet<any[]>(`/public/reviews?productId=${product.id}`).catch(() => []);
  const leadType: LeadType = product.status === "SOLD" ? "SIMILAR_ORDER" : "PRODUCT_ORDER";
  const price = product.price
    ? new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number(product.price))
    : null;
  const specs = [
    ["Назначение", product.purpose],
    ["Сталь", product.steel],
    ["Длина клинка", product.bladeLengthMm ? `${product.bladeLengthMm} мм` : null],
    ["Общая длина", product.totalLengthMm ? `${product.totalLengthMm} мм` : null],
    ["Толщина обуха", product.spineThicknessMm ? `${product.spineThicknessMm} мм` : null],
    ["Рукоять", product.handleMaterial],
    ["Ножны", product.sheathMaterial],
    ["Вес", product.weightGrams ? `${product.weightGrams} г` : null],
    ["Твёрдость", product.hardnessHrc ? `${product.hardnessHrc} HRC` : null],
    ["Срок", product.productionTimeDays ? `${product.productionTimeDays} дней` : "уточняется"],
    ["Гравировка", product.engravingAvailable ? "доступна" : "по согласованию"]
  ];

  return (
    <main className="section">
      <div className="container product-layout">
        <ProductGallery product={product} />
        <div className="split-copy">
          <p className="section-kicker">{statusLabel[product.status]}</p>
          <h1 className="page-title">{product.title}</h1>
          {product.shortDescription ? <p className="page-copy">{product.shortDescription}</p> : null}
          <strong className="price">
            {price ? `${product.pricePrefix ? `${product.pricePrefix} ` : ""}${price}` : "Цена по запросу"}
          </strong>
          {product.status === "IN_STOCK" ? (
            <div className="card product-buy-box">
              <h2>Можно оплатить онлайн</h2>
              <p className="muted">Добавьте изделие в корзину. Доставка будет согласована отдельно после оплаты товара.</p>
              <AddToCartButton productId={product.id} />
            </div>
          ) : (
            <>
              {product.status === "SOLD" ? (
                <p className="card sold-note">Этот нож уже продан, но мастер может изготовить похожий под ваши пожелания.</p>
              ) : null}
              <LeadForm productId={product.id} type={leadType} title={productCta(product.status)} />
            </>
          )}
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Описание</h2>
            <div className="prose-dark">
              <p>{product.description || "Описание изделия уточняется."}</p>
            </div>
          </div>
          <h2 className="section-title">Характеристики</h2>
          <div className="card spec-grid">
            {specs.map(([key, value]) => (
              <div key={key}>
                <strong>{key}</strong>
                <p className="muted">{value || "—"}</p>
              </div>
            ))}
          </div>
          <div className="section-head">
            <h2 className="section-title">Документы</h2>
            <p className="section-copy">
              {product.certificateText ||
                "При наличии предоставляется сертификат, экспертное заключение, декларация, отказное письмо или иной документ."}
            </p>
          </div>
          <div className="section-head">
            <h2 className="section-title">Отзывы покупателей</h2>
            <p className="section-copy">Отзывы появляются после покупки и модерации мастерской.</p>
          </div>
          {reviews.length ? (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <article className="card review-card" key={review.id}>
                  <div className="review-card__head">
                    <strong>{review.clientName}</strong>
                    <span>{review.rating ? `${review.rating}/5` : "Без оценки"}</span>
                  </div>
                  <p>{review.text}</p>
                  {review.city ? <span className="muted">{review.city}</span> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="card empty-inline">
              <p className="muted">У этого изделия пока нет опубликованных отзывов.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
