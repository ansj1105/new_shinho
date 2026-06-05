import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubpageHero } from "@/components/subpage-hero";
import { getProductBySlug, getProductMakerBySlug } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string; makerSlug: string }>;
}): Promise<Metadata> {
  const { locale, slug, makerSlug } = await params;
  const product = await getProductBySlug(slug);
  const maker = await getProductMakerBySlug(slug, makerSlug);

  if (!product || !product.published || !maker) {
    return buildPageMetadata({
      locale,
      path: `/products/${slug}/${makerSlug}`,
      title: locale === "ko" ? "제품 상세 | 신호텍" : "Product detail | Shinhotek",
      description: locale === "ko" ? "신호텍 제품 상세 페이지입니다." : "Shinhotek product detail page.",
    });
  }

  const productName = locale === "ko" ? product.nameKo : product.nameEn;
  const description = locale === "ko" ? maker.descriptionKo : maker.descriptionEn;

  return buildPageMetadata({
    locale,
    path: `/products/${slug}/${makerSlug}`,
    title: `${maker.name} | ${productName} | ${locale === "ko" ? "신호텍" : "Shinhotek"}`,
    description,
    keywords: [maker.name, product.nameKo, product.nameEn, "Shinhotek", "laser", "optical solution"],
    image: maker.logoUrl,
    type: "article",
    category: "Manufacturer product detail",
  });
}

export default async function ProductMakerDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string; makerSlug: string }>;
}) {
  const { locale, slug, makerSlug } = await params;
  const product = await getProductBySlug(slug);
  const maker = await getProductMakerBySlug(slug, makerSlug);

  if (!product || !product.published || !maker) {
    notFound();
  }

  const productName = locale === "ko" ? product.nameKo : product.nameEn;
  const makerSummary = locale === "ko" ? maker.summaryKo : maker.summaryEn;
  const makerDescription = locale === "ko" ? maker.descriptionKo : maker.descriptionEn;
  const heroBgImage = product.heroBgImageUrl || "/subpage-products-laser-bg.png";

  return (
    <div className={`productsPage productMakerDetailPage productMakerDetailPage-${slug}`}>
      <SubpageHero
        eyebrow={productName}
        title={maker.name}
        description={makerSummary}
        tone="products"
        backgroundImageUrl={heroBgImage}
        backgroundOpacity={product.heroBgOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="productMakerDetailHero">
          <div className="productMakerDetailLogoPanel">
            <Image src={maker.logoUrl} alt={maker.name} fill sizes="(max-width: 760px) 80vw, 360px" />
          </div>
          <div className="productMakerDetailCopy">
            <span>{locale === "ko" ? "제조사 상세" : "Manufacturer detail"}</span>
            <h2>{maker.name}</h2>
            <p>{makerDescription}</p>
            <dl className="productMakerDetailFacts">
              <div>
                <dt>{locale === "ko" ? "제품군" : "Product group"}</dt>
                <dd>{productName}</dd>
              </div>
              <div>
                <dt>{locale === "ko" ? "적용 분야" : "Application"}</dt>
                <dd>{makerSummary}</dd>
              </div>
              <div>
                <dt>{locale === "ko" ? "지원 범위" : "Support"}</dt>
                <dd>{locale === "ko" ? "사양 검토 / 테스트 상담 / 적용 제안" : "Specification review / test consultation / application proposal"}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="productMakerDetailBody">
          <article className="productMakerDetailCard">
            <span>{locale === "ko" ? "검토 항목" : "Review scope"}</span>
            <h3>{locale === "ko" ? "공정 조건 기반 제품 검토" : "Product review by process requirements"}</h3>
            <p>
              {locale === "ko"
                ? "신호텍은 제조사별 라인업을 단순 연결하지 않고 출력, 파장, 빔 품질, 광학 구성, 설치 조건을 함께 검토해 적용 가능성을 확인합니다."
                : "SHINHOTEK reviews output, wavelength, beam quality, optical configuration, and installation conditions rather than only forwarding manufacturer lineups."}
            </p>
          </article>
          <article className="productMakerDetailCard">
            <span>{locale === "ko" ? "신호텍 지원" : "Shinhotek support"}</span>
            <h3>{locale === "ko" ? "문의부터 적용까지 연결" : "From inquiry to implementation"}</h3>
            <p>
              {locale === "ko"
                ? "필요 사양 정리, 제조사 기술 확인, 대체 제품 제안, 테스트 및 데모 상담까지 프로젝트 흐름에 맞춰 지원합니다."
                : "We support requirement clarification, manufacturer technical checks, alternative product suggestions, and test or demo consultation according to the project flow."}
            </p>
          </article>
        </section>

        <div className="productMakerDetailActions">
          <Link href={`/${locale}/products/${slug}`} className="button secondary">
            {locale === "ko" ? "제품군으로 돌아가기" : "Back to product group"}
          </Link>
          <Link href={`/${locale}/contact/quote`} className="button">
            {locale === "ko" ? "문의하기" : "Contact us"}
          </Link>
          {maker.website ? (
            <a href={maker.website} target="_blank" rel="noreferrer" className="button secondary">
              {locale === "ko" ? "제조사 홈페이지" : "Manufacturer website"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
