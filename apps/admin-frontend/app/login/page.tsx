"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend } from "../../lib/api";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    const payload = Object.fromEntries(formData.entries());
    try {
      await apiSend("/auth/login", "POST", payload);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form action={submit} className="card admin-form" style={{ width: "min(420px, 100%)" }}>
        <div>
          <p className="admin-topbar__label">Knife Admin</p>
          <h1>Вход в админку</h1>
          <p className="muted">Для сотрудников мастерской с ролью владельца, администратора или менеджера.</p>
        </div>
        <label className="field">
          <span className="field__label">Email</span>
          <input className="input" name="email" type="email" placeholder="admin@example.com…" required autoComplete="email" spellCheck={false} />
        </label>
        <label className="field">
          <span className="field__label">Пароль</span>
          <input className="input" name="password" type="password" placeholder="Минимум 10 символов…" required minLength={10} autoComplete="current-password" />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit">
          Войти
        </button>
      </form>
    </main>
  );
}
