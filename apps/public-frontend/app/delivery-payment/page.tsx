import { ImageBlock } from "../../components/ImageBlock";
import { apiGet } from "../../lib/api";
import { SITE_IMAGES } from "../../lib/images";

export const metadata = { title: "Доставка и оплата" };

export default async function Delivery() {
  const page = await apiGet<any>("/public/pages/delivery-payment").catch(() => null);

  return (
    <main className="section">
      <div className="container page-grid">
        <div className="split-copy">
          <p className="section-kicker">Доставка и оплата</p>
          <h1 className="page-title">Передача изделия без сюрпризов</h1>
          <p className="page-copy">
            {page?.content || "Доставка, сроки и оплата обсуждаются индивидуально после заявки."}
          </p>
          <div className="detail-list">
            <div className="detail-item">
              <strong>Упаковка</strong>
              <span>коробка, защита клинка и дополнительные материалы по договорённости</span>
            </div>
            <div className="detail-item">
              <strong>Сроки</strong>
              <span>зависят от наличия изделия, сложности заказа и города доставки</span>
            </div>
            <div className="detail-item">
              <strong>Оплата</strong>
              <span>условия фиксируются после согласования параметров заказа</span>
            </div>
          </div>
        </div>
        <ImageBlock
          src={SITE_IMAGES.deliveryPackaging}
          alt="Нож в подарочной упаковке с кожаными ножнами"
          ratio="4 / 3"
        />
      </div>
    </main>
  );
}
