"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../lib/api";
import { productStatusOptions, productStatusText } from "../lib/labels";

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export function ProductForm({ product, categories }: { product?: any; categories: any[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(formData: FormData) {
    setError("");
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={save} className="card admin-form">
      {error ? <p className="error-text">{error}</p> : null}

      <fieldset className="form-section">
        <legend>Основное</legend>
        <div className="form-grid form-grid--2">
          <Field label="Название">
            <input
              className="input"
              name="title"
              placeholder="Например, шеф-нож из Х12МФ…"
              defaultValue={product?.title}
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Slug" hint="Можно оставить пустым: API сформирует адрес автоматически.">
            <input className="input" name="slug" placeholder="shef-nozh-h12mf…" defaultValue={product?.slug} autoComplete="off" />
          </Field>
        </div>

        <div className="form-grid form-grid--2">
          <Field label="Категория">
            <select className="input" name="categoryId" defaultValue={product?.category?.id || ""}>
              <option value="">Без категории</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Статус" hint="RESERVED ставится автоматически во время оплаты. Публично видны только товары в наличии, под заказ, проданные и скоро.">
            <select className="input" name="status" defaultValue={product?.status || "DRAFT"}>
              {productStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {productStatusText(status)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Цена и описание</legend>
        <div className="form-grid form-grid--3">
          <Field label="Цена, ₽">
            <input className="input" name="price" inputMode="numeric" placeholder="14500…" defaultValue={product?.price ?? ""} />
          </Field>
          <Field label="Старая цена, ₽">
            <input className="input" name="oldPrice" inputMode="numeric" placeholder="16800…" defaultValue={product?.oldPrice ?? ""} />
          </Field>
          <Field label="Префикс цены">
            <input className="input" name="pricePrefix" placeholder="от…" defaultValue={product?.pricePrefix ?? ""} autoComplete="off" />
          </Field>
        </div>
        <Field label="Краткое описание" hint="Показывается в карточках и в первом экране товара.">
          <textarea
            className="input"
            name="shortDescription"
            placeholder="Коротко: назначение, материал, отличие…"
            defaultValue={product?.shortDescription ?? ""}
          />
        </Field>
        <Field label="Полное описание">
          <textarea
            className="input"
            name="description"
            placeholder="Подробности о геометрии, материалах, уходе и комплектации…"
            rows={6}
            defaultValue={product?.description ?? ""}
          />
        </Field>
      </fieldset>

      <fieldset className="form-section">
        <legend>Материалы и характеристики</legend>
        <div className="form-grid form-grid--3">
          <Field label="Назначение">
            <input className="input" name="purpose" placeholder="Кухня, поход, подарок…" defaultValue={product?.purpose ?? ""} />
          </Field>
          <Field label="Сталь">
            <input className="input" name="steel" placeholder="Х12МФ, 95Х18…" defaultValue={product?.steel ?? ""} />
          </Field>
          <Field label="Рукоять">
            <input className="input" name="handleMaterial" placeholder="Орех, стабилизированный клен…" defaultValue={product?.handleMaterial ?? ""} />
          </Field>
          <Field label="Ножны">
            <input className="input" name="sheathMaterial" placeholder="Натуральная кожа…" defaultValue={product?.sheathMaterial ?? ""} />
          </Field>
          <Field label="Комплектация">
            <input className="input" name="equipment" placeholder="Нож, ножны, памятка…" defaultValue={product?.equipment ?? ""} />
          </Field>
          <Field label="Срок изготовления, дней">
            <input className="input" name="productionTimeDays" type="number" min="0" step="1" defaultValue={product?.productionTimeDays ?? ""} />
          </Field>
        </div>
        <div className="form-grid form-grid--4">
          <Field label="Клинок, мм">
            <input className="input" name="bladeLengthMm" type="number" min="0" step="1" defaultValue={product?.bladeLengthMm ?? ""} />
          </Field>
          <Field label="Общая длина, мм">
            <input className="input" name="totalLengthMm" type="number" min="0" step="1" defaultValue={product?.totalLengthMm ?? ""} />
          </Field>
          <Field label="Обух, мм">
            <input className="input" name="spineThicknessMm" inputMode="decimal" placeholder="3.2…" defaultValue={product?.spineThicknessMm ?? ""} />
          </Field>
          <Field label="Вес, г">
            <input className="input" name="weightGrams" type="number" min="0" step="1" defaultValue={product?.weightGrams ?? ""} />
          </Field>
          <Field label="Твердость, HRC">
            <input className="input" name="hardnessHrc" inputMode="decimal" placeholder="59…" defaultValue={product?.hardnessHrc ?? ""} />
          </Field>
          <Field label="Порядок сортировки">
            <input className="input" name="sortOrder" type="number" step="1" defaultValue={product?.sortOrder ?? ""} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Публикация и документы</legend>
        <label className="check-row">
          <input type="checkbox" name="engravingAvailable" defaultChecked={product?.engravingAvailable} />
          <span>Гравировка доступна</span>
        </label>
        <label className="check-row">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          <span>Показывать в избранных работах на главной</span>
        </label>
        <Field label="Документы и сертификаты">
          <textarea
            className="input"
            name="certificateText"
            placeholder="Что можно предоставить клиенту по этому изделию…"
            defaultValue={product?.certificateText ?? ""}
          />
        </Field>
      </fieldset>

      <fieldset className="form-section">
        <legend>SEO</legend>
        <Field label="SEO title">
          <input className="input" name="seoTitle" placeholder="Заголовок в поиске…" defaultValue={product?.seoTitle ?? ""} />
        </Field>
        <Field label="SEO description">
          <input className="input" name="seoDescription" placeholder="Описание для поисковой выдачи…" defaultValue={product?.seoDescription ?? ""} />
        </Field>
      </fieldset>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Сохраняем…" : "Сохранить товар"}
        </button>
        <button className="btn btn-muted" type="button" onClick={() => router.push("/products")}>
          К списку товаров
        </button>
      </div>
    </form>
  );
}
