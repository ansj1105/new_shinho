"use server";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductDocumentKind } from "@prisma/client";

import {
  clearAdminSession,
  createAdminSession,
  ensureAdminAccount,
  logAdminAccess,
  requireAdminSession,
} from "@/lib/admin-auth";
import { sendInquiryReplyMail } from "@/lib/mailer";
import { createPasswordHash, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function parseTextArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpecArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return {
        label: label?.trim() ?? "",
        value: rest.join("|").trim(),
      };
    })
    .filter((item) => item.label && item.value);
}

function parseOptionalNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoundedNumber(value: FormDataEntryValue | null, fallback: number, min: number, max: number) {
  const parsed = parseOptionalNumber(value, fallback);
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

async function storeResourceAttachment(file: File) {
  const extension = path.extname(file.name || "").toLowerCase();
  const safeExtension = extension && extension.length <= 10 ? extension : "";
  const fileName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", "resources");
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(targetPath, buffer);

  return `/uploads/resources/${fileName}`;
}

async function storeProductDocumentAttachment(file: File) {
  const extension = path.extname(file.name || "").toLowerCase();
  const safeExtension = extension && extension.length <= 10 ? extension : "";
  const fileName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", "product-documents");
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(targetPath, buffer);

  return {
    fileUrl: `/uploads/product-documents/${fileName}`,
    fileName: file.name || fileName,
    mimeType: file.type || null,
    fileSize: file.size,
  };
}

async function storeAdminImage(file: File) {
  const extension = path.extname(file.name || "").toLowerCase();
  const safeExtension = extension && extension.length <= 10 ? extension : "";
  const fileName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", "images");
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(targetPath, buffer);

  return `/uploads/images/${fileName}`;
}

async function resolveAdminImageField(formData: FormData, urlFieldName: string, uploadFieldName: string) {
  const upload = formData.get(uploadFieldName);

  if (isUploadedFile(upload)) {
    return storeAdminImage(upload);
  }

  return String(formData.get(urlFieldName) ?? "").trim() || null;
}

async function removeManagedResourceAttachment(fileUrl: string | null | undefined) {
  if (!fileUrl || !fileUrl.startsWith("/uploads/resources/")) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/+/, "");
  const targetPath = path.join(process.cwd(), "public", relativePath);
  await rm(targetPath, { force: true });
}

async function removeManagedProductDocument(fileUrl: string | null | undefined) {
  if (!fileUrl || !fileUrl.startsWith("/uploads/product-documents/")) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/+/, "");
  const targetPath = path.join(process.cwd(), "public", relativePath);
  await rm(targetPath, { force: true });
}

function parseResourceContentImageWidth(value: FormDataEntryValue | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.min(1400, Math.max(160, Math.round(parsed)));
}

function revalidatePublicPages() {
  revalidatePath("/ko");
  revalidatePath("/en");
  revalidatePath("/ko/company");
  revalidatePath("/en/company");
  revalidatePath("/ko/applications");
  revalidatePath("/en/applications");
  revalidatePath("/ko/products");
  revalidatePath("/en/products");
  revalidatePath("/ko/contact");
  revalidatePath("/en/contact");
  revalidatePath("/ko/contact/quote");
  revalidatePath("/en/contact/quote");
  revalidatePath("/ko/contact/distributors");
  revalidatePath("/en/contact/distributors");
  revalidatePath("/ko/contact/directions");
  revalidatePath("/en/contact/directions");
  revalidatePath("/ko/contact/resources");
  revalidatePath("/en/contact/resources");
  revalidatePath("/ko/legal/privacy");
  revalidatePath("/en/legal/privacy");
  revalidatePath("/ko/legal/terms");
  revalidatePath("/en/legal/terms");
}

async function revalidateProductDocumentPages(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  revalidatePath("/ko/products");
  revalidatePath("/en/products");

  if (product?.slug) {
    revalidatePath(`/ko/products/${product.slug}`);
    revalidatePath(`/en/products/${product.slug}`);
  }

  revalidateAdminPages();
}

function revalidateAdminPages() {
  revalidatePath("/asdasddfg");
  revalidatePath("/asdasddfg/admin");
}

export async function updateCompanyContent(formData: FormData) {
  const data = {
    historyTitleKo: String(formData.get("historyTitleKo") ?? "").trim(),
    historyTitleEn: String(formData.get("historyTitleEn") ?? "").trim(),
    historyBodyKo: String(formData.get("historyBodyKo") ?? ""),
    historyBodyEn: String(formData.get("historyBodyEn") ?? ""),
    brandTitleKo: String(formData.get("brandTitleKo") ?? "").trim(),
    brandTitleEn: String(formData.get("brandTitleEn") ?? "").trim(),
    brandLeadKo: String(formData.get("brandLeadKo") ?? "").trim(),
    brandLeadEn: String(formData.get("brandLeadEn") ?? "").trim(),
    visionTitleKo: String(formData.get("visionTitleKo") ?? "").trim(),
    visionTitleEn: String(formData.get("visionTitleEn") ?? "").trim(),
    visionBodyKo: String(formData.get("visionBodyKo") ?? ""),
    visionBodyEn: String(formData.get("visionBodyEn") ?? ""),
    goalTitleKo: String(formData.get("goalTitleKo") ?? "").trim(),
    goalTitleEn: String(formData.get("goalTitleEn") ?? "").trim(),
    goalBodyKo: String(formData.get("goalBodyKo") ?? ""),
    goalBodyEn: String(formData.get("goalBodyEn") ?? ""),
  };

  await prisma.companyContent.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data,
    },
  });

  revalidatePath("/ko/company");
  revalidatePath("/en/company");
  revalidateAdminPages();
}

async function storeHeroHistory(imageUrl: string) {
  if (!imageUrl) {
    return;
  }

  await prisma.heroImageHistory.create({
    data: {
      siteConfigId: 1,
      imageUrl,
    },
  });

  const history = await prisma.heroImageHistory.findMany({
    where: { siteConfigId: 1 },
    orderBy: { createdAt: "desc" },
  });

  const staleIds = history.slice(10).map((item) => item.id);

  if (staleIds.length > 0) {
    await prisma.heroImageHistory.deleteMany({
      where: { id: { in: staleIds } },
    });
  }
}

export async function updateSiteConfig(formData: FormData) {
  const current = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const heroImageUrl = await resolveAdminImageField(formData, "heroImageUrl", "heroImageUpload");

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      heroTitleKo: String(formData.get("heroTitleKo") ?? ""),
      heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
      heroDescriptionKo: String(formData.get("heroDescriptionKo") ?? ""),
      heroDescriptionEn: String(formData.get("heroDescriptionEn") ?? ""),
      heroImageUrl,
      heroFontSize: Number(formData.get("heroFontSize") ?? 52),
      storyTitleKo: String(formData.get("storyTitleKo") ?? ""),
      storyTitleEn: String(formData.get("storyTitleEn") ?? ""),
      storyBodyKo: String(formData.get("storyBodyKo") ?? ""),
      storyBodyEn: String(formData.get("storyBodyEn") ?? ""),
      storyFontSize: Number(formData.get("storyFontSize") ?? 18),
      storyTitleFontSizeKo: parseBoundedNumber(formData.get("storyTitleFontSizeKo"), 42, 24, 72),
      storyTitleFontSizeEn: parseBoundedNumber(formData.get("storyTitleFontSizeEn"), 42, 24, 72),
      storyEyebrowFontSizeKo: parseBoundedNumber(formData.get("storyEyebrowFontSizeKo"), 18, 12, 36),
      storyEyebrowFontSizeEn: parseBoundedNumber(formData.get("storyEyebrowFontSizeEn"), 18, 12, 36),
      storyBodyFontSizeKo: parseBoundedNumber(formData.get("storyBodyFontSizeKo"), 16, 12, 28),
      storyBodyFontSizeEn: parseBoundedNumber(formData.get("storyBodyFontSizeEn"), 16, 12, 28),
      seriesTitleKo: String(formData.get("seriesTitleKo") ?? ""),
      seriesTitleEn: String(formData.get("seriesTitleEn") ?? ""),
      seriesLeadKo: String(formData.get("seriesLeadKo") ?? ""),
      seriesLeadEn: String(formData.get("seriesLeadEn") ?? ""),
      seoTitleKo: String(formData.get("seoTitleKo") ?? ""),
      seoTitleEn: String(formData.get("seoTitleEn") ?? ""),
      seoDescriptionKo: String(formData.get("seoDescriptionKo") ?? ""),
      seoDescriptionEn: String(formData.get("seoDescriptionEn") ?? ""),
    },
    create: {
      id: 1,
      heroTitleKo: String(formData.get("heroTitleKo") ?? ""),
      heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
      heroDescriptionKo: String(formData.get("heroDescriptionKo") ?? ""),
      heroDescriptionEn: String(formData.get("heroDescriptionEn") ?? ""),
      heroImageUrl,
      heroFontSize: Number(formData.get("heroFontSize") ?? 52),
      storyTitleKo: String(formData.get("storyTitleKo") ?? ""),
      storyTitleEn: String(formData.get("storyTitleEn") ?? ""),
      storyBodyKo: String(formData.get("storyBodyKo") ?? ""),
      storyBodyEn: String(formData.get("storyBodyEn") ?? ""),
      storyFontSize: Number(formData.get("storyFontSize") ?? 18),
      storyTitleFontSizeKo: parseBoundedNumber(formData.get("storyTitleFontSizeKo"), 42, 24, 72),
      storyTitleFontSizeEn: parseBoundedNumber(formData.get("storyTitleFontSizeEn"), 42, 24, 72),
      storyEyebrowFontSizeKo: parseBoundedNumber(formData.get("storyEyebrowFontSizeKo"), 18, 12, 36),
      storyEyebrowFontSizeEn: parseBoundedNumber(formData.get("storyEyebrowFontSizeEn"), 18, 12, 36),
      storyBodyFontSizeKo: parseBoundedNumber(formData.get("storyBodyFontSizeKo"), 16, 12, 28),
      storyBodyFontSizeEn: parseBoundedNumber(formData.get("storyBodyFontSizeEn"), 16, 12, 28),
      seriesTitleKo: String(formData.get("seriesTitleKo") ?? ""),
      seriesTitleEn: String(formData.get("seriesTitleEn") ?? ""),
      seriesLeadKo: String(formData.get("seriesLeadKo") ?? ""),
      seriesLeadEn: String(formData.get("seriesLeadEn") ?? ""),
      seoTitleKo: String(formData.get("seoTitleKo") ?? ""),
      seoTitleEn: String(formData.get("seoTitleEn") ?? ""),
      seoDescriptionKo: String(formData.get("seoDescriptionKo") ?? ""),
      seoDescriptionEn: String(formData.get("seoDescriptionEn") ?? ""),
    },
  });

  if (heroImageUrl && current?.heroImageUrl !== heroImageUrl) {
    await storeHeroHistory(heroImageUrl);
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function updateHeroSection(formData: FormData) {
  const current = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const heroImageUrl = await resolveAdminImageField(formData, "heroImageUrl", "heroImageUpload");

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      heroTitleKo: String(formData.get("heroTitleKo") ?? ""),
      heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
      heroDescriptionKo: String(formData.get("heroDescriptionKo") ?? ""),
      heroDescriptionEn: String(formData.get("heroDescriptionEn") ?? ""),
      heroImageUrl,
      heroFontSize: Number(formData.get("heroFontSize") ?? 52),
    },
    create: {
      id: 1,
      heroTitleKo: String(formData.get("heroTitleKo") ?? ""),
      heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
      heroDescriptionKo: String(formData.get("heroDescriptionKo") ?? ""),
      heroDescriptionEn: String(formData.get("heroDescriptionEn") ?? ""),
      heroImageUrl,
      heroFontSize: Number(formData.get("heroFontSize") ?? 52),
      storyTitleKo: "",
      storyTitleEn: "",
      storyBodyKo: "",
      storyBodyEn: "",
      storyFontSize: 18,
      seriesTitleKo: "Product categories overview",
      seriesTitleEn: "Product categories overview",
      seriesLeadKo: "",
      seriesLeadEn: "",
      seoTitleKo: "",
      seoTitleEn: "",
      seoDescriptionKo: "",
      seoDescriptionEn: "",
    },
  });

  if (heroImageUrl && current?.heroImageUrl !== heroImageUrl) {
    await storeHeroHistory(heroImageUrl);
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function updateStorySection(formData: FormData) {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      storyTitleKo: String(formData.get("storyTitleKo") ?? ""),
      storyTitleEn: String(formData.get("storyTitleEn") ?? ""),
      storyBodyKo: String(formData.get("storyBodyKo") ?? ""),
      storyBodyEn: String(formData.get("storyBodyEn") ?? ""),
      storyFontSize: Number(formData.get("storyFontSize") ?? 18),
      storyTitleFontSizeKo: parseBoundedNumber(formData.get("storyTitleFontSizeKo"), 42, 24, 72),
      storyTitleFontSizeEn: parseBoundedNumber(formData.get("storyTitleFontSizeEn"), 42, 24, 72),
      storyEyebrowFontSizeKo: parseBoundedNumber(formData.get("storyEyebrowFontSizeKo"), 18, 12, 36),
      storyEyebrowFontSizeEn: parseBoundedNumber(formData.get("storyEyebrowFontSizeEn"), 18, 12, 36),
      storyBodyFontSizeKo: parseBoundedNumber(formData.get("storyBodyFontSizeKo"), 16, 12, 28),
      storyBodyFontSizeEn: parseBoundedNumber(formData.get("storyBodyFontSizeEn"), 16, 12, 28),
    },
    create: {
      id: 1,
      heroTitleKo: "",
      heroTitleEn: "",
      heroDescriptionKo: "",
      heroDescriptionEn: "",
      heroImageUrl: null,
      heroFontSize: 52,
      storyTitleKo: String(formData.get("storyTitleKo") ?? ""),
      storyTitleEn: String(formData.get("storyTitleEn") ?? ""),
      storyBodyKo: String(formData.get("storyBodyKo") ?? ""),
      storyBodyEn: String(formData.get("storyBodyEn") ?? ""),
      storyFontSize: Number(formData.get("storyFontSize") ?? 18),
      storyTitleFontSizeKo: parseBoundedNumber(formData.get("storyTitleFontSizeKo"), 42, 24, 72),
      storyTitleFontSizeEn: parseBoundedNumber(formData.get("storyTitleFontSizeEn"), 42, 24, 72),
      storyEyebrowFontSizeKo: parseBoundedNumber(formData.get("storyEyebrowFontSizeKo"), 18, 12, 36),
      storyEyebrowFontSizeEn: parseBoundedNumber(formData.get("storyEyebrowFontSizeEn"), 18, 12, 36),
      storyBodyFontSizeKo: parseBoundedNumber(formData.get("storyBodyFontSizeKo"), 16, 12, 28),
      storyBodyFontSizeEn: parseBoundedNumber(formData.get("storyBodyFontSizeEn"), 16, 12, 28),
      seriesTitleKo: "Product categories overview",
      seriesTitleEn: "Product categories overview",
      seriesLeadKo: "",
      seriesLeadEn: "",
      seoTitleKo: "",
      seoTitleEn: "",
      seoDescriptionKo: "",
      seoDescriptionEn: "",
    },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function updateSeriesSection(formData: FormData) {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      seriesTitleKo: String(formData.get("seriesTitleKo") ?? ""),
      seriesTitleEn: String(formData.get("seriesTitleEn") ?? ""),
      seriesLeadKo: String(formData.get("seriesLeadKo") ?? ""),
      seriesLeadEn: String(formData.get("seriesLeadEn") ?? ""),
    },
    create: {
      id: 1,
      heroTitleKo: "",
      heroTitleEn: "",
      heroDescriptionKo: "",
      heroDescriptionEn: "",
      heroImageUrl: null,
      heroFontSize: 52,
      storyTitleKo: "",
      storyTitleEn: "",
      storyBodyKo: "",
      storyBodyEn: "",
      storyFontSize: 18,
      seriesTitleKo: String(formData.get("seriesTitleKo") ?? ""),
      seriesTitleEn: String(formData.get("seriesTitleEn") ?? ""),
      seriesLeadKo: String(formData.get("seriesLeadKo") ?? ""),
      seriesLeadEn: String(formData.get("seriesLeadEn") ?? ""),
      seoTitleKo: "",
      seoTitleEn: "",
      seoDescriptionKo: "",
      seoDescriptionEn: "",
    },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function updateSeriesCardImage(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.product.update({
    where: { id },
    data: {
      imageUrl: await resolveAdminImageField(formData, "imageUrl", "imageUpload"),
      nameKo: String(formData.get("nameKo") ?? "").trim(),
      nameEn: String(formData.get("nameEn") ?? "").trim(),
      summaryKo: String(formData.get("summaryKo") ?? ""),
      summaryEn: String(formData.get("summaryEn") ?? ""),
    },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

function parseSolutionModuleArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, image, ...bodyParts] = line.split("|");
      return {
        title: title?.trim() ?? "",
        image: image?.trim() ?? "",
        body: bodyParts.join("|").trim(),
      };
    })
    .filter((item) => item.title && item.body);
}

export async function saveManufacturerLogo(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const logoUrl = await resolveAdminImageField(formData, "logoUrl", "logoUpload");
  const data = {
    name: String(formData.get("name") ?? "").trim(),
    logoUrl: logoUrl ?? "",
    href: String(formData.get("href") ?? "").trim() || null,
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };

  if (!data.name || !data.logoUrl) {
    return;
  }

  if (id > 0) {
    await prisma.manufacturerLogo.update({
      where: { id },
      data,
    });
  } else {
    await prisma.manufacturerLogo.create({ data });
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

async function revalidateProductMakerPages(productId: number, makerSlug?: string | null) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  revalidatePath("/ko/products");
  revalidatePath("/en/products");

  if (product?.slug) {
    revalidatePath(`/ko/products/${product.slug}`);
    revalidatePath(`/en/products/${product.slug}`);

    if (makerSlug) {
      revalidatePath(`/ko/products/${product.slug}/${makerSlug}`);
      revalidatePath(`/en/products/${product.slug}/${makerSlug}`);
    }
  }

  revalidateAdminPages();
}

export async function deleteManufacturerLogo(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.manufacturerLogo.delete({ where: { id } });
  revalidatePublicPages();
  revalidateAdminPages();
}

export async function restoreHeroImage(formData: FormData) {
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!imageUrl) {
    return;
  }

  await prisma.siteConfig.update({
    where: { id: 1 },
    data: { heroImageUrl: imageUrl },
  });

  await storeHeroHistory(imageUrl);

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveApplication(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const imageUrl = await resolveAdminImageField(formData, "imageUrl", "imageUpload");
  const detailImageUrl = await resolveAdminImageField(formData, "detailImageUrl", "detailImageUpload");
  const data = {
    slug: String(formData.get("slug") ?? ""),
    titleKo: String(formData.get("titleKo") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    summaryKo: String(formData.get("summaryKo") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? ""),
    imageUrl,
    bulletsKo: parseTextArray(formData.get("bulletsKo")),
    bulletsEn: parseTextArray(formData.get("bulletsEn")),
    detailTitleKo: String(formData.get("detailTitleKo") ?? "").trim() || null,
    detailTitleEn: String(formData.get("detailTitleEn") ?? "").trim() || null,
    detailBodyKo: String(formData.get("detailBodyKo") ?? "").trim() || null,
    detailBodyEn: String(formData.get("detailBodyEn") ?? "").trim() || null,
    detailImageUrl,
    detailBenefitsKo: parseTextArray(formData.get("detailBenefitsKo")),
    detailBenefitsEn: parseTextArray(formData.get("detailBenefitsEn")),
    detailUseCasesKo: parseTextArray(formData.get("detailUseCasesKo")),
    detailUseCasesEn: parseTextArray(formData.get("detailUseCasesEn")),
    detailModulesKo: parseSolutionModuleArray(formData.get("detailModulesKo")),
    detailModulesEn: parseSolutionModuleArray(formData.get("detailModulesEn")),
    detailCtaKo: String(formData.get("detailCtaKo") ?? "").trim() || null,
    detailCtaEn: String(formData.get("detailCtaEn") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };

  if (id > 0) {
    await prisma.application.update({
      where: { id },
      data,
    });
  } else {
    await prisma.application.create({ data });
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function deleteApplication(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.application.delete({
    where: { id },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function savePageHeroConfig(formData: FormData) {
  const pageKey = String(formData.get("pageKey") ?? "").trim();

  if (!pageKey) {
    return;
  }

  const backgroundImageUrl = await resolveAdminImageField(formData, "backgroundImageUrl", "backgroundImageUpload");
  const data = {
    eyebrowKo: String(formData.get("eyebrowKo") ?? "").trim(),
    eyebrowEn: String(formData.get("eyebrowEn") ?? "").trim(),
    titleKo: String(formData.get("titleKo") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim(),
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim(),
    backgroundImageUrl,
    backgroundOpacity: parseOptionalNumber(formData.get("backgroundOpacity"), 0.6),
  };

  await prisma.pageHeroConfig.upsert({
    where: { pageKey },
    update: data,
    create: {
      pageKey,
      ...data,
    },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveDistributorSettings(formData: FormData) {
  const mapImageUrl = await resolveAdminImageField(formData, "mapImageUrl", "mapImageUpload");
  const data = {
    mapImageUrl,
  };

  await prisma.distributorSettings.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data,
    },
  });

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveDistributorRegion(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const data = {
    slug: String(formData.get("slug") ?? "").trim(),
    nameKo: String(formData.get("nameKo") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    descriptionKo: String(formData.get("descriptionKo") ?? "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    enabled: parseBoolean(formData.get("enabled")),
  };

  if (!data.slug || !data.nameKo || !data.nameEn) {
    return;
  }

  if (id > 0) {
    await prisma.distributorRegion.update({
      where: { id },
      data,
    });
  } else {
    await prisma.distributorRegion.create({ data });
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function deleteDistributorRegion(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.distributorRegion.delete({ where: { id } });
  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveDistributorPartner(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const regionId = Number(formData.get("regionId") ?? 0);

  if (!regionId) {
    return;
  }

  const logoUrl = await resolveAdminImageField(formData, "logoUrl", "logoUpload");
  const data = {
    regionId,
    countryKo: String(formData.get("countryKo") ?? "").trim(),
    countryEn: String(formData.get("countryEn") ?? "").trim(),
    companyKo: String(formData.get("companyKo") ?? "").trim(),
    companyEn: String(formData.get("companyEn") ?? "").trim(),
    legalName: String(formData.get("legalName") ?? "").trim() || null,
    addressKo: String(formData.get("addressKo") ?? ""),
    addressEn: String(formData.get("addressEn") ?? ""),
    telephone: String(formData.get("telephone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    logoUrl,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };

  if (!data.countryKo || !data.countryEn || !data.companyKo || !data.companyEn) {
    return;
  }

  if (id > 0) {
    await prisma.distributorPartner.update({
      where: { id },
      data,
    });
  } else {
    await prisma.distributorPartner.create({ data });
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function deleteDistributorPartner(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.distributorPartner.delete({ where: { id } });
  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveProduct(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const imageUrl = await resolveAdminImageField(formData, "imageUrl", "imageUpload");
  const heroBgImageUrl = await resolveAdminImageField(formData, "heroBgImageUrl", "heroBgImageUpload");

  const data = {
    slug: String(formData.get("slug") ?? ""),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    nameKo: String(formData.get("nameKo") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    heroEyebrowKo: String(formData.get("heroEyebrowKo") ?? "").trim() || null,
    heroEyebrowEn: String(formData.get("heroEyebrowEn") ?? "").trim() || null,
    heroTitleKo: String(formData.get("heroTitleKo") ?? "").trim() || null,
    heroTitleEn: String(formData.get("heroTitleEn") ?? "").trim() || null,
    heroLeadKo: String(formData.get("heroLeadKo") ?? "").trim() || null,
    heroLeadEn: String(formData.get("heroLeadEn") ?? "").trim() || null,
    heroBgImageUrl,
    heroBgOpacity: parseOptionalNumber(formData.get("heroBgOpacity"), 0.9),
    summaryKo: String(formData.get("summaryKo") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? ""),
    contentKo: String(formData.get("contentKo") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    featuresKo: parseTextArray(formData.get("featuresKo")),
    featuresEn: parseTextArray(formData.get("featuresEn")),
    applicationsKo: parseTextArray(formData.get("applicationsKo")),
    applicationsEn: parseTextArray(formData.get("applicationsEn")),
    specsKo: parseSpecArray(formData.get("specsKo")),
    specsEn: parseSpecArray(formData.get("specsEn")),
    imageUrl,
    seoTitleKo: String(formData.get("seoTitleKo") ?? "") || null,
    seoTitleEn: String(formData.get("seoTitleEn") ?? "") || null,
    seoDescriptionKo: String(formData.get("seoDescriptionKo") ?? "") || null,
    seoDescriptionEn: String(formData.get("seoDescriptionEn") ?? "") || null,
    published: parseBoolean(formData.get("published")),
  };

  if (id > 0) {
    await prisma.product.update({
      where: { id },
      data,
    });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePublicPages();
  revalidateAdminPages();
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  await prisma.product.delete({ where: { id } });
  revalidatePublicPages();
  revalidateAdminPages();
}

export async function saveProductMaker(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const productId = Number(formData.get("productId") ?? 0);

  if (!productId) {
    throw new Error("Product maker requires a product.");
  }

  const logoUrl = await resolveAdminImageField(formData, "logoUrl", "logoUpload");
  const data = {
    productId,
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    logoUrl: logoUrl ?? "",
    website: String(formData.get("website") ?? "").trim() || null,
    groupKo: String(formData.get("groupKo") ?? "").trim() || null,
    groupEn: String(formData.get("groupEn") ?? "").trim() || null,
    summaryKo: String(formData.get("summaryKo") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? ""),
    descriptionKo: String(formData.get("descriptionKo") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };

  if (!data.slug || !data.name || !data.logoUrl) {
    throw new Error("Product maker requires slug, name, and logo.");
  }

  if (id > 0) {
    await prisma.productMaker.update({
      where: { id },
      data,
    });
  } else {
    await prisma.productMaker.create({ data });
  }

  await revalidateProductMakerPages(productId, data.slug);
}

export async function deleteProductMaker(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  const existing = await prisma.productMaker.findUnique({
    where: { id },
    select: {
      productId: true,
      slug: true,
    },
  });

  if (!existing) {
    return;
  }

  await prisma.productMaker.delete({ where: { id } });
  await revalidateProductMakerPages(existing.productId, existing.slug);
}

export async function saveProductDocument(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const productId = Number(formData.get("productId") ?? 0);
  const currentFileUrl = String(formData.get("currentFileUrl") ?? "").trim() || null;
  const manualFileUrl = String(formData.get("fileUrl") ?? "").trim() || null;
  const attachment = formData.get("attachment");
  const kind =
    String(formData.get("kind") ?? "DATASHEET") === "DRAWING"
      ? ProductDocumentKind.DRAWING
      : ProductDocumentKind.DATASHEET;

  if (!productId) {
    throw new Error("Product document requires a product.");
  }

  let resolvedFile = {
    fileUrl: currentFileUrl,
    fileName: String(formData.get("currentFileName") ?? "").trim() || null,
    mimeType: String(formData.get("currentMimeType") ?? "").trim() || null,
    fileSize: Number(formData.get("currentFileSize") ?? 0) || null,
  };

  if (isUploadedFile(attachment)) {
    resolvedFile = await storeProductDocumentAttachment(attachment);
    if (currentFileUrl && currentFileUrl !== resolvedFile.fileUrl) {
      await removeManagedProductDocument(currentFileUrl);
    }
  } else if (manualFileUrl) {
    resolvedFile = {
      fileUrl: manualFileUrl,
      fileName: path.basename(manualFileUrl.split("?")[0] || manualFileUrl),
      mimeType: null,
      fileSize: null,
    };
    if (currentFileUrl && currentFileUrl !== manualFileUrl) {
      await removeManagedProductDocument(currentFileUrl);
    }
  }

  if (!resolvedFile.fileUrl) {
    throw new Error("Product document requires a file URL or attachment.");
  }

  const data = {
    productId,
    kind,
    titleKo: String(formData.get("titleKo") ?? "").trim() || (kind === "DATASHEET" ? "Data sheet" : "도면"),
    titleEn: String(formData.get("titleEn") ?? "").trim() || (kind === "DATASHEET" ? "Data sheet" : "Drawing"),
    fileUrl: resolvedFile.fileUrl,
    fileName: resolvedFile.fileName,
    mimeType: resolvedFile.mimeType,
    fileSize: resolvedFile.fileSize,
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };

  if (id > 0) {
    await prisma.productDocument.update({
      where: { id },
      data,
    });
  } else {
    await prisma.productDocument.create({ data });
  }

  await revalidateProductDocumentPages(productId);
}

export async function deleteProductDocument(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  const existing = await prisma.productDocument.findUnique({
    where: { id },
    select: { productId: true, fileUrl: true },
  });

  if (!existing) {
    return;
  }

  await prisma.productDocument.delete({ where: { id } });
  await removeManagedProductDocument(existing.fileUrl);
  await revalidateProductDocumentPages(existing.productId);
}

export async function saveResource(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const currentFileUrl = String(formData.get("currentFileUrl") ?? "").trim() || null;
  const currentContentImageUrl = String(formData.get("currentContentImageUrl") ?? "").trim() || null;
  const manualFileUrl = String(formData.get("fileUrl") ?? "").trim() || null;
  const manualContentImageUrl = String(formData.get("contentImageUrl") ?? "").trim() || null;
  const attachment = formData.get("attachment");
  const contentImageUpload = formData.get("contentImageUpload");
  let resolvedFileUrl = currentFileUrl;
  let resolvedContentImageUrl = currentContentImageUrl;

  if (isUploadedFile(attachment)) {
    resolvedFileUrl = await storeResourceAttachment(attachment);
    if (currentFileUrl && currentFileUrl !== resolvedFileUrl) {
      await removeManagedResourceAttachment(currentFileUrl);
    }
  } else if (manualFileUrl) {
    resolvedFileUrl = manualFileUrl;
    if (currentFileUrl && currentFileUrl !== manualFileUrl) {
      await removeManagedResourceAttachment(currentFileUrl);
    }
  }

  if (parseBoolean(formData.get("removeContentImage"))) {
    await removeManagedResourceAttachment(currentContentImageUrl);
    resolvedContentImageUrl = null;
  } else if (isUploadedFile(contentImageUpload)) {
    resolvedContentImageUrl = await storeResourceAttachment(contentImageUpload);
    if (currentContentImageUrl && currentContentImageUrl !== resolvedContentImageUrl) {
      await removeManagedResourceAttachment(currentContentImageUrl);
    }
  } else if (manualContentImageUrl) {
    resolvedContentImageUrl = manualContentImageUrl;
    if (currentContentImageUrl && currentContentImageUrl !== manualContentImageUrl) {
      await removeManagedResourceAttachment(currentContentImageUrl);
    }
  }

  const contentImagePlacement = String(formData.get("contentImagePlacement") ?? "after") === "before" ? "before" : "after";

  const data = {
    slug: String(formData.get("slug") ?? ""),
    displayIndex: Number(formData.get("displayIndex") ?? 1),
    titleKo: String(formData.get("titleKo") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    excerptKo: String(formData.get("excerptKo") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    bodyKo: String(formData.get("bodyKo") ?? ""),
    bodyEn: String(formData.get("bodyEn") ?? ""),
    fileUrl: resolvedFileUrl,
    contentImageUrl: resolvedContentImageUrl,
    contentImageAltKo: String(formData.get("contentImageAltKo") ?? "").trim() || null,
    contentImageAltEn: String(formData.get("contentImageAltEn") ?? "").trim() || null,
    contentImageWidth: parseResourceContentImageWidth(formData.get("contentImageWidth")),
    contentImagePlacement,
    publishedAt: new Date(String(formData.get("publishedAt") ?? new Date().toISOString())),
    published: parseBoolean(formData.get("published")),
  };

  if (id > 0) {
    await prisma.resource.update({
      where: { id },
      data,
    });
  } else {
    await prisma.resource.create({ data });
  }

  revalidatePublicPages();
  revalidatePath(`/ko/contact/resources/${data.slug}`);
  revalidatePath(`/en/contact/resources/${data.slug}`);
  revalidateAdminPages();
}

export async function deleteResource(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  if (!id) {
    return;
  }

  const existing = await prisma.resource.findUnique({
    where: { id },
    select: { fileUrl: true, contentImageUrl: true, slug: true },
  });

  await prisma.resource.delete({ where: { id } });
  await removeManagedResourceAttachment(existing?.fileUrl);
  await removeManagedResourceAttachment(existing?.contentImageUrl);
  revalidatePublicPages();
  if (existing?.slug) {
    revalidatePath(`/ko/contact/resources/${existing.slug}`);
    revalidatePath(`/en/contact/resources/${existing.slug}`);
  }
  revalidateAdminPages();
}

export async function updateInquiryStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: status as "RECEIVED" | "REVIEWING" | "REPLIED",
    },
  });

  revalidateAdminPages();
}

export async function saveInquiryReply(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);

  await prisma.inquiry.update({
    where: { id },
    data: {
      internalNote: String(formData.get("internalNote") ?? "") || null,
      replySubject: String(formData.get("replySubject") ?? "") || null,
      replyBody: String(formData.get("replyBody") ?? "") || null,
      status: (String(formData.get("status") ?? "REVIEWING") || "REVIEWING") as
        | "RECEIVED"
        | "REVIEWING"
        | "REPLIED",
    },
  });

  revalidateAdminPages();
}

export async function sendInquiryReply(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });

  if (!inquiry || !inquiry.replySubject || !inquiry.replyBody) {
    throw new Error("Inquiry reply content is incomplete.");
  }

  await sendInquiryReplyMail({
    to: inquiry.email,
    subject: inquiry.replySubject,
    body: inquiry.replyBody,
  });

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: "REPLIED",
      replySentAt: new Date(),
    },
  });

  revalidateAdminPages();
}

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const seeded = await ensureAdminAccount();
  const admin = await prisma.adminAccount.findUnique({
    where: { username },
  });

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    await logAdminAccess({
      username: username || seeded.username,
      adminId: admin?.id ?? null,
      success: false,
    });
    redirect("/asdasddfg?error=invalid");
  }

  await createAdminSession(admin.id);
  await logAdminAccess({
    username: admin.username,
    adminId: admin.id,
    success: true,
  });
  redirect("/asdasddfg/admin/home");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/asdasddfg");
}

export async function changeAdminPassword(formData: FormData) {
  const session = await requireAdminSession();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const nextPassword = String(formData.get("nextPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!verifyPassword(currentPassword, session.admin.passwordHash)) {
    throw new Error("Current password is incorrect.");
  }

  if (nextPassword.length < 8 || nextPassword !== confirmPassword) {
    throw new Error("New password validation failed.");
  }

  await prisma.adminAccount.update({
    where: { id: session.adminId },
    data: {
      passwordHash: createPasswordHash(nextPassword),
    },
  });

  await clearAdminSession();
  redirect("/asdasddfg?message=password-updated");
}
