import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/site";

export function Footer({
  locale,
  productLinks,
}: {
  locale: Locale;
  productLinks: Array<{ label: string; href: string }>;
}) {
  const dict = getDictionary(locale);
  const phoneHref = `tel:${dict.footer.phone.replace(/[^\d+]/g, "")}`;
  const companyNav = dict.nav.find((item) => item.href === "/company" || item.label === "Company");
  const productNav = dict.nav.find((item) => item.href === "/products");
  const applicationNav = dict.nav.find((item) => item.href === "/applications");
  const contactNav = dict.nav.find((item) => item.href === "/contact");
  const footerLabels =
    locale === "ko"
      ? {
          heading: "본사",
          product: "제품",
          quickLink: "바로가기",
          legal: "약관 및 정책",
          company: "회사소개",
          application: "솔루션소개",
          contactUs: "문의하기",
          telFaxPrefix: "Tel.",
          copyright: "Copyright 2026 Shinhotek. All Rights Reserved.",
        }
      : {
          heading: "Headquarter",
          product: "Product",
          quickLink: "Quick Link",
          legal: "Legal",
          company: "Company",
          application: "Solution",
          contactUs: "Contact",
          telFaxPrefix: "Tel.",
          copyright: "Copyright 2026 Shinhotek. All Rights Reserved.",
        };

  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <div className="footerGrid">
          <div className="footerBrandBlock">
            <Link href={`/${locale}`} className="footerBrand" aria-label={dict.brand}>
              <Image
                src="/shinhotek-logo-official.png"
                alt={dict.brand}
                width={248}
                height={48}
                className="footerBrandLogo"
              />
            </Link>
          </div>

          <div className="footerBlock">
            <strong>{footerLabels.heading}</strong>
            {locale === "ko" ? (
              <span>서울특별시 금천구 가산디지털1로 19, 대륭테크노타운 18차 1306호, 08594</span>
            ) : (
              <>
                <span>{dict.footer.company}</span>
                {dict.footer.companyLine2 ? <span>{dict.footer.companyLine2}</span> : null}
              </>
            )}
            <span>
              {footerLabels.telFaxPrefix} <a href={phoneHref} className="footerPhoneLink">{dict.footer.phone}</a>
            </span>
            <span>
              Fax. {dict.footer.fax}
            </span>
            <span className="footerEmail">
              {dict.footer.email}
            </span>
          </div>

          <div className="footerBlock">
            <strong>{footerLabels.product}</strong>
            {productLinks.map((item) => (
              <Link key={item.href} href={`/${locale}${item.href}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="footerBlock">
            <strong>{footerLabels.quickLink}</strong>
            {companyNav ? <Link href={`/${locale}${companyNav.href}`}>{footerLabels.company}</Link> : null}
            {applicationNav ? <Link href={`/${locale}${applicationNav.href}`}>{footerLabels.application}</Link> : null}
            {productNav ? <Link href={`/${locale}${productNav.href}`}>{footerLabels.product}</Link> : null}
            {contactNav ? <Link href={`/${locale}${contactNav.href}`}>{footerLabels.contactUs}</Link> : null}
          </div>

          <div className="footerBlock">
            <strong>{footerLabels.legal}</strong>
            {dict.footer.legal.map((item) => (
              <Link key={item.href} href={`/${locale}${item.href}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footerBottom">
          <span style={{ color: "var(--muted)" }}>{footerLabels.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

