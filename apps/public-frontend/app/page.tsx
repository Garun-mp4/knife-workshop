import type { ProductDto } from "@knife/shared";
import Link from "next/link";
import { ImageBlock } from "../components/ImageBlock";
import { ProductCard } from "../components/ProductCard";
import { apiGet } from "../lib/api";
import { SITE_IMAGES } from "../lib/images";

const processSteps = [
  {
    image: SITE_IMAGES.processForging,
    alt: "Ковка раскаленного клинка на наковальне",
    title: "Клинок",
    text: "Геометрия, спуски и термообработка подбираются под назначение изделия, а не под шаблонную форму."
  },
  {
    image: SITE_IMAGES.processHandle,
    alt: "Ручная обработка деревянной рукояти ножа",
    title: "Рукоять",
    text: "Дерево, стабилизированные материалы, кожа и металл собираются так, чтобы нож удобно лежал в руке."
  },
  {
    image: SITE_IMAGES.processSharpening,
    alt: "Финишная доводка и заточка ножа на водном камне",
    title: "Доводка",
    text: "Финишная заточка, полировка, упаковка и документы проверяются перед передачей клиенту."
  }
];

const featureCards = [
  {
    index: "01",
    title: "Законные изделия",
    text: "Кухонные, хозяйственно-бытовые, туристические, подарочные и декоративные ножи без агрессивной подачи."
  },
  {
    index: "02",
    title: "Живые материалы",
    text: "Каждая рукоять, фактура клинка и комплект упаковки обсуждаются с учетом задачи и бюджета."
  },
  {
    index: "03",
    title: "Прямая связь",
    text: "Без автоматической корзины: мастер уточняет назначение, сроки, город доставки и нужные документы."
  }
];

export default async function Home() {
  const [featured, settings] = await Promise.all([
    apiGet<ProductDto[]>("/public/products/featured").catch(() => []),
    apiGet<any>("/public/settings").catch(() => ({}))
  ]);
  const site = settings.site ?? {};

  return (
    <main>
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(250, 250, 247, 0.98) 0%, rgba(250, 250, 247, 0.86) 44%, rgba(250, 250, 247, 0.26) 78%), url(${SITE_IMAGES.hero})`
        }}
      >
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="section-kicker">Ручная работа · каталог · индивидуальные заказы</p>
            <h1 className="hero-title">
              {site.heroTitle ?? "Ножи ручной работы для кухни, походов и подарков"}
            </h1>
            <p className="hero-lead">
              {site.heroSubtitle ??
                "Готовые работы, портфолио проданных изделий и индивидуальные заказы напрямую у мастера."}
            </p>
            <div className="hero-actions">
              <Link className="btn-primary" href="/catalog">
                Смотреть каталог
              </Link>
              <Link className="btn-secondary" href="/custom-order">
                Обсудить заказ
              </Link>
            </div>
            <dl className="hero-metrics" aria-label="Коротко о мастерской">
              <div className="hero-metric">
                <dt>Формат</dt>
                <dd>готовые работы и заказ</dd>
              </div>
              <div className="hero-metric">
                <dt>Материалы</dt>
                <dd>сталь, дерево, кожа</dd>
              </div>
              <div className="hero-metric">
                <dt>Передача</dt>
                <dd>упаковка и документы</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head section-head--wide">
            <p className="section-kicker">Каталог</p>
            <h2 className="section-title">Избранные работы</h2>
            <p className="section-copy">
              В каталоге собраны изделия, которые можно обсудить с мастером: наличие, похожий заказ, материалы и сроки.
            </p>
          </div>
          {featured.length ? (
            <div className="grid-products">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ backgroundImage: `url(${SITE_IMAGES.emptyCatalog})` }}>
              <h2>Каталог готовится к публикации</h2>
              <p className="muted">
                Пока витрина пустая, можно описать задачу и получить консультацию по индивидуальному заказу.
              </p>
              <div className="action-row">
                <Link className="btn-primary" href="/custom-order">
                  Обсудить заказ
                </Link>
                <Link className="btn-secondary" href="/portfolio">
                  Смотреть портфолио
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Процесс</p>
            <h2 className="section-title">От заготовки до финишной доводки</h2>
            <p className="section-copy">
              На сайте показаны реальные этапы работы мастерской: ковка, обработка рукояти, заточка и подготовка к
              передаче.
            </p>
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <article className="card process-card" key={step.title}>
                <div className="process-card__media">
                  <img src={step.image} alt={step.alt} />
                </div>
                <div className="process-card__body">
                  <h3>{step.title}</h3>
                  <p className="muted">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container feature-grid">
          {featureCards.map((item) => (
            <article className="card feature-card" key={item.title}>
              <span className="feature-card__index">{item.index}</span>
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split-grid">
          <ImageBlock
            src={SITE_IMAGES.customOrder}
            alt="Эскизы и материалы для индивидуального заказа ножа"
            ratio="4 / 3"
          />
          <div className="split-copy">
            <p className="section-kicker">Индивидуальный заказ</p>
            <h2 className="section-title">Нож под задачу, руку и сценарий использования</h2>
            <p className="section-copy">
              Опишите назначение, бюджет и пожелания. Мастер уточнит материалы, геометрию, сроки, доставку и документы
              перед началом работы.
            </p>
            <div className="action-row">
              <Link className="btn-primary" href="/custom-order">
                Обсудить заказ
              </Link>
              <Link className="btn-secondary" href="/about">
                О мастерской
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
