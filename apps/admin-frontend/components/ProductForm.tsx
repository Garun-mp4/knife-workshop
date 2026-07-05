"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../lib/api";

const statuses = ["DRAFT", "IN_STOCK", "MADE_TO_ORDER", "SOLD", "HIDDEN", "COMING_SOON", "ARCHIVED"];
const materialFields = ["purpose", "steel", "handleMaterial", "sheathMaterial", "equipment", "certificateText"];
const numericFields = [
  "bladeLengthMm",
  "totalLengthMm",
  "spineThicknessMm",
  "weightGrams",
  "hardnessHrc",
  "productionTimeDays",
  "sortOrder"
];

export function ProductForm({ product, categories }: { product?: any; categories: any[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function save(formData: FormData) {
    setError("");
    const payload: any = Object.fromEntries(formData.entries());

    for (const key of Object.keys(payload)) {
      if (payload[key] === "") delete payload[key];
    }

    payload.engravingAvailable = payload.engravingAvailable === "on";
    payload.isFeatured = payload.isFeatured === "on";

    for (const key of ["bladeLengthMm", "totalLengthMm", "weightGrams", "productionTimeDays", "sortOrder"]) {
      if (payload[key]) payload[key] = Number(payload[key]);
    }

    try {
      const saved = await apiSend<any>(
        product ? `/admin/products/${product.id}` : "/admin/products",
        product ? "PATCH" : "POST",
        payload
      );
      router.push(`/products/${saved.id}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <form action={save} className="card admin-form">
      {error ? <p className="error-text">{error}</p> : null}

      <div className="form-grid form-grid--2">
        <input className="input" name="title" placeholder="Название" defaultValue={product?.title} required />
        <input className="input" name="slug" placeholder="Slug" defaultValue={product?.slug} />
      </div>

      <div className="form-grid form-grid--2">
        <select className="input" name="categoryId" defaultValue={product?.category?.id || ""}>
          <option value="">Без категории</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select className="input" name="status" defaultValue={product?.status || "DRAFT"}>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="form-grid form-grid--3">
        <input className="input" name="price" placeholder="Цена" defaultValue={product?.price ?? ""} />
        <input className="input" name="oldPrice" placeholder="Старая цена" defaultValue={product?.oldPrice ?? ""} />
        <input className="input" name="pricePrefix" placeholder="Префикс" defaultValue={product?.pricePrefix ?? ""} />
      </div>

      <textarea
        className="input"
        name="shortDescription"
        placeholder="Краткое описание"
        defaultValue={product?.shortDescription ?? ""}
      />
      <textarea
        className="input"
        name="description"
        placeholder="Полное описание"
        rows={6}
        defaultValue={product?.description ?? ""}
      />

      <div className="form-grid form-grid--3">
        {materialFields.map((key) => (
          <input key={key} className="input" name={key} placeholder={key} defaultValue={product?.[key] ?? ""} />
        ))}
      </div>

      <div className="form-grid form-grid--4">
        {numericFields.map((key) => (
          <input key={key} className="input" name={key} placeholder={key} defaultValue={product?.[key] ?? ""} />
        ))}
      </div>

      <div className="form-grid form-grid--2">
        <label>
          <input type="checkbox" name="engravingAvailable" defaultChecked={product?.engravingAvailable} />
          Гравировка доступна
        </label>
        <label>
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          Избранный товар
        </label>
      </div>

      <input className="input" name="seoTitle" placeholder="SEO title" defaultValue={product?.seoTitle ?? ""} />
      <input
        className="input"
        name="seoDescription"
        placeholder="SEO description"
        defaultValue={product?.seoDescription ?? ""}
      />

      <button className="btn" type="submit">
        Сохранить
      </button>
    </form>
  );
}
