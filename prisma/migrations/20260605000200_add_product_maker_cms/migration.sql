CREATE TABLE "ProductMaker" (
  "id" SERIAL NOT NULL,
  "productId" INTEGER NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT NOT NULL,
  "website" TEXT,
  "summaryKo" TEXT NOT NULL,
  "summaryEn" TEXT NOT NULL,
  "descriptionKo" TEXT NOT NULL,
  "descriptionEn" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProductMaker_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductMaker_productId_slug_key" ON "ProductMaker"("productId", "slug");
CREATE INDEX "ProductMaker_productId_published_displayOrder_idx" ON "ProductMaker"("productId", "published", "displayOrder");

ALTER TABLE "ProductMaker"
  ADD CONSTRAINT "ProductMaker_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
