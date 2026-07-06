"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../lib/api";

export function ImageManager({ product }: { product: any }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await apiSend(`/admin/products/${product.id}/images`, "POST", formData);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Фото будет удалено из товара, базы данных и файлового хранилища. Продолжить?")) return;
    await apiSend(`/admin/products/${product.id}/images/${id}`, "DELETE");
    router.refresh();
  }

  async function main(id: string) {
    await apiSend(`/admin/products/${product.id}/images/${id}/main`, "PATCH");
    router.refresh();
  }

  return (
    <section className="card admin-form">
      <div>
        <h2>Фотографии</h2>
        <p className="muted">Главное фото попадает в карточку каталога. Остальные видны в галерее товара.</p>
      </div>
      <form action={upload} className="form-grid">
        <label className="field">
          <span className="field__label">Файл</span>
          <input className="input" type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
          <span className="field__hint">JPEG, PNG или WebP до лимита, заданного в API.</span>
        </label>
        <label className="field">
          <span className="field__label">Описание изображения</span>
          <input className="input" name="alt" placeholder="Шеф-нож из Х12МФ на деревянном столе…" />
        </label>
        <label className="check-row">
          <input type="checkbox" name="isMain" />
          <span>Сделать главным фото</span>
        </label>
        <button className="btn" disabled={busy} type="submit">
          {busy ? "Загружаем…" : "Загрузить фото"}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
      </form>

      {product.images?.length ? (
        <div className="image-grid">
          {product.images.map((img: any) => (
            <div className="card image-tile" key={img.id}>
              <div className="image-tile__preview">
                {img.thumbUrl ? <img src={img.thumbUrl} alt={img.alt || "Фото товара"} width={180} height={180} /> : null}
              </div>
              <p>
                <span className="status-chip">{img.isMain ? "Главное фото" : "Галерея"}</span>
              </p>
              <div className="image-tile__actions">
                {!img.isMain ? (
                  <button className="btn btn-muted" type="button" onClick={() => main(img.id)}>
                    Сделать главным
                  </button>
                ) : null}
                <button className="btn btn-danger" type="button" onClick={() => del(img.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-admin empty-admin--compact">
          <h2>Фотографий пока нет</h2>
          <p className="muted">Без фото товар выглядит незавершенным в каталоге.</p>
        </div>
      )}
    </section>
  );
}
