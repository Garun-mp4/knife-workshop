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
      <h2>Фотографии</h2>
      <form action={upload} className="form-grid">
        <input className="input" type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
        <input className="input" name="alt" placeholder="Alt text" />
        <label>
          <input type="checkbox" name="isMain" />
          Сделать главным
        </label>
        <button className="btn" disabled={busy} type="submit">
          {busy ? "Загрузка..." : "Загрузить фото"}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
      </form>

      <div className="image-grid">
        {product.images?.map((img: any) => (
          <div className="card image-tile" key={img.id}>
            <div className="image-tile__preview">
              {img.thumbUrl ? <img src={img.thumbUrl} alt={img.alt || "Фото товара"} /> : null}
            </div>
            <p>{img.isMain ? "Главное" : "Фото"}</p>
            <div className="image-tile__actions">
              <button className="btn btn-muted" type="button" onClick={() => main(img.id)}>
                Главное
              </button>
              <button className="btn btn-danger" type="button" onClick={() => del(img.id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
