import type { Locale } from "@/lib/site";

type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
};

type Dictionary = {
  localeName: string;
  brand: string;
  meta: { title: string; description: string; keywords: string[] };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    mainTitle: string;
    mainSubtitle: string[];
    mainLead: string;
    specAriaLabel: string;
    specs: Array<{ label: string; detail: string }>;
    lead: string;
    relationLabel: string;
    relationBody: string;
    ctaDetail: string;
    visualLabel: string;
  };
  story: { title: string; body: string };
  homepage: { productTitle: string; productLead: string; directionsTitle: string; directionsBody: string; applicationsTitle: string; applicationsBody: string };
  directions: { title: string; body: string; mapHint: string };
  applications: { title: string; lead: string };
  products: { title: string; lead: string };
  contact: { title: string; lead: string; formTitle: string; formBody: string; resourceTitle: string };
  footer: { heading: string; company: string; companyLine2?: string; email: string; phone: string; fax: string; legal: Array<{ label: string; href: string }> };
  admin: { title: string; lead: string };
};

const productChildrenKo = [
  { label: "Laser", href: "/products/laser" },
  { label: "Laser Scanner", href: "/products/laser-scanner" },
  { label: "Laser Metrology", href: "/products/laser-metrology" },
  { label: "Optical Solution", href: "/products/optical-solution" },
  { label: "Coating Solution", href: "/products/coating-solution" },
  { label: "Beam Delivery", href: "/products/beam-delivery" },
];

const productChildrenEn = productChildrenKo;

export const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    localeName: "한국어",
    brand: "신호텍",
    meta: {
      title: "신호텍 | 레이저·광학 솔루션 전문 기업",
      description: "신호텍은 산업용 레이저, 레이저 스캐너, 레이저 계측, 광학 솔루션, 코팅 솔루션, 빔 딜리버리 솔루션을 제공합니다.",
      keywords: ["신호텍", "Shinhotek", "레이저", "광학기기", "레이저 스캐너", "레이저 계측", "광학 솔루션", "빔 딜리버리"],
    },
    nav: [
      { label: "회사소개", href: "/company/ceo-vision", children: [
        { label: "CEO 인사말 & 회사비전", href: "/company/ceo-vision" },
        { label: "파트너사 소개", href: "/company/partners" },
        { label: "찾아오는길", href: "/company/directions" },
      ] },
      { label: "솔루션소개", href: "/applications" },
      { label: "제품", href: "/products", children: productChildrenKo },
      { label: "고객지원", href: "/contact", children: [
        { label: "고객지원", href: "/contact" },
        { label: "견적문의", href: "/contact/quote" },
        { label: "Test 및 Demo", href: "/contact/test-demo" },
        { label: "자료실", href: "/contact/resources" },
      ] },
    ],
    hero: {
      eyebrow: "SHINHOTEK",
      titlePrefix: "Industrial",
      titleHighlight: "Optical Solutions",
      mainTitle: "SHINHOTEK",
      mainSubtitle: ["Laser & Optical Solutions", "for Precision Manufacturing"],
      mainLead: `정밀 제조 공정을 위한
레이저·광학 솔루션 파트너`,
      specAriaLabel: "신호텍 주요 제품군",
      specs: [
        { label: "Laser", detail: `Industrial
Laser Source` },
        { label: "Scanner", detail: `2D / 3D
Scan System` },
        { label: "Metrology", detail: `Power / Energy
Measurement` },
        { label: "Optics", detail: `Beam Shaping
Components` },
      ],
      lead: "산업용 레이저 공정에 필요한 제품 선정부터 기술 지원까지 연결합니다.",
      relationLabel: "",
      relationBody: "신호텍은 산업용 레이저, 스캐너, 계측기, 광학 부품과 맞춤형 솔루션을 공급하는 B2B 광학 솔루션 파트너입니다.",
      ctaDetail: "제품 보기",
      visualLabel: "Precision optical engineering",
    },
    story: { title: "신호텍 소개", body: "레이저 공정과 광학 시스템 구축에 필요한 제품, 자료, 기술 지원을 하나의 운영 흐름으로 제공합니다." },
    homepage: {
      productTitle: "제품",
      productLead: "레이저, 스캐너, 계측, 광학 솔루션, 코팅 솔루션, 빔 딜리버리까지 주요 제품군을 확인하세요.",
      directionsTitle: "찾아오시는 길",
      directionsBody: "서울특별시 금천구 가산디지털1로 19, 대륭테크노타운 18차 1306호",
      applicationsTitle: "솔루션소개",
      applicationsBody: "광학 솔루션, 광학 설계, 기구 설계, SW 설계를 공정 조건에 맞춰 제안합니다.",
    },
    directions: { title: "찾아오시는 길", body: "신호텍 방문을 위한 위치와 연락처를 안내드립니다.", mapHint: "지도 또는 위치 이미지는 관리자에서 교체할 수 있습니다." },
    applications: { title: "솔루션소개", lead: "광학 솔루션, 광학 설계, 기구 설계, SW 설계까지 공정 목적에 맞는 엔지니어링 구성을 제안합니다." },
    products: { title: "제품소개", lead: "Laser, Laser Scanner, Laser Metrology, Optical Solution, Coating Solution, Beam Delivery 제품군을 확인하세요." },
    contact: { title: "고객지원", lead: "제품 상담, 견적 문의, 테스트 및 데모 요청, 기술 자료 확인까지 한 곳에서 연결합니다.", formTitle: "견적문의", formBody: "제품 상담, 견적 요청, 기술 문의를 남겨주세요.", resourceTitle: "자료실" },
    footer: { heading: "본사", company: "서울특별시 금천구 가산디지털1로 19, 대륭테크노타운 18차 1306호, 08594", email: "sales@shinhotek.com", phone: "+82 (0)2 852-0533", fax: "+82 (0)2 853-0537", legal: [ { label: "개인정보처리방침", href: "/legal/privacy" }, { label: "이용약관", href: "/legal/terms" } ] },
    admin: { title: "관리자", lead: "메인, 회사소개, 응용분야, 제품, 자료실, 대리점, 문의를 직접 관리합니다." },
  },
  en: {
    localeName: "English",
    brand: "Shinhotek",
    meta: {
      title: "Shinhotek | Laser and Optical Solution Provider",
      description: "Shinhotek provides industrial lasers, laser scanners, laser metrology, optical solutions, coating solutions, and beam delivery systems.",
      keywords: ["Shinhotek", "laser", "optical equipment", "laser scanner", "laser metrology", "optical solution", "beam delivery"],
    },
    nav: [
      { label: "Company", href: "/company/ceo-vision", children: [
        { label: "CEO Message & Vision", href: "/company/ceo-vision" },
        { label: "Partners", href: "/company/partners" },
        { label: "Directions", href: "/company/directions" },
      ] },
      { label: "Solution", href: "/applications" },
      { label: "Product", href: "/products", children: productChildrenEn },
      { label: "Contact", href: "/contact", children: [
        { label: "Support", href: "/contact" },
        { label: "Quote", href: "/contact/quote" },
        { label: "Test & Demo", href: "/contact/test-demo" },
        { label: "Resources", href: "/contact/resources" },
      ] },
    ],
    hero: {
      eyebrow: "SHINHOTEK",
      titlePrefix: "Industrial",
      titleHighlight: "Optical Solutions",
      mainTitle: "SHINHOTEK",
      mainSubtitle: ["Laser & Optical Solutions", "for Precision Manufacturing"],
      mainLead: `Laser and optical solution partner
for precision manufacturing`,
      specAriaLabel: "Shinhotek product categories",
      specs: [
        { label: "Laser", detail: `Industrial
Laser Source` },
        { label: "Scanner", detail: `2D / 3D
Scan System` },
        { label: "Metrology", detail: `Power / Energy
Measurement` },
        { label: "Optics", detail: `Beam Shaping
Components` },
      ],
      lead: "Connecting product selection and technical support for industrial laser processes.",
      relationLabel: "",
      relationBody: "Shinhotek is a B2B optical solution partner supplying industrial lasers, scanners, metrology systems, optical components, and customized solutions.",
      ctaDetail: "View products",
      visualLabel: "Precision optical engineering",
    },
    story: { title: "About Shinhotek", body: "Shinhotek provides products, documentation, and technical support required for laser processes and optical system integration." },
    homepage: {
      productTitle: "Product",
      productLead: "Explore lasers, scanners, metrology systems, optical solutions, coating solutions, and beam delivery systems.",
      directionsTitle: "Directions",
      directionsBody: "1306 Daerung Techno Town-18, 19 Gasan digital 1-ro, Geumcheon-gu, Seoul, Korea",
      applicationsTitle: "Solution",
      applicationsBody: "Review optical solution, optical design, mechanical design, and software design support.",
    },
    directions: { title: "Directions", body: "Find Shinhotek location and contact information for your visit.", mapHint: "Map or location image can be replaced from the admin page." },
    applications: { title: "Solution", lead: "Shinhotek supports optical solutions, optical design, mechanical design, and software design for industrial processes." },
    products: { title: "Product", lead: "Explore Shinhotek laser and optical product categories." },
    contact: { title: "Contact", lead: "Connect with product support, quote requests, test and demo consultation, and technical resources.", formTitle: "Quote", formBody: "Send product consultation, quote requests, or technical inquiries.", resourceTitle: "Resources" },
    footer: { heading: "Headquarter", company: "1306 Daerung Techno Town-18, 19 Gasan digital 1-ro, Geumcheon-gu, Seoul, 08594, Korea", email: "sales@shinhotek.com", phone: "+82 (0)2 852-0533", fax: "+82 (0)2 853-0537", legal: [ { label: "Privacy Policy", href: "/legal/privacy" }, { label: "Terms of Service", href: "/legal/terms" } ] },
    admin: { title: "Admin", lead: "Manage home, company, applications, products, resources, distributors, and inquiries." },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
