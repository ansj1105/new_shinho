import { HomeAdminSection } from "@/components/admin-sections";
import { getPageHeroConfigs } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [siteConfig, pageHeroConfigs, products, manufacturerLogos] = await Promise.all([
    prisma.siteConfig.findUnique({
      where: { id: 1 },
      include: {
        heroImageHistory: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
    getPageHeroConfigs(),
    prisma.product.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.manufacturerLogo.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  if (!siteConfig) {
    return null;
  }

  return (
    <HomeAdminSection
      siteConfig={siteConfig}
      pageHeroConfigs={pageHeroConfigs}
      products={products}
      manufacturerLogos={manufacturerLogos}
    />
  );
}
