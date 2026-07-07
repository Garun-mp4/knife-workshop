"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiClientSend } from "../lib/api";

export function AddToCartButton({ productId, className = "btn-primary" }: { productId: string; className?: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [error, setError] = useState("");

  async function add() {
    setState("loading");
    setError("");
    try {
      await apiClientSend("/account/cart/items", "POST", { productId });
      window.dispatchEvent(new CustomEvent("cart-changed"));
      setState("added");
      window.setTimeout(() => setState("idle"), 1800);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Не удалось добавить товар";
      if (message.includes("401") || message.includes("Unauthorized")) {
        router.push("/account?mode=login");
        return;
      }
      setError(message);
      setState("error");
    }
  }

  return (
    <div className="cart-action">
      <button className={className} type="button" onClick={add} disabled={state === "loading"}>
        <ShoppingCart size={17} aria-hidden="true" />
        {state === "loading" ? "Добавляем…" : state === "added" ? "В корзине" : "В корзину"}
      </button>
      {state === "error" ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
