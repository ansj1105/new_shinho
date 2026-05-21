import Link from "next/link";

import type { Locale } from "@/lib/site";

type SolutionItem = {
  slug: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
};

const makers = ["COHERENT", "TRUMPF", "ULO OPTICS", "DATARAY", "CORE RAY", "OPTICAL SOLUTION"];

export function HomeSolutionSection({
  locale,
  title,
  lead,
  solutions,
  contactTitle,
  contactLead,
}: {
  locale: Locale;
  title?: string | null;
  lead?: string | null;
  solutions: SolutionItem[];
  contactTitle?: string | null;
  contactLead?: string | null;
}) {
  const isKo = locale === "ko";

  return (
    <>
      <section className="homeSolutionSection">
        <div className="container homeSolutionInner">
          <div className="homeSolutionIntro">
            <span className="eyebrow">SHINHOTEK SOLUTION</span>
            <h2 className="sectionTitle">{title || (isKo ? "솔루션소개" : "Solution")}</h2>
            <p className="sectionLead">
              {lead ||
                (isKo
                  ? "제품 판매에 머물지 않고 광학 솔루션, 광학 설계, 기구 설계, SW 설계까지 연결하는 산업용 레이저·광학 파트너를 지향합니다."
                  : "Beyond product supply, Shinhotek connects selection, engineering review, and application support for industrial laser and optical systems.")}
            </p>
          </div>

          <div className="homeSolutionGrid">
            {solutions.map((item, index) => (
              <Link className="homeSolutionItem" key={item.slug} href={`/${locale}/applications#${item.slug}`}>
                <span className="homeSolutionIndex">0{index + 1}</span>
                <h3>{isKo ? item.titleKo : item.titleEn}</h3>
                <p>{isKo ? item.summaryKo : item.summaryEn}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="homeContactSection">
        <div className="container">
          <div className="homeContactBand">
            <div>
              <span className="eyebrow">CONTACT US</span>
              <h2>{contactTitle || (isKo ? "제품 상담과 테스트 요청을 남겨주세요" : "Discuss product selection and test requests")}</h2>
              {contactLead ? <p>{contactLead}</p> : null}
            </div>
            <Link href={`/${locale}/contact/quote`} className="button primary">
              {isKo ? "문의하기" : "Contact us"}
            </Link>
          </div>
        </div>
      </section>

      <section className="homeMakerSection">
        <div className="container">
          <div className="makerMarquee" aria-label={isKo ? "제조사" : "Manufacturers"}>
            <div className="makerMarqueeTrack">
              {[...makers, ...makers].map((maker, index) => (
                <span key={`${maker}-${index}`}>{maker}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
