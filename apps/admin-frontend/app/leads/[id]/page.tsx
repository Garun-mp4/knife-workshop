"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../../lib/api";
import { formatDateTime, leadStatusOptions, leadStatusText, leadTypeText } from "../../../lib/labels";

export default function Lead() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<any>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet(`/admin/leads/${id}`).then(setLead).catch((e) => setError(e instanceof Error ? e.message : "Не удалось загрузить заявку"));
  }, [id]);

  if (!lead) return <p className={error ? "error-text" : "muted"}>{error || "Загрузка…"}</p>;

  async function status(nextStatus: string) {
    setBusy(true);
    setError("");
    try {
      await apiSend(`/admin/leads/${id}/status`, "PATCH", { status: nextStatus });
      const next = await apiGet(`/admin/leads/${id}`);
      setLead(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить статус");
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (confirm("Удалить заявку?")) {
      await apiSend(`/admin/leads/${id}`, "DELETE");
      router.push("/leads");
    }
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Заявка от {formatDateTime(lead.createdAt)}</p>
          <h1>{lead.name}</h1>
          <p className="muted">{leadTypeText(lead.type)}</p>
        </div>
        <button className="btn btn-muted" type="button" onClick={() => router.push("/leads")}>
          К списку
        </button>
      </div>
      <div className="card detail-card">
        <dl className="admin-detail-list">
          <div>
            <dt>Телефон</dt>
            <dd>{lead.phone || "—"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{lead.email || "—"}</dd>
          </div>
          <div>
            <dt>Messenger</dt>
            <dd>{lead.messenger || "—"}</dd>
          </div>
          <div>
            <dt>Город</dt>
            <dd>{lead.city || "—"}</dd>
          </div>
          <div>
            <dt>Бюджет</dt>
            <dd>{lead.budget || "—"}</dd>
          </div>
          <div>
            <dt>Товар</dt>
            <dd>{lead.product?.title || "—"}</dd>
          </div>
        </dl>

        <div className="message-box">
          <strong>Сообщение клиента</strong>
          <p>{lead.message || "Клиент не оставил комментарий."}</p>
        </div>

        <label className="field">
          <span className="field__label">Статус заявки</span>
          <select className="input" value={lead.status} onChange={(event) => status(event.target.value)} disabled={busy}>
            {leadStatusOptions.map((item) => (
              <option key={item} value={item}>
                {leadStatusText(item)}
              </option>
            ))}
          </select>
          <span className="field__hint">Текущий статус: {leadStatusText(lead.status)}</span>
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="form-actions">
          <button className="btn btn-danger" type="button" onClick={del}>
            Удалить заявку
          </button>
          <button className="btn btn-muted" type="button" onClick={() => status("CLOSED")} disabled={busy}>
            Закрыть заявку
          </button>
        </div>
      </div>
    </div>
  );
}
