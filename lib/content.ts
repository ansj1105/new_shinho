import {
  defaultApplications,
  defaultCompanyContent,
  defaultDistributorRegions,
  defaultDistributorSettings,
  defaultManufacturerLogos,
  defaultPageHeroConfigs,
  defaultProducts,
  defaultResources,
  defaultSiteConfig,
} from "@/lib/default-content";
import { prisma } from "@/lib/prisma";
import { productCategoryMakers } from "@/lib/product-makers";
import type { Locale } from "@/lib/site";

const fallbackNow = new Date();

const fallbackSiteConfig = {
  ...defaultSiteConfig,
  heroImageHistory: [],
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
};

const fallbackApplications = defaultApplications.map((application, index) => ({
  id: index + 1,
  ...application,
  sortOrder: index + 1,
  published: true,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
}));

const retiredDefaultProductSlugs = new Set(["beam-shaping", "optics"]);

const fallbackProducts = defaultProducts.map((product, index) => ({
  id: index + 1,
  ...product,
  published: true,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
}));

const fallbackManufacturerLogos = defaultManufacturerLogos.map((logo, index) => ({
  id: index + 1,
  ...logo,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
}));

const fallbackProductMakers = Object.fromEntries(
  Object.entries(productCategoryMakers).map(([productSlug, makers]) => [
    productSlug,
    makers.map((maker, index) => ({
      id: index + 1,
      productId: 0,
      ...maker,
      website: maker.website ?? null,
      displayOrder: index + 1,
      published: true,
      createdAt: fallbackNow,
      updatedAt: fallbackNow,
    })),
  ]),
);

const fallbackResources = defaultResources.map((resource, index) => ({
  id: index + 1,
  ...resource,
  contentImageUrl: null,
  contentImageAltKo: null,
  contentImageAltEn: null,
  contentImageWidth: null,
  contentImagePlacement: "after",
  published: true,
  publishedAt: fallbackNow,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
}));

const fallbackPageHeroConfigs = defaultPageHeroConfigs.map((config, index) => ({
  id: index + 1,
  ...config,
  backgroundImageUrl: config.backgroundImageUrl ?? null,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
}));

const fallbackCompanyContent = {
  ...defaultCompanyContent,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
};

const fallbackDistributorSettings = {
  ...defaultDistributorSettings,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
};

const fallbackDistributorRegions = defaultDistributorRegions.map((region, index) => ({
  id: index + 1,
  slug: region.slug,
  nameKo: region.nameKo,
  nameEn: region.nameEn,
  descriptionKo: region.descriptionKo,
  descriptionEn: region.descriptionEn,
  sortOrder: region.sortOrder,
  enabled: region.enabled,
  createdAt: fallbackNow,
  updatedAt: fallbackNow,
  partners: region.partners.map((partner, partnerIndex) => ({
    id: partnerIndex + 1,
    regionId: index + 1,
    ...partner,
    createdAt: fallbackNow,
    updatedAt: fallbackNow,
  })),
}));

function normalizePageHeroLabel<T extends { pageKey: string; titleKo: string; titleEn: string }>(
  config: T,
) {
  if (config.pageKey === "applications") {
    return { ...config, titleKo: "솔루션소개", titleEn: "Solution" };
  }

  if (config.pageKey === "products") {
    return { ...config, eyebrowKo: "제품", titleKo: "제품소개", titleEn: "Product" };
  }

  return config;
}

type PageHeroConfigLike = {
  id: number;
  pageKey: string;
  eyebrowKo: string;
  eyebrowEn: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  backgroundImageUrl: string | null;
  backgroundOpacity: number;
  createdAt: Date;
  updatedAt: Date;
};

function mergePageHeroConfigs(configs: PageHeroConfigLike[]) {
  const configMap = new Map(configs.map((config) => [config.pageKey, config]));

  return fallbackPageHeroConfigs.map((fallbackConfig) =>
    normalizePageHeroLabel(configMap.get(fallbackConfig.pageKey) ?? fallbackConfig),
  );
}

function logFallback(scope: string, error: unknown) {
  console.warn(`[content] falling back to static data for ${scope}`);
  if (process.env.NODE_ENV !== "production") {
    console.warn(error);
  }
}

export async function getSiteConfig() {
  try {
    return await prisma.siteConfig.findUnique({
      where: { id: 1 },
      include: {
        heroImageHistory: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch (error) {
    logFallback("siteConfig", error);
    return fallbackSiteConfig;
  }
}

export async function getApplications() {
  try {
    const applications = await prisma.application.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });

    return applications.length ? applications : fallbackApplications;
  } catch (error) {
    logFallback("applications", error);
    return fallbackApplications;
  }
}

export async function getCompanyContent() {
  try {
    return (await prisma.companyContent.findUnique({ where: { id: 1 } })) ?? fallbackCompanyContent;
  } catch (error) {
    logFallback("companyContent", error);
    return fallbackCompanyContent;
  }
}

export async function getProducts() {
  try {
    const products = (await prisma.product.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    })).filter((product) => !retiredDefaultProductSlugs.has(product.slug));

    const mergedProducts = fallbackProducts.map((fallbackProduct) => {
      const existingProduct = products.find((product) => product.slug === fallbackProduct.slug);

      return existingProduct ?? fallbackProduct;
    });

    const extraProducts = products.filter(
      (product) => !fallbackProducts.some((fallbackProduct) => fallbackProduct.slug === product.slug),
    );

    return [...mergedProducts, ...extraProducts].sort(
      (a, b) => a.displayOrder - b.displayOrder || a.createdAt.getTime() - b.createdAt.getTime(),
    );
  } catch (error) {
    logFallback("products", error);
    return fallbackProducts;
  }
}

export async function getManufacturerLogos() {
  try {
    const logos = await prisma.manufacturerLogo.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });

    return logos.length ? logos : fallbackManufacturerLogos;
  } catch (error) {
    logFallback("manufacturerLogos", error);
    return fallbackManufacturerLogos;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        documents: {
          where: { published: true },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!product) {
      return fallbackProducts.find((item) => item.slug === slug) ?? null;
    }

    return product;
  } catch (error) {
    logFallback(`product:${slug}`, error);
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getProductMakersByProductSlug(productSlug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: {
        makers: {
          where: { published: true },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    return product?.makers.length ? product.makers : fallbackProductMakers[productSlug] ?? [];
  } catch (error) {
    logFallback(`productMakers:${productSlug}`, error);
    return fallbackProductMakers[productSlug] ?? [];
  }
}

export async function getProductMakerBySlug(productSlug: string, makerSlug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: {
        makers: {
          where: {
            slug: makerSlug,
            published: true,
          },
          take: 1,
        },
      },
    });

    return product?.makers[0] ?? fallbackProductMakers[productSlug]?.find((maker) => maker.slug === makerSlug) ?? null;
  } catch (error) {
    logFallback(`productMaker:${productSlug}/${makerSlug}`, error);
    return fallbackProductMakers[productSlug]?.find((maker) => maker.slug === makerSlug) ?? null;
  }
}

export async function getProductMakersForAdmin() {
  try {
    return await prisma.productMaker.findMany({
      orderBy: [{ productId: "asc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    logFallback("productMakersAdmin", error);
    return [];
  }
}

export async function getResources() {
  try {
    return await prisma.resource.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    logFallback("resources", error);
    return fallbackResources;
  }
}

export async function getResourceBySlug(slug: string) {
  try {
    return await prisma.resource.findUnique({
      where: { slug },
    });
  } catch (error) {
    logFallback(`resource:${slug}`, error);
    return fallbackResources.find((resource) => resource.slug === slug) ?? null;
  }
}

export async function getPageHeroConfigs() {
  try {
    const configs = await prisma.pageHeroConfig.findMany({
      orderBy: { pageKey: "asc" },
    });
    return mergePageHeroConfigs(configs);
  } catch (error) {
    logFallback("pageHeroConfigs", error);
    return fallbackPageHeroConfigs;
  }
}

export async function getPageHeroConfig(pageKey: string) {
  try {
    const config = await prisma.pageHeroConfig.findUnique({
      where: { pageKey },
    });
    return config
      ? normalizePageHeroLabel(config)
      : (fallbackPageHeroConfigs.find((fallbackConfig) => fallbackConfig.pageKey === pageKey) ?? null);
  } catch (error) {
    logFallback(`pageHeroConfig:${pageKey}`, error);
    return fallbackPageHeroConfigs.find((config) => config.pageKey === pageKey) ?? null;
  }
}

export async function getDistributorDirectory({ includeDisabled = false } = {}) {
  try {
    const [settings, regions] = await Promise.all([
      prisma.distributorSettings.findUnique({ where: { id: 1 } }),
      prisma.distributorRegion.findMany({
        where: includeDisabled ? undefined : { enabled: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        include: {
          partners: {
            where: includeDisabled ? undefined : { published: true },
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          },
        },
      }),
    ]);

    return {
      settings: settings ?? fallbackDistributorSettings,
      regions: regions.length ? regions : fallbackDistributorRegions,
    };
  } catch (error) {
    logFallback("distributorDirectory", error);
    return {
      settings: fallbackDistributorSettings,
      regions: fallbackDistributorRegions,
    };
  }
}

export function pickLocalized<T extends Record<string, unknown>>(
  data: T,
  locale: Locale,
  field: string,
) {
  const suffix = locale === "ko" ? "Ko" : "En";
  return data[`${field}${suffix}` as keyof T];
}


