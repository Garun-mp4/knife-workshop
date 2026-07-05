"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthMenu } from "./AuthMenu";

const navItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/custom-order", label: "Заказ" },
  { href: "/about", label: "О мастерской" },
  { href: "/delivery-payment", label: "Доставка" },
  { href: "/contacts", label: "Контакты" }
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        К содержанию
      </a>
      <div className="container header-shell">
        <Link className="brand" href="/" aria-label="Knife Workshop, на главную" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            KW
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
            <AuthMenu variant="mobile" onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
