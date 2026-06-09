"use client";

import { useMemo, useState } from "react";

import { savePageHeroConfig } from "@/app/admin/actions";
import { AdminImageField } from "@/components/admin-image-field";

type PageHeroConfigItem = {
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

const pageLabelMap: Record<string, string> = {
  applications: "Application",
  products: "Product",
  "contact-quote": "Contact Quote",
  "contact-distributors": "Contact Distributors",
  "contact-directions": "Contact Directions",
  "contact-resources": "Contact Resources",
  "legal-privacy": "Privacy",
  "legal-terms": "Terms",
};

export function AdminPageHeroTabs({
  pageHeroConfigs,
}: {
  pageHeroConfigs: PageHeroConfigItem[];
}) {
  const sortedConfigs = useMemo(
    () => [...pageHeroConfigs].sort((a, b) => a.pageKey.localeCompare(b.pageKey)),
    [pageHeroConfigs],
  );
  const [activeKey, setActiveKey] = useState(sortedConfigs[0]?.pageKey ?? "");

  const activeConfig =
    sortedConfigs.find((config) => config.pageKey === activeKey) ?? sortedConfigs[0] ?? null;

  if (!activeConfig) {
    return null;
  }

  return (
    <div className="lumosAdminTabs">
      <div className="lumosAdminTabList" role="tablist" aria-label="Sub hero pages">
        {sortedConfigs.map((config) => (
          <button
            key={config.pageKey}
            type="button"
            role="tab"
            aria-selected={activeConfig.pageKey === config.pageKey}
            className={`lumosAdminTabButton ${
              activeConfig.pageKey === config.pageKey ? "isActive" : ""
            }`}
            onClick={() => setActiveKey(config.pageKey)}
          >
            {pageLabelMap[config.pageKey] ?? config.pageKey}
          </button>
        ))}
      </div>

      <form key={activeConfig.id} action={savePageHeroConfig} className="lumosAdminForm">
        <input type="hidden" name="pageKey" value={activeConfig.pageKey} />
        <div className="lumosAdminSectionHead">
          <div>
            <h3>{pageLabelMap[activeConfig.pageKey] ?? activeConfig.pageKey}</h3>
            <p>Sub bg 이미지, 투명도, eyebrow, title, lead를 조정합니다.</p>
          </div>
        </div>
        <div className="lumosAdminAssetPreview">
          <div className="lumosAdminAssetPreviewHead">
            <strong>Sub Hero Background</strong>
            <span>{activeConfig.backgroundImageUrl ? "연결됨" : "미연결"}</span>
          </div>
          <div className="lumosAdminAssetPreviewFrame">
            {activeConfig.backgroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeConfig.backgroundImageUrl}
                alt={activeConfig.pageKey}
                className="lumosAdminAssetPreviewImage"
              />
            ) : (
              <div className="lumosAdminAssetPreviewEmpty">No background connected</div>
            )}
          </div>
        </div>
        <div className="lumosAdminFormGrid">
          <AdminImageField
            label="Background Image URL"
            urlName="backgroundImageUrl"
            uploadName="backgroundImageUpload"
            defaultValue={activeConfig.backgroundImageUrl}
            placeholder="/subpage-contact-bg.png"
          />
          <label className="field">
            <span>Background Opacity</span>
            <input
              name="backgroundOpacity"
              type="number"
              min={0}
              max={1}
              step="0.05"
              defaultValue={activeConfig.backgroundOpacity}
            />
          </label>
        </div>
        <div className="lumosAdminFormGrid">
          <label className="field">
            <span>Eyebrow KO</span>
            <input name="eyebrowKo" defaultValue={activeConfig.eyebrowKo} />
          </label>
          <label className="field">
            <span>Eyebrow EN</span>
            <input name="eyebrowEn" defaultValue={activeConfig.eyebrowEn} />
          </label>
        </div>
        <div className="lumosAdminFormGrid">
          <label className="field">
            <span>Title KO</span>
            <input name="titleKo" defaultValue={activeConfig.titleKo} />
          </label>
          <label className="field">
            <span>Title EN</span>
            <input name="titleEn" defaultValue={activeConfig.titleEn} />
          </label>
        </div>
        <div className="lumosAdminFormGrid">
          <label className="field">
            <span>Description KO</span>
            <textarea name="descriptionKo" defaultValue={activeConfig.descriptionKo} />
          </label>
          <label className="field">
            <span>Description EN</span>
            <textarea name="descriptionEn" defaultValue={activeConfig.descriptionEn} />
          </label>
        </div>
        <button type="submit" className="lumosAdminPrimaryButton">
          {(pageLabelMap[activeConfig.pageKey] ?? activeConfig.pageKey) + " 저장"}
        </button>
      </form>
    </div>
  );
}
