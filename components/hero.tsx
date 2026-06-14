import Image from "next/image";
import Link from "next/link";
import { Aperture, Orbit, ScanSearch, ShieldCheck } from "lucide-react";

import type { Locale } from "@/lib/site";

type HeroProps = {
  locale: Locale;
  heroImageUrl?: string | null;
  title?: string | null;
  description?: string | null;
};

const featureIcons = [ShieldCheck, Aperture, Orbit, ScanSearch] as const;

const heroContent = {
  ko: {
    badge: "FULLY PASSIVE BEAM STABILIZATION",
    titleMain: "Mode",
    titleAccent: "Cleaner",
    subTitle: "빛을 다듬다 – 완전 수동형 빔 안정화 솔루션",
    body:
      "입력 빔의 왜곡, 떨림, 정렬 오차와 관계없이 별도 센서 제어 없이 순수한 가우시안 빔으로 정리시키는 수동형 모드 클리너.",
    features: [
      {
        title: "완전 수동형",
        body: "센서·액추에이터 제어 없이 지연 없이 즉각 안정화",
      },
      {
        title: "깨끗한 가우시안 빔",
        body: "입력 왜곡과 무관하게 가우시안 모드만 투과",
      },
      {
        title: "3D 안정성",
        body: "틸트·시프트·디포커스에도 위치 각도·빔 품질 유지",
      },
      {
        title: "산업용 USP 호환",
        body: "30 fs 초고속 펄스 고출력 산업 가공 대응",
      },
    ],
    beforeLabel: "Before Mode Cleaner",
    afterLabel: "After Mode Cleaner",
    metricBefore: { label: "입력", value: 'M² = 1.56' },
    metricAfter: { label: "출력", value: 'M² = 1.08' },
    detailCta: "제품 자세히 보기",
    inquiryCta: "기술 문의하기",
  },
  en: {
    badge: "FULLY PASSIVE BEAM STABILIZATION",
    titleMain: "Mode",
    titleAccent: "Cleaner",
    subTitle: "Refining light – a fully passive beam stabilization solution",
    body:
      "A passive mode cleaner that converts distorted, unstable, or misaligned input beams into a clean Gaussian beam without sensor feedback or active actuator control.",
    features: [
      {
        title: "Fully Passive",
        body: "Immediate stabilization without sensor or actuator control loops",
      },
      {
        title: "Clean Gaussian Beam",
        body: "Only the Gaussian mode passes through regardless of input distortion",
      },
      {
        title: "3D Stability",
        body: "Beam position, angle, and quality remain stable under tilt, shift, and defocus",
      },
      {
        title: "USP Ready",
        body: "Compatible with ultrafast pulses and high-power industrial processing",
      },
    ],
    beforeLabel: "Before Mode Cleaner",
    afterLabel: "After Mode Cleaner",
    metricBefore: { label: "Input", value: 'M² = 1.56' },
    metricAfter: { label: "Output", value: 'M² = 1.08' },
    detailCta: "View Product",
    inquiryCta: "Contact Us",
  },
} as const;

export function Hero({ locale }: HeroProps) {
  const content = heroContent[locale];

  return (
    <section className="heroSection">
      <div className="heroBackdrop" aria-hidden="true">
        <div className="heroBackdropGrid" />
        <div className="heroBackdropGlow heroBackdropGlowWarm" />
        <div className="heroBackdropGlow heroBackdropGlowCool" />
        <div className="heroBackdropRing" />
      </div>

      <div className="container heroInner">
        <div className="heroCopy">
          <span className="heroModeBadge">{content.badge}</span>

          <div className="heroModeHeading" aria-label="Mode Cleaner">
            <span className="heroModeHeadingMain">{content.titleMain}</span>
            <span className="heroModeHeadingAccent">{content.titleAccent}</span>
          </div>

          <p className="heroModeSubTitle">{content.subTitle}</p>
          <p className="heroModeBody">{content.body}</p>

          <div className="heroModeFeatureGrid">
            {content.features.map((feature, index) => {
              const Icon = featureIcons[index] ?? ShieldCheck;

              return (
                <div key={feature.title} className="heroModeFeatureCard">
                  <span className="heroModeFeatureIcon" aria-hidden="true">
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <div className="heroModeFeatureCopy">
                    <strong>{feature.title}</strong>
                    <span>{feature.body}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="heroModeActions">
            <Link href={`/${locale}/products/optical-solution`} className="heroModePrimaryCta">
              {content.detailCta}
            </Link>
            <Link href={`/${locale}/contact/quote`} className="heroModeSecondaryCta">
              {content.inquiryCta}
            </Link>
          </div>
        </div>

        <div className="heroModeVisual" aria-hidden="true">
          <div className="heroModeComparison heroModeComparisonBefore">
            <span className="heroModeComparisonLabel">{content.beforeLabel}</span>
            <div className="heroModeComparisonFrame">
              <Image src="/hero-mode-cleaner-before.png" alt="" width={260} height={260} className="heroModeComparisonImage" />
            </div>
          </div>

          <div className="heroModeArrow">➜</div>

          <div className="heroModeComparison heroModeComparisonAfter">
            <span className="heroModeComparisonLabel">{content.afterLabel}</span>
            <div className="heroModeComparisonFrame">
              <Image src="/hero-mode-cleaner-after.png" alt="" width={240} height={240} className="heroModeComparisonImage" />
            </div>
          </div>

          <div className="heroModeDeviceWrap">
            <Image
              src="/hero-mode-cleaner-device.png"
              alt=""
              width={900}
              height={635}
              priority
              className="heroModeDeviceImage"
            />
          </div>

          <div className="heroModeMetricStack">
            <div className="heroModeMetricCard">
              <span>{content.metricBefore.label}</span>
              <strong>{content.metricBefore.value}</strong>
            </div>
            <div className="heroModeMetricCard">
              <span>{content.metricAfter.label}</span>
              <strong>{content.metricAfter.value}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
