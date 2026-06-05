import type { Locale } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/applications#optical-solution`);
}
