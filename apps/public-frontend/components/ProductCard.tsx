import type { ProductDto } from "@knife/shared";
import { productCta } from "@knife/shared";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({ product }: { product: ProductDto }) {
  const image = product.images?.[0]?.thumbUrl || product.images?.[0]?.mediumUrl;
  const imageAlt = product.images?.[0]?.alt || product.title;

  return (
    <article className="card product-card">
      <Link className="product-card__media" href={`/product/${product.slug}`}>
        {image ? <img src={image} alt={imageAlt} /> : <span className="product-card__placeholder">Фото скоро</span>}
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
          {product.price ? `${product.pricePrefix ? `${product.pricePrefix} ` : ""}${product.price} ₽` : "Цена по запросу"}
        </strong>
        <Link className="btn-secondary product-card__action" href={`/product/${product.slug}`}>
          {productCta(product.status)}
        </Link>
      </div>
    </article>
  );
}
