"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";
import { pageStatusText } from "../../lib/labels";

export default function Pages() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => apiGet<any[]>("/admin/pages").then(setItems);

  useEffect(() => {
    load();
  }, []);

  async function create(formData: FormData) {
    await apiSend("/admin/pages", "POST", Object.fromEntries(formData.entries()));
    load();
  }

  return (
    <div className="page-stack">
      <div className="page-intro-admin">
        <p className="eyebrow">Контент</p>
        <h1>Страницы</h1>
        <p className="muted">Юридические и служебные тексты, которые подставляются на публичный сайт.</p>
      </div>
      <form action={create} className="card admin-form">
        <div className="form-grid form-grid--2">
          <label className="field">
            <span className="field__label">Заголовок</span>
            <input className="input" name="title" placeholder="Доставка и оплата…" required />
          </label>
          <label className="field">
            <span className="field__label">Slug</span>
            <input className="input" name="slug" placeholder="delivery-payment…" required autoComplete="off" />
          </label>
        </div>
        <label className="field">
          <span className="field__label">Содержание</span>
          <textarea className="input" name="content" placeholder="Основной текст страницы…" required />
        </label>
        <label className="field">
          <span className="field__label">Статус</span>
          <select className="input" name="status">
            <option value="PUBLISHED">{pageStatusText("PUBLISHED")}</option>
            <option value="DRAFT">{pageStatusText("DRAFT")}</option>
            <option value="HIDDEN">{pageStatusText("HIDDEN")}</option>
          </select>
        </label>
        <button className="btn" type="submit">
          Создать
        </button>
      </form>

      <div className="card table-card">
        {items.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Slug</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {items.map((page) => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>{page.slug}</td>
                  <td>{pageStatusText(page.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-admin">
            <h2>Страниц пока нет</h2>
            <p className="muted">Создайте текст для доставки, документов или политики конфиденциальности.</p>
          </div>
        )}
      </div>
    </div>
  );
}
