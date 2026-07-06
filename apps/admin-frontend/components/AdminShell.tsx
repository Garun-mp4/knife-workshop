"use client";

import {
  Boxes,
  FileText,
  Gauge,
  Images,
  LayoutList,
  LogOut,
  MessageSquareText,
  ScrollText,
  Settings,
  Star
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiSend } from "../lib/api";

const links = [
  { href: "/dashboard", label: "Обзор", icon: Gauge },
  { href: "/products", label: "Товары", icon: Boxes },
  { href: "/categories", label: "Категории", icon: LayoutList },
  { href: "/leads", label: "Заявки", icon: MessageSquareText },
  { href: "/reviews", label: "Отзывы", icon: Star },
  { href: "/pages", label: "Страницы", icon: FileText },
  { href: "/settings", label: "Настройки", icon: Settings },
  { href: "/media-cleanup", label: "Медиа", icon: Images },
  { href: "/audit-log", label: "Журнал", icon: ScrollText }
];

function pageLabel(pathname: string) {
  const match = links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));
  return match?.label ?? "Knife Admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.endsWith("/login")) return <>{children}</>;

  async function logout() {
    await apiSend("/auth/logout", "POST");
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar" aria-label="Админ-навигация">
        <div className="sidebar__brand">
          <span className="sidebar__mark" aria-hidden="true">
            KW
          </span>
          <div>
            <h2>Knife Admin</h2>
            <p>операционная панель</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={`sidebar__link ${active ? "is-active" : ""}`}>
                <Icon size={17} aria-hidden="true" strokeWidth={1.9} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <p className="sidebar__hint">Доступ только для сотрудников мастерской. Все изменения пишутся в журнал.</p>
          <button className="btn btn-muted" type="button" onClick={logout}>
            <LogOut size={16} aria-hidden="true" strokeWidth={1.9} />
            Выйти
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar__label">Раздел</p>
            <p className="admin-topbar__title">{pageLabel(pathname)}</p>
          </div>
          <p className="admin-topbar__meta">Каталог, заявки, контент и настройки сайта</p>
        </header>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
