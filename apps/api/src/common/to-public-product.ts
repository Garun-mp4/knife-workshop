import { Product } from "@prisma/client";

type ProductWithRelations = Product & { category?: any; images?: any[] };
const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT ?? "http://localhost:9000";
const bucket = process.env.S3_BUCKET ?? "knife-workshop-media";

function url(key?: string | null) {
  return key ? `${publicEndpoint}/${bucket}/${key}` : null;
}

export function toPublicProduct(product: ProductWithRelations) {
  return {
    ...product,
    price: product.price?.toString() ?? null,
    oldPrice: product.oldPrice?.toString() ?? null,
    spineThicknessMm: product.spineThicknessMm?.toString() ?? null,
    hardnessHrc: product.hardnessHrc?.toString() ?? null,
    images: (product.images ?? [])
      .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        alt: image.alt,
        isMain: image.isMain,
        sortOrder: image.sortOrder,
        originalName: image.originalName,
        largeUrl: url(image.largeKey ?? image.originalKey),
        mediumUrl: url(image.mediumKey ?? image.originalKey),
        thumbUrl: url(image.thumbKey ?? image.originalKey),
        placeholderUrl: url(image.placeholderKey),
        width: image.width,
        height: image.height
      }))
  };
}
