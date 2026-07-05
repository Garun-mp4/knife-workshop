import { ImageBlock } from "../../components/ImageBlock";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "О мастерской" };

export default function About() {
  return (
    <main className="section">
      <div className="container page-grid">
        <ImageBlock
          src={SITE_IMAGES.aboutMaster}
          alt="Мастер вручную полирует нож в мастерской"
          ratio="4 / 3"
        />
        <div className="split-copy">
          <p className="section-kicker">О мастерской</p>
          <h1 className="page-title">Ручная работа без серийной витрины</h1>
          <p className="page-copy">
            Мастерская делает законные изделия ручной работы: кухонные, хозяйственно-бытовые, туристические,
            подарочные и декоративные ножи. Каждый заказ обсуждается вручную: от назначения и стали до рукояти,
            упаковки и документов.
          </p>
          <div className="detail-list">
            <div className="detail-item">
              <strong>Подход</strong>
              <span>один мастер, прямой диалог и понятные сроки</span>
            </div>
            <div className="detail-item">
              <strong>Материалы</strong>
              <span>сталь, дерево, кожа, стабилизированные заготовки</span>
            </div>
            <div className="detail-item">
              <strong>Документы</strong>
              <span>сертификаты и заключения предоставляются при наличии</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
