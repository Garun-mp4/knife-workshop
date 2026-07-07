"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../../lib/api";
import { formatDateTime, formatPrice, orderStatusOptions, orderStatusText, paymentStatusText } from "../../../lib/labels";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setOrder(await apiGet(`/admin/orders/${id}`));
  }

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Не удалось загрузить заказ"));
  }, [id]);

  async function status(nextStatus: string) {
    setBusy(true);
    setError("");
    try {
      await apiSend(`/admin/orders/${id}/status`, "PATCH", { status: nextStatus });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить статус");
    } finally {
      setBusy(false);
    }
  }

  if (!order) return <p className={error ? "error-text" : "muted"}>{error || "Загрузка…"}</p>;

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Заказ от {formatDateTime(order.createdAt)}</p>
          <h1>Заказ {order.id.slice(0, 8)}</h1>
          <p className="muted">{orderStatusText(order.status)} · {formatPrice(order.totalAmount)}</p>
        </div>
        <button className="btn btn-muted" type="button" onClick={() => router.push("/orders")}>К списку</button>
      </div>
      <div className="card detail-card">
        <dl className="admin-detail-list">
          <div><dt>Клиент</dt><dd>{order.customerName}</dd></div>
          <div><dt>Email</dt><dd>{order.email}</dd></div>
          <div><dt>Телефон</dt><dd>{order.phone || "—"}</dd></div>
          <div><dt>Telegram</dt><dd>{order.telegram || "—"}</dd></div>
          <div><dt>WhatsApp</dt><dd>{order.whatsapp || "—"}</dd></div>
          <div><dt>Город</dt><dd>{order.city || "—"}</dd></div>
          <div><dt>Адрес</dt><dd>{order.deliveryAddress || "—"}</dd></div>
          <div><dt>Комментарий</dt><dd>{order.deliveryComment || "—"}</dd></div>
          <div><dt>Платеж</dt><dd>{paymentStatusText(order.payments?.[0]?.status)}</dd></div>
        </dl>
        <div className="message-box">
          <strong>Состав заказа</strong>
          {order.items.map((item: any) => (
            <p key={item.id}>{item.title} · {formatPrice(item.price)} · количество {item.quantity}</p>
          ))}
        </div>
        <div className="message-box">
          <strong>Доставка</strong>
          <p>{order.deliveryText || "Доставка согласуется отдельно."}</p>
        </div>
        <label className="field">
          <span className="field__label">Статус заказа</span>
          <select className="input" value={order.status} onChange={(event) => status(event.target.value)} disabled={busy}>
            {orderStatusOptions.map((item) => <option key={item} value={item}>{orderStatusText(item)}</option>)}
          </select>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </div>
  );
}
