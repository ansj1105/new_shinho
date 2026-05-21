import Link from "next/link";
import type { Metadata } from "next";

import { SubpageHero } from "@/components/subpage-hero";
import { getPageHeroConfig } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const demoSteps = {
  ko: [
    { title: "공정 조건 확인", body: "레이저 파장, 출력, 빔 크기, 작업 거리, 장비 제약 조건을 확인합니다." },
    { title: "제품 및 구성 제안", body: "적합한 레이저, 스캐너, 계측 장비, 광학 부품과 테스트 구성을 제안합니다." },
    { title: "테스트·데모 협의", body: "샘플 평가, 데모 일정, 필요 자료와 담당 지원 범위를 조율합니다." },
  ],
  en: [
    { title: "Process Review", body: "Review wavelength, power, beam size, working distance, and equipment constraints." },
    { title: "Configuration Proposal", body: "Propose suitable lasers, scanners, metrology systems, optics, and test setups." },
    { title: "Test & Demo Plan", body: "Coordinate sample evaluation, demo schedule, required documents, and support scope." },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";

  return buildPageMetadata({
    locale,
    path: "/contact/test-demo",
    title: isKo ? "Test 및 Demo | 신호텍" : "Test & Demo | Shinhotek",
    description: isKo
      ? "신호텍 레이저·광학 제품 적용 전 테스트와 데모 상담을 요청하세요."
      : "Request test and demo consultation before applying Shinhotek laser and optical products.",
    keywords: ["Test Demo", "신호텍 테스트", "레이저 데모", "optical test", "laser demo"],
    image: "/subpage-contact-bg.png",
  });
}

export default async function TestDemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";
  const heroConfig = await getPageHeroConfig("contact-test-demo");

  return (
    <div className="contactPage">
      <SubpageHero
        eyebrow={isKo ? heroConfig?.eyebrowKo || "Test 및 Demo" : heroConfig?.eyebrowEn || "Test & Demo"}
        title={isKo ? heroConfig?.titleKo || "Test 및 Demo" : heroConfig?.titleEn || "Test & Demo"}
        description={
          isKo
            ? heroConfig?.descriptionKo || "제품 적용 가능성 검토와 테스트·데모 요청을 남겨주세요."
            : heroConfig?.descriptionEn || "Request test and demo consultation for product applicability review."
        }
        tone="contact"
        backgroundImageUrl={heroConfig?.backgroundImageUrl || "/subpage-contact-bg.png"}
        backgroundOpacity={heroConfig?.backgroundOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="testDemoPanel">
          <div className="testDemoIntro">
            <span className="eyebrow">PROCESS</span>
            <h2 className="sectionTitle">{isKo ? "테스트 및 데모 진행 흐름" : "Test and demo workflow"}</h2>
            <p className="sectionLead">
              {isKo
                ? "공정 조건을 먼저 확인한 뒤, 적용 가능한 제품과 테스트 구성을 검토합니다."
                : "We review process requirements first, then propose applicable products and test configurations."}
            </p>
          </div>
          <div className="testDemoSteps">
            {demoSteps[locale].map((step, index) => (
              <article key={step.title} className="testDemoStep">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <div className="testDemoActions">
            <Link href={`/${locale}/contact/quote`} className="button primary">
              {isKo ? "상담 요청" : "Request consultation"}
            </Link>
            <Link href={`/${locale}/contact/resources`} className="button secondary">
              {isKo ? "자료실 보기" : "View resources"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
