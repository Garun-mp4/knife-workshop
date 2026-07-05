import "./globals.css";
import { AdminShell } from "../components/AdminShell";
export const metadata = { title: "Knife Admin" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ru"><body><AdminShell>{children}</AdminShell></body></html>; }
