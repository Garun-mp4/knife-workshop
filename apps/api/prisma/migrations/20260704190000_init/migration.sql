CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'IN_STOCK', 'MADE_TO_ORDER', 'SOLD', 'HIDDEN', 'COMING_SOON', 'ARCHIVED');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CONTACTED', 'WAITING_PAYMENT', 'ACCEPTED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'CLOSED', 'CANCELLED');
CREATE TYPE "LeadType" AS ENUM ('PRODUCT_ORDER', 'SIMILAR_ORDER', 'CUSTOM_ORDER', 'GENERAL_QUESTION');
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT,
  "description" TEXT,
  "price" DECIMAL(10,2),
  "oldPrice" DECIMAL(10,2),
  "pricePrefix" TEXT,
  "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
  "categoryId" TEXT,
  "purpose" TEXT,
  "steel" TEXT,
  "bladeLengthMm" INTEGER,
  "totalLengthMm" INTEGER,
  "spineThicknessMm" DECIMAL(5,2),
  "handleMaterial" TEXT,
  "sheathMaterial" TEXT,
  "weightGrams" INTEGER,
  "hardnessHrc" DECIMAL(4,1),
  "equipment" TEXT,
  "productionTimeDays" INTEGER,
  "engravingAvailable" BOOLEAN NOT NULL DEFAULT false,
  "certificateText" TEXT,
  "certificateFileUrl" TEXT,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

CREATE TABLE "ProductImage" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "alt" TEXT,
  "bucket" TEXT NOT NULL,
  "originalKey" TEXT NOT NULL,
  "largeKey" TEXT,
  "mediumKey" TEXT,
  "thumbKey" TEXT,
  "placeholderKey" TEXT,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "isMain" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "pendingDelete" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "type" "LeadType" NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "productId" TEXT,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "messenger" TEXT,
  "city" TEXT,
  "budget" TEXT,
  "message" TEXT,
  "sourceUrl" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmContent" TEXT,
  "utmTerm" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_productId_idx" ON "Lead"("productId");

CREATE TABLE "Review" (
  "id" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "city" TEXT,
  "text" TEXT NOT NULL,
  "rating" INTEGER,
  "imageUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Page" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

CREATE TABLE "SiteSetting" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB,
  "ip" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
