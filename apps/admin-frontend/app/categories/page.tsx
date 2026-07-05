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
      <h1>Категории</h1>
      <form action={create} className="card admin-form admin-form--inline">
        <input className="input" name="name" placeholder="Название" required />
        <input className="input" name="slug" placeholder="slug" />
        <button className="btn" type="submit">
          Создать
        </button>
      </form>

      <div className="card table-card">
        <table className="table">
          <tbody>
            {items.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category._count?.products ?? 0} товаров</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
