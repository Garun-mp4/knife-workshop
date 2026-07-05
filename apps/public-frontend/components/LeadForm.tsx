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
      <div className="card success-card">
        <h3>Заявка отправлена</h3>
        <p className="muted">Мастер свяжется с вами вручную через указанный контакт.</p>
      </div>
    );
  }

  return (
    <form action={submit} className="card lead-form">
      <h3>{title}</h3>
      <p className="muted lead-form__intro">Оставьте удобный контакт и коротко опишите задачу.</p>
      <input className="input" name="name" placeholder="Имя" required />
      <input className="input" name="phone" placeholder="Телефон" />
      <input className="input" name="email" type="email" placeholder="Email" />
      <input className="input" name="messenger" placeholder="Telegram / WhatsApp" />
      <input className="input" name="city" placeholder="Город" />
      <input className="input" name="budget" placeholder="Бюджет" />
      <textarea className="input" name="message" placeholder="Комментарий" rows={5} />
      <label className="form-consent">
        <input type="checkbox" name="consent" required /> Я согласен на обработку персональных данных и принимаю
        политику конфиденциальности.
      </label>
      {state === "error" ? <p className="form-error">{error}</p> : null}
      <button className="btn-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Отправляем..." : "Отправить"}
      </button>
    </form>
  );
}
