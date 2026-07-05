"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../../lib/api";

const statuses = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "WAITING_PAYMENT",
  "ACCEPTED",
  "IN_PRODUCTION",
  "READY",
  "SHIPPED",
  "CLOSED",
  "CANCELLED"
];

export default function Lead() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<any>();

  useEffect(() => {
    apiGet(`/admin/leads/${id}`).then(setLead);
  }, [id]);

  if (!lead) return <p className="muted">Загрузка...</p>;

  async function status(nextStatus: string) {
    await apiSend(`/admin/leads/${id}/status`, "PATCH", { status: nextStatus });
    const next = await apiGet(`/admin/leads/${id}`);
    setLead(next);
  }

  async function del() {
    if (confirm("Удалить заявку?")) {
      await apiSend(`/admin/leads/${id}`, "DELETE");
      router.push("/leads");
    }
  }

  return (
    <div className="page-stack">
      <h1>Заявка: {lead.name}</h1>
      <div className="card detail-card">
        <p>Телефон: {lead.phone || "—"}</p>
        <p>Email: {lead.email || "—"}</p>
        <p>Messenger: {lead.messenger || "—"}</p>
        <p>Товар: {lead.product?.title || "—"}</p>
        <p>Сообщение: {lead.message || "—"}</p>
        <select className="input" value={lead.status} onChange={(event) => status(event.target.value)}>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="btn btn-danger" type="button" onClick={del}>
          Удалить
        </button>
      </div>
    </div>
  );
}
