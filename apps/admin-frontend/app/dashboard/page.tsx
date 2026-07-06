import Link from "next/link";
import { apiGetServer } from "../../lib/server-api";
import { leadStatusText, leadTypeText, productStatusText } from "../../lib/labels";

export default async function Dashboard() {
  const [products, leads] = await Promise.all([
    apiGetServer<any[]>("/admin/products").catch(() => []),
    apiGetServer<any[]>("/admin/leads").catch(() => [])
  ]);
  const inStock = products.filter((product: any) => product.status === "IN_STOCK").length;
  const sold = products.filter((product: any) => product.status === "SOLD").length;
  const newLeads = leads.filter((lead: any) => lead.status === "NEW").length;
  const metrics = [
    ["Товаров", products.length],
    ["В наличии", inStock],
    ["Продано", sold],
    ["Новых заявок", newLeads]
  ];

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Рабочий день</p>
        <h1>Обзор мастерской</h1>
        <p className="muted">Быстрый контроль витрины, наличия и новых обращений клиентов.</p>
      </div>
      <div className="metric-grid">
        {metrics.map(([label, value]) => (
          <div className="card metric-card" key={label}>
            <p className="muted">{label}</p>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <section>
        <div className="section-row">
          <h2>Последние заявки</h2>
          <Link className="btn btn-muted" href="/leads">
            Все заявки
          </Link>
        </div>
        <div className="card table-card">
          {leads.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Контакт</th>
                  <th>Тип</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 6).map((lead: any) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.phone || lead.email || lead.messenger || "—"}</td>
                    <td>{leadTypeText(lead.type)}</td>
                    <td>
                      <span className="status-chip">{leadStatusText(lead.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-admin">
              <h2>Заявок пока нет</h2>
              <p className="muted">Когда клиент отправит форму с сайта, обращение появится здесь.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Состояние каталога</h2>
        <div className="card table-card">
          {products.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Статус</th>
                  <th>Категория</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map((product: any) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{productStatusText(product.status)}</td>
                    <td>{product.category?.name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-admin">
              <h2>Каталог пуст</h2>
              <p className="muted">Создайте первый товар и добавьте фотографии, чтобы витрина стала полезной.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
