"use client";

import { isStaffRole, type AuthUser } from "@knife/shared";
import { LogOut, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logoutUser, userInitials } from "../lib/auth";

type Props = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AuthMenu({ variant = "desktop", onNavigate }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!open) return undefined;

    function closeFromPointer(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeFromPointer);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromPointer);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [open]);

  function closeAndNavigate() {
    setOpen(false);
    onNavigate?.();
  }

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
    <div className={isMobile ? "auth-menu auth-menu--mobile" : "auth-menu"} ref={menuRef}>
      <button
        className="auth-summary"
        type="button"
        aria-label="Меню профиля"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {user.avatarUrl ? (
          <img className="auth-avatar auth-avatar--image" src={user.avatarUrl} alt="" width={42} height={42} />
        ) : (
          <span className="auth-avatar" aria-hidden="true">
            {userInitials(user)}
          </span>
        )}
        {isMobile ? <span className="auth-summary__name">{user.name}</span> : null}
      </button>
      {open ? (
        <div className="auth-dropdown">
          <div className="auth-user">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <Link href="/account" className="auth-dropdown__item" onClick={closeAndNavigate}>
            <UserRound size={16} aria-hidden="true" />
            Профиль
          </Link>
          {isStaffRole(user.role) ? (
            <Link href="/admin/dashboard" className="auth-dropdown__item" onClick={closeAndNavigate}>
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
                closeAndNavigate();
              })
            }
          >
            <LogOut size={16} aria-hidden="true" />
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  );
}
