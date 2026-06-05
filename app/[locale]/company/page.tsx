import { redirect } from "next/navigation";

import type { Locale } from "@/lib/site";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  redirect(`/${locale}/company/ceo-vision`);
}
