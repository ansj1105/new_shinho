"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/site";

type HeaderProps = {
  locale: Locale;
  productLinks: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
};

export function Header({ locale, productLinks }: HeaderProps) {
  const dict = getDictionary(locale);
  const navItems = dict.nav.map((item) =>
    item.href === "/products" ? { ...item, children: productLinks } : item,
  );
  const localeLabel = locale === "ko" ? "\uD55C\uAD6D\uC5B4" : "English";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [openNavHref, setOpenNavHref] = useState<string | null>(null);
  const [suppressNavHover, setSuppressNavHover] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpenNavHref(null);
    setOpenMobileSection(null);
    setLocaleOpen(false);
    setMobileOpen(false);
    setSuppressNavHover(true);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);

  return (
    <header className="siteHeader">
      <div className="headerBar">
        <div className="container headerInner">
          <Link href={`/${locale}`} className="brandLink">
            <Image
              src="/shinhotek-logo-official.png"
              alt={dict.brand}
              width={248}
              height={48}
              className="brandLogo"
              priority
            />
          </Link>

          <nav
            className={`desktopNav ${suppressNavHover ? "isSuppressed" : ""}`}
            aria-label="Primary navigation"
            onMouseMove={() => {
              if (suppressNavHover) {
                setSuppressNavHover(false);
              }
            }}
            onMouseLeave={() => {
              setOpenNavHref(null);
              setSuppressNavHover(false);
            }}
          >
            {navItems.map((item) => (
              <div
                key={item.href}
                className={`navItem ${openNavHref === item.href ? "isOpen" : ""}`}
                onMouseEnter={() => {
                  if (suppressNavHover) {
                    setSuppressNavHover(false);
                  }

                  setOpenNavHref(item.children ? item.href : null);
                }}
              >
                <Link
                  href={`/${locale}${item.href}`}
                  className="desktopNavLink"
                  onClick={() => {
                    setOpenNavHref(null);
                    setSuppressNavHover(true);
                  }}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div
                    className={`navDropdown card ${
                      item.href === "/products" ? "isProductsDropdown" : "isSingleColumnDropdown"
                    }`}
                  >
                    {item.children.map((child) => (
                      <div key={child.href} className="navDropdownGroup">
                        <Link
                          href={`/${locale}${child.href}`}
                          className="navDropdownLink"
                          onClick={() => {
                            setOpenNavHref(null);
                            setSuppressNavHover(true);
                          }}
                        >
                          {child.label}
                        </Link>
                        {"children" in child && child.children?.length ? (
                          <div className="navDropdownDepthList">
                            {child.children.map((grandChild) => (
                              <Link
                                key={grandChild.href}
                                href={`/${locale}${grandChild.href}`}
                                className="navDropdownDepthLink"
                                onClick={() => {
                                  setOpenNavHref(null);
                                  setSuppressNavHover(true);
                                }}
                              >
                                {grandChild.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="headerActions">
            <div className="localeMenu">
              <button
                type="button"
                className="localeSwitch"
                aria-expanded={localeOpen}
                aria-label="Select language"
                data-locale={locale === "ko" ? "KR" : "EN"}
                onClick={() => setLocaleOpen((value) => !value)}
              >
                <span className="localeGlobe" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="8.25" />
                    <path d="M3.9 9h16.2" />
                    <path d="M3.9 15h16.2" />
                    <path d="M12 3.8c2.5 2.1 4 5.1 4 8.2s-1.5 6.1-4 8.2c-2.5-2.1-4-5.1-4-8.2s1.5-6.1 4-8.2Z" />
                  </svg>
                </span>
                <span className="localeSwitchValue">
                  <span>{localeLabel}</span>
                </span>
              </button>

              <div className={`localeDropdown card ${localeOpen ? "isOpen" : ""}`}>
                <Link href="/ko" className={`localeDropdownLink ${locale === "ko" ? "isActive" : ""}`}>
                  <span className="localeFlag" aria-hidden="true">KR</span>
                  <span>{"\uD55C\uAD6D\uC5B4"}</span>
                </Link>
                <Link href="/en" className={`localeDropdownLink ${locale === "en" ? "isActive" : ""}`}>
                  <span className="localeFlag" aria-hidden="true">EN</span>
                  <span>English</span>
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="mobileMenuButton"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div className={`mobileMenu card ${mobileOpen ? "isOpen" : ""}`}>
        <div className="container mobileMenuInner">
          {navItems.map((item) => (
            <div key={item.href} className="mobileMenuSection">
              <div className="mobileMenuTitleRow">
                <Link
                  href={`/${locale}${item.href}`}
                  className="mobileMenuTitle"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <button
                    type="button"
                    className={`mobileMenuToggle ${
                      openMobileSection === item.href ? "isOpen" : ""
                    }`}
                    aria-expanded={openMobileSection === item.href}
                    aria-label={`${item.label} submenu`}
                    onClick={() =>
                      setOpenMobileSection((value) =>
                        value === item.href ? null : item.href,
                      )
                    }
                  >
                    <span />
                    <span />
                  </button>
                ) : null}
              </div>
              {item.children?.length ? (
                <div
                  className={`mobileMenuLinks ${
                    openMobileSection === item.href ? "isOpen" : ""
                  }`}
                >
                  {item.children.map((child) => (
                    <div key={child.href} className="mobileMenuDepthGroup">
                      <Link
                        href={`/${locale}${child.href}`}
                        className="mobileMenuLink"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                      {"children" in child && child.children?.length ? (
                        <div className="mobileMenuDepthLinks">
                          {child.children.map((grandChild) => (
                            <Link
                              key={grandChild.href}
                              href={`/${locale}${grandChild.href}`}
                              className="mobileMenuDepthLink"
                              onClick={() => setMobileOpen(false)}
                            >
                              {grandChild.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

