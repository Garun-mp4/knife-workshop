"use client";

import { isStaffRole, type AuthUser } from "@knife/shared";
import { LogOut, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser, userInitials } from "../lib/auth";

type Props = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AuthMenu({ variant = "desktop", onNavigate }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = variant === "mobile";

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const next = await getCurrentUser();
      if (active) {
        setUser(next);
        setLoading(false);
      }
    }
    load();
    window.addEventListener("auth-changed", load);
    return () => {
      active = false;
      window.removeEventListener("auth-changed", load);
    };
  }, []);

  if (loading) return <span className={isMobile ? "auth-loading auth-loading--mobile" : "auth-loading"} aria-hidden="true" />;

  if (!user) {
    return (
      <div className={isMobile ? "auth-actions auth-actions--mobile" : "auth-actions"}>
        <Link className="auth-link" href="/account?mode=login" onClick={onNavigate}>
          Войти
        </Link>
        <Link
          className={isMobile ? "btn-primary" : "btn-secondary auth-register"}
          href="/account?mode=register"
          onClick={onNavigate}
        >
          Регистрация
        </Link>
      </div>
    );
  }

  return (
    <details className={isMobile ? "auth-menu auth-menu--mobile" : "auth-menu"}>
      <summary className="auth-summary" aria-label="Меню профиля">
        <span className="auth-avatar" aria-hidden="true">
          {userInitials(user)}
        </span>
        {isMobile ? <span className="auth-summary__name">{user.name}</span> : null}
      </summary>
      <div className="auth-dropdown">
        <div className="auth-user">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <Link href="/account" className="auth-dropdown__item" onClick={onNavigate}>
          <UserRound size={16} aria-hidden="true" />
          Профиль
        </Link>
        {isStaffRole(user.role) ? (
          <Link href="/admin/dashboard" className="auth-dropdown__item" onClick={onNavigate}>
            <Shield size={16} aria-hidden="true" />
            Админ-панель
          </Link>
        ) : null}
        <button
          className="auth-dropdown__item"
          type="button"
          onClick={() =>
            logoutUser().then(() => {
              setUser(null);
              onNavigate?.();
            })
          }
        >
          <LogOut size={16} aria-hidden="true" />
          Выйти
        </button>
      </div>
    </details>
  );
}
