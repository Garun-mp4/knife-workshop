import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.PUBLIC_SITE_URL ?? "http://localhost:8080"; return ["", "/catalog", "/gallery", "/cart", "/custom-order", "/about", "/delivery-payment", "/documents", "/contacts", "/privacy-policy"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); }
