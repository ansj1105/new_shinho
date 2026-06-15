import Link from "next/link";

import { resourceBodyToHtml } from "@/lib/resource-rich-text";
import type { Locale } from "@/lib/site";

type SolutionItem = {
  slug: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
  imageUrl: string | null;
};

type ManufacturerLogoItem = {
  id: number;
  name: string;
  logoUrl: string;
  href: string | null;
};

export function HomeSolutionSection({
  locale,
  title,
  lead,
  solutions,
  contactTitle,
  contactLead,
  manufacturerLogos,
}: {
  locale: Locale;
  title?: string | null;
  lead?: string | null;
  solutions: SolutionItem[];
  contactTitle?: string | null;
  contactLead?: string | null;
  manufacturerLogos: ManufacturerLogoItem[];
}) {
  const isKo = locale === "ko";
  const introBody = isKo
    ? `신호텍은 2007년 설립 이래 레이저 및 광학 솔루션 분야에서 차별화된 기술력과 빠른 실행력을 바탕으로 성장해온 전문 기업입니다. 단순한 부품 공급을 넘어 설계, 시뮬레이션, 정밀 제작 및 제어 소프트웨어까지 아우르는 ‘토털 옵티컬 솔루션’을 제공하는 목표를 가지고 고출력 레이저 광학계, Beam Profiler, F-Theta Lens, Beam Monitoring System, Bessel Beam Generator 등 고정밀 광학 솔루션을 자체 개발하고 있습니다. 이러한 독자적인 기술 역량을 축적하며 산업용·반도체·디스플레이·자동차·국방 등 다양한 첨단 산업에 최적화된 솔루션을 제공하고 있습니다.

특히 초고속 레이저 가공과 정밀 계측 분야에서 요구되는 안정성과 정밀도를 제어하는 빔프로파일러를 자체 개발한 LUMOSITY 소프트웨어와 하드웨어를 최초로 국산화 양산화하여 레이저 상태를 실시간으로 분석·모니터링할 수 있는 통합 솔루션을 제공하여 고객 공정의 생산성과 신뢰성을 동시에 향상시키고 있습니다.

“First & Fast, Beyond Optics”라는 비전 아래, 신호텍은 창의적인 광학 기술과 민첩한 개발 역량으로 미래 레이저·광학 산업을 선도하는 글로벌 파트너로 도약하고 있습니다.`
    : lead ||
      "Beyond product supply, Shinhotek connects selection, engineering review, and application support for industrial laser and optical systems.";
  const leadHtml = resourceBodyToHtml(introBody);
  const visibleSolutions = solutions.filter((item) => {
    const searchable = `${item.slug} ${item.titleKo} ${item.titleEn}`.toLowerCase();
    return (
      !searchable.includes("semiconductor") &&
      !searchable.includes("반도체") &&
      !searchable.includes("optical-solution") &&
      !searchable.includes("optical solution") &&
      !searchable.includes("광학솔루션") &&
      !searchable.includes("광학 솔루션")
    );
  });
  const visualItems = visibleSolutions.slice(0, 4).map((item, index) => {
    const fixedImageByIndex = {
      1: "/home-solution-intro-1.jpg",
      2: "/home-solution-intro-2.jpg",
      3: "/home-solution-intro-3.png",
    } as const;

    return {
      ...item,
      imageUrl: fixedImageByIndex[index as keyof typeof fixedImageByIndex] ?? item.imageUrl,
    };
  });

  return (
    <>
      <section className="homeSolutionSection">
        <div className="container homeSolutionInner">
          <div className="homeSolutionVisualGrid" aria-label={isKo ? "솔루션 이미지" : "Solution images"}>
            {visualItems.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/applications#${item.slug}`}
                className="homeSolutionVisualTile"
                aria-label={isKo ? item.titleKo : item.titleEn}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={isKo ? item.titleKo : item.titleEn} />
                ) : (
                  <span>{isKo ? item.titleKo : item.titleEn}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="homeSolutionCopyPanel">
            <div className="homeSolutionTitleBox">
              <h2>{title || (isKo ? "신호텍 소개" : "About Shinhotek")}</h2>
            </div>
            <div className="homeSolutionLead" dangerouslySetInnerHTML={{ __html: leadHtml }} />
          </div>
        </div>
      </section>

      <section className="homeContactSection">
        <div className="container">
          <div className="homeContactBand">
            <div className="homeContactCopy">
              <span className="eyebrow">APPLICATIONS</span>
              <div className="homeContactTitleBox">
                <h2>{contactTitle || (isKo ? "Contact us" : "Contact us")}</h2>
              </div>
              <p>
                {contactLead ||
                  (isKo
                    ? "레이저 및 광학 솔루션 상담이 필요하시면 신호텍에 문의해 주세요."
                    : "Contact Shinhotek for laser and optical solution consultation.")}
              </p>
              <Link href={`/${locale}/contact/quote`} className="homeContactCta">
                {isKo ? "문의하기" : "VIEW ALL APPLICATIONS"}
              </Link>
            </div>
            <div className="homeContactInfoPanel">
              <span>Tel. 02-852-0533</span>
              <span>sales@shinhotek.com</span>
              <span>service@shinhotek.com</span>
            </div>
          </div>
        </div>
      </section>

      <section className="homeMakerSection">
        <div className="container">
          <div className="makerMarquee" aria-label={isKo ? "제조사" : "Manufacturers"}>
            <button type="button" className="makerMarqueeArrow" aria-label="Previous manufacturers">
              ‹
            </button>
            <div className="makerMarqueeTrack">
              {[...manufacturerLogos, ...manufacturerLogos].map((maker, index) => (
                <a
                  key={`${maker.id}-${index}`}
                  className="makerLogoBox"
                  href={maker.href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={maker.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={maker.logoUrl} alt={maker.name} />
                </a>
              ))}
            </div>
            <button type="button" className="makerMarqueeArrow" aria-label="Next manufacturers">
              ›
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
