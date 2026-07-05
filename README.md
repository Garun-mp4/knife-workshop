# Knife Workshop Catalog

Production-ready MVP сайта ножевой мастерской: публичный сайт, каталог, портфолио проданных работ, формы заявок, админ-панель, backend API, worker, PostgreSQL, Redis, MinIO и Nginx в Docker Compose.

Проект предназначен только для демонстрации и продажи законных изделий: кухонных, хозяйственно-бытовых, туристических, разделочных, подарочных, декоративных и иных ножей, разрешённых к продаже в регионе работы мастерской. В карточке товара предусмотрены поля для юридической информации и документов.

## Стек

- Monorepo: pnpm workspaces
- Backend: NestJS + TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Cache / Queue: Redis + BullMQ
- Storage: MinIO / S3-compatible
- Public frontend: Next.js
- Admin frontend: Next.js
- Styling: Tailwind CSS + простые компоненты
- Reverse proxy: Nginx
- Image processing: Sharp
- Auth: JWT + httpOnly cookies
- Docker: Docker Compose

## Структура

```text
knife-workshop/
  apps/
    api/
    worker/
    public-frontend/
    admin-frontend/
  packages/
    shared/
    ui/
  image/prompts.txt
  infra/nginx/nginx.conf
  infra/minio/init.sh
  docker-compose.yml
  docker-compose.prod.yml
  .env.example
```

## Быстрый запуск

```bash
cp .env.example .env
docker compose up --build
```

После запуска:

- Публичный сайт: <http://localhost:8080>
- Админка: <http://localhost:8080/admin>
- Swagger API: <http://localhost:8080/api/docs>
- MinIO API: <http://localhost:9000>
- MinIO Console dev: <http://localhost:9001>

## Миграции Prisma

Compose выполняет `prisma migrate deploy` при старте API. Вручную:

```bash
docker compose exec api pnpm prisma migrate deploy
```

## Seed

```bash
docker compose exec api pnpm prisma db seed
```

Seed создаёт администратора из `.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me_admin_password
```

Также создаются категории, демо-товары, отзывы, настройки сайта и страницы `delivery-payment`, `documents`, `privacy-policy`.

## Команды разработки

```bash
pnpm dev          # docker compose up --build
pnpm down         # остановка контейнеров
pnpm logs         # логи
pnpm db:migrate   # миграции
pnpm db:seed      # seed
pnpm db:studio    # Prisma Studio внутри контейнера API
pnpm lint
pnpm test
pnpm format
```

## Работа с изображениями товаров

Товарные изображения нельзя добавлять ссылкой. Администратор загружает файл через `/admin/products/[id]`.

Поток загрузки:

1. Admin frontend отправляет `multipart/form-data` на `POST /api/admin/products/:productId/images`.
2. API проверяет размер, MIME, фактический тип файла, расширение и читаемость изображения.
3. API создаёт версии:
   - `original`
   - `large.webp`, до 1600 px
   - `medium.webp`, до 900 px
   - `thumb.webp`, до 400 px
   - `placeholder.webp`
4. Все версии сохраняются в MinIO.
5. Metadata сохраняется в PostgreSQL.

Формат ключей:

```text
products/{productId}/{imageId}/original.{ext}
products/{productId}/{imageId}/large.webp
products/{productId}/{imageId}/medium.webp
products/{productId}/{imageId}/thumb.webp
products/{productId}/{imageId}/placeholder.webp
```

## Удаление изображений

При удалении фото из админки API:

1. Проверяет авторизацию.
2. Находит запись в БД.
3. Помечает фото `pendingDelete=true`.
4. Удаляет все версии из MinIO.
5. Удаляет запись из БД.
6. Если фото было главным, назначает следующее главным.
7. Пишет действие в audit log.

Если удаление из MinIO не удалось, запись остаётся помеченной `pendingDelete=true`. Worker периодически ставит такие изображения в очередь `image-delete`.

## Статичные изображения сайта

Статичные декоративные изображения публичного сайта должны лежать здесь:

```text
apps/public-frontend/public/images/
```

Файл `image/prompts.txt` содержит промты и точные имена файлов. Эти имена уже используются в коде через `SITE_IMAGES`:

```ts
const SITE_IMAGES = {
  hero: "/images/hero-workshop.webp",
  aboutMaster: "/images/about-master.webp",
  processForging: "/images/process-forging.webp",
  processHandle: "/images/process-handle.webp",
  processSharpening: "/images/process-sharpening.webp",
  customOrder: "/images/custom-order.webp",
  deliveryPackaging: "/images/delivery-packaging.webp",
  documentsGuarantee: "/images/documents-guarantee.webp",
  emptyCatalog: "/images/empty-catalog.webp",
  portfolioSold: "/images/portfolio-sold.webp",
  contactWorkshop: "/images/contact-workshop.webp",
  ogDefault: "/images/og-default.webp"
};
```

Если файл отсутствует, frontend показывает gradient/placeholder-блок.

## Основные API endpoints

Все endpoints находятся под `/api`.

Auth:

```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

Public:

```http
GET  /api/public/products
GET  /api/public/products/featured
GET  /api/public/products/:slug
GET  /api/public/categories
GET  /api/public/categories/:slug/products
POST /api/public/leads
GET  /api/public/reviews
GET  /api/public/pages/:slug
GET  /api/public/settings
```

Admin:

```http
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/:productId/images
DELETE /api/admin/products/:productId/images/:imageId
GET    /api/admin/categories
GET    /api/admin/leads
GET    /api/admin/reviews
GET    /api/admin/pages
GET    /api/admin/settings
GET    /api/admin/audit-log
```

## Backup PostgreSQL

```bash
docker compose exec postgres pg_dump -U knife_user knife_workshop > backup.sql
```

Восстановление примерное:

```bash
cat backup.sql | docker compose exec -T postgres psql -U knife_user knife_workshop
```

## Backup MinIO

Изображения хранятся в named volume `minio_data`. Для MVP можно бэкапить Docker volume средствами хоста. Более переносимый способ — `mc mirror`:

```bash
docker compose exec minio mc alias set local http://localhost:9000 "$S3_ACCESS_KEY" "$S3_SECRET_KEY"
docker compose exec minio mc mirror local/knife-workshop-media /tmp/knife-workshop-media-backup
```

В production лучше настроить регулярный `mc mirror` во внешнее S3-compatible хранилище или отдельный backup-сервер.

## Production

Для production используйте:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Обязательные действия перед production:

1. Сменить все секреты в `.env`.
2. Установить `COOKIE_SECURE=true`.
3. Настроить HTTPS на Nginx, Traefik, Caddy или внешнем reverse proxy.
4. Закрыть MinIO Console наружу.
5. Не открывать PostgreSQL и Redis наружу.
6. Настроить backup PostgreSQL и MinIO.
7. Настроить логи и мониторинг healthchecks.

## MVP acceptance checklist

- `docker compose up --build` поднимает отдельные контейнеры.
- Публичный сайт открывается.
- Админка открывается.
- Seed-админ может войти.
- Категории и товары создаются из админки.
- Фото товара загружается через upload, сохраняется в MinIO и metadata в PostgreSQL.
- Фото можно удалить из админки.
- Статус товара можно поменять на `SOLD`.
- Проданные товары отображаются в портфолио с CTA «Заказать похожий».
- Заявка с публичного сайта появляется в админке.
- Есть `image/prompts.txt`, `.env.example`, `docker-compose.yml`, `docker-compose.prod.yml`, `README.md`.
