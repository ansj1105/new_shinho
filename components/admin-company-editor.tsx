"use client";

import { updateCompanyContent } from "@/app/admin/actions";
import { AdminRichTextEditor } from "@/components/admin-rich-text-editor";
import { siteUrl } from "@/lib/site";

type CompanyContentData = {
  id: number;
  historyTitleKo: string;
  historyTitleEn: string;
  historyBodyKo: string;
  historyBodyEn: string;
  brandTitleKo: string;
  brandTitleEn: string;
  brandLeadKo: string;
  brandLeadEn: string;
  visionTitleKo: string;
  visionTitleEn: string;
  visionBodyKo: string;
  visionBodyEn: string;
  goalTitleKo: string;
  goalTitleEn: string;
  goalBodyKo: string;
  goalBodyEn: string;
};

function EditorField({
  label,
  name,
  defaultValue,
  rows = 5,
}: {
  label: string;
  name: keyof CompanyContentData;
  defaultValue: string;
  rows?: number;
}) {
  return <AdminRichTextEditor name={name} label={label} defaultValue={defaultValue} />;
}

export function AdminCompanyEditor({ companyContent }: { companyContent: CompanyContentData }) {
  return (
    <section className="lumosAdminSectionCard">
      <div className="lumosAdminSectionHead">
        <div>
          <h2>회사소개</h2>
          <p>회사소개, CEO 인사말 & 회사비전 페이지의 제목과 문구를 수정합니다. 본문 줄바꿈은 공개 페이지에 반영됩니다.</p>
        </div>
      </div>

      <form action={updateCompanyContent} className="lumosAdminForm">
        <div className="lumosAdminClientPreview">
          <div className="lumosAdminAssetPreviewHead">
            <strong>Client Page Preview</strong>
            <span>/ko/company</span>
          </div>
          <div className="lumosAdminClientPreviewFrame">
            <iframe
              src="/ko/company"
              title="company page preview"
              loading="lazy"
              scrolling="no"
              className="lumosAdminClientPreviewIframe"
            />
          </div>
        </div>

        <div className="lumosAdminEditorPanel">
          <div className="lumosAdminEditorHead">
            <strong>CEO 인사말</strong>
            <span>/ko/company/ceo-vision 상단 CEO 인사말 영역입니다. 빈 줄은 문단 구분, 일반 줄바꿈은 같은 문단 내 줄바꿈으로 처리됩니다.</span>
          </div>
          <div className="lumosAdminFormGrid">
            <label className="field">
              <span>CEO 인사말 제목 KO</span>
              <input name="historyTitleKo" defaultValue={companyContent.historyTitleKo} />
            </label>
            <label className="field">
              <span>CEO Message Title EN</span>
              <input name="historyTitleEn" defaultValue={companyContent.historyTitleEn} />
            </label>
          </div>
          <div className="lumosAdminFormGrid">
            <EditorField
              label="CEO 인사말 본문 KO"
              name="historyBodyKo"
              defaultValue={companyContent.historyBodyKo}
              rows={12}
            />
            <EditorField
              label="CEO Message Body EN"
              name="historyBodyEn"
              defaultValue={companyContent.historyBodyEn}
              rows={12}
            />
          </div>
        </div>

        <div className="lumosAdminEditorPanel">
          <div className="lumosAdminEditorHead">
            <strong>회사소개 / 회사비전</strong>
            <span>회사소개 메인 문구와 /ko/company/ceo-vision 하단 Vision/Goal 영역을 관리합니다.</span>
          </div>
          <div className="lumosAdminFormGrid">
            <label className="field">
              <span>회사소개 제목 KO</span>
              <input name="brandTitleKo" defaultValue={companyContent.brandTitleKo} />
            </label>
            <label className="field">
              <span>Company Intro Title EN</span>
              <input name="brandTitleEn" defaultValue={companyContent.brandTitleEn} />
            </label>
            <label className="field">
              <span>회사소개 문구 KO</span>
              <input name="brandLeadKo" defaultValue={companyContent.brandLeadKo} />
            </label>
            <label className="field">
              <span>Company Intro Text EN</span>
              <input name="brandLeadEn" defaultValue={companyContent.brandLeadEn} />
            </label>
          </div>
          <div className="lumosAdminFormGrid">
            <label className="field">
              <span>비전 제목 KO</span>
              <input name="visionTitleKo" defaultValue={companyContent.visionTitleKo} />
            </label>
            <label className="field">
              <span>Vision Title EN</span>
              <input name="visionTitleEn" defaultValue={companyContent.visionTitleEn} />
            </label>
            <EditorField label="비전 본문 KO" name="visionBodyKo" defaultValue={companyContent.visionBodyKo} />
            <EditorField label="Vision Body EN" name="visionBodyEn" defaultValue={companyContent.visionBodyEn} />
          </div>
          <div className="lumosAdminFormGrid">
            <label className="field">
              <span>목표 제목 KO</span>
              <input name="goalTitleKo" defaultValue={companyContent.goalTitleKo} />
            </label>
            <label className="field">
              <span>Goal Title EN</span>
              <input name="goalTitleEn" defaultValue={companyContent.goalTitleEn} />
            </label>
            <EditorField label="목표 본문 KO" name="goalBodyKo" defaultValue={companyContent.goalBodyKo} />
            <EditorField label="Goal Body EN" name="goalBodyEn" defaultValue={companyContent.goalBodyEn} />
          </div>
        </div>

        <div className="lumosAdminActionRow">
          <a href={`${siteUrl}/ko/company`} target="_blank" rel="noreferrer" className="lumosAdminGhostButton">
            프론트 미리보기
          </a>
          <button type="submit" className="lumosAdminPrimaryButton">
            회사소개 저장
          </button>
        </div>
      </form>
    </section>
  );
}
