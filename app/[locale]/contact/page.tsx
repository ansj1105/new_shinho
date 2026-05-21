import Link from "next/link";
import type { Metadata } from "next";

import { SubpageHero } from "@/components/subpage-hero";
import { getPageHeroConfig } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const supportItems = {
  ko: [
    { title: "고객지원", body: "제품 선정, 기술 검토, 적용 가능성 문의를 남겨주세요.", href: "/contact/quote", cta: "문의하기" },
    { title: "견적문의", body: "프로젝트 조건과 필요한 제품군을 공유해 주시면 검토 후 안내드립니다.", href: "/contact/quote", cta: "견적 요청" },
    { title: "Test 및 Demo", body: "제품 적용 전 테스트 구성, 샘플 평가, 데모 요청을 상담합니다.", href: "/contact/test-demo", cta: "테스트 상담" },
    { title: "자료실", body: "제품 자료, 인증 자료, 기술 문서를 확인할 수 있습니다.", href: "/contact/resources", cta: "자료 보기" },
  ],
  en: [
    { title: "Support", body: "Send product selection, technical review, or applicability questions.", href: "/contact/quote", cta: "Contact" },
    { title: "Quote", body: "Share project conditions and required product categories for review.", href: "/contact/quote", cta: "Request quote" },
    { title: "Test & Demo", body: "Discuss test setup, sample evaluation, and demo requests before implementation.", href: "/contact/test-demo", cta: "Request test" },
    { title: "Resources", body: "Browse product documents, certifications, and technical resources.", href: "/contact/resources", cta: "View resources" },
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
    path: "/contact",
    title: isKo ? "고객지원 | 신호텍" : "Contact | Shinhotek",
    description: isKo
      ? "신호텍 제품 상담, 견적문의, Test 및 Demo, 자료실을 안내합니다."
      : "Find Shinhotek support paths for consultation, quote requests, test and demo, and resources.",
    keywords: ["Shinhotek contact", "신호텍 고객지원", "견적문의", "Test Demo", "laser support"],
    image: "/subpage-contact-bg.png",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const heroConfig = await getPageHeroConfig("contact");

  return (
    <div className="contactPage">
      <SubpageHero
        eyebrow={locale === "ko" ? heroConfig?.eyebrowKo || "고객지원" : heroConfig?.eyebrowEn || "Contact"}
        title={locale === "ko" ? heroConfig?.titleKo || dict.contact.title : heroConfig?.titleEn || dict.contact.title}
        description={locale === "ko" ? heroConfig?.descriptionKo || dict.contact.lead : heroConfig?.descriptionEn || dict.contact.lead}
        tone="contact"
        backgroundImageUrl={heroConfig?.backgroundImageUrl || "/subpage-contact-bg.png"}
        backgroundOpacity={heroConfig?.backgroundOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="contactSupportGrid" aria-label={dict.contact.title}>
          {supportItems[locale].map((item) => (
            <article key={item.title} className="contactSupportCard">
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <Link href={`/${locale}${item.href}`} className="button secondary">
                {item.cta}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
