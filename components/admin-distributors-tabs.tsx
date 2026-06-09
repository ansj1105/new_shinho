"use client";

import { useMemo, useState } from "react";

import {
  deleteDistributorPartner,
  deleteDistributorRegion,
  saveDistributorPartner,
  saveDistributorRegion,
  saveDistributorSettings,
} from "@/app/admin/actions";
import { AdminImageField } from "@/components/admin-image-field";

type DistributorPartnerItem = {
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
};

type DistributorRegionItem = {
  id: number;
  slug: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  enabled: boolean;
  partners: DistributorPartnerItem[];
};

export function AdminDistributorsTabs({
  settings,
  regions,
}: {
  settings: { id: number; mapImageUrl: string | null };
  regions: DistributorRegionItem[];
}) {
  const sortedRegions = useMemo(
    () => [...regions].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [regions],
  );
  const [activeRegionId, setActiveRegionId] = useState(sortedRegions[0]?.id ?? 0);
  const [showCreateRegion, setShowCreateRegion] = useState(false);
  const activeRegion = sortedRegions.find((region) => region.id === activeRegionId) ?? sortedRegions[0] ?? null;

  return (
    <div className="lumosAdminTabs">
      <section className="lumosAdminNestedSection">
        <div className="lumosAdminSectionHead">
          <div>
            <h3>대리점 소개 지도 이미지</h3>
            <p>공개 페이지의 지도 영역 대신 노출할 이미지를 등록합니다.</p>
          </div>
        </div>
        <form action={saveDistributorSettings} className="lumosAdminForm">
          <div className="lumosAdminAssetPreview">
            <div className="lumosAdminAssetPreviewHead">
              <strong>Map Image</strong>
              <span>이미지 URL 변경 가능</span>
            </div>
            <div className="lumosAdminAssetPreviewFrame">
              {settings.mapImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.mapImageUrl} alt="Distributor map preview" className="lumosAdminAssetPreviewImage" />
              ) : (
                <div className="lumosAdminAssetPreviewEmpty">No map image connected</div>
              )}
            </div>
          </div>
          <AdminImageField
            label="Map Image URL"
            urlName="mapImageUrl"
            uploadName="mapImageUpload"
            defaultValue={settings.mapImageUrl}
          />
          <button type="submit" className="lumosAdminPrimaryButton">
            지도 이미지 저장
          </button>
        </form>
      </section>

      <div className="lumosAdminTabToolbar">
        <div className="lumosAdminTabList" role="tablist" aria-label="Distributor regions">
          {sortedRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              role="tab"
              aria-selected={activeRegion?.id === region.id}
              className={`lumosAdminTabButton ${activeRegion?.id === region.id ? "isActive" : ""}`}
              onClick={() => {
                setActiveRegionId(region.id);
                setShowCreateRegion(false);
              }}
            >
              {region.nameKo}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`lumosAdminPrimaryButton ${showCreateRegion ? "isSoftActive" : ""}`}
          onClick={() => setShowCreateRegion((value) => !value)}
        >
          새 대륙 추가
        </button>
      </div>

      {showCreateRegion ? (
        <RegionForm region={null} submitLabel="대륙 생성" />
      ) : activeRegion ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>{activeRegion.nameKo}</h2>
              <p>{activeRegion.enabled ? "활성화됨" : "비활성화됨"}</p>
            </div>
          </div>
          <RegionForm region={activeRegion} submitLabel="대륙 저장" />
          <PartnerList region={activeRegion} regions={sortedRegions} />
        </section>
      ) : null}
    </div>
  );
}

function RegionForm({
  region,
  submitLabel,
}: {
  region: DistributorRegionItem | null;
  submitLabel: string;
}) {
  return (
    <form action={saveDistributorRegion} className="lumosAdminForm">
      {region ? <input type="hidden" name="id" value={region.id} /> : null}
      <div className="lumosAdminFormGrid">
        <label className="field">
          <span>Slug</span>
          <input name="slug" defaultValue={region?.slug ?? ""} placeholder="asia" />
        </label>
        <label className="field">
          <span>Sort Order</span>
          <input name="sortOrder" type="number" defaultValue={region?.sortOrder ?? 99} />
        </label>
        <label className="field">
          <span>Name KO</span>
          <input name="nameKo" defaultValue={region?.nameKo ?? ""} />
        </label>
        <label className="field">
          <span>Name EN</span>
          <input name="nameEn" defaultValue={region?.nameEn ?? ""} />
        </label>
      </div>
      <div className="lumosAdminFormGrid">
        <label className="field lumosAdminEditorField">
          <span>Description KO</span>
          <textarea name="descriptionKo" rows={4} defaultValue={region?.descriptionKo ?? ""} />
        </label>
        <label className="field lumosAdminEditorField">
          <span>Description EN</span>
          <textarea name="descriptionEn" rows={4} defaultValue={region?.descriptionEn ?? ""} />
        </label>
      </div>
      <div className="lumosAdminActionRow">
        <label className="lumosAdminCheckbox">
          <input type="checkbox" name="enabled" defaultChecked={region?.enabled ?? true} />
          <span>대륙 활성화</span>
        </label>
        <button type="submit" className="lumosAdminPrimaryButton">
          {submitLabel}
        </button>
      </div>
      {region ? (
        <button type="submit" formAction={deleteDistributorRegion} className="lumosAdminDangerButton">
          대륙 삭제
        </button>
      ) : null}
    </form>
  );
}

function PartnerList({
  region,
  regions,
}: {
  region: DistributorRegionItem;
  regions: DistributorRegionItem[];
}) {
  const partners = [...region.partners].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  return (
    <section className="lumosAdminNestedSection">
      <div className="lumosAdminSectionHead">
        <div>
          <h3>대리점 CRUD</h3>
          <p>선택한 대륙에 속한 대리점을 추가, 수정, 삭제합니다.</p>
        </div>
      </div>
      <div className="lumosAdminDocumentList">
        {partners.length ? (
          partners.map((partner) => (
            <article key={partner.id} className="lumosAdminDocumentItem">
              <div className="lumosAdminDocumentMeta">
                <strong>{partner.companyKo}</strong>
                <span>{partner.countryKo}</span>
                <small>{partner.email ?? partner.website ?? "연락처 미등록"}</small>
              </div>
              <PartnerForm partner={partner} regions={regions} submitLabel="대리점 저장" />
              <form action={deleteDistributorPartner} className="lumosAdminInlineForm">
                <input type="hidden" name="id" value={partner.id} />
                <button type="submit" className="lumosAdminDangerButton">
                  대리점 삭제
                </button>
              </form>
            </article>
          ))
        ) : (
          <p className="lumosAdminEmptyText">등록된 대리점이 없습니다.</p>
        )}
      </div>
      <div className="lumosAdminSectionHead">
        <div>
          <h3>새 대리점 추가</h3>
          <p>참고 이미지처럼 대륙 아래 카드로 추가됩니다.</p>
        </div>
      </div>
      <PartnerForm partner={null} regions={regions} defaultRegionId={region.id} submitLabel="대리점 추가" />
    </section>
  );
}

function PartnerForm({
  partner,
  regions,
  defaultRegionId,
  submitLabel,
}: {
  partner: DistributorPartnerItem | null;
  regions: DistributorRegionItem[];
  defaultRegionId?: number;
  submitLabel: string;
}) {
  return (
    <form action={saveDistributorPartner} className="lumosAdminForm">
      {partner ? <input type="hidden" name="id" value={partner.id} /> : null}
      <div className="lumosAdminFormGrid">
        <label className="field">
          <span>Region</span>
          <select name="regionId" defaultValue={partner?.regionId ?? defaultRegionId}>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nameKo}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Sort Order</span>
          <input name="sortOrder" type="number" defaultValue={partner?.sortOrder ?? 99} />
        </label>
        <label className="field">
          <span>Country KO</span>
          <input name="countryKo" defaultValue={partner?.countryKo ?? ""} />
        </label>
        <label className="field">
          <span>Country EN</span>
          <input name="countryEn" defaultValue={partner?.countryEn ?? ""} />
        </label>
        <label className="field">
          <span>Company KO</span>
          <input name="companyKo" defaultValue={partner?.companyKo ?? ""} />
        </label>
        <label className="field">
          <span>Company EN</span>
          <input name="companyEn" defaultValue={partner?.companyEn ?? ""} />
        </label>
        <label className="field">
          <span>Legal Name</span>
          <input name="legalName" defaultValue={partner?.legalName ?? ""} />
        </label>
        <AdminImageField
          label="Logo URL"
          urlName="logoUrl"
          uploadName="logoUpload"
          defaultValue={partner?.logoUrl}
          placeholder="/contact/distributor-logo.png"
        />
      </div>
      <div className="lumosAdminFormGrid">
        <label className="field lumosAdminEditorField">
          <span>Address KO</span>
          <textarea name="addressKo" rows={4} defaultValue={partner?.addressKo ?? ""} />
        </label>
        <label className="field lumosAdminEditorField">
          <span>Address EN</span>
          <textarea name="addressEn" rows={4} defaultValue={partner?.addressEn ?? ""} />
        </label>
      </div>
      <div className="lumosAdminFormGrid">
        <label className="field">
          <span>Tel</span>
          <input name="telephone" defaultValue={partner?.telephone ?? ""} />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" defaultValue={partner?.email ?? ""} />
        </label>
        <label className="field">
          <span>Website</span>
          <input name="website" defaultValue={partner?.website ?? ""} />
        </label>
      </div>
      <div className="lumosAdminActionRow">
        <label className="lumosAdminCheckbox">
          <input type="checkbox" name="published" defaultChecked={partner?.published ?? true} />
          <span>대리점 노출</span>
        </label>
        <button type="submit" className="lumosAdminPrimaryButton">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
