import { ImageBlock } from "../../components/ImageBlock";
import { apiGet } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Юридическая информация и документы" };

export default async function Documents() {
  const page = await apiGet<any>("/public/pages/documents").catch(() => null);

  return (
    <main className="section">
      <div className="container page-grid">
        <div className="split-copy">
          <p className="section-kicker">Документы</p>
          <h1 className="page-title">Юридическая информация</h1>
          <p className="page-copy">
            {page?.content ||
              "Сайт предназначен для демонстрации и продажи только законных изделий. При наличии предоставляются документы."}
          </p>
          <div className="detail-list">
            <div className="detail-item">
              <strong>Назначение</strong>
              <span>кухонные, хозяйственно-бытовые, туристические, подарочные и декоративные изделия</span>
            </div>
            <div className="detail-item">
              <strong>Проверка</strong>
              <span>параметры и комплект документов обсуждаются до передачи изделия</span>
            </div>
            <div className="detail-item">
              <strong>Гарантия</strong>
              <span>условия эксплуатации и ухода фиксируются при общении с мастером</span>
            </div>
          </div>
        </div>
        <ImageBlock
          src={SITE_IMAGES.documentsGuarantee}
          alt="Документы и гарантийные материалы рядом с ножом"
          ratio="4 / 3"
        />
      </div>
    </main>
  );
}
