"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";

const fields = [
  "workshopName",
  "phone",
  "telegram",
  "whatsapp",
  "email",
  "city",
  "heroTitle",
  "heroSubtitle",
  "guaranteeText",
  "deliveryText"
];

export default function Settings() {
  const [site, setSite] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<any>("/admin/settings").then((settings) => setSite(settings.site ?? {}));
  }, []);

  async function save(formData: FormData) {
    await apiSend("/admin/settings", "PATCH", { site: Object.fromEntries(formData.entries()) });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <div className="page-stack">
      <h1>Настройки сайта</h1>
      <form action={save} className="card admin-form">
        <div className="form-grid form-grid--2">
          {fields.map((field) => (
            <input key={field} className="input" name={field} placeholder={field} defaultValue={site[field] ?? ""} />
          ))}
        </div>
        {saved ? <p className="muted">Изменения сохранены.</p> : null}
        <button className="btn" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
