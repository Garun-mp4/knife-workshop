import { PrismaClient, ProductStatus } from "@prisma/client";
import * as argon2 from "argon2";
import slugify from "slugify";

const prisma = new PrismaClient();
const slug = (value: string) => slugify(value, { lower: true, strict: true, locale: "ru" });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change_me_admin_password";
  const name = process.env.ADMIN_NAME ?? "Administrator";

  await prisma.user.upsert({
    where: { email },
    update: { name, role: "OWNER", isActive: true },
    create: { email, name, role: "OWNER", passwordHash: await argon2.hash(password) }
  });

  const categories = [
    "Кухонные ножи",
    "Туристические ножи",
    "Разделочные ножи",
    "Подарочные ножи",
    "Ножи на заказ",
    "Ножны и аксессуары",
    "Проданные работы"
  ];
  const categoryRows = [];
  for (const [index, name] of categories.entries()) {
    categoryRows.push(await prisma.category.upsert({
      where: { slug: slug(name) },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug: slug(name), sortOrder: index, isActive: true }
    }));
  }

  const products = [
    ["Шеф-нож из стали Х12МФ", "IN_STOCK", "Кухонные ножи", "Классический кухонный нож для ежедневной работы.", "14500"],
    ["Туристический нож с ореховой рукоятью", "MADE_TO_ORDER", "Туристические ножи", "Практичный нож для походов и подарков.", "12800"],
    ["Разделочный нож с кожаными ножнами", "IN_STOCK", "Разделочные ножи", "Надёжная геометрия и удобная рукоять.", "11900"],
    ["Подарочный нож с гравировкой", "MADE_TO_ORDER", "Подарочные ножи", "Индивидуальная гравировка и премиальная упаковка.", "18500"],
    ["Авторский нож из дамасской стали", "SOLD", "Проданные работы", "Проданная работа из портфолио мастерской.", "24000"],
    ["Комплект ножен из кожи", "COMING_SOON", "Ножны и аксессуары", "Ручная работа, натуральная кожа.", "4500"],
    ["Нож по индивидуальному эскизу", "MADE_TO_ORDER", "Ножи на заказ", "Создаётся под задачу, руку и пожелания клиента.", null]
  ] as const;

  for (const [index, p] of products.entries()) {
    const [title, status, categoryName, shortDescription, price] = p;
    const category = categoryRows.find((c) => c.name === categoryName);
    await prisma.product.upsert({
      where: { slug: slug(title) },
      update: {},
      create: {
        title,
        slug: slug(title),
        status: status as ProductStatus,
        categoryId: category?.id,
        shortDescription,
        description: `${shortDescription} Все параметры можно адаптировать под пожелания клиента. Изделие предназначено только для законного бытового, кухонного, туристического, подарочного или декоративного использования.`,
        price: price ? Number(price) : undefined,
        pricePrefix: status === "MADE_TO_ORDER" ? "от" : undefined,
        purpose: categoryName,
        steel: index % 2 === 0 ? "Х12МФ" : "95Х18",
        bladeLengthMm: 145 + index * 8,
        totalLengthMm: 260 + index * 10,
        spineThicknessMm: 3.2,
        handleMaterial: index % 2 === 0 ? "стабилизированный клён" : "орех",
        sheathMaterial: "натуральная кожа",
        weightGrams: 180 + index * 12,
        hardnessHrc: 59,
        equipment: "Нож, ножны, памятка по уходу",
        productionTimeDays: status === "IN_STOCK" ? null : 30,
        engravingAvailable: categoryName === "Подарочные ножи",
        certificateText: "По запросу предоставляется документ, подтверждающий бытовое/хозяйственное назначение изделия.",
        isFeatured: index < 4,
        sortOrder: index
      }
    });
  }

  const reviews = [
    ["Алексей", "Москва", "Заказывал кухонный нож. Очень аккуратная работа, удобно держать, заточка отличная.", 5],
    ["Мария", "Казань", "Подарок получился солидным и очень красивым. Отдельное спасибо за упаковку.", 5],
    ["Игорь", "Санкт-Петербург", "Мастер помог подобрать сталь и форму под мои задачи. Всё честно и по срокам.", 5]
  ] as const;
  for (const [index, [clientName, city, text, rating]] of reviews.entries()) {
    await prisma.review.upsert({
      where: { id: `seed-review-${index}` },
      update: { clientName, city, text, rating, isPublished: true, sortOrder: index },
      create: { id: `seed-review-${index}`, clientName, city, text, rating, isPublished: true, sortOrder: index }
    });
  }

  await prisma.siteSetting.upsert({ where: { key: "site" }, update: {}, create: { key: "site", value: {
    workshopName: "Knife Workshop",
    phone: "+7 999 000-00-00",
    telegram: "@knife_workshop",
    whatsapp: "+79990000000",
    email: "admin@example.com",
    city: "Ваш город",
    heroTitle: "Ножи ручной работы для кухни, походов и подарков",
    heroSubtitle: "Каталог готовых работ, портфолио проданных изделий и индивидуальные заказы напрямую у мастера.",
    guaranteeText: "Каждое изделие проходит проверку качества. Документы предоставляются при наличии и по запросу.",
    deliveryText: "Доставка обсуждается индивидуально после оформления заявки."
  } } });

  const pages = [
    ["delivery-payment", "Доставка и оплата", "Доставка, сроки и оплата обсуждаются индивидуально после заявки. Оплата возможна по согласованию с мастером."],
    ["documents", "Юридическая информация и документы", "Мастерская продаёт только законные кухонные, хозяйственно-бытовые, туристические, подарочные и декоративные изделия. Не используйте изделия незаконно. При наличии предоставляются сертификаты, экспертные заключения, декларации или отказные письма."],
    ["privacy-policy", "Политика конфиденциальности", "Отправляя форму, вы соглашаетесь на обработку персональных данных для связи по вашей заявке."]
  ] as const;
  for (const [slugValue, title, content] of pages) {
    await prisma.page.upsert({ where: { slug: slugValue }, update: { title, content, status: "PUBLISHED" }, create: { slug: slugValue, title, content, status: "PUBLISHED" } });
  }
}

main().then(async () => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
