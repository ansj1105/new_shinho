import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubpageHero } from "@/components/subpage-hero";
import { getProductBySlug, getProductMakersByProductSlug } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    return buildPageMetadata({
      locale,
      path: `/products/${slug}`,
      title: locale === "ko" ? "제품 | 신호텍" : "Product | Shinhotek",
      description: locale === "ko" ? "신호텍 제품 상세 페이지입니다." : "Shinhotek product detail page.",
    });
  }

  const title = locale === "ko" ? product.seoTitleKo || `${product.nameKo} | 신호텍` : product.seoTitleEn || `${product.nameEn} | Shinhotek`;
  const description = locale === "ko" ? product.seoDescriptionKo || product.summaryKo : product.seoDescriptionEn || product.summaryEn;
  const image = product.imageUrl || product.heroBgImageUrl || "/product-placeholder.svg";

  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title,
    description,
    keywords: [product.nameKo, product.nameEn, "Shinhotek product", "industrial laser", "optical solution"],
    image,
    type: "article",
    category: "Product category",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    notFound();
  }

  const localizedProductName = locale === "ko" ? product.nameKo : product.nameEn;
  const localizedSummary = locale === "ko" ? product.summaryKo : product.summaryEn;
  const heroTitle = locale === "ko" ? product.heroTitleKo || localizedProductName : product.heroTitleEn || localizedProductName;
  const heroLead = locale === "ko" ? product.heroLeadKo || localizedSummary : product.heroLeadEn || localizedSummary;
  const heroEyebrow = locale === "ko" ? product.heroEyebrowKo || "Product" : product.heroEyebrowEn || "Product";
  const heroBgImage = product.heroBgImageUrl || "/subpage-products-laser-bg.png";
  const makers = await getProductMakersByProductSlug(slug);

  return (
    <div className={`productsPage productCategoryPage productCategoryPage-${slug}`}>
      <SubpageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        description={heroLead}
        tone="products"
        backgroundImageUrl={heroBgImage}
        backgroundOpacity={product.heroBgOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="productMakerPageHead">
          <h2>{localizedProductName}</h2>
          <p>{localizedSummary}</p>
        </section>

        <section className="productMakerGrid" aria-label={locale === "ko" ? "제조사 목록" : "Manufacturer list"}>
          {makers.map((maker) => (
            <Link key={maker.slug} href={`/${locale}/products/${slug}/${maker.slug}`} className="productMakerCard">
              <span className="productMakerLogo">
                <Image src={maker.logoUrl} alt={maker.name} fill sizes="(max-width: 760px) 50vw, 220px" />
              </span>
              <strong>{maker.name}</strong>
              <em>{locale === "ko" ? maker.summaryKo : maker.summaryEn}</em>
            </Link>
          ))}
        </section>

        <section className="productMakerSupport">
          <div>
            <span>{locale === "ko" ? "제품 선정 지원" : "Selection support"}</span>
            <p>
              {locale === "ko"
                ? "제조사별 제품 사양과 공정 조건을 검토해 적합한 제품군을 안내합니다."
                : "We review manufacturer specifications and process requirements to recommend suitable products."}
            </p>
          </div>
          <a href={`/${locale}/contact/quote`}>{locale === "ko" ? "문의하기" : "Contact us"}</a>
        </section>
      </div>
    </div>
  );
}
