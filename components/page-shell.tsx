import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { VisitTracker } from "@/components/visit-tracker";
import { getProductMakersByProductSlug, getProducts } from "@/lib/content";
import type { Locale } from "@/lib/site";

export async function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const products = await getProducts();
  const productLinks = await Promise.all(
    products.map(async (product) => {
      const makers = await getProductMakersByProductSlug(product.slug);

      return {
        label: locale === "ko" ? product.nameKo : product.nameEn,
        href: `/products/${product.slug}`,
        children: makers.map((maker) => ({
          label: maker.name,
          href: `/products/${product.slug}/${maker.slug}`,
        })),
      };
    }),
  );

  return (
    <div className={`shell ${locale === "en" ? "is-en" : "is-ko"}`} data-locale={locale}>
      <VisitTracker locale={locale} />
      <Header locale={locale} productLinks={productLinks} />
      <main>{children}</main>
      <ScrollTopButton />
      <Footer locale={locale} productLinks={productLinks} />
    </div>
  );
}
