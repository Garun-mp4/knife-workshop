"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";

const fields = [
  ["workshopName", "Название мастерской", "Knife Workshop…"],
  ["phone", "Телефон", "+7 999 000-00-00…"],
  ["telegram", "Telegram", "@knife_workshop…"],
  ["whatsapp", "WhatsApp", "+79990000000…"],
  ["email", "Email", "hello@example.com…"],
  ["city", "Город", "Астрахань…"],
  ["heroTitle", "Заголовок главной", "Ножи ручной работы…"],
  ["heroSubtitle", "Подзаголовок главной", "Каталог, портфолио и заказы…"],
  ["guaranteeText", "Текст гарантии", "Что получает клиент после покупки…"],
  ["deliveryText", "Текст доставки", "Как обсуждаются сроки и оплата…"],
  ["cartDeliveryText", "Текст доставки в корзине", "Что клиент должен знать перед оплатой товара…"]
] as const;

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
      <div className="page-intro-admin">
        <p className="eyebrow">Публичный сайт</p>
        <h1>Настройки сайта</h1>
        <p className="muted">Контакты и тексты, которые клиент видит на ключевых страницах.</p>
      </div>
      <form action={save} className="card admin-form">
        <div className="form-grid form-grid--2">
          {fields.map(([field, label, placeholder]) => (
            <label className="field" key={field}>
              <span className="field__label">{label}</span>
              <input className="input" name={field} placeholder={placeholder} defaultValue={site[field] ?? ""} />
            </label>
          ))}
        </div>
        {saved ? <p className="success-text" aria-live="polite">Изменения сохранены.</p> : null}
        <button className="btn" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
}
