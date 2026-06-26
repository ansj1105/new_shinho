import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubpageHero } from "@/components/subpage-hero";
import { getProductBySlug, getProductMakerBySlug } from "@/lib/content";
import { getProductMakerDetailContent } from "@/lib/product-maker-detail-content";
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
  const detail = getProductMakerDetailContent(slug, makerSlug);

  if (!product || !product.published || !maker) {
    return buildPageMetadata({
      locale,
      path: `/products/${slug}/${makerSlug}`,
      title: locale === "ko" ? "제품 상세 | 신호텍" : "Product detail | Shinhotek",
      description: locale === "ko" ? "신호텍 제품 상세 페이지입니다." : "Shinhotek product detail page.",
    });
  }

  const productName = locale === "ko" ? product.nameKo : product.nameEn;
  const description = detail
    ? locale === "ko"
      ? detail.leadKo
      : detail.leadEn
    : locale === "ko"
      ? maker.descriptionKo
      : maker.descriptionEn;

  return buildPageMetadata({
    locale,
    path: `/products/${slug}/${makerSlug}`,
    title: `${maker.name} | ${productName} | ${locale === "ko" ? "신호텍" : "Shinhotek"}`,
    description,
    keywords: [maker.name, product.nameKo, product.nameEn, "Shinhotek", "laser", "optical solution"],
    image: detail?.heroImage ?? maker.logoUrl,
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
  const detail = getProductMakerDetailContent(slug, makerSlug);
  const detailHeadline = detail ? (locale === "ko" ? detail.headlineKo : detail.headlineEn) : maker.name;
  const detailLead = detail ? (locale === "ko" ? detail.leadKo : detail.leadEn) : makerDescription;
  const detailLabel = detail ? (locale === "ko" ? detail.labelKo : detail.labelEn) : productName;
  const detailReference = detail ? (locale === "ko" ? detail.referenceKo : detail.referenceEn) : null;
  const detailNotes = detail ? (locale === "ko" ? detail.notesKo : detail.notesEn) : [];
  const detailBlocks = detail?.blocks ?? [];
  const detailProductGroups = detail?.productGroups ?? [];
  const heroBgImage = product.heroBgImageUrl || "/subpage-products-laser-bg.png";
  const primaryImage = detail?.heroImage ?? maker.logoUrl;

  return (
    <div className={`productsPage productMakerDetailPage productMakerDetailPage-${slug} productMakerDetailPage-${makerSlug}`}>
      <SubpageHero
        eyebrow={productName}
        title={maker.name}
        description={makerSummary}
        tone="products"
        backgroundImageUrl={heroBgImage}
        backgroundOpacity={product.heroBgOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="makerDetailIntro">
          <div className="makerDetailIntroMedia">
            <Image src={primaryImage} alt={maker.name} fill sizes="(max-width: 900px) 100vw, 520px" priority />
          </div>
          <div className="makerDetailIntroCopy">
            <span>{detailLabel}</span>
            <h2>{detailHeadline}</h2>
            <p>{detailLead}</p>
            {detailReference ? <em>{detailReference}</em> : null}
            {detailNotes.length ? (
              <ul>
                {detailNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <section className="makerDetailProductSection" aria-label={locale === "ko" ? "제품 구성" : "Product lineup"}>
          <div className="makerDetailSectionHead">
            <span>{locale === "ko" ? "제품 구성" : "Product lineup"}</span>
            <h2>{locale === "ko" ? "제조사 제품 구성과 적용 검토" : "Manufacturer lineup and application review"}</h2>
            <p>
              {locale === "ko"
                ? "제조사 제품군을 이미지, 기본 정보, 적용 검토 항목 중심으로 한 화면에서 확인할 수 있도록 정리했습니다."
                : "Manufacturer lineups are organized around product visuals, key descriptions, and application review points in one flow."}
            </p>
          </div>

          {detailProductGroups.length ? (
            <div className="makerDetailCatalog" aria-label={locale === "ko" ? "제조사 제품 목록" : "Manufacturer products"}>
              {detailProductGroups.map((group) => {
                const groupTitle = locale === "ko" ? group.titleKo : group.titleEn;

                return (
                  <section key={groupTitle} className="makerDetailCatalogGroup" aria-labelledby={`maker-detail-group-${groupTitle}`}>
                    <h3 id={`maker-detail-group-${groupTitle}`}>{groupTitle}</h3>
                    <div className="makerDetailCatalogGrid">
                      {group.products.map((productItem) => {
                        const specs = locale === "ko" ? productItem.specsKo : productItem.specsEn;

                        return (
                          <article key={productItem.name} className="makerDetailCatalogCard">
                            {productItem.image ? (
                              <div className="makerDetailCatalogMedia">
                                <Image src={productItem.image} alt={productItem.name} fill sizes="(max-width: 760px) 80vw, 240px" />
                              </div>
                            ) : null}
                            <div className="makerDetailCatalogCopy">
                              <span>{maker.name}</span>
                              <h4>{productItem.name}</h4>
                              <ul>
                                {specs.map((spec) => (
                                  <li key={spec}>{spec}</li>
                                ))}
                              </ul>
                            </div>
                            {maker.website ? (
                              <a href={maker.website} target="_blank" rel="noreferrer" className="makerDetailCatalogButton">
                                SEE MORE
                              </a>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : detailBlocks.length ? (
            <div className="makerDetailProductGrid">
              {detailBlocks.map((item) => {
                const title = locale === "ko" ? item.titleKo : item.titleEn;
                const body = locale === "ko" ? item.bodyKo : item.bodyEn;

                return (
                  <article key={title} className="makerDetailProductCard">
                    {item.image ? (
                      <div className="makerDetailProductMedia">
                        <Image src={item.image} alt={title} fill sizes="(max-width: 760px) 100vw, 360px" />
                      </div>
                    ) : null}
                    <div className="makerDetailProductCopy">
                      <span className="makerDetailCardMaker">{maker.name}</span>
                      <h3>{title}</h3>
                      <p>{body}</p>
                      {maker.website ? (
                        <a href={maker.website} target="_blank" rel="noreferrer" className="makerDetailProductLink">
                          {locale === "ko" ? "제조사 홈페이지" : "Manufacturer website"}
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="makerDetailFallbackPanel">
              <h3>{maker.name}</h3>
              <p>{makerDescription}</p>
            </article>
          )}
        </section>

        <section className="makerDetailSupportBand">
          <div>
            <span>{locale === "ko" ? "SHINHOTEK SUPPORT" : "SHINHOTEK SUPPORT"}</span>
            <h2>{locale === "ko" ? "문의부터 적용까지 연결" : "From inquiry to implementation"}</h2>
            <p>
              {locale === "ko"
                ? "신호텍은 제조사 페이지를 단순 연결하지 않고 고객 공정 조건, 장비 구성, 테스트 가능성을 함께 검토합니다."
                : "SHINHOTEK reviews process conditions, equipment configuration, and test feasibility rather than only linking manufacturer pages."}
            </p>
          </div>
          <div className="makerDetailActions">
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
        </section>
      </div>
    </div>
  );
}
