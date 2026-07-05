"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiSend } from "../lib/api";
const links = [["/dashboard","Dashboard"],["/products","Товары"],["/categories","Категории"],["/leads","Заявки"],["/reviews","Отзывы"],["/pages","Страницы"],["/settings","Настройки"],["/media-cleanup","Media cleanup"],["/audit-log","Audit log"]];
export function AdminShell({ children }: { children: React.ReactNode }) { const pathname = usePathname(); if (pathname.endsWith("/login")) return <>{children}</>; return <div className="admin-layout"><aside className="sidebar"><h2>Knife Admin</h2>{links.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}<button className="btn btn-muted" onClick={async()=>{ await apiSend('/auth/logout','POST'); window.location.href = "/account?mode=login"; }}>Logout</button></aside><main className="main">{children}</main></div>; }
