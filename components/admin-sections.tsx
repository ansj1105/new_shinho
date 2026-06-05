import {
  AdminDistributorsTabs,
} from "@/components/admin-distributors-tabs";
import {
  deleteResource,
  saveInquiryReply,
  saveResource,
  sendInquiryReply,
  updateInquiryStatus,
} from "@/app/admin/actions";
import { AdminApplicationsTabs } from "@/components/admin-applications-tabs";
import { AdminHomeTabs } from "@/components/admin-home-tabs";
import { AdminInquiriesTabs } from "@/components/admin-inquiries-tabs";
import { AdminPageHeroTabs } from "@/components/admin-page-hero-tabs";
import { AdminProductsTabs } from "@/components/admin-products-tabs";
import { AdminResourcesTabs } from "@/components/admin-resources-tabs";

export function AdminSectionCard({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="lumosAdminSectionCard">
      <div className="lumosAdminSectionHead">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function HomeAdminSection({
  siteConfig,
  pageHeroConfigs,
  products,
  manufacturerLogos,
}: {
  siteConfig: {
    id: number;
    heroTitleKo: string;
    heroTitleEn: string;
    heroDescriptionKo: string;
    heroDescriptionEn: string;
    heroImageUrl: string | null;
    heroFontSize: number;
    storyTitleKo: string;
    storyTitleEn: string;
    storyBodyKo: string;
    storyBodyEn: string;
    storyFontSize: number;
    storyTitleFontSizeKo: number;
    storyTitleFontSizeEn: number;
    storyEyebrowFontSizeKo: number;
    storyEyebrowFontSizeEn: number;
    storyBodyFontSizeKo: number;
    storyBodyFontSizeEn: number;
    seriesTitleKo: string;
    seriesTitleEn: string;
    seriesLeadKo: string;
    seriesLeadEn: string;
    seoTitleKo: string;
    seoTitleEn: string;
    seoDescriptionKo: string;
    seoDescriptionEn: string;
    heroImageHistory: Array<{ id: number; imageUrl: string; createdAt: Date }>;
  };
  pageHeroConfigs: Array<{
    id: number;
    pageKey: string;
    eyebrowKo: string;
    eyebrowEn: string;
    titleKo: string;
    titleEn: string;
    descriptionKo: string;
    descriptionEn: string;
    backgroundImageUrl: string | null;
    backgroundOpacity: number;
  }>;
  products: Array<{
    id: number;
    slug: string;
    nameKo: string;
    nameEn: string;
    imageUrl: string | null;
    displayOrder: number;
  }>;
  manufacturerLogos: Array<{
    id: number;
    name: string;
    logoUrl: string;
    href: string | null;
    displayOrder: number;
    published: boolean;
  }>;
}) {
  return (
    <AdminHomeTabs
      siteConfig={siteConfig}
      pageHeroConfigs={pageHeroConfigs}
      products={products}
      manufacturerLogos={manufacturerLogos}
    />
  );
}

export function ApplicationsAdminSection({
  applications,
}: {
  applications: Array<{
    id: number;
    slug: string;
    sortOrder: number;
    titleKo: string;
    titleEn: string;
    summaryKo: string;
    summaryEn: string;
    bulletsKo: unknown;
    bulletsEn: unknown;
    detailTitleKo: string | null;
    detailTitleEn: string | null;
    detailBodyKo: string | null;
    detailBodyEn: string | null;
    detailImageUrl: string | null;
    detailBenefitsKo: unknown;
    detailBenefitsEn: unknown;
    detailUseCasesKo: unknown;
    detailUseCasesEn: unknown;
    detailModulesKo: unknown;
    detailModulesEn: unknown;
    detailCtaKo: string | null;
    detailCtaEn: string | null;
    imageUrl: string | null;
    published: boolean;
  }>;
}) {
  return <AdminApplicationsTabs applications={applications} />;
}

export function ProductsAdminSection({
  products,
}: {
  products: Array<{
    id: number;
    slug: string;
    displayOrder: number;
    nameKo: string;
    nameEn: string;
    heroEyebrowKo: string | null;
    heroEyebrowEn: string | null;
    heroTitleKo: string | null;
    heroTitleEn: string | null;
    heroLeadKo: string | null;
    heroLeadEn: string | null;
    heroBgImageUrl: string | null;
    heroBgOpacity: number | null;
    summaryKo: string;
    summaryEn: string;
    contentKo: string;
    contentEn: string;
    featuresKo: unknown;
    featuresEn: unknown;
    applicationsKo: unknown;
    applicationsEn: unknown;
    specsKo: unknown;
    specsEn: unknown;
    imageUrl: string | null;
    seoTitleKo: string | null;
    seoTitleEn: string | null;
    seoDescriptionKo: string | null;
    seoDescriptionEn: string | null;
    published: boolean;
    makers: Array<{
      id: number;
      productId: number;
      slug: string;
      name: string;
      logoUrl: string;
      website: string | null;
      summaryKo: string;
      summaryEn: string;
      descriptionKo: string;
      descriptionEn: string;
      displayOrder: number;
      published: boolean;
    }>;
    documents: Array<{
      id: number;
      productId: number;
      kind: "DATASHEET" | "DRAWING";
      titleKo: string;
      titleEn: string;
      fileUrl: string;
      fileName: string | null;
      mimeType: string | null;
      fileSize: number | null;
      displayOrder: number;
      published: boolean;
    }>;
  }>;
}) {
  return <AdminProductsTabs products={products} />;
}

export function ResourcesAdminSection({
  resources,
}: {
  resources: Array<{
    id: number;
    slug: string;
    displayIndex: number;
    titleKo: string;
    titleEn: string;
    excerptKo: string;
    excerptEn: string;
    bodyKo: string;
    bodyEn: string;
    fileUrl: string | null;
    contentImageUrl: string | null;
    contentImageAltKo: string | null;
    contentImageAltEn: string | null;
    contentImageWidth: number | null;
    contentImagePlacement: string;
    publishedAt: Date;
    published: boolean;
  }>;
}) {
  return <AdminResourcesTabs resources={resources} />;
}

export function InquiriesAdminSection({
  inquiries,
}: {
  inquiries: Array<{
    id: number;
    company: string | null;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    locale: string;
    status: string;
    internalNote: string | null;
    replySubject: string | null;
    replyBody: string | null;
    replySentAt: Date | null;
    createdAt: Date;
  }>;
}) {
  return <AdminInquiriesTabs inquiries={inquiries} />;
}

export function ContactAdminSection({
  pageHeroConfigs,
  distributorSettings,
  distributorRegions,
}: {
  pageHeroConfigs: Array<{
    id: number;
    pageKey: string;
    eyebrowKo: string;
    eyebrowEn: string;
    titleKo: string;
    titleEn: string;
    descriptionKo: string;
    descriptionEn: string;
    backgroundImageUrl: string | null;
    backgroundOpacity: number;
  }>;
  distributorSettings: {
    id: number;
    mapImageUrl: string | null;
  };
  distributorRegions: Array<{
    id: number;
    slug: string;
    nameKo: string;
    nameEn: string;
    descriptionKo: string | null;
    descriptionEn: string | null;
    sortOrder: number;
    enabled: boolean;
    partners: Array<{
      id: number;
      regionId: number;
      countryKo: string;
      countryEn: string;
      companyKo: string;
      companyEn: string;
      legalName: string | null;
      addressKo: string;
      addressEn: string;
      telephone: string | null;
      email: string | null;
      website: string | null;
      logoUrl: string | null;
      sortOrder: number;
      published: boolean;
    }>;
  }>;
}) {
  const contactHeroConfigs = pageHeroConfigs.filter((config) => config.pageKey.startsWith("contact-"));

  return (
    <div className="lumosAdminStack">
      <AdminSectionCard title="대리점 소개 관리" description="지도 이미지, 대륙 활성화, 대리점 CRUD를 관리합니다.">
        <AdminDistributorsTabs settings={distributorSettings} regions={distributorRegions} />
      </AdminSectionCard>
      <AdminSectionCard
        title="Contact Subpage Hero"
        description="Quote, Distributors, Directions, Resources 상단 비주얼과 카피를 조정합니다."
      >
        <AdminPageHeroTabs pageHeroConfigs={contactHeroConfigs} />
      </AdminSectionCard>
    </div>
  );
}
