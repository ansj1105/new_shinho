"use client";

import { useMemo, useState } from "react";

import { deleteApplication, saveApplication } from "@/app/admin/actions";
import { AdminImageField } from "@/components/admin-image-field";
import { AdminRichTextEditor } from "@/components/admin-rich-text-editor";
import { siteUrl } from "@/lib/site";

type ApplicationItem = {
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
};

function textValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join("\n");
  }

  return "";
}

function moduleTextValue(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const moduleItem = item as { title?: unknown; image?: unknown; body?: unknown };
      return [moduleItem.title, moduleItem.image, moduleItem.body].map((part) => String(part ?? "").trim()).join("|");
    })
    .filter(Boolean)
    .join("\n");
}

export function AdminApplicationsTabs({
  applications,
}: {
  applications: ApplicationItem[];
}) {
  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [applications],
  );
  const [activeId, setActiveId] = useState(sortedApplications[0]?.id ?? 0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const activeApplication =
    sortedApplications.find((application) => application.id === activeId) ?? sortedApplications[0] ?? null;

  return (
    <div className="lumosAdminTabs">
      <div className="lumosAdminTabToolbar">
        <div className="lumosAdminTabList" role="tablist" aria-label="Application">
          {sortedApplications.map((application) => (
            <button
              key={application.id}
              type="button"
              role="tab"
              aria-selected={activeApplication?.id === application.id}
              className={`lumosAdminTabButton ${
                activeApplication?.id === application.id ? "isActive" : ""
              }`}
              onClick={() => {
                setActiveId(application.id);
                setShowCreateForm(false);
              }}
            >
              {application.titleKo}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`lumosAdminPrimaryButton ${showCreateForm ? "isSoftActive" : ""}`}
          onClick={() => setShowCreateForm((value) => !value)}
        >
          새 Application 추가
        </button>
      </div>

      {showCreateForm ? (
        <section className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>새 Application 추가</h2>
              <p>새 application을 생성하면 즉시 프론트 페이지 앵커 목록에 포함됩니다.</p>
            </div>
          </div>
          <form action={saveApplication} className="lumosAdminForm">
            <div className="lumosAdminAssetPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Application Image</strong>
                <span>URL 입력 후 생성/변경 가능</span>
              </div>
              <div className="lumosAdminAssetPreviewFrame">
                <div className="lumosAdminAssetPreviewEmpty">Image preview will appear after save</div>
              </div>
            </div>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Slug</span>
                <input name="slug" placeholder="new-application" />
              </label>
              <label className="field">
                <span>Sort Order</span>
                <input name="sortOrder" type="number" defaultValue={99} />
              </label>
              <AdminImageField label="Image URL" urlName="imageUrl" uploadName="imageUpload" />
            </div>
            <p className="adminHint">
              Image URL을 교체하면 응용분야 페이지의 대표 이미지가 변경됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Title KO</span>
                <input name="titleKo" />
              </label>
              <label className="field">
                <span>Title EN</span>
                <input name="titleEn" />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminRichTextEditor name="summaryKo" label="Body KO" />
              <AdminRichTextEditor name="summaryEn" label="Body EN" />
            </div>
            <p className="adminHint">
              본문은 빈 줄로 문단을 나눌 수 있고, 일반 줄바꿈은 같은 문단 안의 줄바꿈으로 표시됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Bullets KO</span>
                <textarea name="bulletsKo" />
              </label>
              <label className="field">
                <span>Bullets EN</span>
                <textarea name="bulletsEn" />
              </label>
            </div>
            <div className="lumosAdminEditorPanel">
              <div className="lumosAdminEditorHead">
                <div>
                  <strong>광학솔루션 상세 구성</strong>
                  <span>광학솔루션 상세 섹션의 제목, 본문, 리스트, 모듈, CTA를 관리합니다.</span>
                </div>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Detail Title KO</span>
                  <input name="detailTitleKo" />
                </label>
                <label className="field">
                  <span>Detail Title EN</span>
                  <input name="detailTitleEn" />
                </label>
                <AdminImageField
                  label="Detail Image URL"
                  urlName="detailImageUrl"
                  uploadName="detailImageUpload"
                />
                <label className="field">
                  <span>CTA KO</span>
                  <input name="detailCtaKo" />
                </label>
                <label className="field">
                  <span>CTA EN</span>
                  <input name="detailCtaEn" />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Detail Body KO</span>
                  <textarea name="detailBodyKo" />
                </label>
                <label className="field">
                  <span>Detail Body EN</span>
                  <textarea name="detailBodyEn" />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Benefits KO</span>
                  <textarea name="detailBenefitsKo" />
                </label>
                <label className="field">
                  <span>Benefits EN</span>
                  <textarea name="detailBenefitsEn" />
                </label>
                <label className="field">
                  <span>Applications KO</span>
                  <textarea name="detailUseCasesKo" />
                </label>
                <label className="field">
                  <span>Applications EN</span>
                  <textarea name="detailUseCasesEn" />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Modules KO</span>
                  <textarea name="detailModulesKo" placeholder="Title|/image.png|Body" />
                </label>
                <label className="field">
                  <span>Modules EN</span>
                  <textarea name="detailModulesEn" placeholder="Title|/image.png|Body" />
                </label>
              </div>
              <p className="adminHint">Modules는 한 줄에 Title|Image URL|Body 형식으로 입력합니다.</p>
            </div>
            <label className="lumosAdminCheckbox">
              <input type="checkbox" name="published" defaultChecked />
              <span>노출</span>
            </label>
            <button type="submit" className="lumosAdminPrimaryButton">
              Application 생성
            </button>
          </form>
        </section>
      ) : activeApplication ? (
        <section key={activeApplication.id} className="lumosAdminSectionCard">
          <div className="lumosAdminSectionHead">
            <div>
              <h2>{activeApplication.titleKo}</h2>
              <p>{activeApplication.slug}</p>
            </div>
          </div>
          <form key={`application-form-${activeApplication.id}`} action={saveApplication} className="lumosAdminForm">
            <div className="lumosAdminAssetPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Application Image</strong>
                <span>{activeApplication.imageUrl ? "연결됨 / 변경 가능" : "미연결"}</span>
              </div>
              <div className="lumosAdminAssetPreviewFrame">
                {activeApplication.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeApplication.imageUrl}
                    alt={activeApplication.titleKo}
                    className="lumosAdminAssetPreviewImage"
                  />
                ) : (
                  <div className="lumosAdminAssetPreviewEmpty">No image connected</div>
                )}
              </div>
            </div>
            <div className="lumosAdminClientPreview">
              <div className="lumosAdminAssetPreviewHead">
                <strong>Client Page Preview</strong>
                <span>{`/ko/applications#${activeApplication.slug}`}</span>
              </div>
              <div className="lumosAdminClientPreviewFrame">
                <iframe
                  key={`application-preview-${activeApplication.id}`}
                  src={`/ko/applications#${activeApplication.slug}`}
                  title={`${activeApplication.titleKo} preview`}
                  loading="lazy"
                  scrolling="no"
                  className="lumosAdminClientPreviewIframe"
                />
              </div>
            </div>
            <input type="hidden" name="id" value={activeApplication.id} />
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Slug</span>
                <input name="slug" defaultValue={activeApplication.slug} />
              </label>
              <label className="field">
                <span>Sort Order</span>
                <input name="sortOrder" type="number" defaultValue={activeApplication.sortOrder} />
              </label>
              <AdminImageField
                label="Image URL"
                urlName="imageUrl"
                uploadName="imageUpload"
                defaultValue={activeApplication.imageUrl}
              />
            </div>
            <p className="adminHint">
              Image URL을 교체하면 응용분야 페이지의 대표 이미지가 변경됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Title KO</span>
                <input name="titleKo" defaultValue={activeApplication.titleKo} />
              </label>
              <label className="field">
                <span>Title EN</span>
                <input name="titleEn" defaultValue={activeApplication.titleEn} />
              </label>
            </div>
            <div className="lumosAdminFormGrid">
              <AdminRichTextEditor name="summaryKo" label="Body KO" defaultValue={activeApplication.summaryKo} />
              <AdminRichTextEditor name="summaryEn" label="Body EN" defaultValue={activeApplication.summaryEn} />
            </div>
            <p className="adminHint">
              본문은 빈 줄로 문단을 나눌 수 있고, 일반 줄바꿈은 같은 문단 안의 줄바꿈으로 표시됩니다.
            </p>
            <div className="lumosAdminFormGrid">
              <label className="field">
                <span>Bullets KO</span>
                <textarea name="bulletsKo" defaultValue={textValue(activeApplication.bulletsKo)} />
              </label>
              <label className="field">
                <span>Bullets EN</span>
                <textarea name="bulletsEn" defaultValue={textValue(activeApplication.bulletsEn)} />
              </label>
            </div>
            <div className="lumosAdminEditorPanel">
              <div className="lumosAdminEditorHead">
                <div>
                  <strong>광학솔루션 상세 구성</strong>
                  <span>광학솔루션 상세 섹션의 제목, 본문, 리스트, 모듈, CTA를 관리합니다.</span>
                </div>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Detail Title KO</span>
                  <input name="detailTitleKo" defaultValue={activeApplication.detailTitleKo ?? ""} />
                </label>
                <label className="field">
                  <span>Detail Title EN</span>
                  <input name="detailTitleEn" defaultValue={activeApplication.detailTitleEn ?? ""} />
                </label>
                <AdminImageField
                  label="Detail Image URL"
                  urlName="detailImageUrl"
                  uploadName="detailImageUpload"
                  defaultValue={activeApplication.detailImageUrl}
                />
                <label className="field">
                  <span>CTA KO</span>
                  <input name="detailCtaKo" defaultValue={activeApplication.detailCtaKo ?? ""} />
                </label>
                <label className="field">
                  <span>CTA EN</span>
                  <input name="detailCtaEn" defaultValue={activeApplication.detailCtaEn ?? ""} />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Detail Body KO</span>
                  <textarea name="detailBodyKo" defaultValue={activeApplication.detailBodyKo ?? ""} />
                </label>
                <label className="field">
                  <span>Detail Body EN</span>
                  <textarea name="detailBodyEn" defaultValue={activeApplication.detailBodyEn ?? ""} />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Benefits KO</span>
                  <textarea name="detailBenefitsKo" defaultValue={textValue(activeApplication.detailBenefitsKo)} />
                </label>
                <label className="field">
                  <span>Benefits EN</span>
                  <textarea name="detailBenefitsEn" defaultValue={textValue(activeApplication.detailBenefitsEn)} />
                </label>
                <label className="field">
                  <span>Applications KO</span>
                  <textarea name="detailUseCasesKo" defaultValue={textValue(activeApplication.detailUseCasesKo)} />
                </label>
                <label className="field">
                  <span>Applications EN</span>
                  <textarea name="detailUseCasesEn" defaultValue={textValue(activeApplication.detailUseCasesEn)} />
                </label>
              </div>
              <div className="lumosAdminFormGrid">
                <label className="field">
                  <span>Modules KO</span>
                  <textarea
                    name="detailModulesKo"
                    defaultValue={moduleTextValue(activeApplication.detailModulesKo)}
                    placeholder="Title|/image.png|Body"
                  />
                </label>
                <label className="field">
                  <span>Modules EN</span>
                  <textarea
                    name="detailModulesEn"
                    defaultValue={moduleTextValue(activeApplication.detailModulesEn)}
                    placeholder="Title|/image.png|Body"
                  />
                </label>
              </div>
              <p className="adminHint">Modules는 한 줄에 Title|Image URL|Body 형식으로 입력합니다.</p>
            </div>
            <label className="lumosAdminCheckbox">
              <input type="checkbox" name="published" defaultChecked={activeApplication.published} />
              <span>노출</span>
            </label>
            <div className="lumosAdminActionRow">
              <div className="lumosAdminActionRowEnd">
                <a
                  href={`${siteUrl}/ko/applications#${activeApplication.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lumosAdminGhostButton"
                >
                  프론트 미리보기
                </a>
                <button
                  type="submit"
                  formAction={deleteApplication}
                  className="lumosAdminDangerButton"
                  onClick={(event) => {
                    if (!window.confirm("이 Application을 삭제할까요?")) {
                      event.preventDefault();
                    }
                  }}
                >
                  Application 삭제
                </button>
              </div>
              <button type="submit" className="lumosAdminPrimaryButton">
                Application 저장
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
