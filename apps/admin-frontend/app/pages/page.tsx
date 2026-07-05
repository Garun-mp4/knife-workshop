"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../lib/api";

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
      <h1>Страницы</h1>
      <form action={create} className="card admin-form">
        <div className="form-grid form-grid--2">
          <input className="input" name="title" placeholder="Title" required />
          <input className="input" name="slug" placeholder="slug" required />
        </div>
        <textarea className="input" name="content" placeholder="Content" required />
        <select className="input" name="status">
          <option>PUBLISHED</option>
          <option>DRAFT</option>
          <option>HIDDEN</option>
        </select>
        <button className="btn" type="submit">
          Создать
        </button>
      </form>

      <div className="card table-card">
        <table className="table">
          <tbody>
            {items.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>{page.slug}</td>
                <td>{page.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
