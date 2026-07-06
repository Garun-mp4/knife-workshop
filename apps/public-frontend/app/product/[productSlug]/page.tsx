import type { LeadType, ProductDto } from "@knife/shared";
import { productCta, statusLabel } from "@knife/shared";
import type { Metadata } from "next";
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
          {product.status === "SOLD" ? (
            <p className="card sold-note">Этот нож уже продан, но мастер может изготовить похожий под ваши пожелания.</p>
          ) : null}
          <LeadForm productId={product.id} type={leadType} title={productCta(product.status)} />
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
        </div>
      </section>
    </main>
  );
}
