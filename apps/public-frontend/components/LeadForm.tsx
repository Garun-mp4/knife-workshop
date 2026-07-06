"use client";

import type { LeadType } from "@knife/shared";
import { useState } from "react";
import { apiPost } from "../lib/api";

export function LeadForm({
  productId,
  type = "GENERAL_QUESTION",
  title = "Оставить заявку"
}: {
  productId?: string;
  type?: LeadType;
  title?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setError("");
    const payload = Object.fromEntries(formData.entries());

    try {
      await apiPost("/public/leads", {
        ...payload,
        productId,
        type,
        consent: payload.consent === "on",
        sourceUrl: location.href
      });
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку. Попробуйте позже.");
    }
  }

  if (state === "success") {
    return (
      <div className="card success-card" aria-live="polite">
        <h3>Заявка отправлена</h3>
        <p className="muted">Мастер свяжется с вами вручную через указанный контакт.</p>
      </div>
    );
  }

  return (
    <form action={submit} className="card lead-form">
      <h3>{title}</h3>
      <p className="muted lead-form__intro">Оставьте удобный контакт и коротко опишите задачу.</p>
      <label className="field">
        <span className="field__label">Имя</span>
        <input className="input" name="name" placeholder="Как к вам обращаться…" required autoComplete="name" />
      </label>
      <div className="form-grid form-grid--2">
        <label className="field">
          <span className="field__label">Телефон</span>
          <input className="input" name="phone" type="tel" inputMode="tel" placeholder="+7 999 000-00-00…" autoComplete="tel" />
        </label>
        <label className="field">
          <span className="field__label">Email</span>
          <input className="input" name="email" type="email" placeholder="name@example.com…" autoComplete="email" spellCheck={false} />
        </label>
      </div>
      <div className="form-grid form-grid--2">
        <label className="field">
          <span className="field__label">Telegram или WhatsApp</span>
          <input className="input" name="messenger" placeholder="@username или номер…" autoComplete="off" />
        </label>
        <label className="field">
          <span className="field__label">Город</span>
          <input className="input" name="city" placeholder="Астрахань…" autoComplete="address-level2" />
        </label>
      </div>
      <label className="field">
        <span className="field__label">Бюджет</span>
        <input className="input" name="budget" placeholder="Например, до 15000 ₽…" inputMode="decimal" autoComplete="off" />
      </label>
      <label className="field">
        <span className="field__label">Комментарий</span>
        <textarea className="input" name="message" placeholder="Назначение, материалы, сроки, пожелания по документам…" rows={5} />
      </label>
      <label className="form-consent">
        <input type="checkbox" name="consent" required /> Я согласен на обработку персональных данных и принимаю
        политику конфиденциальности.
      </label>
      {state === "error" ? <p className="form-error" aria-live="polite">{error}</p> : null}
      <button className="btn-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
