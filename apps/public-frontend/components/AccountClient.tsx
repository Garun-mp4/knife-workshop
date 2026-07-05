"use client";

import { isStaffRole, type AuthUser } from "@knife/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, userInitials } from "../lib/auth";

type Mode = "login" | "register";

export function AccountClient({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((next) => {
      if (active) {
        setUser(next);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function submit(formData: FormData) {
    setError("");
    setBusy(true);
    try {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const next = mode === "register"
        ? await registerUser({ name: String(formData.get("name") ?? ""), email, password })
        : await loginUser({ email, password });
      setUser(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось выполнить действие");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await logoutUser();
    setUser(null);
    setBusy(false);
  }

  if (!loaded) {
    return (
      <section className="section section--tight">
        <div className="container account-shell">
          <div className="card account-card">
            <p className="muted">Загрузка профиля...</p>
          </div>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="section section--tight">
        <div className="container account-shell">
          <div className="account-copy">
            <span className="section-kicker">Личный кабинет</span>
            <h1 className="page-title">Профиль</h1>
            <p className="page-copy">Сессия сохранена в защищенных cookies, поэтому повторный вход не нужен после обновления сайта.</p>
          </div>
          <div className="card account-card">
            <div className="account-profile-head">
              <span className="account-avatar" aria-hidden="true">
                {userInitials(user)}
              </span>
              <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <dl className="account-details">
              <div>
                <dt>Роль</dt>
                <dd>{user.role === "CUSTOMER" ? "Пользователь" : user.role}</dd>
              </div>
              <div>
                <dt>Доступ</dt>
                <dd>{isStaffRole(user.role) ? "Админ-панель доступна" : "Публичный аккаунт"}</dd>
              </div>
            </dl>
            <div className="account-actions">
              {isStaffRole(user.role) ? (
                <Link className="btn-primary" href="/admin/dashboard">
                  Открыть админ-панель
                </Link>
              ) : null}
              <button className="btn-secondary" type="button" onClick={logout} disabled={busy}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--tight">
      <div className="container account-shell">
        <div className="account-copy">
          <span className="section-kicker">Аккаунт</span>
          <h1 className="page-title">{mode === "register" ? "Регистрация" : "Вход"}</h1>
          <p className="page-copy">Войдите или создайте аккаунт, чтобы сайт запомнил вас между посещениями.</p>
        </div>
        <form action={submit} className="card account-card">
          <div className="account-tabs" role="tablist" aria-label="Режим аккаунта">
            <button className={mode === "login" ? "is-active" : ""} type="button" onClick={() => setMode("login")}>
              Войти
            </button>
            <button className={mode === "register" ? "is-active" : ""} type="button" onClick={() => setMode("register")}>
              Регистрация
            </button>
          </div>
          {mode === "register" ? <input className="input" name="name" placeholder="Имя" required minLength={2} /> : null}
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="password" type="password" placeholder="Пароль" required minLength={10} />
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? "Отправка..." : mode === "register" ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
}
