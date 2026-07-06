import type { ProductDto } from "@knife/shared";

export function ProductGallery({ product }: { product: ProductDto }) {
  const images = product.images ?? [];
  const mainImage = images[0];

  return (
    <div className="gallery">
      <div className="card media-frame gallery-main">
        {mainImage ? (
          <img
            src={mainImage.largeUrl || mainImage.mediumUrl || ""}
            alt={mainImage.alt || product.title}
            width={mainImage.width ?? 1200}
            height={mainImage.height ?? 900}
          />
        ) : (
          <span className="product-card__placeholder">Фото изделия готовится</span>
        )}
      </div>
      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.slice(1).map((img) => (
            <div key={img.id} className="card gallery-thumb">
              <img
                src={img.thumbUrl || img.mediumUrl || ""}
                alt={img.alt || product.title}
                width={img.width ?? 400}
                height={img.height ?? 400}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
