"use client";

import { isStaffRole, orderStatusLabel, type AuthUser, type OrderStatus } from "@knife/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClientGet, apiClientSend } from "../lib/api";
import { getCurrentUser, loginUser, logoutUser, registerUser, userInitials } from "../lib/auth";

type Mode = "login" | "register";

export function AccountClient({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviewItems, setReviewItems] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    getCurrentUser().then(async (next) => {
      if (active) {
        setUser(next);
        if (next) {
          setOrders(await apiClientGet<any[]>("/account/orders").catch(() => []));
          setReviewItems(await apiClientGet<any[]>("/account/reviews/eligible").catch(() => []));
        }
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
      setOrders(await apiClientGet<any[]>("/account/orders").catch(() => []));
      setReviewItems(await apiClientGet<any[]>("/account/reviews/eligible").catch(() => []));
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

  async function saveProfile(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      const payload = Object.fromEntries(formData.entries());
      const next = await apiClientSend<AuthUser>("/account/profile", "PATCH", payload);
      setUser(next);
      setEditing(false);
      window.dispatchEvent(new CustomEvent("auth-changed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить профиль");
    } finally {
      setBusy(false);
    }
  }

  async function uploadAvatar(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      const next = await apiClientSend<AuthUser>("/account/profile/avatar", "POST", formData);
      setUser(next);
      window.dispatchEvent(new CustomEvent("auth-changed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить фото");
    } finally {
      setBusy(false);
    }
  }

  async function createReview(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      const payload = Object.fromEntries(formData.entries());
      await apiClientSend("/account/reviews", "POST", { ...payload, rating: payload.rating ? Number(payload.rating) : undefined });
      setReviewItems(await apiClientGet<any[]>("/account/reviews/eligible").catch(() => []));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить отзыв");
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) {
    return (
      <section className="section section--tight">
        <div className="container account-shell">
          <div className="card account-card">
            <p className="muted">Загрузка профиля…</p>
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
            <p className="page-copy">Сайт запомнил вход в защищенных cookies, поэтому профиль останется доступен после обновления страницы.</p>
          </div>
          <div className="card account-card">
            <div className="account-profile-head">
              {user.avatarUrl ? (
                <img className="account-avatar account-avatar--image" src={user.avatarUrl} alt="" width={58} height={58} />
              ) : (
                <span className="account-avatar" aria-hidden="true">
                  {userInitials(user)}
                </span>
              )}
              <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <form action={uploadAvatar} className="avatar-upload">
              <input className="input" type="file" name="file" accept="image/png,image/jpeg,image/webp" />
              <button className="btn-secondary" type="submit" disabled={busy}>Обновить фото</button>
            </form>
            {error && !editing ? <p className="form-error">{error}</p> : null}
            {editing ? (
              <form action={saveProfile} className="profile-form">
                <label className="field"><span className="field__label">Имя</span><input className="input" name="name" defaultValue={user.name} required /></label>
                <label className="field"><span className="field__label">Телефон</span><input className="input" name="phone" type="tel" defaultValue={user.phone ?? ""} /></label>
                <label className="field"><span className="field__label">Telegram</span><input className="input" name="telegram" defaultValue={user.telegram ?? ""} /></label>
                <label className="field"><span className="field__label">WhatsApp</span><input className="input" name="whatsapp" defaultValue={user.whatsapp ?? ""} /></label>
                <label className="field"><span className="field__label">Город</span><input className="input" name="city" defaultValue={user.city ?? ""} /></label>
                <label className="field"><span className="field__label">Адрес доставки</span><textarea className="input" name="deliveryAddress" rows={3} defaultValue={user.deliveryAddress ?? ""} /></label>
                <label className="field"><span className="field__label">Комментарий к доставке</span><textarea className="input" name="deliveryComment" rows={3} defaultValue={user.deliveryComment ?? ""} /></label>
                {error ? <p className="form-error">{error}</p> : null}
                <div className="account-actions">
                  <button className="btn-primary" type="submit" disabled={busy}>Сохранить</button>
                  <button className="btn-secondary" type="button" onClick={() => setEditing(false)}>Отмена</button>
                </div>
              </form>
            ) : (
              <dl className="account-details">
                <div><dt>Телефон</dt><dd>{user.phone || "Не указан"}</dd></div>
                <div><dt>Telegram</dt><dd>{user.telegram || "Не указан"}</dd></div>
                <div><dt>WhatsApp</dt><dd>{user.whatsapp || "Не указан"}</dd></div>
                <div><dt>Город</dt><dd>{user.city || "Не указан"}</dd></div>
                <div><dt>Доставка</dt><dd>{user.deliveryAddress || "Не указана"}</dd></div>
                <div><dt>Роль</dt><dd>{user.role === "CUSTOMER" ? "Пользователь" : user.role}</dd></div>
              </dl>
            )}
            <div className="account-actions">
              {!editing ? <button className="btn-primary" type="button" onClick={() => setEditing(true)}>Редактировать</button> : null}
              {isStaffRole(user.role) ? (
                <Link className="btn-secondary" href="/admin/dashboard">
                  Открыть админ-панель
                </Link>
              ) : null}
              <button className="btn-secondary" type="button" onClick={logout} disabled={busy}>
                Выйти
              </button>
            </div>
          </div>
          <div className="card account-card account-wide">
            <h2>Мои заказы</h2>
            {orders.length ? (
              <div className="account-orders">
                {orders.map((order) => (
                  <article className="order-row" key={order.id}>
                    <div>
                      <strong>Заказ {order.id.slice(0, 8)}</strong>
                      <p className="muted">{order.items.map((item: any) => item.title).join(", ")}</p>
                    </div>
                    <span className="status-badge">{orderStatusLabel[order.status as OrderStatus] ?? order.status}</span>
                    <strong className="price">{new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number(order.totalAmount))}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">Заказов пока нет. Готовые изделия можно добавить в корзину из каталога.</p>
            )}
          </div>
          <div className="card account-card account-wide">
            <h2>Отзывы после покупки</h2>
            {reviewItems.length ? (
              <form action={createReview} className="profile-form">
                <label className="field">
                  <span className="field__label">Товар</span>
                  <select className="input" name="orderItemId" required>
                    {reviewItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </select>
                </label>
                <label className="field"><span className="field__label">Оценка</span><input className="input" name="rating" type="number" min="1" max="5" step="1" placeholder="5" /></label>
                <label className="field"><span className="field__label">Текст отзыва</span><textarea className="input" name="text" rows={4} required /></label>
                <button className="btn-primary" type="submit" disabled={busy}>Отправить на модерацию</button>
              </form>
            ) : (
              <p className="muted">После оплаты товара здесь появится возможность оставить отзыв.</p>
            )}
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
          <p className="page-copy">Войдите или создайте аккаунт, чтобы быстрее возвращаться к заказам и админке, если у вас есть доступ сотрудника.</p>
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
          {mode === "register" ? (
            <label className="field">
              <span className="field__label">Имя</span>
              <input className="input" name="name" placeholder="Как к вам обращаться…" required minLength={2} autoComplete="name" />
            </label>
          ) : null}
          <label className="field">
            <span className="field__label">Email</span>
            <input className="input" name="email" type="email" placeholder="name@example.com…" required autoComplete="email" spellCheck={false} />
          </label>
          <label className="field">
            <span className="field__label">Пароль</span>
            <input
              className="input"
              name="password"
              type="password"
              placeholder="Минимум 10 символов…"
              required
              minLength={10}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </label>
          {error ? <p className="form-error" aria-live="polite">{error}</p> : null}
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? "Отправляем…" : mode === "register" ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
}
