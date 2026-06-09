"use client";

type AdminImageFieldProps = {
  label: string;
  urlName: string;
  uploadName: string;
  defaultValue?: string | null;
  placeholder?: string;
};

export function AdminImageField({
  label,
  urlName,
  uploadName,
  defaultValue,
  placeholder = "/uploads/images/example.png",
}: AdminImageFieldProps) {
  return (
    <div className="field adminImageField">
      <label>
        <span>{label}</span>
        <input name={urlName} defaultValue={defaultValue ?? ""} placeholder={placeholder} />
      </label>
      <label>
        <span>{label} 파일 업로드</span>
        <input name={uploadName} type="file" accept="image/*" />
      </label>
      <p className="adminHint">파일을 선택하면 파일 업로드가 우선 적용되고, 파일이 없으면 URL 값이 저장됩니다.</p>
    </div>
  );
}
