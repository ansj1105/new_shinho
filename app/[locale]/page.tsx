import type { Metadata } from "next";

import { HomeSeriesOverview } from "@/components/home-series-overview";
import { HomeSolutionSection } from "@/components/home-solution-section";
import { Hero } from "@/components/hero";
import { getApplications, getManufacturerLogos, getPageHeroConfig, getProducts, getSiteConfig } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return buildPageMetadata({
    locale,
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await connection();

  const { locale } = await params;
  const [config, products, applications, contactHeroConfig, manufacturerLogos] = await Promise.all([
    getSiteConfig(),
    getProducts(),
    getApplications(),
    getPageHeroConfig("contact"),
    getManufacturerLogos(),
  ]);

  return (
    <>
      <Hero
        locale={locale}
        heroImageUrl={config?.heroImageUrl}
        title={locale === "ko" ? config?.heroTitleKo : config?.heroTitleEn}
        description={locale === "ko" ? config?.heroDescriptionKo : config?.heroDescriptionEn}
      />
      <HomeSeriesOverview
        locale={locale}
        title={locale === "ko" ? config?.seriesTitleKo : config?.seriesTitleEn}
        lead={locale === "ko" ? config?.seriesLeadKo : config?.seriesLeadEn}
        products={products}
      />

      <HomeSolutionSection
        locale={locale}
        title={locale === "ko" ? config?.storyTitleKo : config?.storyTitleEn}
        lead={locale === "ko" ? config?.storyBodyKo : config?.storyBodyEn}
        solutions={applications}
        contactTitle={locale === "ko" ? contactHeroConfig?.titleKo : contactHeroConfig?.titleEn}
        contactLead={locale === "ko" ? contactHeroConfig?.descriptionKo : contactHeroConfig?.descriptionEn}
        manufacturerLogos={manufacturerLogos}
      />
    </>
  );
}

