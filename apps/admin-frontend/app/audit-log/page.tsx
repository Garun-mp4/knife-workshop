import { apiGetServer } from "../../lib/server-api";

export default async function AuditLog() {
  const logs = await apiGetServer<any[]>("/admin/audit-log").catch(() => []);

  return (
    <div className="page-stack">
      <h1>Audit log</h1>
      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Пользователь</th>
              <th>Действие</th>
              <th>Сущность</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString("ru-RU")}</td>
                <td>{log.user?.email || "—"}</td>
                <td>{log.action}</td>
                <td>
                  {log.entity} {log.entityId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
