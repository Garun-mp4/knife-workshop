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
              <span>готовые изделия можно купить через корзину, а индивидуальные заказы проходят через прямой диалог</span>
            </div>
            <div className="detail-item">
              <strong>Материалы</strong>
              <span>сталь, дерево, кожа, стабилизированные заготовки, латунь, фибра и упаковочные материалы</span>
            </div>
            <div className="detail-item">
              <strong>Документы</strong>
              <span>сертификаты, заключения и отказные письма предоставляются при наличии и по запросу</span>
            </div>
            <div className="detail-item">
              <strong>Безопасность</strong>
              <span>мастерская продает только разрешенные бытовые, кухонные, туристические, подарочные и декоративные изделия</span>
            </div>
            <div className="detail-item">
              <strong>Уход</strong>
              <span>к заказу можно добавить рекомендации по хранению, заточке, уходу за рукоятью и ножнами</span>
            </div>
            <div className="detail-item">
              <strong>Передача</strong>
              <span>готовое изделие проверяется, упаковывается и передается клиенту после согласования доставки</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
