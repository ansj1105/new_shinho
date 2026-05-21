import type { Metadata } from "next";

import { ApplicationImageRail } from "@/components/application-image-rail";
import { FadeImage } from "@/components/fade-image";
import { SubpageHero } from "@/components/subpage-hero";
import { applicationGalleryImages } from "@/lib/application-gallery";
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
      galleryImages: applicationGalleryImages[entry.slug] ?? [],
    };
  });

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
      {/* <ApplicationsIndexNav locale={locale} items={applicationEntries} /> */}

      <div className="applicationsBody applicationsBodyShowcase">
        <div className="container applicationsShowcase">
          {normalizedApplicationEntries.map((entry) => {
            const localizedTitle = locale === "ko" ? entry.titleKo : entry.titleEn;
            const localizedBody = locale === "ko" ? entry.bodyKo : entry.bodyEn;

            return (
              <section key={entry.slug} id={entry.slug} className="applicationShowcaseRow">
                <div className="applicationShowcaseMedia">
                  <FadeImage
                    src={entry.imageUrl}
                    alt={localizedTitle}
                    width={960}
                    height={720}
                    sizes="(max-width: 720px) 100vw, (max-width: 960px) 220px, 280px"
                    className="applicationShowcaseImage"
                    skeletonClassName="applicationShowcaseSkeleton"
                  />
                </div>
                <div className="applicationShowcaseBody">
                  <h2 className="applicationShowcaseTitle">{localizedTitle}</h2>
                  <div className="applicationShowcaseText">
                    {splitApplicationParagraphs(localizedBody).map((paragraph, index) => (
                      <p key={`${entry.slug}-body-${index}`}>{renderApplicationLines(paragraph)}</p>
                    ))}
                  </div>
                </div>
                <ApplicationImageRail
                  images={entry.galleryImages}
                  title={localizedTitle}
                  locale={locale}
                />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
