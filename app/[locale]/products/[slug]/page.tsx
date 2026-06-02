import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubpageHero } from "@/components/subpage-hero";
import { getProductBySlug } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const productReferenceMeta: Record<string, { count: number; labelKo: string; labelEn: string }> = {
  laser: { count: 8, labelKo: "Laser 제품군", labelEn: "Laser product groups" },
  "laser-scanner": { count: 1, labelKo: "Laser Scanner 제품군", labelEn: "Laser scanner group" },
  "laser-metrology": { count: 3, labelKo: "Laser Metrology 제품군", labelEn: "Laser metrology groups" },
  "optical-solution": { count: 5, labelKo: "Optical Solution 제품군", labelEn: "Optical solution groups" },
  "coating-solution": { count: 4, labelKo: "Coating Solution 제품군", labelEn: "Coating solution groups" },
  "beam-delivery": { count: 3, labelKo: "Beam Delivery 제품군", labelEn: "Beam delivery groups" },
};

const productCategoryMakers: Record<
  string,
  Array<{ name: string; logoUrl: string; website: string; summaryKo: string; summaryEn: string }>
> = {
  laser: [
    { name: "Spark Lasers", logoUrl: "/makers/spark-lasers.png", website: "https://spark-lasers.com/", summaryKo: "초단펄스 레이저", summaryEn: "Ultrafast lasers" },
    { name: "Iradion", logoUrl: "/makers/iradion.png", website: "https://iradionlaser.com/", summaryKo: "세라믹 CO2 레이저", summaryEn: "Ceramic CO2 lasers" },
    { name: "MLase", logoUrl: "/makers/mlase.png", website: "https://mlase.com/", summaryKo: "산업용 레이저 소스", summaryEn: "Industrial laser sources" },
    { name: "Coherent", logoUrl: "/makers/coherent.png", website: "https://www.coherent.com/ko", summaryKo: "레이저 및 광학 플랫폼", summaryEn: "Laser and optics platforms" },
    { name: "SemiNex", logoUrl: "/makers/seminex.png", website: "https://seminex.com/", summaryKo: "고출력 다이오드 레이저", summaryEn: "High-power diode lasers" },
    { name: "Monocrom", logoUrl: "/makers/monocrom.png", website: "https://monocrom.com/", summaryKo: "다이오드 레이저 모듈", summaryEn: "Diode laser modules" },
    { name: "Optical Engines", logoUrl: "/makers/optical-engines.webp", website: "https://opticalenginesinc.com/", summaryKo: "레이저 엔진", summaryEn: "Laser engines" },
    { name: "LaserPoint", logoUrl: "/makers/laserpoint.png", website: "https://www.laserpoint.eu/", summaryKo: "레이저 측정 연계", summaryEn: "Laser measurement support" },
  ],
  "laser-scanner": [
    { name: "SCANLAB", logoUrl: "/makers/scanlab.jpg", website: "https://www.scanlab.de/ko", summaryKo: "스캔 헤드 및 제어", summaryEn: "Scan heads and controls" },
  ],
  "laser-metrology": [
    { name: "LaserPoint", logoUrl: "/makers/laserpoint.png", website: "https://www.laserpoint.eu/", summaryKo: "파워/에너지 측정", summaryEn: "Power and energy measurement" },
    { name: "LUMOS", logoUrl: "/makers/lumos.png", website: "https://www.lumosity.co.kr/", summaryKo: "빔 프로파일링", summaryEn: "Beam profiling" },
    { name: "Coherent", logoUrl: "/makers/coherent.png", website: "https://www.coherent.com/ko", summaryKo: "계측 및 센서", summaryEn: "Metrology and sensors" },
  ],
  "optical-solution": [
    { name: "AdlOptica", logoUrl: "/makers/adloptica.webp", website: "https://www.adloptica.com/", summaryKo: "빔 쉐이핑", summaryEn: "Beam shaping" },
    { name: "Cailabs", logoUrl: "/makers/cailabs.png", website: "https://www.cailabs.com/", summaryKo: "광학 변환 솔루션", summaryEn: "Optical transformation solutions" },
    { name: "PowerPhotonic", logoUrl: "/makers/powerphotonic.png", website: "https://www.powerphotonic.com/", summaryKo: "자유형상 광학", summaryEn: "Freeform optics" },
    { name: "Optoman", logoUrl: "/makers/optoman.png", website: "https://www.optoman.com/", summaryKo: "고성능 광학 부품", summaryEn: "High-performance optics" },
    { name: "ULO Optics", logoUrl: "/makers/ulo-optics.png", website: "https://www.ulooptics.com/", summaryKo: "산업용 광학 부품", summaryEn: "Industrial optics" },
  ],
  "coating-solution": [
    { name: "Optoman", logoUrl: "/makers/optoman.png", website: "https://www.optoman.com/", summaryKo: "레이저 옵틱 코팅", summaryEn: "Laser optics coating" },
    { name: "ULO Optics", logoUrl: "/makers/ulo-optics.png", website: "https://www.ulooptics.com/", summaryKo: "광학 부품 및 코팅", summaryEn: "Optics and coating" },
    { name: "Photonic Tools", logoUrl: "/makers/photonic-tools.png", website: "https://www.photonic-tools.de/", summaryKo: "광섬유/포토닉 툴", summaryEn: "Fiber and photonic tools" },
    { name: "MLOptic", logoUrl: "/makers/mloptic.png", website: "https://www.mloptic.com/", summaryKo: "정밀 광학 코팅", summaryEn: "Precision optical coating" },
  ],
  "beam-delivery": [
    { name: "Cailabs", logoUrl: "/makers/cailabs.png", website: "https://www.cailabs.com/", summaryKo: "빔 전송 및 형상 제어", summaryEn: "Beam delivery and shaping" },
    { name: "PowerPhotonic", logoUrl: "/makers/powerphotonic.png", website: "https://www.powerphotonic.com/", summaryKo: "빔 딜리버리 광학", summaryEn: "Beam delivery optics" },
    { name: "ULO Optics", logoUrl: "/makers/ulo-optics.png", website: "https://www.ulooptics.com/", summaryKo: "빔 익스팬더/렌즈", summaryEn: "Beam expanders and lenses" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    return buildPageMetadata({
      locale,
      path: `/products/${slug}`,
      title: locale === "ko" ? "제품 | 신호텍" : "Product | Shinhotek",
      description: locale === "ko" ? "신호텍 제품 상세 페이지입니다." : "Shinhotek product detail page.",
    });
  }

  const title = locale === "ko" ? product.seoTitleKo || `${product.nameKo} | 신호텍` : product.seoTitleEn || `${product.nameEn} | Shinhotek`;
  const description = locale === "ko" ? product.seoDescriptionKo || product.summaryKo : product.seoDescriptionEn || product.summaryEn;
  const image = product.imageUrl || product.heroBgImageUrl || "/product-placeholder.svg";

  return buildPageMetadata({
    locale,
    path: `/products/${slug}`,
    title,
    description,
    keywords: [product.nameKo, product.nameEn, "Shinhotek product", "industrial laser", "optical solution"],
    image,
    type: "article",
    category: "Product category",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    notFound();
  }

  const localizedProductName = locale === "ko" ? product.nameKo : product.nameEn;
  const localizedSummary = locale === "ko" ? product.summaryKo : product.summaryEn;
  const heroTitle = locale === "ko" ? product.heroTitleKo || localizedProductName : product.heroTitleEn || localizedProductName;
  const heroLead = locale === "ko" ? product.heroLeadKo || localizedSummary : product.heroLeadEn || localizedSummary;
  const heroEyebrow = locale === "ko" ? product.heroEyebrowKo || "Product" : product.heroEyebrowEn || "Product";
  const heroBgImage = product.heroBgImageUrl || "/subpage-products-laser-bg.png";
  const referenceMeta = productReferenceMeta[slug];
  const makers = productCategoryMakers[slug] ?? [];

  return (
    <div className={`productsPage productCategoryPage productCategoryPage-${slug}`}>
      <SubpageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        description={heroLead}
        tone="products"
        backgroundImageUrl={heroBgImage}
        backgroundOpacity={product.heroBgOpacity ?? 0.9}
      />

      <div className="container subpageContent">
        <section className="productMakerPageHead">
          <span>PRODUCT LINE UP</span>
          <h2>{localizedProductName}</h2>
          <p>{localizedSummary}</p>
          {referenceMeta ? <strong>{locale === "ko" ? referenceMeta.labelKo : referenceMeta.labelEn}</strong> : null}
        </section>

        <section className="productMakerGrid" aria-label={locale === "ko" ? "제조사 목록" : "Manufacturer list"}>
          {makers.map((maker) => (
            <a key={maker.name} href={maker.website} target="_blank" rel="noreferrer" className="productMakerCard">
              <span className="productMakerLogo">
                <Image src={maker.logoUrl} alt={maker.name} fill sizes="(max-width: 760px) 50vw, 220px" />
              </span>
              <strong>{maker.name}</strong>
              <em>{locale === "ko" ? maker.summaryKo : maker.summaryEn}</em>
            </a>
          ))}
        </section>

        <section className="productMakerSupport">
          <div>
            <span>{locale === "ko" ? "제품 선정 지원" : "Selection support"}</span>
            <p>
              {locale === "ko"
                ? "제조사별 제품 사양과 공정 조건을 검토해 적합한 제품군을 안내합니다."
                : "We review manufacturer specifications and process requirements to recommend suitable products."}
            </p>
          </div>
          <a href={`/${locale}/contact/quote`}>{locale === "ko" ? "문의하기" : "Contact us"}</a>
        </section>
      </div>
    </div>
  );
}
