import { ImageBlock } from "../../components/ImageBlock";
import { LeadForm } from "../../components/LeadForm";
import { apiGet } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Контакты" };

export default async function Contacts() {
  const settings = await apiGet<any>("/public/settings").catch(() => ({}));
  const site = settings.site ?? {};

  return (
    <main className="section">
      <div className="container page-grid">
        <div className="split-copy">
          <p className="section-kicker">Контакты</p>
          <h1 className="page-title">Связь с мастерской</h1>
          <p className="page-copy">
            Напишите удобным способом или оставьте заявку. Обычно мастер отвечает в течение рабочего дня.
          </p>
          <ImageBlock src={SITE_IMAGES.contactWorkshop} alt="Рабочий стол мастерской с телефоном и инструментами" />
          <div className="card contact-card">
            <p>
              <strong>Телефон:</strong> {site.phone || "—"}
            </p>
            <p>
              <strong>Telegram:</strong> {site.telegram || "—"}
            </p>
            <p>
              <strong>WhatsApp:</strong> {site.whatsapp || "—"}
            </p>
            <p>
              <strong>Email:</strong> {site.email || "—"}
            </p>
            <p>
              <strong>Город:</strong> {site.city || "—"}
            </p>
          </div>
        </div>
        <LeadForm title="Задать вопрос" />
      </div>
    </main>
  );
}
