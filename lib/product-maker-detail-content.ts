export type MakerDetailBlock = {
  titleKo: string;
  titleEn: string;
  bodyKo: string;
  bodyEn: string;
  image?: string;
};

export type MakerDetailProduct = {
  name: string;
  image?: string;
  specsKo: string[];
  specsEn: string[];
};

export type MakerDetailProductGroup = {
  titleKo: string;
  titleEn: string;
  products: MakerDetailProduct[];
};

export type MakerDetailContent = {
  labelKo: string;
  labelEn: string;
  headlineKo: string;
  headlineEn: string;
  leadKo: string;
  leadEn: string;
  heroImage?: string;
  referenceKo?: string;
  referenceEn?: string;
  blocks: MakerDetailBlock[];
  productGroups?: MakerDetailProductGroup[];
  notesKo: string[];
  notesEn: string[];
};

function block(titleKo: string, titleEn: string, bodyKo: string, bodyEn: string, image?: string): MakerDetailBlock {
  return { titleKo, titleEn, bodyKo, bodyEn, image };
}

const defaultNotesKo = ["제품 사양 검토", "공정 적용성 확인", "테스트 및 데모 상담"];
const defaultNotesEn = ["Specification review", "Application feasibility check", "Test and demo consultation"];

const laserPackageBlocks = [
  block("레이저 다이오드 패키지", "Laser diode packages", "고출력 레이저 다이오드 패키지를 공정 조건에 맞춰 검토합니다.", "High-power laser diode packages are reviewed against process conditions.", "/maker-detail/laser-packages-1.png"),
  block("모듈 구성", "Module configuration", "패키지, 모듈, 냉각 조건을 함께 검토해 적용 가능성을 확인합니다.", "Package, module, and cooling requirements are reviewed together for practical integration.", "/maker-detail/laser-packages-2.png"),
  block("시스템 연계", "System integration", "장비 구성과 인터페이스 조건까지 포함해 제조사 협의를 지원합니다.", "Manufacturer coordination includes equipment architecture and interface conditions.", "/maker-detail/laser-packages-3.png"),
];

const detailContent: Record<string, MakerDetailContent> = {
  "laser/spark-lasers": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "초단펄스 레이저 제품 구성",
    headlineEn: "Ultrafast laser product lineup",
    leadKo: "Spark Lasers의 펨토초 및 피코초 레이저 제품군을 공정 정밀도, 펄스 폭, 출력 조건 중심으로 검토합니다.",
    leadEn: "Spark Lasers femtosecond and picosecond products are structured around precision, pulse width, and output requirements.",
    heroImage: "/makers/spark-lasers.png",
    referenceKo: "Spark Lasers 제품 페이지 구성 참고",
    referenceEn: "Reference layout based on Spark Lasers product page",
    blocks: [
      block("공정 적용 검토", "Process review", "신호텍은 Spark Lasers 라인업과 고객 공정 조건을 연결해 적용 가능성을 확인합니다.", "SHINHOTEK connects Spark Lasers lineups with customer process conditions."),
    ],
    productGroups: [
      {
        titleKo: "FEMTOSECOND LASERS",
        titleEn: "FEMTOSECOND LASERS",
        products: [
          {
            name: "ALCOR",
            specsKo: ["790, 1030 nm and 1040 nm", "< 500 fs / up to 30 W"],
            specsEn: ["790, 1030 nm and 1040 nm", "< 500 fs / up to 30 W"],
          },
          {
            name: "ALTAIR",
            specsKo: ["1030 nm", "< 500 fs / up to 75 W / up to 1 MHz"],
            specsEn: ["1030 nm", "< 500 fs / up to 75 W / up to 1 MHz"],
          },
          {
            name: "DIADEM",
            specsKo: ["515 nm and 1030 nm", "< 370 fs / up to 50 W / up to 1 MHz", "400 fs / up to 60 W"],
            specsEn: ["515 nm and 1030 nm", "< 370 fs / up to 50 W / up to 1 MHz", "400 fs / up to 60 W"],
          },
        ],
      },
      {
        titleKo: "PICOSECOND LASERS",
        titleEn: "PICOSECOND LASERS",
        products: [
          {
            name: "ANTARES",
            specsKo: ["< 10 ps / High power", "High repetition rate / Narrow linewidth"],
            specsEn: ["< 10 ps / High power", "High repetition rate / Narrow linewidth"],
          },
          {
            name: "SIRIUS",
            specsKo: ["< 10 ps / up to 40 uJ / 5 MHz", "High shot to shot stability"],
            specsEn: ["< 10 ps / up to 40 uJ / 5 MHz", "High shot to shot stability"],
          },
        ],
      },
    ],
    notesKo: defaultNotesKo,
    notesEn: defaultNotesEn,
  },
  "laser/iradion": {
    labelKo: "Laser Source",
    labelEn: "Laser source",
    headlineKo: "CO2 레이저 및 정밀 레이저 소스",
    headlineEn: "CO2 and precision laser sources",
    leadKo: "세라미코어 기반 CO2 레이저와 나노초·펨토초 레이저 소스를 산업 공정 조건에 맞춰 검토합니다.",
    leadEn: "Ceramicore CO2 lasers and nanosecond or femtosecond laser sources are reviewed for industrial use.",
    heroImage: "/maker-detail/iradion-1.png",
    blocks: [
      block("CO2 레이저", "CO2 lasers", "산업용 절단, 마킹, 표면 처리 공정에 필요한 출력 안정성과 수명을 검토합니다.", "Output stability and lifetime are reviewed for cutting, marking, and surface processing.", "/maker-detail/iradion-1.png"),
      block("세라미코어 레이저", "Ceramicore laser source", "세라믹 기반 구조의 안정성과 유지보수 조건을 함께 검토합니다.", "Ceramic architecture, stability, and maintenance conditions are reviewed together.", "/maker-detail/iradion-2.png"),
      block("럭시나 듀라라이프 CO2 레이저", "Luxinar DuraLife CO2 laser sources", "산업 공정에서 요구되는 출력 안정성, 수명, 유지보수 조건을 함께 검토합니다.", "Output stability, lifetime, and maintenance conditions are reviewed for industrial processes.", "/maker-detail/iradion-3.png"),
      block("고체 상태 레이저", "Solid-state laser precision", "정밀도와 장비 연계를 기준으로 고체 상태 레이저 적용 조건을 확인합니다.", "Solid-state laser application conditions are checked by precision and equipment integration requirements.", "/maker-detail/iradion-4.png"),
    ],
    notesKo: ["CO2 레이저", "나노초·펨토초 소스", "산업용 안정성 검토"],
    notesEn: ["CO2 lasers", "Nanosecond and femtosecond sources", "Industrial stability review"],
  },
  "laser/mlase": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "유연한 구성의 산업용 엑시머 레이저",
    headlineEn: "Flexible industrial excimer laser systems",
    leadKo: "의료 및 산업용 OEM 장비에 적용 가능한 엑시머 레이저 시스템과 통합 조건을 검토합니다.",
    leadEn: "Excimer laser systems and integration conditions are reviewed for medical and industrial OEM equipment.",
    heroImage: "/maker-detail/mlase-1.png",
    blocks: [
      block("엑시머 레이저 시스템", "Excimer laser systems", "OEM 장비에 적용 가능한 레이저 소스와 구동 조건을 검토합니다.", "Laser sources and operating conditions for OEM equipment are reviewed.", "/maker-detail/mlase-1.png"),
      block("의료 및 산업용 통합", "Medical and industrial integration", "장비 구성, 인터페이스, 설치 환경을 포함해 통합 가능성을 확인합니다.", "Equipment architecture, interface, and installation conditions are reviewed.", "/maker-detail/mlase-2.png"),
      block("개발 지원", "Development support", "제품 개발 단계에서 요구 사양과 제조사 협의를 지원합니다.", "Requirement definition and manufacturer coordination are supported during development.", "/maker-detail/mlase-3.png"),
    ],
    notesKo: defaultNotesKo,
    notesEn: defaultNotesEn,
  },
  "laser/coherent": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "Coherent 레이저 및 광학 플랫폼",
    headlineEn: "Coherent laser and optical platforms",
    leadKo: "Coherent의 레이저 플랫폼을 공정 출력, 파장, 빔 품질 기준으로 검토합니다.",
    leadEn: "Coherent laser platforms are reviewed by output, wavelength, and beam quality requirements.",
    heroImage: "/maker-detail/coherent-1.png",
    blocks: [
      block("레이저 플랫폼", "Laser platforms", "산업용 레이저 공정에 맞는 제품군과 사양 범위를 검토합니다.", "Product families and specification ranges are reviewed for industrial laser processes.", "/maker-detail/coherent-1.png"),
      block("광학 및 계측 연계", "Optics and metrology integration", "광학 구성과 계측 조건까지 함께 고려해 적용성을 확인합니다.", "Optical architecture and metrology conditions are considered together.", "/maker-detail/coherent-2.png"),
      block("시스템 적용", "System application", "장비 레벨에서 필요한 인터페이스와 설치 조건을 확인합니다.", "Required interfaces and installation conditions are checked at equipment level.", "/maker-detail/coherent-3.png"),
    ],
    notesKo: ["출력·파장 검토", "광학 구성 확인", "제조사 기술 협의"],
    notesEn: ["Output and wavelength review", "Optical configuration check", "Manufacturer technical coordination"],
  },
  "laser/dilas": {
    labelKo: "Diode laser",
    labelEn: "Diode laser",
    headlineKo: "Dilas 다이오드 레이저 구성",
    headlineEn: "Dilas diode laser lineup",
    leadKo: "다이오드 레이저 소스와 패키지 구성을 출력, 파장, 냉각 조건에 맞춰 검토합니다.",
    leadEn: "Diode laser sources and package configurations are reviewed by output, wavelength, and cooling requirements.",
    heroImage: "/maker-detail/laser-packages-1.png",
    blocks: laserPackageBlocks,
    notesKo: ["다이오드 레이저", "패키지 구성", "냉각 및 장착 검토"],
    notesEn: ["Diode lasers", "Package configuration", "Cooling and mounting review"],
    },
  "laser/seminex": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "레이저 다이오드 패키지",
    headlineEn: "Laser diode packages",
    leadKo: "고출력 다이오드 레이저 패키지를 공정 요구 조건에 맞춰 검토합니다.",
    leadEn: "High-power diode laser packages are reviewed against process requirements.",
    heroImage: "/maker-detail/laser-packages-1.png",
    blocks: laserPackageBlocks,
    notesKo: ["다이오드 패키지", "출력 조건", "냉각 및 장착 검토"],
    notesEn: ["Diode packages", "Output conditions", "Cooling and mounting review"],
  },
  "laser/optical-engines": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "Optical Engines 제품 구성",
    headlineEn: "Optical Engines product lineup",
    leadKo: "레이저 엔진과 관련 모듈을 장비 구성과 공정 조건에 맞춰 검토합니다.",
    leadEn: "Laser engines and related modules are reviewed according to equipment and process conditions.",
    heroImage: "/maker-detail/laser-packages-4.png",
    blocks: [
      block("레이저 엔진", "Laser engines", "장비 적용에 필요한 엔진 구성과 출력 조건을 확인합니다.", "Engine configuration and output conditions are checked for equipment integration.", "/maker-detail/laser-packages-4.png"),
      block("패키지 옵션", "Package options", "모듈 구성과 장착 조건을 함께 검토합니다.", "Module configuration and mounting conditions are reviewed together.", "/maker-detail/laser-packages-5.png"),
      block("적용 지원", "Application support", "제조사 사양을 공정 요구사항에 맞춰 해석하고 제안합니다.", "Manufacturer specifications are interpreted and proposed for process needs.", "/maker-detail/laser-packages-2.png"),
    ],
    notesKo: defaultNotesKo,
    notesEn: defaultNotesEn,
  },
  "laser/monocrom": {
    labelKo: "Laser",
    labelEn: "Laser",
    headlineKo: "Monocrom 레이저 제품",
    headlineEn: "Monocrom laser products",
    leadKo: "다이오드 레이저 모듈과 산업용 레이저 구성을 공정 목적에 맞춰 검토합니다.",
    leadEn: "Diode laser modules and industrial laser configurations are reviewed by process purpose.",
    heroImage: "/maker-detail/monocrom-1.png",
    blocks: [
      block("다이오드 레이저 모듈", "Diode laser modules", "출력, 파장, 패키지 조건을 기준으로 적합한 모듈을 확인합니다.", "Suitable modules are checked by output, wavelength, and package conditions.", "/maker-detail/monocrom-1.png"),
      block("제품 구성", "Product configuration", "장비 통합과 유지보수 조건을 고려해 제품군을 검토합니다.", "Product families are reviewed with equipment integration and maintenance in mind.", "/maker-detail/monocrom-2.png"),
    ],
    notesKo: defaultNotesKo,
    notesEn: defaultNotesEn,
  },
  "laser-scanner/scanlab": {
    labelKo: "Laser Scanner",
    labelEn: "Laser Scanner",
    headlineKo: "SCANLAB 스캔 시스템",
    headlineEn: "SCANLAB scan systems",
    leadKo: "스캔 헤드, 제어기, 공정 속도 조건을 기준으로 레이저 스캐너 구성을 검토합니다.",
    leadEn: "Laser scanner configurations are reviewed by scan head, controller, and process speed requirements.",
    heroImage: "/maker-detail/scanlab-1.png",
    blocks: [
      block("스캔 헤드", "Scan heads", "가공 영역, 속도, 정밀도 조건에 맞는 스캔 헤드를 검토합니다.", "Scan heads are reviewed by field size, speed, and precision requirements.", "/maker-detail/scanlab-1.png"),
      block("제어 시스템", "Control systems", "장비 제어와 인터페이스 조건을 함께 확인합니다.", "Equipment control and interface conditions are checked together.", "/maker-detail/scanlab-2.png"),
      block("공정 적용", "Process application", "레이저 공정별 스캔 패턴과 광학 구성을 검토합니다.", "Scan patterns and optical configurations are reviewed for each laser process.", "/maker-detail/scanlab-3.png"),
    ],
    notesKo: ["스캔 헤드", "제어기", "공정 속도 검토"],
    notesEn: ["Scan heads", "Controllers", "Process speed review"],
  },
  "laser-metrology/laserpoint": {
    labelKo: "Laser Metrology",
    labelEn: "Laser Metrology",
    headlineKo: "LaserPoint 파워 및 에너지 미터",
    headlineEn: "LaserPoint power and energy meters",
    leadKo: "레이저 출력과 에너지 측정을 위한 계측 장비를 파장, 출력 범위, 설치 조건 기준으로 검토합니다.",
    leadEn: "Power and energy meters are reviewed by wavelength, measurement range, and installation conditions.",
    heroImage: "/maker-detail/laserpoint-1.png",
    blocks: [
      block("파워 미터", "Power meters", "공정 출력 범위와 응답 특성에 맞는 계측 구성을 검토합니다.", "Measurement configuration is reviewed by output range and response behavior.", "/maker-detail/laserpoint-1.png"),
      block("에너지 측정", "Energy measurement", "펄스 에너지와 반복률 조건을 기준으로 센서 적용성을 확인합니다.", "Sensor applicability is checked by pulse energy and repetition-rate conditions."),
    ],
    notesKo: ["파워 측정", "에너지 측정", "센서 구성 검토"],
    notesEn: ["Power measurement", "Energy measurement", "Sensor configuration review"],
  },
  "laser-metrology/lumos": {
    labelKo: "Laser Metrology",
    labelEn: "Laser Metrology",
    headlineKo: "LUMOS 빔 프로파일러 및 광학 측정 장비",
    headlineEn: "LUMOS beam profilers and optical metrology",
    leadKo: "레이저 빔 프로파일과 광학 측정 데이터를 기반으로 공정 안정성을 확인합니다.",
    leadEn: "Process stability is checked through beam profiling and optical measurement data.",
    heroImage: "/maker-detail/lumos-1.png",
    blocks: [
      block("빔 프로파일링", "Beam profiling", "빔 크기, 균일도, 분포 데이터를 통해 공정 조건을 검증합니다.", "Beam size, uniformity, and distribution data are used to verify process conditions.", "/maker-detail/lumos-1.png"),
      block("광학 측정", "Optical measurement", "정밀 계측 데이터를 장비 튜닝과 품질 관리에 연결합니다.", "Precision measurement data is connected to equipment tuning and quality control."),
    ],
    notesKo: ["빔 프로파일", "균일도 분석", "공정 모니터링"],
    notesEn: ["Beam profile", "Uniformity analysis", "Process monitoring"],
  },
  "optical-solution/adloptica": {
    labelKo: "Optical Solution",
    labelEn: "Optical Solution",
    headlineKo: "레이저 빔 성형 솔루션",
    headlineEn: "Laser beam shaping solutions",
    leadKo: "AdlOptica 빔 성형 광학계를 통해 공정 목적에 맞는 빔 형상을 검토합니다.",
    leadEn: "AdlOptica beam shaping optics are reviewed for process-specific beam profiles.",
    heroImage: "/maker-detail/adloptica-1.png",
    blocks: [
      block("빔 성형", "Beam shaping", "Top-hat, line beam, Bessel beam 등 공정별 형상 요구를 검토합니다.", "Top-hat, line beam, Bessel beam, and other process beam profiles are reviewed.", "/maker-detail/adloptica-1.png"),
      block("광학 설계 연계", "Optical design linkage", "기존 장비 광학계와의 호환 조건을 함께 확인합니다.", "Compatibility with existing optical systems is checked together."),
    ],
    notesKo: ["빔 성형", "광학 호환성", "공정 형상 검토"],
    notesEn: ["Beam shaping", "Optical compatibility", "Process profile review"],
  },
  "optical-solution/powerphotonic": {
    labelKo: "Optical Solution",
    labelEn: "Optical Solution",
    headlineKo: "PowerPhotonic 자유형상 광학 제품 구성",
    headlineEn: "PowerPhotonic freeform optics",
    leadKo: "자유형상 광학과 마이크로 옵틱 제품군을 이미지, 사양, 공정 조건 중심으로 검토합니다.",
    leadEn: "Freeform and micro-optic configurations are reviewed with product images and specifications.",
    heroImage: "/maker-detail/powerphotonic-1.png",
    blocks: [
      block("자유형상 광학 제품군", "Freeform optics lineup", "다양한 자유형상 광학 제품을 공정 목적과 광학 조건에 맞춰 검토합니다.", "Product families are reviewed against process purpose and optical conditions.", "/maker-detail/powerphotonic-1.png"),
      block("빔 딜리버리 적용", "Beam delivery application", "빔 전달과 형상 제어가 필요한 장비 구성에 적용성을 확인합니다.", "Applicability is checked for equipment requiring beam delivery and profile control."),
    ],
    notesKo: ["자유형상 광학", "마이크로 옵틱", "제품군 사양 검토"],
    notesEn: ["Freeform optics", "Micro-optics", "Product specification review"],
  },
  "optical-solution/cailabs": {
    labelKo: "Optical Solution",
    labelEn: "Optical Solution",
    headlineKo: "Cailabs 광학 변환 솔루션",
    headlineEn: "Optical transformation solutions shaping the future of light",
    leadKo: "빛의 미래를 형성하는 Cailabs 광학 변환 기술을 기반으로 빔 전송, 형상 제어, 모드 변환 조건을 검토합니다.",
    leadEn: "Cailabs optical transformation technology is reviewed for beam delivery, beam shaping, and mode conversion.",
    blocks: [
      block("모드 변환", "Mode conversion", "입력 빔 조건과 출력 형상 요구를 기준으로 광학 변환 적용성을 확인합니다.", "Optical transformation applicability is checked from input beam conditions and output requirements."),
      block("시스템 통합", "System integration", "광학계, 장비 공간, 정렬 조건을 함께 검토합니다.", "Optics, equipment space, and alignment requirements are reviewed together."),
    ],
    notesKo: ["모드 변환", "빔 전송", "광학계 통합"],
    notesEn: ["Mode conversion", "Beam delivery", "Optical system integration"],
  },
  "optical-solution/mloptic": {
    labelKo: "Optical Solution",
    labelEn: "Optical Solution",
    headlineKo: "MLOptic 정밀 광학 제품 구성",
    headlineEn: "MLOptic precision optical modules",
    leadKo: "광자를 통한 혁신이라는 방향에 맞춰 정밀 광학 모듈, 제품 설명, 주요 사양을 검토합니다.",
    leadEn: "Precision optical modules and specifications are reviewed under the photon innovation concept.",
    heroImage: "/maker-detail/mloptic-1.png",
    blocks: [
      block("정밀 광학 모듈", "Precision optical modules", "제품명, 설명, 주요 사양을 중심으로 적용 가능성을 검토합니다.", "Applicability is reviewed around product names, descriptions, and key specifications.", "/maker-detail/mloptic-1.png"),
      block("사양 검토", "Specification review", "공정 조건에 필요한 광학 성능과 장착 조건을 확인합니다.", "Optical performance and mounting requirements are checked for process conditions."),
    ],
    notesKo: ["정밀 광학", "제품 사양", "적용 조건 검토"],
    notesEn: ["Precision optics", "Product specifications", "Application condition review"],
  },
  "coating-solution/optoman": {
    labelKo: "Coating Solution",
    labelEn: "Coating Solution",
    headlineKo: "Optoman 레이저 옵틱 코팅 제품 구성",
    headlineEn: "Optoman laser optics coating",
    leadKo: "레이저 옵틱 코팅 컬렉션을 파장, 손상 임계값, 공정 환경 기준으로 검토합니다.",
    leadEn: "Laser optics coatings are reviewed by wavelength, damage threshold, and process environment.",
    heroImage: "/maker-detail/optoman-1.png",
    blocks: [
      block("코팅 제품군", "Coating collections", "제품명, 설명, 주요 사양을 중심으로 적합한 코팅 옵션을 검토합니다.", "Suitable coating options are reviewed by product name, description, and specifications.", "/maker-detail/optoman-1.png"),
      block("레이저 내구성", "Laser durability", "고출력 레이저 환경에서 요구되는 내구성과 품질 조건을 확인합니다.", "Durability and quality conditions required for high-power laser environments are checked."),
    ],
    notesKo: ["코팅 사양", "파장 조건", "손상 임계값 검토"],
    notesEn: ["Coating specifications", "Wavelength conditions", "Damage threshold review"],
  },
  "coating-solution/ulo-optics": {
    labelKo: "Coating Solution",
    labelEn: "Coating Solution",
    headlineKo: "ULO 레이저 보호 윈도우 제품 구성",
    headlineEn: "ULO laser protection windows",
    leadKo: "레이저 보호 윈도우와 산업용 광학 부품을 장비 조건에 맞춰 검토합니다.",
    leadEn: "Laser protection windows and industrial optical parts are reviewed against equipment conditions.",
    heroImage: "/maker-detail/ulo-1.png",
    blocks: [
      block("레이저 보호 윈도우", "Laser protection windows", "가공 환경에서 광학계를 보호하기 위한 윈도우 사양을 검토합니다.", "Window specifications are reviewed to protect optical systems in processing environments.", "/maker-detail/ulo-1.png"),
      block("산업용 광학 부품", "Industrial optical parts", "장비 구조와 설치 조건을 기준으로 부품 적용성을 확인합니다.", "Part applicability is checked by equipment architecture and installation conditions."),
    ],
    notesKo: ["보호 윈도우", "광학 부품", "장비 적용성"],
    notesEn: ["Protection windows", "Optical parts", "Equipment applicability"],
  },
  "coating-solution/photonic-tools": {
    labelKo: "Coating Solution",
    labelEn: "Coating Solution",
    headlineKo: "Photonic Tools 산업용 초고속 빔 전달",
    headlineEn: "Photonic Tools industrial ultrafast beam delivery",
    leadKo: "산업용 초고속 레이저 공정에 필요한 빔 전달 구성과 광학 부품 적용 조건을 검토합니다.",
    leadEn: "Beam delivery configurations and optical component requirements are reviewed for industrial ultrafast laser processes.",
    heroImage: "/maker-detail/photonic-tools-1.png",
    blocks: [
      block("초고속 빔 전달", "Ultrafast beam delivery", "초고속 레이저 기반 장비에서 요구되는 빔 전달 안정성과 장착 조건을 확인합니다.", "Beam delivery stability and mounting requirements are checked for ultrafast laser equipment.", "/maker-detail/photonic-tools-1.png"),
      block("산업용 적용 검토", "Industrial application review", "광학 경로, 출력 조건, 공간 제약을 함께 검토해 장비 적용성을 높입니다.", "Optical path, output conditions, and space constraints are reviewed together for practical equipment integration."),
    ],
    notesKo: ["초고속 빔 전달", "광학 부품", "장비 적용성 검토"],
    notesEn: ["Ultrafast beam delivery", "Optical components", "Equipment applicability review"],
  },
  "coating-solution/zenops": {
    labelKo: "Coating Solution",
    labelEn: "Coating Solution",
    headlineKo: "ZENOPS 광학 부품 및 코팅 제품 구성",
    headlineEn: "ZENOPS optical parts and coating support",
    leadKo: "ZENOPS 광학 부품과 코팅 제품군을 공정 조건, 코팅 사양, 장비 적용성 기준으로 검토합니다.",
    leadEn: "ZENOPS products are reviewed by optical part, coating condition, and equipment applicability.",
    heroImage: "/maker-detail/zenops-1.png",
    blocks: [
      block("ZENOPS 제품", "ZENOPS products", "제조사 제품 구성과 사양을 기준으로 필요한 광학 부품을 확인합니다.", "Required optical parts are checked based on product lineup and specifications.", "/maker-detail/zenops-1.png"),
      block("코팅 적용", "Coating application", "파장, 출력, 설치 환경에 맞는 코팅 조건을 검토합니다.", "Coating conditions are reviewed by wavelength, output, and installation environment."),
    ],
    notesKo: ["광학 부품", "코팅 조건", "제조사 사양 검토"],
    notesEn: ["Optical parts", "Coating conditions", "Manufacturer specification review"],
  },
  "beam-delivery/powerphotonic": {
    labelKo: "Beam Delivery",
    labelEn: "Beam Delivery",
    headlineKo: "PowerPhotonic 빔 딜리버리 광학 구성",
    headlineEn: "PowerPhotonic beam delivery optics",
    leadKo: "빔 전달, 형상 제어, 자유형상 광학을 장비 구조에 맞춰 검토합니다.",
    leadEn: "Beam delivery, profile control, and freeform optics are reviewed for equipment architecture.",
    heroImage: "/maker-detail/powerphotonic-1.png",
    blocks: [
      block("빔 딜리버리", "Beam delivery", "광학계 경로와 출력 조건을 기준으로 전달 광학을 검토합니다.", "Delivery optics are reviewed by optical path and output conditions.", "/maker-detail/powerphotonic-1.png"),
      block("자유형상 광학", "Freeform optics", "빔 품질과 형상 요구를 만족하기 위한 광학 옵션을 확인합니다.", "Optical options are checked to satisfy beam quality and profile requirements."),
    ],
    notesKo: ["빔 전달", "형상 제어", "장비 통합"],
    notesEn: ["Beam delivery", "Profile control", "Equipment integration"],
  },
  "beam-delivery/beam-delivery-parts": {
    labelKo: "Beam Delivery",
    labelEn: "Beam Delivery",
    headlineKo: "Beam Delivery Parts 제품 구성",
    headlineEn: "Beam Delivery Parts",
    leadKo: "빔 전달 구성에 필요한 렌즈, 윈도우, 마운트 등 부품을 장비 구조와 설치 조건에 맞춰 검토합니다.",
    leadEn: "Lenses, windows, mounts, and other beam delivery parts are reviewed against equipment conditions.",
    heroImage: "/makers/beam-delivery-parts.svg",
    blocks: [
      block("빔 전달 부품", "Beam delivery parts", "광학 경로, 출력 조건, 설치 공간에 맞는 부품 구성을 확인합니다.", "Part configuration is checked by optical path, output condition, and installation space.", "/makers/beam-delivery-parts.svg"),
      block("적용 검토", "Application review", "표준 부품과 맞춤 구성을 함께 검토해 장비 적용성을 높입니다.", "Standard parts and custom configurations are reviewed together for equipment applicability."),
    ],
    notesKo: ["렌즈·윈도우", "마운트 구성", "장비 적용 검토"],
    notesEn: ["Lenses and windows", "Mount configuration", "Equipment application review"],
  },
};

export function getProductMakerDetailContent(productSlug: string, makerSlug: string) {
  return detailContent[`${productSlug}/${makerSlug}`] ?? null;
}
