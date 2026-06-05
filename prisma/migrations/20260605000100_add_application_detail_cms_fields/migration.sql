ALTER TABLE "Application"
  ADD COLUMN "detailTitleKo" TEXT,
  ADD COLUMN "detailTitleEn" TEXT,
  ADD COLUMN "detailBodyKo" TEXT,
  ADD COLUMN "detailBodyEn" TEXT,
  ADD COLUMN "detailImageUrl" TEXT,
  ADD COLUMN "detailBenefitsKo" JSONB,
  ADD COLUMN "detailBenefitsEn" JSONB,
  ADD COLUMN "detailUseCasesKo" JSONB,
  ADD COLUMN "detailUseCasesEn" JSONB,
  ADD COLUMN "detailModulesKo" JSONB,
  ADD COLUMN "detailModulesEn" JSONB,
  ADD COLUMN "detailCtaKo" TEXT,
  ADD COLUMN "detailCtaEn" TEXT;
