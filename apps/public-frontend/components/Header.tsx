"use client";

import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthMenu } from "./AuthMenu";

const navItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/gallery", label: "Галерея работ" },
  { href: "/custom-order", label: "Заказ" },
  { href: "/about", label: "О мастерской" },
  { href: "/contacts", label: "Контакты" }
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
      <a className="skip-link" href="#main-content">
        К содержанию
      </a>
      <div className="container header-shell">
        <Link className="brand" href="/" aria-label="Knife Workshop, на главную" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg className="brand-mark__blade" viewBox="0 0 46 46" focusable="false">
              <path
                d="M10.5 29.7 31.8 8.5c1.1-1.1 3-.7 3.5.8l2.2 6.9c.3.9 0 1.8-.7 2.4L18 35.1c-.7.6-1.7.7-2.5.2l-4.6-2.7c-1.1-.6-1.3-2.1-.4-2.9Z"
                fill="currentColor"
              />
              <path d="m17.8 34.4 7.6 7.1" stroke="currentColor" strokeLinecap="round" strokeWidth="3.2" />
              <path d="m25.8 24.5 7.9 7.9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" opacity="0.42" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-title">Knife Workshop</span>
            <span className="brand-subtitle">ножи ручной работы</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-link ${isActivePath(pathname, item.href) ? "is-active" : ""}`}
              href={item.href}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <AuthMenu />
          <Link className="btn-secondary header-cart" href="/cart" aria-label="Корзина">
            <ShoppingCart size={17} aria-hidden="true" />
            <span>Корзина</span>
          </Link>
          <Link className="btn-primary header-cta" href="/custom-order">
            Обсудить заказ
          </Link>
          <button
            className="mobile-toggle"
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-panel" id="mobile-navigation">
          <nav className="container mobile-panel__inner" aria-label="Мобильная навигация">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={`nav-link ${isActivePath(pathname, item.href) ? "is-active" : ""}`}
                href={item.href}
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="btn-primary" href="/custom-order" onClick={() => setOpen(false)}>
              Обсудить заказ
            </Link>
            <Link className="btn-secondary" href="/cart" onClick={() => setOpen(false)}>
              <ShoppingCart size={17} aria-hidden="true" />
              Корзина
            </Link>
            <AuthMenu variant="mobile" onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
