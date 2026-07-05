import Link from "next/link";
import { apiGetServer } from "../../lib/server-api";

export default async function Leads() {
  const leads = await apiGetServer<any[]>("/admin/leads").catch(() => []);

  return (
    <div className="page-stack">
      <h1>Заявки</h1>
      <div className="card table-card">
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
                <td>{lead.phone || lead.email || lead.messenger}</td>
                <td>{lead.type}</td>
                <td>{lead.product?.title || "—"}</td>
                <td>{lead.status}</td>
                <td>{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
