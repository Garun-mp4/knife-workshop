import Link from "next/link";
import { formatDateTime, leadStatusText, leadTypeText } from "../../lib/labels";
import { apiGetServer } from "../../lib/server-api";

export default async function Leads() {
  const leads = await apiGetServer<any[]>("/admin/leads").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Клиенты</p>
        <h1>Заявки</h1>
        <p className="muted">Все обращения с публичных форм. Новые заявки лучше разбирать сверху вниз.</p>
      </div>
      <div className="card table-card">
        {leads.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Контакт</th>
                <th>Тип</th>
                <th>Товар</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/leads/${lead.id}`}>{lead.name}</Link>
                  </td>
                  <td>{lead.phone || lead.email || lead.messenger || "—"}</td>
                  <td>{leadTypeText(lead.type)}</td>
                  <td>{lead.product?.title || "—"}</td>
                  <td>
                    <span className="status-chip">{leadStatusText(lead.status)}</span>
                  </td>
                  <td>{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Заявок пока нет</h2>
            <p className="muted">Отправьте тестовую форму с публичного сайта или дождитесь первого обращения клиента.</p>
          </div>
        )}
      </div>
    </div>
  );
}
