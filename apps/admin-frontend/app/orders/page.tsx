import Link from "next/link";
import { formatDateTime, formatPrice, orderStatusText, paymentStatusText } from "../../lib/labels";
import { apiGetServer } from "../../lib/server-api";

export default async function Orders() {
  const orders = await apiGetServer<any[]>("/admin/orders").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Продажи</p>
        <h1>Заказы</h1>
        <p className="muted">Покупки из корзины, онлайн-оплата и дальнейшая ручная работа с доставкой.</p>
      </div>
      <div className="card table-card">
        {orders.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Заказ</th>
                <th>Клиент</th>
                <th>Состав</th>
                <th>Оплата</th>
                <th>Сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/orders/${order.id}`}>{order.id.slice(0, 8)}</Link>
                    <p className="table-note">{orderStatusText(order.status)}</p>
                  </td>
                  <td>{order.customerName}<p className="table-note">{order.phone || order.email}</p></td>
                  <td>{order.items.map((item: any) => item.title).join(", ")}</td>
                  <td>{paymentStatusText(order.payments?.[0]?.status)}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Заказов пока нет</h2>
            <p className="muted">Когда клиент оплатит товар через корзину, заказ появится здесь.</p>
          </div>
        )}
      </div>
    </div>
  );
}
