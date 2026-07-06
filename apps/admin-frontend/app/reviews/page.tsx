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
      <div className="page-intro-admin">
        <p className="eyebrow">Доверие</p>
        <h1>Отзывы</h1>
        <p className="muted">Публикуйте только проверенные отзывы клиентов с понятным городом и оценкой.</p>
      </div>
      <form action={create} className="card admin-form">
        <div className="form-grid form-grid--2">
          <label className="field">
            <span className="field__label">Клиент</span>
            <input className="input" name="clientName" placeholder="Алексей…" required />
          </label>
          <label className="field">
            <span className="field__label">Город</span>
            <input className="input" name="city" placeholder="Москва…" />
          </label>
        </div>
        <label className="field">
          <span className="field__label">Текст отзыва</span>
          <textarea className="input" name="text" placeholder="Что клиент отметил в работе…" required />
        </label>
        <label className="field">
          <span className="field__label">Оценка</span>
          <input className="input" name="rating" type="number" min="1" max="5" step="1" placeholder="5…" />
        </label>
        <label className="check-row">
          <input type="checkbox" name="isPublished" />
          <span>Опубликовать на сайте</span>
        </label>
        <button className="btn" type="submit">
          Добавить
        </button>
      </form>

      <div className="card table-card">
        {items.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Город</th>
                <th>Оценка</th>
                <th>Публикация</th>
              </tr>
            </thead>
            <tbody>
              {items.map((review) => (
                <tr key={review.id}>
                  <td>{review.clientName}</td>
                  <td>{review.city || "—"}</td>
                  <td>{review.rating ?? "—"}</td>
                  <td>{review.isPublished ? "Опубликован" : "Скрыт"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Отзывов пока нет</h2>
            <p className="muted">Добавьте первый отзыв после согласования текста с клиентом.</p>
          </div>
        )}
      </div>
    </div>
  );
}
