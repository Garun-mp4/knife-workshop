import { ImageBlock } from "../../components/ImageBlock";
import { LeadForm } from "../../components/LeadForm";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Индивидуальный заказ" };

export default function CustomOrder() {
  return (
    <main className="section">
      <div className="container page-grid">
        <div className="split-copy">
          <p className="section-kicker">Индивидуальный заказ</p>
          <h1 className="page-title">Обсудим нож под конкретную задачу</h1>
          <p className="page-copy">
            Расскажите, какой нож нужен: тип, материалы, бюджет, город, желаемый срок и пожелания по документам.
            Мастер ответит вручную и уточнит детали перед началом работы.
          </p>
          <ImageBlock
            src={SITE_IMAGES.customOrder}
            alt="Эскизы ножей, заготовки и материалы для индивидуального заказа"
            ratio="4 / 3"
          />
        </div>
        <LeadForm type="CUSTOM_ORDER" title="Обсудить индивидуальный заказ" />
      </div>
    </main>
  );
}
