import Link from "next/link";
import type { Metadata } from "next";

import { SubpageHero } from "@/components/subpage-hero";
import { getPageHeroConfig, getResources } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";

  return buildPageMetadata({
    locale,
    path: "/contact/resources",
    title: isKo ? "자료실 | SHINHOTEK 다운로드" : "Resources | SHINHOTEK Downloads",
    description: isKo
      ? "SHINHOTEK 제품 자료, 데이터시트, 다운로드 자료와 공지 정보를 확인하세요."
      : "Browse SHINHOTEK product resources, datasheets, downloads, and reference materials.",
    keywords: ["자료실", "Resources", "Datasheet", "SHINHOTEK download", "laser datasheet", "optical component datasheet"],
    image: "/subpage-contact-bg.png",
  });
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [resources, heroConfig] = await Promise.all([
    getResources(),
    getPageHeroConfig("contact-resources"),
  ]);
  const eyebrow = locale === "ko" ? heroConfig?.eyebrowKo || "자료실" : heroConfig?.eyebrowEn || "Resources";
  const title = locale === "ko" ? heroConfig?.titleKo || "자료실" : heroConfig?.titleEn || "Resource Library";
  const description = locale === "ko"
    ? heroConfig?.descriptionKo || "제품 자료, 기술 문서, 다운로드 자료를 제공합니다."
    : heroConfig?.descriptionEn || "Browse resource posts and downloadable reference materials.";

  return (
    <div className="resourcesPage">
      <SubpageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        tone="resources"
        backgroundImageUrl={heroConfig?.backgroundImageUrl || "/subpage-contact-bg.png"}
        backgroundOpacity={heroConfig?.backgroundOpacity ?? 0.9}
        lightText
      />
      <div className="container subpageContent">
        <div className="resourcesTableWrap">
          <div className="resourcesTableHead">
            <span>No.</span>
            <span>{locale === "ko" ? "제목" : "Title"}</span>
            <span>{locale === "ko" ? "등록일" : "Date"}</span>
          </div>
          <div className="resourcesTableBody">
            {resources.map((resource, index) => {
              const localizedTitle = locale === "ko" ? resource.titleKo : resource.titleEn;
              const publishedDate = new Date(resource.publishedAt ?? resource.createdAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US");

              return (
                <Link
                  key={resource.slug}
                  href={`/${locale}/contact/resources/${resource.slug}`}
                  className="resourcesRow"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="resourcesRowTitle">{localizedTitle}</span>
                  <span>{publishedDate}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
