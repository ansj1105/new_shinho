"use client";

import { useState } from "react";

import {
  deleteManufacturerLogo,
  restoreHeroImage,
  saveManufacturerLogo,
  updateHeroSection,
  updateSeriesCardImage,
  updateSeriesSection,
  updateSiteConfig,
  updateStorySection,
} from "@/app/admin/actions";
import { AdminImageField } from "@/components/admin-image-field";
import { AdminPageHeroTabs } from "@/components/admin-page-hero-tabs";
import { AdminRichTextEditor } from "@/components/admin-rich-text-editor";
import { siteUrl } from "@/lib/site";

type SiteConfigData = {
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

type PageHeroConfigData = {
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
};

type SeriesProductData = {
  id: number;
  slug: string;
  nameKo: string;
  nameEn: string;
  imageUrl: string | null;
  displayOrder: number;
};

type ManufacturerLogoData = {
  id: number;
  name: string;
  logoUrl: string;
  href: string | null;
  displayOrder: number;
  published: boolean;
};

const defaultProductImageUrls: Record<string, string> = {
  laser: "/product-placeholder.svg",
  "laser-scanner": "/product-placeholder.svg",
  "laser-metrology": "/product-placeholder.svg",
  "beam-shaping": "/product-placeholder.svg",
  optics: "/product-placeholder.svg",
  "beam-delivery": "/product-placeholder.svg",
  "optical-solution": "/product-placeholder.svg",
};

function resolveProductImageUrl(product: SeriesProductData) {
  return product.imageUrl || defaultProductImageUrls[product.slug] || "";
}

const homeTabItems = [
  { key: "hero", label: "Hero" },
  { key: "story", label: "Story" },
  { key: "series", label: "Series" },
  { key: "flow", label: "Flow Logos" },
  { key: "history", label: "History" },
  { key: "seo", label: "SEO" },
  { key: "subhero", label: "Sub Hero" },
] as const;

export function AdminHomeTabs({
  siteConfig,
  pageHeroConfigs,
  products,
  manufacturerLogos,
}: {
  siteConfig: SiteConfigData;
  pageHeroConfigs: PageHeroConfigData[];
  products: SeriesProductData[];
  manufacturerLogos: ManufacturerLogoData[];
}) {
  const recentHistory = siteConfig.heroImageHistory.slice(0, 5);
  const [activeKey, setActiveKey] = useState<(typeof homeTabItems)[number]["key"]>("hero");
  const seriesProducts = [...products].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);

  return (
    <div className="lumosAdminTabs">
      <div className="lumosAdminTabList" role="tablist" aria-label="Home settings tabs">
        {homeTabItems.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeKey === item.key}
            className={`lumosAdminTabButton ${activeKey === item.key ? "isActive" : ""}`}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeKey === "hero" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Hero Section</h2>
              <p>메인 첫 섹션의 대표 이미지와 문구를 관리합니다.</p>
            </div>
          </div>
          <form action={updateHeroSection} className="lumosAdminForm">
            <div className="lumosAdminClientPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Client Page Preview</strong>
                <span>/ko</span>
              </div>
              <div className="lumosAdminClientPreviewFrame">
                <iframe
                  src="/ko"
                  title="home hero preview"
                  loading="lazy"
                  scrolling="no"
                  className="lumosAdminClientPreviewIframe"
                />
              </div>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminImageField
                label="Hero Image URL"
                urlName="heroImageUrl"
                uploadName="heroImageUpload"
                defaultValue={siteConfig.heroImageUrl}
                placeholder="/hero-main-laser.png"
              />
              <AdminRichTextEditor name="heroTitleKo" label="Hero Title KO" defaultValue={siteConfig.heroTitleKo} />
              <AdminRichTextEditor name="heroTitleEn" label="Hero Title EN" defaultValue={siteConfig.heroTitleEn} />
              <AdminRichTextEditor
                name="heroDescriptionKo"
                label="Hero Description KO"
                defaultValue={siteConfig.heroDescriptionKo}
              />
              <AdminRichTextEditor
                name="heroDescriptionEn"
                label="Hero Description EN"
                defaultValue={siteConfig.heroDescriptionEn}
              />
            </div>
            <p className="adminHint">Hero 문구는 TipTap 라이브러리 에디터로 저장되며 메인 첫 섹션에 바로 반영됩니다.</p>
            <input type="hidden" name="heroFontSize" value={siteConfig.heroFontSize} />
            <button type="submit" className="lumosAdminPrimaryButton">
              Hero 저장
            </button>
          </form>
        </section>
      ) : null}

      {activeKey === "story" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Story Section</h2>
              <p>브랜드 어원 섹션 문구와 폰트 크기를 관리합니다.</p>
            </div>
          </div>
          <form action={updateStorySection} className="lumosAdminForm">
            <div className="lumosAdminClientPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Client Page Preview</strong>
                <span>/ko#storySection</span>
              </div>
              <div className="lumosAdminClientPreviewFrame">
                <iframe
                  src="/ko#storySection"
                  title="story section preview"
                  loading="lazy"
                  scrolling="no"
                  className="lumosAdminClientPreviewIframe"
                />
              </div>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Story Title KO</span>
                <input name="storyTitleKo" defaultValue={siteConfig.storyTitleKo} />
              </label>
              <label className="field">
                <span>Story Title EN</span>
                <input name="storyTitleEn" defaultValue={siteConfig.storyTitleEn} />
              </label>
              <label className="field">
                <span>Title Font KO</span>
                <input
                  name="storyTitleFontSizeKo"
                  type="number"
                  min={24}
                  max={72}
                  defaultValue={siteConfig.storyTitleFontSizeKo}
                />
              </label>
              <label className="field">
                <span>Title Font EN</span>
                <input
                  name="storyTitleFontSizeEn"
                  type="number"
                  min={24}
                  max={72}
                  defaultValue={siteConfig.storyTitleFontSizeEn}
                />
              </label>
              <label className="field">
                <span>Brand Label Font KO</span>
                <input
                  name="storyEyebrowFontSizeKo"
                  type="number"
                  min={12}
                  max={36}
                  defaultValue={siteConfig.storyEyebrowFontSizeKo}
                />
              </label>
              <label className="field">
                <span>Brand Label Font EN</span>
                <input
                  name="storyEyebrowFontSizeEn"
                  type="number"
                  min={12}
                  max={36}
                  defaultValue={siteConfig.storyEyebrowFontSizeEn}
                />
              </label>
              <label className="field">
                <span>Body Font KO</span>
                <input
                  name="storyBodyFontSizeKo"
                  type="number"
                  min={12}
                  max={28}
                  defaultValue={siteConfig.storyBodyFontSizeKo}
                />
              </label>
              <label className="field">
                <span>Body Font EN</span>
                <input
                  name="storyBodyFontSizeEn"
                  type="number"
                  min={12}
                  max={28}
                  defaultValue={siteConfig.storyBodyFontSizeEn}
                />
              </label>
            </div>
            <input type="hidden" name="storyFontSize" value={siteConfig.storyBodyFontSizeKo} />
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Story Body KO</span>
                <textarea name="storyBodyKo" defaultValue={siteConfig.storyBodyKo} />
              </label>
              <label className="field">
                <span>Story Body EN</span>
                <textarea name="storyBodyEn" defaultValue={siteConfig.storyBodyEn} />
              </label>
            </div>
            <button type="submit" className="lumosAdminPrimaryButton">
              어원 영역 저장
            </button>
          </form>
        </section>
      ) : null}

      {activeKey === "series" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Series Section</h2>
              <p>메인 제품 소개 섹션의 제목, 설명, 이미지 구성을 관리합니다. 실제 화면은 hover 활성 카드 형태로 노출됩니다.</p>
            </div>
          </div>
          <form action={updateSeriesSection} className="lumosAdminForm">
            <div className="lumosAdminClientPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Client Page Preview</strong>
                <span>/ko#homeSeriesSection</span>
              </div>
              <div className="lumosAdminClientPreviewFrame">
                <iframe
                  src="/ko#homeSeriesSection"
                  title="home series section preview"
                  loading="lazy"
                  scrolling="no"
                  className="lumosAdminClientPreviewIframe"
                />
              </div>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Series Title KO</span>
                <input name="seriesTitleKo" defaultValue={siteConfig.seriesTitleKo} />
              </label>
              <label className="field">
                <span>Series Title EN</span>
                <input name="seriesTitleEn" defaultValue={siteConfig.seriesTitleEn} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminRichTextEditor name="seriesLeadKo" label="Series Lead KO" defaultValue={siteConfig.seriesLeadKo} />
              <AdminRichTextEditor name="seriesLeadEn" label="Series Lead EN" defaultValue={siteConfig.seriesLeadEn} />
            </div>
            <button type="submit" className="lumosAdminPrimaryButton">
              상품 섹션 저장
            </button>
          </form>

          <div className="lumosAdminSeriesManager">
            <div className="lumosAdminSectionHead">
              <div>
                <h3>Series Showcase Images</h3>
                <p>각 제품 카드의 대표 이미지를 관리합니다. 제품명과 소개 문구는 Product 관리의 제품명·요약 문구를 사용합니다.</p>
              </div>
            </div>
            <div className="lumosAdminSeriesGrid">
              {seriesProducts.map((product) => (
                <div key={product.id} className="lumosAdminSeriesCard">
                  <div className="lumosAdminAssetPreview">
                    <div className="lumosAdminAssetPreviewHead">
                      <strong>{product.nameKo}</strong>
                      <span>{resolveProductImageUrl(product) || product.slug}</span>
                    </div>
                    <div className="lumosAdminAssetPreviewFrame">
                      {resolveProductImageUrl(product) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveProductImageUrl(product)}
                          alt={product.nameKo}
                          className="lumosAdminAssetPreviewImage"
                        />
                      ) : (
                        <div className="lumosAdminAssetPreviewEmpty">No image connected</div>
                      )}
                    </div>
                  </div>
                  <form action={updateSeriesCardImage} className="lumosAdminForm">
                    <input type="hidden" name="id" value={product.id} />
                    <AdminImageField
                      label="Series Image URL"
                      urlName="imageUrl"
                      uploadName="imageUpload"
                      defaultValue={resolveProductImageUrl(product)}
                      placeholder="/product-placeholder.svg"
                    />
                    <div className="lumosAdminActionRow">
                      <a
                        href="/asdasddfg/admin/products"
                        className="lumosAdminGhostButton"
                      >
                        Product 관리
                      </a>
                      <button type="submit" className="lumosAdminPrimaryButton">
                        이미지 저장
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeKey === "flow" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Flow Logo Bar</h2>
              <p>메인 하단에 흘러가는 제조사 로고, 링크, 노출 순서를 관리합니다.</p>
            </div>
          </div>
          <div className="lumosAdminSeriesManager">
            <div className="lumosAdminSectionHead">
              <div>
                <h3>새 제조사 로고 추가</h3>
                <p>이미지는 public 경로 또는 외부 이미지 URL을 입력합니다.</p>
              </div>
            </div>
            <form action={saveManufacturerLogo} className="lumosAdminForm">
              <input type="hidden" name="id" value="0" />
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>제조사명</span>
                  <input name="name" />
                </label>
                <AdminImageField
                  label="Logo Image URL"
                  urlName="logoUrl"
                  uploadName="logoUpload"
                  placeholder="/makers/example.png"
                />
                <label className="field">
                  <span>Link URL</span>
                  <input name="href" placeholder="https://example.com" />
                </label>
                <label className="field">
                  <span>순서</span>
                  <input name="displayOrder" type="number" defaultValue={manufacturerLogos.length + 1} />
                </label>
              </div>
              <label className="adminInlineCheck">
                <input type="checkbox" name="published" defaultChecked />
                <span>노출</span>
              </label>
              <button type="submit" className="lumosAdminPrimaryButton">
                로고 추가
              </button>
            </form>
          </div>

          <div className="lumosAdminSeriesGrid">
            {manufacturerLogos.map((logo) => (
              <div key={logo.id} className="lumosAdminSeriesCard">
                <div className="lumosAdminAssetPreview">
                  <div className="lumosAdminAssetPreviewHead">
                    <strong>{logo.name}</strong>
                    <span>{logo.logoUrl}</span>
                  </div>
                  <div className="lumosAdminAssetPreviewFrame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.logoUrl} alt={logo.name} className="lumosAdminAssetPreviewImage" />
                  </div>
                </div>
                <form action={saveManufacturerLogo} className="lumosAdminForm">
                  <input type="hidden" name="id" value={logo.id} />
                  <div className="lumosAdminFormGrid">
                    <label className="field">
                      <span>제조사명</span>
                      <input name="name" defaultValue={logo.name} />
                    </label>
                    <AdminImageField
                      label="Logo Image URL"
                      urlName="logoUrl"
                      uploadName="logoUpload"
                      defaultValue={logo.logoUrl}
                      placeholder="/makers/example.png"
                    />
                    <label className="field">
                      <span>Link URL</span>
                      <input name="href" defaultValue={logo.href ?? ""} />
                    </label>
                    <label className="field">
                      <span>순서</span>
                      <input name="displayOrder" type="number" defaultValue={logo.displayOrder} />
                    </label>
                  </div>
                  <label className="adminInlineCheck">
                    <input type="checkbox" name="published" defaultChecked={logo.published} />
                    <span>노출</span>
                  </label>
                  <div className="lumosAdminActionRow">
                    <button type="submit" className="lumosAdminPrimaryButton">
                      저장
                    </button>
                  </div>
                </form>
                <form action={deleteManufacturerLogo}>
                  <input type="hidden" name="id" value={logo.id} />
                  <button type="submit" className="lumosAdminGhostButton">
                    삭제
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeKey === "history" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Hero Image History</h2>
              <p>최근 5개 변경 이력을 표시합니다. 전체 보관은 최대 10개입니다.</p>
            </div>
          </div>
          <div className="lumosAdminHistoryList">
            {recentHistory.length === 0 ? <p>아직 저장된 이력이 없습니다.</p> : null}
            {recentHistory.map((item) => (
              <div key={item.id} className="lumosAdminHistoryItem">
                <div>
                  <strong>{item.imageUrl}</strong>
                  <span>{item.createdAt.toLocaleString("ko-KR")}</span>
                </div>
                <form action={restoreHeroImage}>
                  <input type="hidden" name="imageUrl" value={item.imageUrl} />
                  <button type="submit" className="lumosAdminGhostButton">
                    적용
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeKey === "seo" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>SEO Settings</h2>
              <p>메인 페이지 SEO 메타 정보를 관리합니다.</p>
            </div>
          </div>
          <form action={updateSiteConfig} className="lumosAdminForm">
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Title KO</span>
                <input name="seoTitleKo" defaultValue={siteConfig.seoTitleKo} />
              </label>
              <label className="field">
                <span>SEO Title EN</span>
                <input name="seoTitleEn" defaultValue={siteConfig.seoTitleEn} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Description KO</span>
                <textarea name="seoDescriptionKo" defaultValue={siteConfig.seoDescriptionKo} />
              </label>
              <label className="field">
                <span>SEO Description EN</span>
                <textarea name="seoDescriptionEn" defaultValue={siteConfig.seoDescriptionEn} />
              </label>
            </div>
            <input type="hidden" name="heroTitleKo" value={siteConfig.heroTitleKo} />
            <input type="hidden" name="heroTitleEn" value={siteConfig.heroTitleEn} />
            <input type="hidden" name="heroDescriptionKo" value={siteConfig.heroDescriptionKo} />
            <input type="hidden" name="heroDescriptionEn" value={siteConfig.heroDescriptionEn} />
            <input type="hidden" name="heroImageUrl" value={siteConfig.heroImageUrl ?? ""} />
            <input type="hidden" name="heroFontSize" value={siteConfig.heroFontSize} />
            <input type="hidden" name="storyTitleKo" value={siteConfig.storyTitleKo} />
            <input type="hidden" name="storyTitleEn" value={siteConfig.storyTitleEn} />
            <input type="hidden" name="storyBodyKo" value={siteConfig.storyBodyKo} />
            <input type="hidden" name="storyBodyEn" value={siteConfig.storyBodyEn} />
            <input type="hidden" name="storyFontSize" value={siteConfig.storyFontSize} />
            <input type="hidden" name="storyTitleFontSizeKo" value={siteConfig.storyTitleFontSizeKo} />
            <input type="hidden" name="storyTitleFontSizeEn" value={siteConfig.storyTitleFontSizeEn} />
            <input type="hidden" name="storyEyebrowFontSizeKo" value={siteConfig.storyEyebrowFontSizeKo} />
            <input type="hidden" name="storyEyebrowFontSizeEn" value={siteConfig.storyEyebrowFontSizeEn} />
            <input type="hidden" name="storyBodyFontSizeKo" value={siteConfig.storyBodyFontSizeKo} />
            <input type="hidden" name="storyBodyFontSizeEn" value={siteConfig.storyBodyFontSizeEn} />
            <input type="hidden" name="seriesTitleKo" value={siteConfig.seriesTitleKo} />
            <input type="hidden" name="seriesTitleEn" value={siteConfig.seriesTitleEn} />
            <input type="hidden" name="seriesLeadKo" value={siteConfig.seriesLeadKo} />
            <input type="hidden" name="seriesLeadEn" value={siteConfig.seriesLeadEn} />
            <button type="submit" className="lumosAdminPrimaryButton">
              SEO 저장
            </button>
          </form>
        </section>
      ) : null}

      {activeKey === "subhero" ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>Sub Hero Settings</h2>
              <p>각 서브페이지 공통 상단 배경 이미지와 문구를 페이지별로 관리합니다.</p>
            </div>
          </div>
          <AdminPageHeroTabs pageHeroConfigs={pageHeroConfigs} />
        </section>
      ) : null}
    </div>
  );
}
