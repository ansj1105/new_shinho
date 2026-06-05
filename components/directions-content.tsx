"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type DirectionsContentProps = {
  locale: string;
};

type LocationItem = {
  id: "hq" | "rd" | "factory";
  labelKo: string;
  labelEn: string;
  addressKo: string;
  addressEn: string;
  query: string;
  latitude?: number;
  longitude?: number;
};

const locations: LocationItem[] = [
  {
    id: "hq",
    labelKo: "\uBCF8\uC0AC",
    labelEn: "Head Office",
    addressKo: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAE08\uCC9C\uAD6C \uAC00\uC0B0\uB514\uC9C0\uD1381\uB85C 19 \uB300\uB96D\uD14C\uD06C\uB178\uD0C0\uC6B418 18\uCC28 1306\uD638, 08594",
    addressEn: "1306, Daerung Techno Town-18, 19 Gasan digital 1-ro, Geumcheon-gu, Seoul, 08594, Korea",
    query: "37.467837,126.886559",
    latitude: 37.467837,
    longitude: 126.886559,
  },
  {
    id: "rd",
    labelKo: "R&D Center",
    labelEn: "R&D Center",
    addressKo: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAE08\uCC9C\uAD6C \uAC00\uC0B0\uB514\uC9C0\uD1381\uB85C 19 \uB300\uB96D\uD14C\uD06C\uB178\uD0C0\uC6B418 18\uCC28 1307\uD638, 08594",
    addressEn: "1307, Daerung Techno Town-18, 19 Gasan digital 1-ro, Geumcheon-gu, Seoul, 08594, Korea",
    query: "37.467837,126.886559",
    latitude: 37.467837,
    longitude: 126.886559,
  },
  {
    id: "factory",
    labelKo: "Factory",
    labelEn: "Factory",
    addressKo: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAE08\uCC9C\uAD6C \uAC00\uC0B0\uB514\uC9C0\uD1381\uB85C 58 \uC5D0\uC774\uC2A4\uD55C\uC194\uD0C0\uC6CC 1609\uD638, 1010\uD638, 08591",
    addressEn: "1609, 1010, Ace Hansol Tower, 58, Gasan digital 1-ro, Geumcheon-gu, Seoul, 08591, Korea",
    query: "37.471434,126.886417",
    latitude: 37.471434,
    longitude: 126.886417,
  },
];

export function DirectionsContent({ locale }: DirectionsContentProps) {
  const isKo = locale === "ko";
  const [activeLocationId, setActiveLocationId] = useState<LocationItem["id"]>("hq");

  const activeLocation = useMemo(
    () => locations.find((location) => location.id === activeLocationId) ?? locations[0],
    [activeLocationId],
  );

  const encodedQuery = encodeURIComponent(activeLocation.query);
  const googleMapEmbedUrl = `https://www.google.com/maps?output=embed&q=${encodedQuery}&z=15`;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const kakaoMapUrl =
    activeLocation.latitude && activeLocation.longitude
      ? `https://map.kakao.com/link/map/${encodeURIComponent(isKo ? activeLocation.labelKo : activeLocation.labelEn)},${activeLocation.latitude},${activeLocation.longitude}`
      : `https://map.kakao.com/link/search/${encodedQuery}`;

  return (
    <div className="pageBody twoCol directionsTwoCol">
      <div className="card directionsInfoCard">
        <div className="directionsInfoLayout">
          <div className="directionsCompanyImageWrap">
            <Image
              src="/contact/directions-building.png"
              alt={isKo ? "Shinhotek \uAC74\uBB3C \uC804\uACBD" : "Shinhotek building"}
              width={1209}
              height={1364}
              className="directionsCompanyImage"
            />
          </div>

          <div className="stack">
            <strong>{isKo ? "\uBCF8\uC0AC" : "Head Office"}</strong>
            <span>{isKo ? locations[0].addressKo : locations[0].addressEn}</span>

            {locations.slice(1).map((location) => (
              <div key={location.id} className="directionsLocationGroup">
                <strong>{isKo ? location.labelKo : location.labelEn}</strong>
                <span>{isKo ? location.addressKo : location.addressEn}</span>
              </div>
            ))}

            <div className="directionsLocationGroup">
              <strong>Contact</strong>
              <div className="directionsContactRows">
                <span>Tel.</span>
                <a href="tel:028520533">02-852-0533</a>
                <span>Fax.</span>
                <span>02-853-0537</span>
                <span>E - Mail.</span>
                <a href="mailto:sales@shinhotek.com">sales@shinhotek.com</a>
                <span aria-hidden="true" />
                <a href="mailto:service@shinhotek.com">service@shinhotek.com</a>
              </div>
            </div>

            <div className="buttonRow directionsExternalLinks">
              <a href={googleMapUrl} target="_blank" rel="noreferrer" className="button secondary">
                Google Maps
              </a>
              <a href={kakaoMapUrl} target="_blank" rel="noreferrer" className="button secondary">
                Kakao Map
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="card directionsMapCard">
        <iframe
          title={isKo ? "Shinhotek \uCC3E\uC544\uC624\uB294 \uAE38 \uC9C0\uB3C4" : "Shinhotek directions map"}
          src={googleMapEmbedUrl}
          width="100%"
          className="directionsMapIframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="directionsMapTabs" role="tablist" aria-label={isKo ? "\uC704\uCE58 \uC120\uD0DD" : "Select location"}>
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              role="tab"
              aria-selected={location.id === activeLocationId}
              className={`directionsMapTab ${location.id === activeLocationId ? "isActive" : ""}`}
              onClick={() => setActiveLocationId(location.id)}
            >
              {isKo ? location.labelKo : location.labelEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
