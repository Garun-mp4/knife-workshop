import { apiGetServer } from "../../lib/server-api";
import { formatDateTime } from "../../lib/labels";

export default async function AuditLog() {
  const logs = await apiGetServer<any[]>("/admin/audit-log").catch(() => []);

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Безопасность</p>
        <h1>Журнал действий</h1>
        <p className="muted">Последние изменения в товарах, заявках, изображениях и настройках.</p>
      </div>
      <div className="card table-card">
        {logs.length ? (
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
                  <td>{formatDateTime(log.createdAt)}</td>
                  <td>{log.user?.email || "—"}</td>
                  <td>{log.action}</td>
                  <td>
                    {log.entity} {log.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Записей пока нет</h2>
            <p className="muted">Действия сотрудников появятся здесь после первых изменений.</p>
          </div>
        )}
      </div>
    </div>
  );
}
