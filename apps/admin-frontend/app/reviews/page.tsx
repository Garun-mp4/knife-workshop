"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";

export default function Reviews() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => apiGet<any[]>("/admin/reviews").then(setItems);

  useEffect(() => {
    load();
  }, []);

  async function create(formData: FormData) {
    const payload: any = Object.fromEntries(formData.entries());
    payload.rating = payload.rating ? Number(payload.rating) : undefined;
    payload.isPublished = payload.isPublished === "on";
    await apiSend("/admin/reviews", "POST", payload);
    load();
  }

  return (
    <div className="page-stack">
      <h1>Отзывы</h1>
      <form action={create} className="card admin-form">
        <div className="form-grid form-grid--2">
          <input className="input" name="clientName" placeholder="Клиент" required />
          <input className="input" name="city" placeholder="Город" />
        </div>
        <textarea className="input" name="text" placeholder="Текст" required />
        <input className="input" name="rating" placeholder="Рейтинг 1-5" />
        <label>
          <input type="checkbox" name="isPublished" />
          Опубликован
        </label>
        <button className="btn" type="submit">
          Добавить
        </button>
      </form>

      <div className="card table-card">
        <table className="table">
          <tbody>
            {items.map((review) => (
              <tr key={review.id}>
                <td>{review.clientName}</td>
                <td>{review.city}</td>
                <td>{review.rating}</td>
                <td>{review.isPublished ? "да" : "нет"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
