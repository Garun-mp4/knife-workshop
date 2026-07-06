"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";

export default function Categories() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => apiGet<any[]>("/admin/categories").then(setItems).catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  async function create(formData: FormData) {
    await apiSend("/admin/categories", "POST", Object.fromEntries(formData.entries()));
    load();
  }

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Структура каталога</p>
        <h1>Категории</h1>
        <p className="muted">Категории помогают клиенту быстро понять назначение изделий.</p>
      </div>
      <form action={create} className="card admin-form admin-form--inline">
        <label className="field">
          <span className="field__label">Название</span>
          <input className="input" name="name" placeholder="Кухонные ножи…" required />
        </label>
        <label className="field">
          <span className="field__label">Slug</span>
          <input className="input" name="slug" placeholder="kuhonnye-nozhi…" autoComplete="off" />
        </label>
        <button className="btn" type="submit">
          Создать
        </button>
      </form>

      <div className="card table-card">
        {items.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Товары</th>
              </tr>
            </thead>
            <tbody>
              {items.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category._count?.products ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Категорий пока нет</h2>
            <p className="muted">Создайте первую категорию перед наполнением каталога.</p>
          </div>
        )}
      </div>
    </div>
  );
}
