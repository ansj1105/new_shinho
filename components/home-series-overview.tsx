"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/lib/site";

type SeriesCardItem = {
  slug: string;
  name: string;
  imageUrl: string;
  imageClassName: string;
};

const seriesItems: SeriesCardItem[] = [
  { slug: "laser", name: "Laser", imageUrl: "/hero-main-laser.png", imageClassName: "isPhoto" },
  { slug: "laser-scanner", name: "Laser Scanner", imageUrl: "/subpage-products-laser-bg.png", imageClassName: "isPhoto" },
  { slug: "laser-metrology", name: "Laser Metrology", imageUrl: "/hero-lab-bg.avif", imageClassName: "isPhoto" },
  { slug: "optical-solution", name: "Optical Solution", imageUrl: "/subpage-software-bg.png", imageClassName: "isPhoto" },
  { slug: "coating-solution", name: "Coating Solution", imageUrl: "/story-origin-lab.png", imageClassName: "isPhoto" },
  { slug: "beam-delivery", name: "Beam Delivery", imageUrl: "/subpage-products-laser-bg.png", imageClassName: "isPhoto" },
];

type SeriesProductSource = {
  slug: string;
  nameKo: string;
  nameEn: string;
  imageUrl: string | null;
};

export function HomeSeriesOverview({
  locale,
  title,
  lead,
  products,
}: {
  locale: Locale;
  title?: string | null;
  lead?: string | null;
  products?: SeriesProductSource[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const mergedSeriesItems = products?.length
    ? products.map((product) => {
        const staticItem = seriesItems.find((item) => item.slug === product.slug);

        return {
          slug: product.slug,
          name: locale === "ko" ? product.nameKo : product.nameEn,
          imageUrl:
            product.imageUrl || staticItem?.imageUrl || "/product-placeholder.svg",
          imageClassName: staticItem?.imageClassName ?? "isGeneric",
        };
      })
    : seriesItems;
  const desktopTopRow = mergedSeriesItems.slice(0, 3);
  const desktopBottomRow = mergedSeriesItems.slice(3);

  useEffect(() => {
    const sectionElement = document.getElementById("homeSeriesSection");

    if (!sectionElement) {
      return;
    }

    const revealTargets = Array.from(sectionElement.querySelectorAll<HTMLElement>(".seriesFeatureCard"));

    if (revealTargets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("isRevealed");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  function goToPrev() {
    setCurrentIndex((index) => (index === 0 ? mergedSeriesItems.length - 1 : index - 1));
  }

  function goToNext() {
    setCurrentIndex((index) => (index + 1) % mergedSeriesItems.length);
  }

  return (
    <section id="homeSeriesSection" className="homeSeriesSection">
      <div className="container homeSeriesInner">
        <div className="homeSeriesHead">
          <h2 className="sectionTitle">{title ?? "Product Categories"}</h2>
          {lead ? <p className="sectionLead">{lead}</p> : null}
        </div>

        <div className="homeSeriesDesktop">
          <div className="homeSeriesRow isTop">
            {desktopTopRow.map((item) => (
              <SeriesFeatureCard
                key={item.slug}
                item={item}
                locale={locale}
                revealDelayMs={getSymmetricRevealDelay(desktopTopRow.length, desktopTopRow.findIndex((candidate) => candidate.slug === item.slug))}
              />
            ))}
          </div>
          <div className="homeSeriesRow isBottom">
            {desktopBottomRow.map((item) => (
              <SeriesFeatureCard
                key={item.slug}
                item={item}
                locale={locale}
                revealDelayMs={getSymmetricRevealDelay(desktopBottomRow.length, desktopBottomRow.findIndex((candidate) => candidate.slug === item.slug))}
              />
            ))}
          </div>
        </div>

        <div className="homeSeriesSlider">
          <div
            className="homeSeriesSliderViewport"
            onPointerDown={(event) => setDragStartX(event.clientX)}
            onPointerUp={(event) => {
              if (dragStartX === null) {
                return;
              }

              const delta = dragStartX - event.clientX;

              if (Math.abs(delta) > 40) {
                if (delta > 0) {
                  goToNext();
                } else {
                  goToPrev();
                }
              }

              setDragStartX(null);
            }}
            onPointerCancel={() => setDragStartX(null)}
            onPointerLeave={() => setDragStartX(null)}
          >
            <div
              className="homeSeriesSliderTrack"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {mergedSeriesItems.map((item) => (
                <div key={item.slug} className="homeSeriesSlide">
                  <SeriesFeatureCard item={item} locale={locale} revealDelayMs={0} />
                </div>
              ))}
            </div>
          </div>

          <div className="homeSeriesSliderControls">
            <button
              type="button"
              className="homeSeriesSliderButton"
              onClick={goToPrev}
              aria-label="Previous product"
            >
              ‹
            </button>

            <div className="homeSeriesSliderDots">
              {mergedSeriesItems.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  className={`homeSeriesSliderDot ${index === currentIndex ? "isActive" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to ${item.name}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="homeSeriesSliderButton"
              onClick={goToNext}
              aria-label="Next product"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function getSymmetricRevealDelay(length: number, index: number) {
  if (index < 0) {
    return 0;
  }

  const lastIndex = length - 1;
  const pairStep = Math.min(index, lastIndex - index);
  const centerBonus = length % 2 === 1 && index === Math.floor(length / 2) ? 1 : 0;

  return (pairStep + centerBonus) * 140;
}

function splitSeriesTitle(name: string) {
  const match = name.match(/^(.*)\s(\([^)]+\))$/);

  if (!match) {
    return {
      productName: name,
      category: null,
    };
  }

  return {
    productName: match[1],
    category: match[2],
  };
}

function SeriesFeatureCard({
  item,
  locale,
  revealDelayMs = 0,
}: {
  item: SeriesCardItem;
  locale: Locale;
  revealDelayMs?: number;
}) {
  const titleParts = splitSeriesTitle(item.name);

  return (
    <Link
      href={`/${locale}/products/${item.slug}`}
      className="seriesFeatureCard"
      data-series-slug={item.slug}
      style={{ ["--series-reveal-delay" as string]: `${revealDelayMs}ms` }}
    >
      <div className="seriesFeatureMedia">
        <span className={`seriesFeatureImageFrame ${item.imageClassName}`}>
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 960px) 100vw, 25vw"
            className="seriesFeatureImage"
          />
        </span>
      </div>
      <div className="seriesFeatureContent">
        <strong className="seriesFeatureTitle">
          <span className="seriesFeatureTitleName">{titleParts.productName}</span>
          {titleParts.category ? (
            <span className="seriesFeatureTitleCategory">{titleParts.category}</span>
          ) : null}
        </strong>
      </div>
    </Link>
  );
}

