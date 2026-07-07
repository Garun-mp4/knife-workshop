"use client";

import type { AuthUser } from "@knife/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClientGet, apiClientSend } from "../lib/api";
import { getCurrentUser } from "../lib/auth";

function money(value?: string | number | null) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(numeric);
}

export function CartClient() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const nextUser = await getCurrentUser();
    setUser(nextUser);
    if (nextUser) {
      const nextCart = await apiClientGet<any>("/account/cart").catch(() => null);
      setCart(nextCart);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(itemId: string) {
    setCart(await apiClientSend("/account/cart/items/" + itemId, "DELETE"));
    window.dispatchEvent(new CustomEvent("cart-changed"));
  }

  async function checkout(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      const payload = Object.fromEntries(formData.entries());
      const result = await apiClientSend<any>("/account/orders/checkout", "POST", {
        ...payload,
        returnUrl: `${location.origin}/cart/result`
      });
      if (result.confirmationUrl) {
        location.href = result.confirmationUrl;
        return;
      }
      setError("Платеж создан, но ЮKassa не вернула ссылку на оплату.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось перейти к оплате");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="section section--tight">
        <div className="container">
          <div className="card empty-inline"><p className="muted">Загрузка корзины…</p></div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section section--tight">
        <div className="container page-intro">
          <p className="section-kicker">Корзина</p>
          <h1 className="page-title">Войдите, чтобы оформить заказ</h1>
          <p className="page-copy">Покупки, оплата и отзывы привязаны к аккаунту, поэтому оформление доступно после входа.</p>
          <Link className="btn-primary" href="/account?mode=login">Войти или зарегистрироваться</Link>
        </div>
      </section>
    );
  }

  const items = cart?.items ?? [];
  const hasUnavailable = items.some((item: any) => !item.available);

  return (
    <section className="section">
      <div className="container cart-layout">
        <div className="cart-main">
          <div className="page-intro">
            <p className="section-kicker">Корзина</p>
            <h1 className="page-title">Оформление заказа</h1>
            <p className="page-copy">Онлайн оплачиваются только готовые изделия. Доставка согласуется отдельно после оплаты.</p>
          </div>

          {items.length ? (
            <div className="cart-items">
              {items.map((item: any) => {
                const image = item.product.images?.[0]?.thumbUrl || item.product.images?.[0]?.mediumUrl;
                return (
                  <article className="card cart-item" key={item.id}>
                    <Link className="cart-item__media" href={`/product/${item.product.slug}`}>
                      {image ? <img src={image} alt={item.product.title} width={120} height={120} /> : <span>Фото скоро</span>}
                    </Link>
                    <div>
                      <h2><Link href={`/product/${item.product.slug}`}>{item.product.title}</Link></h2>
                      <p className="muted">{item.product.steel || "сталь по задаче"} · количество 1</p>
                      {!item.available ? <p className="form-error">{item.unavailableReason}</p> : null}
                    </div>
                    <strong className="price">{money(item.subtotal)}</strong>
                    <button className="btn-secondary" type="button" onClick={() => remove(item.id)}>Убрать</button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="card empty-inline">
              <h2>Корзина пуста</h2>
              <p className="muted">Добавьте готовое изделие из каталога, чтобы перейти к оплате.</p>
              <Link className="btn-primary" href="/catalog">В каталог</Link>
            </div>
          )}
        </div>

        <aside className="card checkout-panel">
          <h2>Данные заказа</h2>
          <p className="muted">Проверьте контакты. Эти данные можно сохранить в профиле, чтобы не вводить их снова.</p>
          <form action={checkout} className="checkout-form">
            <label className="field">
              <span className="field__label">Получатель</span>
              <input className="input" name="customerName" defaultValue={user.name} required />
            </label>
            <label className="field">
              <span className="field__label">Телефон</span>
              <input className="input" name="phone" type="tel" defaultValue={user.phone ?? ""} />
            </label>
            <label className="field">
              <span className="field__label">Telegram</span>
              <input className="input" name="telegram" defaultValue={user.telegram ?? ""} />
            </label>
            <label className="field">
              <span className="field__label">WhatsApp</span>
              <input className="input" name="whatsapp" defaultValue={user.whatsapp ?? ""} />
            </label>
            <label className="field">
              <span className="field__label">Город</span>
              <input className="input" name="city" defaultValue={user.city ?? ""} />
            </label>
            <label className="field">
              <span className="field__label">Адрес или пункт выдачи</span>
              <textarea className="input" name="deliveryAddress" rows={3} defaultValue={user.deliveryAddress ?? ""} />
            </label>
            <label className="field">
              <span className="field__label">Комментарий к доставке</span>
              <textarea className="input" name="deliveryComment" rows={3} defaultValue={user.deliveryComment ?? ""} />
            </label>
            <div className="delivery-note">
              <strong>Доставка отдельно</strong>
              <p>Сейчас оплачивается только товар: {money(cart?.total)}. Способ, срок и стоимость доставки мастер согласует после заказа.</p>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="btn-primary" type="submit" disabled={!items.length || hasUnavailable || busy}>
              {busy ? "Создаем платеж…" : `Перейти к оплате ${money(cart?.total)}`}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
