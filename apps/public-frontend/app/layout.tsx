import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SITE_IMAGES } from "../lib/images";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080"),
  title: { default: "Knife Workshop — ножи ручной работы", template: "%s · Knife Workshop" },
  description: "Каталог ножей ручной работы, портфолио проданных изделий и индивидуальные заказы напрямую у мастера.",
  openGraph: { title: "Knife Workshop", description: "Ножи ручной работы", images: [SITE_IMAGES.ogDefault] }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
