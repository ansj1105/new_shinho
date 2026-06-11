import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { resourceBodyToHtml } from "@/lib/resource-rich-text";
import type { Locale } from "@/lib/site";
import type { CSSProperties } from "react";

type HeroProps = {
  locale: Locale;
  heroImageUrl?: string | null;
  title?: string | null;
  description?: string | null;
};

export function Hero({ locale, heroImageUrl, title, description }: HeroProps) {
  const dict = getDictionary(locale);
  const imageUrl =
    !heroImageUrl ||
    heroImageUrl === "/hero-lab-bg.avif" ||
    heroImageUrl === "/hero-lab-bg.png" ||
    heroImageUrl === "/hero-main-camera-hud.png" ||
    heroImageUrl === "/hero-main-laser.png" ||
    heroImageUrl === "/hero-main-camera-globe.png"
      ? "/hero-main-laser.png"
      : heroImageUrl;
  const titleHtml = resourceBodyToHtml(title || dict.hero.mainTitle);
  const descriptionHtml = resourceBodyToHtml(description || dict.hero.mainLead);
  const heroSpecIcons = [
    "/newhero/icon1-cutout.png",
    "/newhero/icon2-cutout.png",
    "/newhero/icon3-cutout.png",
    "/newhero/icon4-cutout.png",
  ];

  return (
    <section
      className="heroSection"
      style={{ ["--hero-image" as string]: `url("${imageUrl}")` } as CSSProperties}
    >
      <div className="heroBackdrop" aria-hidden="true">
        <div className="heroBackdropGrid" />
        <div className="heroTechOrbit">
          <svg className="heroTechWheel" viewBox="0 0 652 652">
            <g id="circle1">
              <path
                fill="none"
                stroke="#02AEEF"
                strokeDasharray="30,30,4,10"
                d="M325.8,0c179.9,0,325.8,146,325.8,326 S505.7,652,325.8,652S0,506,0,326S145.9,0,325.8,0z"
              />
            </g>
            <g id="circle2">
              <path
                fill="none"
                stroke="#02AEEF"
                d="M558.2,232.9c11.3,28.6,17.6,59.8,17.6,92.4 c0,138.5-112.2,250.8-250.7,250.8c-49.3,0-95.3-14.2-134.1-38.8"
              />
              <path
                fill="none"
                stroke="#02AEEF"
                strokeWidth="3"
                d="M264.4,81.9c24.7-6.2,50.8-8.6,77.5-6.8 c55.2,3.7,105,25,144.2,58"
              />
              <path
                fill="none"
                stroke="#02AEEF"
                d="M191.2,113.3c43.3-27.5,95.5-41.9,150.7-38.2 c55.2,3.7,105,25,144.2,58"
              />
              <path fill="none" stroke="#02AEEF" d="M82.7,394.3C68.6,345,69.5,290.8,88.7,239" />
            </g>
            <g id="circle3">
              <circle
                fill="none"
                stroke="#02AEEF"
                strokeWidth="20"
                strokeDasharray="0.7,8"
                cx="324.5"
                cy="324.7"
                r="168.9"
              />
            </g>
            <g id="center">
              <circle fill="none" stroke="#02AEEF" cx="325" cy="325" r="40.2" />
              <circle fill="none" stroke="#02AEEF" cx="324.5" cy="324.5" r="64.5" />
              <path fill="none" stroke="#02AEEF" strokeWidth="3" d="M558.2,232.9" />
              <path fill="none" stroke="#02AEEF" d="M119.5,181.2" />
            </g>
          </svg>
        </div>
      </div>
      <div className="container heroInner">
        <div className="heroCopy">
          <div className="heroMessagePanel heroMessagePanelPrimary" dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <div className="heroBody">
            <div className="heroMessagePanel heroMessagePanelSecondary" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            {/*
            <div className="heroRelationBlock">
              <span className="heroRelationLabel">{dict.hero.relationLabel}</span>
              <p className="heroRelationText">{dict.hero.relationBody}</p>
            </div>
            */}
          </div>
          <Link href={`/${locale}/products/laser`} className="heroLearnMore">
            <span>CONTACT US</span>
          </Link>
        </div>
        <div className="heroVisualPanel" aria-hidden="true">
          <div className="heroVisualFrame">
            <Image src="/hero-main-laser.png" alt="" width={420} height={420} priority />
          </div>
        </div>
      </div>
    </section>
  );
}

