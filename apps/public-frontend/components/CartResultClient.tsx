"use client";

import { orderStatusLabel, type OrderStatus } from "@knife/shared";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClientGet } from "../lib/api";

export function CartResultClient() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (orderId) apiClientGet<any>(`/account/orders/${orderId}`).then(setOrder).catch(() => setOrder(null));
  }, [orderId]);

  return (
    <section className="section section--tight">
      <div className="container page-intro">
        <p className="section-kicker">Оплата</p>
        <h1 className="page-title">Статус заказа обновится после подтверждения платежа</h1>
        <p className="page-copy">
          Если оплата прошла, ЮKassa отправит уведомление на сайт, а заказ появится в профиле как оплаченный.
        </p>
        {order ? (
          <div className="card empty-inline">
            <strong>Заказ {order.id}</strong>
            <p className="muted">Текущий статус: {orderStatusLabel[order.status as OrderStatus] ?? order.status}</p>
          </div>
        ) : null}
        <div className="action-row">
          <Link className="btn-primary" href="/account">Открыть профиль</Link>
          <Link className="btn-secondary" href="/catalog">Вернуться в каталог</Link>
        </div>
      </div>
    </section>
  );
}
