import { apiGetServer } from "../../lib/server-api";

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
      <h1>Dashboard</h1>
      <div className="metric-grid">
        {metrics.map(([label, value]) => (
          <div className="card metric-card" key={label}>
            <p className="muted">{label}</p>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <section>
        <h2>Последние заявки</h2>
        <div className="card table-card">
          <table className="table">
            <tbody>
              {leads.slice(0, 6).map((lead: any) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone || lead.email}</td>
                  <td>{lead.type}</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
