import { ImageBlock } from "../../components/ImageBlock";
import { LeadForm } from "../../components/LeadForm";
import { apiGet } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Контакты" };

export default async function Contacts() {
  const settings = await apiGet<any>("/public/settings").catch(() => ({}));
  const site = settings.site ?? {};
  const phoneHref = site.phone ? `tel:${String(site.phone).replace(/[^\d+]/g, "")}` : undefined;
  const whatsappHref = site.whatsapp ? `https://wa.me/${String(site.whatsapp).replace(/[^\d]/g, "")}` : undefined;
  const telegramHref = site.telegram ? `https://t.me/${String(site.telegram).replace(/^@/, "")}` : undefined;

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
          <div className="card contact-card contact-actions">
            {site.phone ? <a className="contact-action" href={phoneHref}><strong>Позвонить</strong><span>{site.phone}</span></a> : null}
            {site.telegram ? <a className="contact-action" href={telegramHref} target="_blank" rel="noreferrer"><strong>Telegram</strong><span>{site.telegram}</span></a> : null}
            {site.whatsapp ? <a className="contact-action" href={whatsappHref} target="_blank" rel="noreferrer"><strong>WhatsApp</strong><span>{site.whatsapp}</span></a> : null}
            {site.email ? <a className="contact-action" href={`mailto:${site.email}`}><strong>Email</strong><span>{site.email}</span></a> : null}
            <div className="contact-action"><strong>Город</strong><span>{site.city || "—"}</span></div>
          </div>
        </div>
        <LeadForm title="Задать вопрос" />
      </div>
    </main>
  );
}
