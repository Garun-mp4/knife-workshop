"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";
import { formatDateTime } from "../../lib/labels";

export default function Reviews() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const load = () => apiGet<any[]>("/admin/reviews").then(setItems);

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Не удалось загрузить отзывы"));
  }, []);

  async function publish(id: string, isPublished: boolean) {
    setError("");
    try {
      await apiSend(`/admin/reviews/${id}`, "PATCH", { isPublished });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить отзыв");
    }
  }

  async function del(id: string) {
    if (!confirm("Удалить отзыв?")) return;
    await apiSend(`/admin/reviews/${id}`, "DELETE");
    await load();
  }

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Доверие</p>
        <h1>Отзывы</h1>
        <p className="muted">Отзывы приходят от покупателей после оплаты товара. Здесь их можно опубликовать или скрыть.</p>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="card table-card">
        {items.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Товар</th>
                <th>Текст</th>
                <th>Оценка</th>
                <th>Дата</th>
                <th>Публикация</th>
              </tr>
            </thead>
            <tbody>
              {items.map((review) => (
                <tr key={review.id}>
                  <td>{review.clientName}<p className="table-note">{review.city || review.user?.email || "—"}</p></td>
                  <td>{review.product?.title || "—"}</td>
                  <td>{review.text}</td>
                  <td>{review.rating ?? "—"}</td>
                  <td>{formatDateTime(review.createdAt)}</td>
                  <td>
                    <div className="inline-actions">
                      <button className={review.isPublished ? "btn btn-muted" : "btn"} type="button" onClick={() => publish(review.id, !review.isPublished)}>
                        {review.isPublished ? "Скрыть" : "Опубликовать"}
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => del(review.id)}>Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Отзывов пока нет</h2>
            <p className="muted">После оплаченных заказов покупатели смогут отправлять отзывы из профиля.</p>
          </div>
        )}
      </div>
    </div>
  );
}
