import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { VisitTracker } from "@/components/visit-tracker";
import { getProductMakersByProductSlug, getProducts } from "@/lib/content";
import type { Locale } from "@/lib/site";

type ProductNavLink = {
  label: string;
  href: string;
  children?: ProductNavLink[];
};

const productNavStructure = [
  {
    slug: "laser",
    groups: [
      { label: "Picosecond / Femtosecond", makerSlugs: ["spark-lasers"] },
      { label: "Nanosecond", makerSlugs: [] },
      { label: "CO2", makerSlugs: ["iradion"] },
      { label: "Diode laser", makerSlugs: ["dilas", "seminex", "monocrom", "optical-engines"] },
      { label: "Eximer", makerSlugs: ["mlase"] },
    ],
  },
  {
    slug: "laser-scanner",
    groups: [
      { label: null, makerSlugs: ["scanlab"] },
    ],
  },
  {
    slug: "laser-metrology",
    groups: [
      { label: null, makerSlugs: ["laserpoint", "lumos"] },
    ],
  },
] as const;

const makerMenuLabels: Record<string, string> = {
  "spark-lasers": "Spark Laser",
  iradion: "Iradion",
  dilas: "Dilas",
  seminex: "Seminex",
  monocrom: "Monocrom",
  "optical-engines": "Optical Engine",
  mlase: "Mlase",
  scanlab: "Scanlab",
  laserpoint: "Laser Point",
  lumos: "LUMOS",
};

export async function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const products = await getProducts();
  const productLinks = (await Promise.all(
    productNavStructure.map(async (navProduct) => {
      const product = products.find((item) => item.slug === navProduct.slug);

      if (!product) {
        return null;
      }

      const makers = await getProductMakersByProductSlug(product.slug);
      const makerMap = new Map(makers.map((maker) => [maker.slug, maker]));
      const children = navProduct.groups
        .flatMap<ProductNavLink>((group) => {
          const groupMakers = group.makerSlugs
            .map((makerSlug) => makerMap.get(makerSlug))
            .filter((maker): maker is NonNullable<typeof maker> => Boolean(maker));

          if (!group.label) {
            return groupMakers.map((maker) => ({
              label: makerMenuLabels[maker.slug] ?? maker.name,
              href: `/products/${product.slug}/${maker.slug}`,
            }));
          }

          return [{
            label: group.label,
            href: `/products/${product.slug}`,
            children: groupMakers.map((maker) => ({
              label: makerMenuLabels[maker.slug] ?? maker.name,
              href: `/products/${product.slug}/${maker.slug}`,
            })),
          }];
        })
        .filter((item) => Boolean(item));

      return {
        label: locale === "ko" ? product.nameKo : product.nameEn,
        href: `/products/${product.slug}`,
        children,
      };
    }),
  )) as Array<ProductNavLink | null>;
  const filteredProductLinks = productLinks.filter((item): item is ProductNavLink => item !== null);

  return (
    <div className={`shell ${locale === "en" ? "is-en" : "is-ko"}`} data-locale={locale}>
      <VisitTracker locale={locale} />
      <Header locale={locale} productLinks={filteredProductLinks} />
      <main>{children}</main>
      <ScrollTopButton />
      <Footer locale={locale} productLinks={filteredProductLinks} />
    </div>
  );
}
