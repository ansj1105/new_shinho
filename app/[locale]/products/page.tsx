import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { Metadata } from "next";

import { SubpageHero } from "@/components/subpage-hero";
import { getPageHeroConfig, getProducts } from "@/lib/content";
import { defaultProducts } from "@/lib/default-content";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const productOverviewCopy: Record<string, { title: string; bodyEn: string; bodyKo: string }> = {};

const productFallbackImages: Record<string, string> = {
  laser: "/hero-main-laser.png",
  "laser-scanner": "/subpage-products-laser-bg.png",
  "laser-metrology": "/hero-lab-bg.avif",
  "optical-solution": "/subpage-software-bg.png",
  "coating-solution": "/story-origin-lab.png",
  "beam-delivery": "/subpage-products-laser-bg.png",
};

const productShowcaseImageClasses: Record<string, string> = {
  laser: "isPhoto",
  "laser-scanner": "isPhoto",
  "laser-metrology": "isPhoto",
  "optical-solution": "isPhoto",
  "coating-solution": "isPhoto",
  "beam-delivery": "isPhoto",
};

const productCategoryTags: Record<string, { ko: string[]; en: string[] }> = {
  laser: {
    ko: ["CO2 Laser", "DPSS / Fiber", "Ultrafast", "Diode / Excimer"],
    en: ["CO2 Laser", "DPSS / Fiber", "Ultrafast", "Diode / Excimer"],
  },
  "laser-scanner": {
    ko: ["2D / 3D Scanner", "Polygon Scanner", "Drilling Head", "Control Software"],
    en: ["2D / 3D Scanner", "Polygon Scanner", "Drilling Head", "Control Software"],
  },
  "laser-metrology": {
    ko: ["Power Meter", "Energy Meter", "Beam Analysis", "Sensors"],
    en: ["Power Meter", "Energy Meter", "Beam Analysis", "Sensors"],
  },
  "optical-solution": {
    ko: ["Optical Design", "Custom Assembly", "Beam Shaping", "Process Review"],
    en: ["Optical Design", "Custom Assembly", "Beam Shaping", "Process Review"],
  },
  "coating-solution": {
    ko: ["AR Coating", "HR Coating", "High Power Optics", "Custom Coating"],
    en: ["AR Coating", "HR Coating", "High Power Optics", "Custom Coating"],
  },
  "beam-delivery": {
    ko: ["Beam Expander", "Delivery Optics", "Optical Head", "Path Configuration"],
    en: ["Beam Expander", "Delivery Optics", "Optical Head", "Path Configuration"],
  },
};

const defaultProductMap = new Map(defaultProducts.map((product) => [product.slug, product]));

function splitProductParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderProductLines(paragraph: string) {
  return paragraph.split("\n").map((line, index) => (
    <span key={`${index}-${line}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

function getManagedProductSummary(
  product: { slug: string; summaryKo: string; summaryEn: string },
  locale: Locale,
) {
  const staticOverview = productOverviewCopy[product.slug as keyof typeof productOverviewCopy];
  const defaultProduct = defaultProductMap.get(product.slug);
  const summary = locale === "ko" ? product.summaryKo : product.summaryEn;
  const defaultSummary = locale === "ko" ? defaultProduct?.summaryKo : defaultProduct?.summaryEn;
  const staticSummary = staticOverview ? (locale === "ko" ? staticOverview.bodyKo : staticOverview.bodyEn) : "";
  const normalizedSummary = summary.trim();
  const normalizedDefaultSummary = defaultSummary?.trim() ?? "";
  const normalizedStaticSummary = staticSummary.trim();

  if (
    staticOverview &&
    (!normalizedSummary ||
      normalizedSummary === normalizedDefaultSummary ||
      normalizedSummary === normalizedStaticSummary)
  ) {
    return staticSummary;
  }

  return summary;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";

  return buildPageMetadata({
    locale,
    path: "/products",
    title: isKo
      ? "제품소개 | 신호텍 레이저·광학 제품"
      : "Product | Shinhotek Laser and Optical Products",
    description: isKo
      ? "Laser, Laser Scanner, Laser Metrology, Optical Solution, Coating Solution, Beam Delivery 제품군을 확인하세요."
      : "Review Shinhotek product categories including lasers, scanners, metrology systems, optical solutions, coating solutions, and beam delivery systems.",
    keywords: [
      "Product",
      "Shinhotek product",
      "industrial laser",
      "laser scanner",
      "laser metrology",
      "optical solution",
      "beam delivery",
    ],
    image: "/subpage-products-laser-bg.png",
  });
}

function getProductShowcaseImage(slug: string, imageUrl?: string | null) {
  if (imageUrl?.startsWith("/uploads/images/")) {
    const relativePath = imageUrl.replace(/^\/+/, "");
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    if (existsSync(absolutePath)) {
      return imageUrl;
    }
  }

  return imageUrl || productFallbackImages[slug] || "/product-placeholder.svg";
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [products, heroConfig] = await Promise.all([getProducts(), getPageHeroConfig("products")]);
  const productsHeroBackgroundImage =
    !heroConfig?.backgroundImageUrl ||
    heroConfig.backgroundImageUrl === "/subpage-products-hero.png" ||
    heroConfig.backgroundImageUrl === "/subpage-products-hero-pc.png" ||
    heroConfig.backgroundImageUrl === "/subpage-products-laser-bg.png"
      ? "/subpage-products-laser-bg.png"
      : heroConfig.backgroundImageUrl;

  return (
    <div className="productsPage">
      <SubpageHero
        eyebrow={locale === "ko" ? heroConfig?.eyebrowKo || "제품" : heroConfig?.eyebrowEn || "Product"}
        title={locale === "ko" ? heroConfig?.titleKo || dict.products.title : heroConfig?.titleEn || dict.products.title}
        description={
          locale === "ko" ? heroConfig?.descriptionKo || dict.products.lead : heroConfig?.descriptionEn || dict.products.lead
        }
        tone="products"
        backgroundImageUrl={productsHeroBackgroundImage}
        desktopBackgroundImageUrl={productsHeroBackgroundImage}
        backgroundOpacity={heroConfig?.backgroundOpacity ?? 0.9}
      />
      <div className="container subpageContent">
        <section className="productsShowcaseHead">
          <h2>{locale === "ko" ? "제품소개" : "Products"}</h2>
          <p>
            {locale === "ko"
              ? "SHINHOTEK은 레이저, 스캐너, 계측, 광학 솔루션까지 공정 목적에 맞는 제품군을 제공합니다."
              : "SHINHOTEK provides product categories for laser, scanner, metrology, and optical process requirements."}
          </p>
        </section>

        <nav className="productLineupRail" aria-label={locale === "ko" ? "제품군 바로가기" : "Product lineup"}>
          <div className="productLineupRailHead">
            <span>PRODUCT LINE UP</span>
            <strong>{locale === "ko" ? "제조 공정별 제품군" : "Product categories by process"}</strong>
          </div>
          <div className="productLineupRailLinks">
            {products.map((product) => (
              <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
                {locale === "ko" ? product.nameKo : product.nameEn}
              </Link>
            ))}
          </div>
        </nav>

        <div className="productsShowcase">
          {products.map((product) => {
            const detailHref = `/${locale}/products/${product.slug}`;
            const localizedTitle = locale === "ko" ? product.nameKo : product.nameEn;
            const localizedSummary = getManagedProductSummary(product, locale);
            const tags = productCategoryTags[product.slug]?.[locale] ?? [];

            return (
              <article key={product.slug} className="productShowcaseRow">
                <Link href={detailHref} className="productShowcaseMedia" data-product-slug={product.slug}>
                  <Image
                    src={getProductShowcaseImage(product.slug, product.imageUrl)}
                    alt={locale === "ko" ? product.nameKo : product.nameEn}
                    width={1200}
                    height={900}
                    sizes="(max-width: 960px) 100vw, 280px"
                    className={`productShowcaseImage ${productShowcaseImageClasses[product.slug as keyof typeof productShowcaseImageClasses] ?? ""}`.trim()}
                  />
                </Link>
                <div className="productShowcaseBody">
                  <Link href={detailHref} className="productShowcaseTextLink">
                    <h2 className="productShowcaseTitle">{localizedTitle}</h2>
                  </Link>
                  <div className="productShowcaseText">
                    {splitProductParagraphs(localizedSummary).map((paragraph, index) => (
                      <p key={`${product.slug}-summary-${index}`}>{renderProductLines(paragraph)}</p>
                    ))}
                  </div>
                  {tags.length > 0 ? (
                    <ul className="productShowcaseTags" aria-label={locale === "ko" ? "주요 구성" : "Key lineup"}>
                      {tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                  <Link href={detailHref} className="productShowcaseMore">
                    SEE MORE
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
