"use client";

import { useMemo, useState } from "react";

import {
  deleteProduct,
  deleteProductDocument,
  deleteProductMaker,
  saveProduct,
  saveProductDocument,
  saveProductMaker,
} from "@/app/admin/actions";
import { AdminImageField } from "@/components/admin-image-field";
import { siteUrl } from "@/lib/site";

type ProductItem = {
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
  makers: ProductMakerItem[];
  documents: ProductDocumentItem[];
};

type ProductMakerItem = {
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
};

type ProductDocumentItem = {
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
};

function textValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join("\n");
  }

  return "";
}

function specValue(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (typeof item === "object" && item && "label" in item && "value" in item) {
        return `${String(item.label)}|${String(item.value)}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function formatFileSize(size: number | null) {
  if (!size) {
    return "-";
  }

  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function documentKindLabel(kind: ProductDocumentItem["kind"]) {
  return kind === "DATASHEET" ? "Data sheet" : "도면";
}

const defaultProductImageUrls: Record<string, string> = {
  laser: "/product-placeholder.svg",
  "laser-scanner": "/product-placeholder.svg",
  "laser-metrology": "/product-placeholder.svg",
  "beam-shaping": "/product-placeholder.svg",
  optics: "/product-placeholder.svg",
  "beam-delivery": "/product-placeholder.svg",
  "optical-solution": "/product-placeholder.svg",
};

function resolveProductImageUrl(product: Pick<ProductItem, "slug" | "imageUrl">) {
  return product.imageUrl || defaultProductImageUrls[product.slug] || "";
}

export function AdminProductsTabs({
  products,
}: {
  products: ProductItem[];
}) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    [products],
  );
  const [activeId, setActiveId] = useState(sortedProducts[0]?.id ?? 0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const activeProduct =
    sortedProducts.find((product) => product.id === activeId) ?? sortedProducts[0] ?? null;
  const activeProductImageUrl = activeProduct ? resolveProductImageUrl(activeProduct) : "";

  return (
    <div className="lumosAdminTabs">
      <div className="lumosAdminTabToolbar">
        <div className="lumosAdminTabList" role="tablist" aria-label="Product">
          {sortedProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={activeProduct?.id === product.id}
              className={`lumosAdminTabButton ${activeProduct?.id === product.id ? "isActive" : ""}`}
              onClick={() => {
                setActiveId(product.id);
                setShowCreateForm(false);
              }}
            >
              {product.nameKo}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`lumosAdminPrimaryButton ${showCreateForm ? "isSoftActive" : ""}`}
          onClick={() => setShowCreateForm((value) => !value)}
        >
          새 Product 추가
        </button>
      </div>

      {showCreateForm ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>새 Product 추가</h2>
              <p>제품 생성 시 제품 목록, 메인 제품 영역, 상단 제품 확장 메뉴, 푸터, 상세 페이지에 함께 반영됩니다.</p>
            </div>
          </div>
          <form action={saveProduct} className="lumosAdminForm">
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Slug</span>
                <input name="slug" placeholder="new-product" />
              </label>
              <label className="field">
                <span>Display Order</span>
                <input name="displayOrder" type="number" defaultValue={products.length + 1} />
              </label>
              <AdminImageField label="Image URL" urlName="imageUrl" uploadName="imageUpload" />
            </div>
            <p className="adminHint">
              Image URL은 제품 목록, 메인 제품 영역, 제품 상세 기본 이미지에 사용됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Name KO</span>
                <input name="nameKo" />
              </label>
              <label className="field">
                <span>Name EN</span>
                <input name="nameEn" />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Sub Hero Eyebrow KO</span>
                <input name="heroEyebrowKo" />
              </label>
              <label className="field">
                <span>Sub Hero Eyebrow EN</span>
                <input name="heroEyebrowEn" />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Sub Hero Title KO</span>
                <input name="heroTitleKo" />
              </label>
              <label className="field">
                <span>Sub Hero Title EN</span>
                <input name="heroTitleEn" />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Sub Hero Lead KO</span>
                <textarea name="heroLeadKo" rows={6} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Sub Hero Lead EN</span>
                <textarea name="heroLeadEn" rows={6} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminImageField
                label="Sub Hero BG Image URL"
                urlName="heroBgImageUrl"
                uploadName="heroBgImageUpload"
              />
              <label className="field">
                <span>Sub Hero BG Opacity</span>
                <input name="heroBgOpacity" type="number" min={0} max={1} step={0.05} defaultValue={0.9} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Summary KO</span>
                <textarea name="summaryKo" rows={8} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Summary EN</span>
                <textarea name="summaryEn" rows={8} />
              </label>
            </div>
            <p className="adminHint">
              Summary와 Content는 빈 줄로 문단을 나눌 수 있고, 일반 줄바꿈은 같은 문단 안의 줄바꿈으로 표시됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Content KO</span>
                <textarea name="contentKo" rows={10} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Content EN</span>
                <textarea name="contentEn" rows={10} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Features KO</span>
                <textarea name="featuresKo" rows={6} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Features EN</span>
                <textarea name="featuresEn" rows={6} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Application KO</span>
                <textarea name="applicationsKo" rows={6} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Application EN</span>
                <textarea name="applicationsEn" rows={6} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Specs KO (label|value)</span>
                <textarea name="specsKo" rows={6} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Specs EN (label|value)</span>
                <textarea name="specsEn" rows={6} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Title KO</span>
                <input name="seoTitleKo" />
              </label>
              <label className="field">
                <span>SEO Title EN</span>
                <input name="seoTitleEn" />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Description KO</span>
                <textarea name="seoDescriptionKo" />
              </label>
              <label className="field">
                <span>SEO Description EN</span>
                <textarea name="seoDescriptionEn" />
              </label>
            </div>
            <label className="lumosAdminCheckbox">
              <input type="checkbox" name="published" defaultChecked />
              <span>노출</span>
            </label>
            <button type="submit" className="lumosAdminPrimaryButton">
              Product 생성
            </button>
          </form>
        </section>
      ) : activeProduct ? (
        <section key={activeProduct.id} className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>{activeProduct.nameKo}</h2>
              <p>{activeProduct.slug}</p>
            </div>
          </div>
          <form key={`product-form-${activeProduct.id}`} action={saveProduct} className="lumosAdminForm">
            <div className="lumosAdminClientPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Client Page Preview</strong>
                <span>{`/ko/products/${activeProduct.slug}`}</span>
              </div>
              <div className="lumosAdminClientPreviewFrame">
                <iframe
                  key={`product-preview-${activeProduct.id}`}
                  src={`/ko/products/${activeProduct.slug}`}
                  title={`${activeProduct.nameKo} preview`}
                  loading="lazy"
                  scrolling="no"
                  className="lumosAdminClientPreviewIframe"
                />
              </div>
            </div>
            <input type="hidden" name="id" value={activeProduct.id} />
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Slug</span>
                <input name="slug" defaultValue={activeProduct.slug} />
              </label>
              <label className="field">
                <span>Display Order</span>
                <input name="displayOrder" type="number" defaultValue={activeProduct.displayOrder} />
              </label>
              <AdminImageField
                label="Image URL"
                urlName="imageUrl"
                uploadName="imageUpload"
                defaultValue={activeProductImageUrl}
              />
            </div>
            <div className="lumosAdminAssetPreview lumosAdminProductImagePreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Product Image Preview</strong>
                <span>{activeProductImageUrl || "No image path"}</span>
              </div>
              <div className="lumosAdminAssetPreviewFrame">
                {activeProductImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`product-image-${activeProduct.id}`}
                    src={activeProductImageUrl}
                    alt={activeProduct.nameKo}
                    className="lumosAdminAssetPreviewImage"
                  />
                ) : (
                  <div className="lumosAdminAssetPreviewEmpty">No image connected</div>
                )}
              </div>
            </div>
            <p className="adminHint">
              Image URL은 제품 목록, 메인 제품 영역, 제품 상세 기본 이미지에 사용됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Name KO</span>
                <input name="nameKo" defaultValue={activeProduct.nameKo} />
              </label>
              <label className="field">
                <span>Name EN</span>
                <input name="nameEn" defaultValue={activeProduct.nameEn} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Sub Hero Eyebrow KO</span>
                <input name="heroEyebrowKo" defaultValue={activeProduct.heroEyebrowKo ?? ""} />
              </label>
              <label className="field">
                <span>Sub Hero Eyebrow EN</span>
                <input name="heroEyebrowEn" defaultValue={activeProduct.heroEyebrowEn ?? ""} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Sub Hero Title KO</span>
                <input name="heroTitleKo" defaultValue={activeProduct.heroTitleKo ?? ""} />
              </label>
              <label className="field">
                <span>Sub Hero Title EN</span>
                <input name="heroTitleEn" defaultValue={activeProduct.heroTitleEn ?? ""} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Sub Hero Lead KO</span>
                <textarea name="heroLeadKo" rows={6} defaultValue={activeProduct.heroLeadKo ?? ""} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Sub Hero Lead EN</span>
                <textarea name="heroLeadEn" rows={6} defaultValue={activeProduct.heroLeadEn ?? ""} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminImageField
                label="Sub Hero BG Image URL"
                urlName="heroBgImageUrl"
                uploadName="heroBgImageUpload"
                defaultValue={activeProduct.heroBgImageUrl}
              />
              <label className="field">
                <span>Sub Hero BG Opacity</span>
                <input
                  name="heroBgOpacity"
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  defaultValue={activeProduct.heroBgOpacity ?? 0.9}
                />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Summary KO</span>
                <textarea name="summaryKo" rows={8} defaultValue={activeProduct.summaryKo} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Summary EN</span>
                <textarea name="summaryEn" rows={8} defaultValue={activeProduct.summaryEn} />
              </label>
            </div>
            <p className="adminHint">
              Summary와 Content는 빈 줄로 문단을 나눌 수 있고, 일반 줄바꿈은 같은 문단 안의 줄바꿈으로 표시됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Content KO</span>
                <textarea name="contentKo" rows={10} defaultValue={activeProduct.contentKo} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Content EN</span>
                <textarea name="contentEn" rows={10} defaultValue={activeProduct.contentEn} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Features KO</span>
                <textarea name="featuresKo" rows={6} defaultValue={textValue(activeProduct.featuresKo)} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Features EN</span>
                <textarea name="featuresEn" rows={6} defaultValue={textValue(activeProduct.featuresEn)} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Application KO</span>
                <textarea name="applicationsKo" rows={6} defaultValue={textValue(activeProduct.applicationsKo)} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Application EN</span>
                <textarea name="applicationsEn" rows={6} defaultValue={textValue(activeProduct.applicationsEn)} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field lumosAdminEditorField">
                <span>Specs KO (label|value)</span>
                <textarea name="specsKo" rows={6} defaultValue={specValue(activeProduct.specsKo)} />
              </label>
              <label className="field lumosAdminEditorField">
                <span>Specs EN (label|value)</span>
                <textarea name="specsEn" rows={6} defaultValue={specValue(activeProduct.specsEn)} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Title KO</span>
                <input name="seoTitleKo" defaultValue={activeProduct.seoTitleKo ?? ""} />
              </label>
              <label className="field">
                <span>SEO Title EN</span>
                <input name="seoTitleEn" defaultValue={activeProduct.seoTitleEn ?? ""} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>SEO Description KO</span>
                <textarea name="seoDescriptionKo" defaultValue={activeProduct.seoDescriptionKo ?? ""} />
              </label>
              <label className="field">
                <span>SEO Description EN</span>
                <textarea name="seoDescriptionEn" defaultValue={activeProduct.seoDescriptionEn ?? ""} />
              </label>
            </div>
            <div className="lumosAdminActionRow">
              <label className="lumosAdminCheckbox">
                <input type="checkbox" name="published" defaultChecked={activeProduct.published} />
                <span>노출</span>
              </label>
              <div className="lumosAdminActionRowEnd">
                <a
                  href={`${siteUrl}/ko/products/${activeProduct.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lumosAdminGhostButton"
                >
                  프론트 미리보기
                </a>
                <button type="submit" className="lumosAdminPrimaryButton">
                  Product 저장
                </button>
              </div>
            </div>
          </form>
          <section className="lumosAdminNestedSection">
            <div className="lumosAdminSectionHead">
              <div>
                <h3>제조사 상세 관리</h3>
                <p>제품군 하위 3depth 상세 페이지에 노출되는 제조사 로고, 설명, 링크를 관리합니다.</p>
              </div>
            </div>

            <div className="lumosAdminDocumentList">
              {activeProduct.makers.length ? (
                activeProduct.makers.map((maker) => (
                  <article key={maker.id} className="lumosAdminDocumentItem">
                    <div className="lumosAdminDocumentMeta">
                      <strong>{maker.name}</strong>
                      <span>{`/${maker.slug}`}</span>
                      <small>{maker.website ?? "No website"}</small>
                    </div>
                    <form action={saveProductMaker} className="lumosAdminDocumentForm">
                      <input type="hidden" name="id" value={maker.id} />
                      <input type="hidden" name="productId" value={activeProduct.id} />
                      <div className="lumosAdminFormGrid">
                        <label className="field">
                          <span>Slug</span>
                          <input name="slug" defaultValue={maker.slug} />
                        </label>
                        <label className="field">
                          <span>순서</span>
                          <input name="displayOrder" type="number" defaultValue={maker.displayOrder} />
                        </label>
                        <label className="field">
                          <span>제조사명</span>
                          <input name="name" defaultValue={maker.name} />
                        </label>
                        <AdminImageField
                          label="Logo URL"
                          urlName="logoUrl"
                          uploadName="logoUpload"
                          defaultValue={maker.logoUrl}
                          placeholder="/makers/example.png"
                        />
                        <label className="field">
                          <span>Website</span>
                          <input name="website" defaultValue={maker.website ?? ""} />
                        </label>
                      </div>
                      <div className="lumosAdminFormGrid">
                        <label className="field">
                          <span>Summary KO</span>
                          <textarea name="summaryKo" rows={3} defaultValue={maker.summaryKo} />
                        </label>
                        <label className="field">
                          <span>Summary EN</span>
                          <textarea name="summaryEn" rows={3} defaultValue={maker.summaryEn} />
                        </label>
                        <label className="field">
                          <span>Description KO</span>
                          <textarea name="descriptionKo" rows={5} defaultValue={maker.descriptionKo} />
                        </label>
                        <label className="field">
                          <span>Description EN</span>
                          <textarea name="descriptionEn" rows={5} defaultValue={maker.descriptionEn} />
                        </label>
                      </div>
                      <div className="lumosAdminActionRow">
                        <label className="lumosAdminCheckbox">
                          <input type="checkbox" name="published" defaultChecked={maker.published} />
                          <span>노출</span>
                        </label>
                        <button type="submit" className="lumosAdminPrimaryButton">
                          제조사 저장
                        </button>
                      </div>
                    </form>
                    <form action={deleteProductMaker} className="lumosAdminInlineForm">
                      <input type="hidden" name="id" value={maker.id} />
                      <button type="submit" className="lumosAdminDangerButton">
                        제조사 삭제
                      </button>
                    </form>
                  </article>
                ))
              ) : (
                <p className="lumosAdminEmptyText">등록된 제조사가 없습니다.</p>
              )}
            </div>

            <form action={saveProductMaker} className="lumosAdminForm">
              <input type="hidden" name="productId" value={activeProduct.id} />
              <div className="lumosAdminSectionHead">
                <div>
                  <h3>새 제조사 추가</h3>
                  <p>추가한 제조사는 제품군 페이지와 상단바 3depth 메뉴에 반영됩니다.</p>
                </div>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Slug</span>
                  <input name="slug" placeholder="maker-slug" />
                </label>
                <label className="field">
                  <span>순서</span>
                  <input name="displayOrder" type="number" defaultValue={activeProduct.makers.length + 1} />
                </label>
                <label className="field">
                  <span>제조사명</span>
                  <input name="name" />
                </label>
                <AdminImageField
                  label="Logo URL"
                  urlName="logoUrl"
                  uploadName="logoUpload"
                  placeholder="/makers/example.png"
                />
                <label className="field">
                  <span>Website</span>
                  <input name="website" />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Summary KO</span>
                  <textarea name="summaryKo" rows={3} />
                </label>
                <label className="field">
                  <span>Summary EN</span>
                  <textarea name="summaryEn" rows={3} />
                </label>
                <label className="field">
                  <span>Description KO</span>
                  <textarea name="descriptionKo" rows={5} />
                </label>
                <label className="field">
                  <span>Description EN</span>
                  <textarea name="descriptionEn" rows={5} />
                </label>
              </div>
              <div className="lumosAdminActionRow">
                <label className="lumosAdminCheckbox">
                  <input type="checkbox" name="published" defaultChecked />
                  <span>노출</span>
                </label>
                <button type="submit" className="lumosAdminPrimaryButton">
                  제조사 추가
                </button>
              </div>
            </form>
          </section>

          <section className="lumosAdminNestedSection">
            <div className="lumosAdminSectionHead">
              <div>
                <h3>제품 자료 관리</h3>
                <p>Data sheet와 도면 파일을 제품 상세 페이지의 스펙 하단 미리보기 영역에 연결합니다.</p>
              </div>
            </div>

            <div className="lumosAdminDocumentList">
              {activeProduct.documents.length ? (
                activeProduct.documents.map((document) => (
                  <article key={document.id} className="lumosAdminDocumentItem">
                    <div className="lumosAdminDocumentMeta">
                      <strong>{documentKindLabel(document.kind)}</strong>
                      <span>{document.titleKo}</span>
                      <small>{`${document.fileName ?? document.fileUrl} / ${formatFileSize(document.fileSize)}`}</small>
                    </div>
                    <div className="lumosAdminDocumentActions">
                      <a href={document.fileUrl} target="_blank" rel="noreferrer" className="lumosAdminGhostButton">
                        파일 보기
                      </a>
                    </div>
                    <form action={saveProductDocument} className="lumosAdminDocumentForm">
                      <input type="hidden" name="id" value={document.id} />
                      <input type="hidden" name="productId" value={activeProduct.id} />
                      <input type="hidden" name="currentFileUrl" value={document.fileUrl} />
                      <input type="hidden" name="currentFileName" value={document.fileName ?? ""} />
                      <input type="hidden" name="currentMimeType" value={document.mimeType ?? ""} />
                      <input type="hidden" name="currentFileSize" value={document.fileSize ?? 0} />
                      <div className="lumosAdminFormGrid">
                        <label className="field">
                          <span>종류</span>
                          <select name="kind" defaultValue={document.kind}>
                            <option value="DATASHEET">Data sheet</option>
                            <option value="DRAWING">도면</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>순서</span>
                          <input name="displayOrder" type="number" defaultValue={document.displayOrder} />
                        </label>
                        <label className="field">
                          <span>Title KO</span>
                          <input name="titleKo" defaultValue={document.titleKo} />
                        </label>
                        <label className="field">
                          <span>Title EN</span>
                          <input name="titleEn" defaultValue={document.titleEn} />
                        </label>
                        <label className="field">
                          <span>File URL</span>
                          <input name="fileUrl" defaultValue={document.fileUrl} />
                        </label>
                        <label className="field">
                          <span>파일 교체</span>
                          <input name="attachment" type="file" />
                        </label>
                      </div>
                      <div className="lumosAdminActionRow">
                        <label className="lumosAdminCheckbox">
                          <input type="checkbox" name="published" defaultChecked={document.published} />
                          <span>노출</span>
                        </label>
                        <button type="submit" className="lumosAdminPrimaryButton">
                          자료 저장
                        </button>
                      </div>
                    </form>
                    <form action={deleteProductDocument} className="lumosAdminInlineForm">
                      <input type="hidden" name="id" value={document.id} />
                      <button type="submit" className="lumosAdminDangerButton">
                        자료 삭제
                      </button>
                    </form>
                  </article>
                ))
              ) : (
                <p className="lumosAdminEmptyText">등록된 제품 자료가 없습니다.</p>
              )}
            </div>

            <form action={saveProductDocument} className="lumosAdminForm">
              <input type="hidden" name="productId" value={activeProduct.id} />
              <input type="hidden" name="currentFileUrl" value="" />
              <input type="hidden" name="currentFileName" value="" />
              <input type="hidden" name="currentMimeType" value="" />
              <input type="hidden" name="currentFileSize" value="0" />
              <div className="lumosAdminSectionHead">
                <div>
                  <h3>새 자료 추가</h3>
                  <p>파일 업로드를 우선 사용하고, 외부 파일은 File URL로 연결합니다.</p>
                </div>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>종류</span>
                  <select name="kind" defaultValue="DATASHEET">
                    <option value="DATASHEET">Data sheet</option>
                    <option value="DRAWING">도면</option>
                  </select>
                </label>
                <label className="field">
                  <span>순서</span>
                  <input name="displayOrder" type="number" defaultValue={activeProduct.documents.length + 1} />
                </label>
                <label className="field">
                  <span>Title KO</span>
                  <input name="titleKo" placeholder="Data sheet" />
                </label>
                <label className="field">
                  <span>Title EN</span>
                  <input name="titleEn" placeholder="Data sheet" />
                </label>
                <label className="field">
                  <span>File URL</span>
                  <input name="fileUrl" />
                </label>
                <label className="field">
                  <span>파일 업로드</span>
                  <input name="attachment" type="file" />
                </label>
              </div>
              <div className="lumosAdminActionRow">
                <label className="lumosAdminCheckbox">
                  <input type="checkbox" name="published" defaultChecked />
                  <span>노출</span>
                </label>
                <button type="submit" className="lumosAdminPrimaryButton">
                  자료 추가
                </button>
              </div>
            </form>
          </section>
          <form action={deleteProduct} className="lumosAdminInlineForm">
            <input type="hidden" name="id" value={activeProduct.id} />
            <button type="submit" className="lumosAdminDangerButton">
              삭제
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
