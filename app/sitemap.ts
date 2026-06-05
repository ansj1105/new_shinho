import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { localeAlternates } from "@/lib/seo";
import { locales, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, resources] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      include: {
        makers: {
          where: { published: true },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    prisma.resource.findMany({ where: { published: true } }),
  ]);

  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/company/ceo-vision", priority: 0.75 },
    { path: "/company/partners", priority: 0.72 },
    { path: "/company/directions", priority: 0.72 },
    { path: "/applications", priority: 0.85 },
    { path: "/products", priority: 0.9 },
    { path: "/contact", priority: 0.78 },
    { path: "/contact/quote", priority: 0.75 },
    { path: "/contact/test-demo", priority: 0.7 },
    { path: "/contact/resources", priority: 0.65 },
    { path: "/legal/privacy", priority: 0.25 },
    { path: "/legal/terms", priority: 0.25 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority } of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path ? "monthly" : "weekly",
        priority,
        alternates: {
          languages: localeAlternates(path),
        },
      });
    }

    for (const product of products) {
      const productPath = `/products/${product.slug}`;

      entries.push({
        url: `${siteUrl}/${locale}${productPath}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly",
        priority: 0.85,
        alternates: {
          languages: localeAlternates(productPath),
        },
      });

      for (const maker of product.makers) {
        const makerPath = `${productPath}/${maker.slug}`;

        entries.push({
          url: `${siteUrl}/${locale}${makerPath}`,
          lastModified: product.updatedAt,
          changeFrequency: "monthly",
          priority: 0.72,
          alternates: {
            languages: localeAlternates(makerPath),
          },
        });
      }
    }

    for (const resource of resources) {
      entries.push({
        url: `${siteUrl}/${locale}/contact/resources/${resource.slug}`,
        lastModified: resource.updatedAt,
        changeFrequency: "monthly",
        priority: 0.55,
        alternates: {
          languages: localeAlternates(`/contact/resources/${resource.slug}`),
        },
      });
    }
  }

  return entries;
}
