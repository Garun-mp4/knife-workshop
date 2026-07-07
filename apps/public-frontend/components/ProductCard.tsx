import type { ProductDto } from "@knife/shared";
import { productCta } from "@knife/shared";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({ product }: { product: ProductDto }) {
  const mainImage = product.images?.[0];
  const image = mainImage?.thumbUrl || mainImage?.mediumUrl;
  const imageAlt = mainImage?.alt || product.title;
  const price = product.price
    ? new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number(product.price))
    : null;

  return (
    <article className="card product-card">
      <Link className="product-card__media" href={`/product/${product.slug}`}>
        {image ? (
          <img src={image} alt={imageAlt} width={mainImage?.width ?? 400} height={mainImage?.height ?? 300} loading="lazy" />
        ) : (
          <span className="product-card__placeholder">Фото скоро</span>
        )}
      </Link>
      <div className="product-card__body">
        <StatusBadge status={product.status} />
        <h3>
          <Link href={`/product/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="product-card__meta">
          {product.category?.name ?? "Категория"} · {product.steel || "сталь по задаче"}
        </p>
        <strong className="price">
          {price ? `${product.pricePrefix ? `${product.pricePrefix} ` : ""}${price}` : "Цена по запросу"}
        </strong>
        {product.status === "IN_STOCK" ? (
          <AddToCartButton productId={product.id} className="btn-primary product-card__action" />
        ) : (
          <Link className="btn-secondary product-card__action" href={`/product/${product.slug}`}>
            {productCta(product.status)}
          </Link>
        )}
      </div>
    </article>
  );
}
