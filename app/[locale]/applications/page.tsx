import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SubpageHero } from "@/components/subpage-hero";
import { getApplications, getPageHeroConfig } from "@/lib/content";
import { defaultApplications } from "@/lib/default-content";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const applicationEnglishCopy: Record<string, { title: string; body: string }> = {};
const applicationKoreanCopy: Record<string, { title: string; body: string }> = {};

function splitApplicationParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderApplicationLines(paragraph: string) {
  return paragraph.split("\n").map((line, index) => (
    <span key={`${index}-${line}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

const solutionNumbers = ["01", "02", "03", "04"];

function textArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function textField(entry: unknown, key: string) {
  const value = (entry as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function valueField(entry: unknown, key: string) {
  return (entry as Record<string, unknown>)[key];
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
    path: "/applications",
    title: isKo
      ? "솔루션소개 | 신호텍 레이저·광학 솔루션"
      : "Solution | Shinhotek Laser and Optical Solutions",
    description: isKo
      ? "광학 솔루션, 광학 설계, 기구 설계, SW 설계 등 신호텍의 공정 맞춤형 솔루션 구성을 확인하세요."
      : "Explore Shinhotek solution capabilities across optical solutions, optical design, mechanical design, and software design.",
    keywords: [
      "솔루션소개",
      "Solution",
      "optical solution",
      "optical design",
      "mechanical design",
      "software design",
      "laser process engineering",
    ],
    image: "/subpage-applications-bg.png",
  });
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [heroConfig, applications] = await Promise.all([
    getPageHeroConfig("applications"),
    getApplications(),
  ]);
  const applicationEntries = applications.length ? applications : defaultApplications;
  const normalizedApplicationEntries = applicationEntries.map((entry) => {
    const englishCopy = applicationEnglishCopy[entry.slug];
    const koreanCopy = applicationKoreanCopy[entry.slug];

    return {
      slug: entry.slug,
      titleKo: entry.titleKo ?? koreanCopy?.title ?? "",
      titleEn: entry.titleEn ?? englishCopy?.title ?? "",
      imageUrl: entry.imageUrl ?? "",
      bodyKo: entry.summaryKo ?? koreanCopy?.body ?? "",
      bodyEn: entry.summaryEn ?? englishCopy?.body ?? "",
      bulletsKo: textArray(entry.bulletsKo),
      bulletsEn: textArray(entry.bulletsEn),
      detailTitleKo: textField(entry, "detailTitleKo"),
      detailTitleEn: textField(entry, "detailTitleEn"),
      detailBodyKo: textField(entry, "detailBodyKo"),
      detailBodyEn: textField(entry, "detailBodyEn"),
      detailImageUrl: textField(entry, "detailImageUrl"),
      detailBenefitsKo: textArray(valueField(entry, "detailBenefitsKo")),
      detailBenefitsEn: textArray(valueField(entry, "detailBenefitsEn")),
      detailUseCasesKo: textArray(valueField(entry, "detailUseCasesKo")),
      detailUseCasesEn: textArray(valueField(entry, "detailUseCasesEn")),
      detailCtaKo: textField(entry, "detailCtaKo"),
      detailCtaEn: textField(entry, "detailCtaEn"),
    };
  });
  const opticalSolutionDetail =
    normalizedApplicationEntries.find((entry) => entry.slug === "optical-solution") ?? normalizedApplicationEntries[0];

  return (
    <div className="applicationsPage">
      <SubpageHero
        eyebrow={locale === "ko" ? heroConfig?.eyebrowKo || "SOLUTION" : heroConfig?.eyebrowEn || "SOLUTION"}
        title={locale === "ko" ? heroConfig?.titleKo || dict.applications.title : heroConfig?.titleEn || dict.applications.title}
        description={locale === "ko" ? heroConfig?.descriptionKo || dict.applications.lead : heroConfig?.descriptionEn || dict.applications.lead}
        tone="applications"
        backgroundImageUrl={heroConfig?.backgroundImageUrl || "/subpage-applications-bg.png"}
        backgroundOpacity={heroConfig?.backgroundOpacity ?? 0.6}
      />
      <div className="solutionPageBody">
        <div className="container solutionPageShell">
          <section className="solutionPageIntro">
            <h2>{locale === "ko" ? "공정 조건에 맞춘 설계형 솔루션" : "Engineering-led solutions for process requirements"}</h2>
            <p>
              {locale === "ko"
                ? "제품 적용 전 검토부터 광학계, 기구, 소프트웨어 연동까지 하나의 기술 흐름으로 구성합니다."
                : "From application review to optics, mechanics, and software integration, each solution is organized as one technical workflow."}
            </p>
          </section>

          <div className="solutionCategoryGrid">
          {normalizedApplicationEntries.map((entry, index) => {
            const localizedTitle = locale === "ko" ? entry.titleKo : entry.titleEn;
            const localizedBody = locale === "ko" ? entry.bodyKo : entry.bodyEn;
            const capabilities = locale === "ko" ? entry.bulletsKo : entry.bulletsEn;

            return (
              <article key={entry.slug} id={entry.slug} className="solutionCategoryCard">
                <div className="solutionCategoryMedia">
                  <Image
                    src={entry.imageUrl || "/subpage-applications-bg.png"}
                    alt={localizedTitle}
                    fill
                    sizes="(max-width: 960px) 100vw, 42vw"
                    className="solutionCategoryImage"
                  />
                  <span className="solutionCategoryIndex">{solutionNumbers[index] ?? String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="solutionCategoryBody">
                  <h2 className="applicationShowcaseTitle">{localizedTitle}</h2>
                  <div className="applicationShowcaseText">
                    {splitApplicationParagraphs(localizedBody).map((paragraph, index) => (
                      <p key={`${entry.slug}-body-${index}`}>{renderApplicationLines(paragraph)}</p>
                    ))}
                  </div>
                  {capabilities.length ? (
                    <ul className="solutionCapabilityList" aria-label={locale === "ko" ? "핵심 역량" : "Core capabilities"}>
                      {capabilities.map((capability) => (
                        <li key={capability}>{capability}</li>
                      ))}
                    </ul>
                  ) : null}
                  <Link href={`/${locale}/contact/quote`} className="solutionCategoryCta">
                    {locale === "ko" ? "상담 문의" : "Request consultation"}
                  </Link>
                </div>
              </article>
            );
          })}
          </div>

          {opticalSolutionDetail ? (
          <section id="optical-solution-detail" className="opticalSolutionDetailSection" aria-label={locale === "ko" ? "광학솔루션 상세" : "Optical solution detail"}>
            <div className="projectIntroPanel">
              <div className="projectIntroCopy">
                <h2>{locale === "ko" ? opticalSolutionDetail.detailTitleKo : opticalSolutionDetail.detailTitleEn}</h2>
                {splitApplicationParagraphs(locale === "ko" ? opticalSolutionDetail.detailBodyKo : opticalSolutionDetail.detailBodyEn).map((paragraph, index) => (
                  <p key={`optical-detail-body-${index}`}>{renderApplicationLines(paragraph)}</p>
                ))}
              </div>
              <div className="projectIntroVisual">
                <Image
                  src={opticalSolutionDetail.detailImageUrl || opticalSolutionDetail.imageUrl || "/applications/automotive-lidar.png"}
                  alt={locale === "ko" ? "LiDAR 광학솔루션" : "LiDAR optical solution"}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                />
              </div>
            </div>

            <div className="projectInfoSplit" aria-label={locale === "ko" ? "광학솔루션 검토 항목" : "Optical solution details"}>
              <div className="projectInfoColumn">
                <h3>Benefits</h3>
                <ul>
                  {(locale === "ko" ? opticalSolutionDetail.detailBenefitsKo : opticalSolutionDetail.detailBenefitsEn).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="projectInfoColumn">
                <h3>Applications</h3>
                <ul>
                  {(locale === "ko" ? opticalSolutionDetail.detailUseCasesKo : opticalSolutionDetail.detailUseCasesEn).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="projectContactBand">
              <div className="projectContactVisual" aria-hidden="true">
                <Image src="/applications/gallery/automotive-lidar/vcsel-1.png" alt="" fill sizes="220px" />
              </div>
              <div>
                <h2>{locale === "ko" ? "적용 조건과 요구사항을 공유해 주세요." : "Share your application requirements."}</h2>
              </div>
              <Link href={`/${locale}/contact/quote`}>{locale === "ko" ? opticalSolutionDetail.detailCtaKo || "문의하기" : opticalSolutionDetail.detailCtaEn || "Contact us"}</Link>
            </div>
          </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
