import type { TrackingDevicesOverride } from "./schema";

// Approved Global PDF copy. Fuel sensor retains the existing comingSoon flag.
export const globalTrackingDevices = {
  seo: {
    title: "GPS Tracking Devices & Accessories UAE | LOCATOR",
    absoluteTitle: true,
    description:
      "Explore GPS tracking devices, vehicle trackers, driver ID readers and sensors for fleet operations. Contact LOCATOR for suitable device options.",
    ogTitle: "GPS Tracking Devices & Accessories UAE | LOCATOR",
    ogDescription:
      "Explore GPS tracking devices, vehicle trackers, driver ID readers and sensors for fleet operations. Contact LOCATOR for suitable device options.",
    keywords: [
      "GPS tracking devices",
      "GPS tracking device",
      "vehicle tracking device",
      "GPS tracker",
      "car GPS tracker",
      "driver ID reader",
      "RFID reader",
      "temperature sensor",
      "CAN adapter",
    ],
  },
  sectionOrder: ["hero", "catalog", "journey", "whyChoose", "faq", "finalCta"],
  enabled: {
    journey: true,
    whyChoose: true,
    faq: true,
  },
  hero: {
    eyebrow: "GPS Tracking Hardware & IoT Accessories",
    eyebrowStyle: "compact",
    heading: "GPS Tracking Devices & IoT Accessories",
    accent: "",
    paragraphs: [
      "Find the right tracking hardware for your vehicles, equipment and valuable assets. LOCATOR offers compatible GPS trackers, driver identification devices and IoT sensors that connect with your fleet management platform.",
    ],
    primaryCta: {
      label: "Request Device Pricing",
      href: "/contact",
    },
    secondaryCta: {
      label: "Talk to an Expert",
      href: "/contact",
    },
  },
  catalog: {
    eyebrow: "",
    heading: "GPS Tracking Devices & Accessories",
    paragraphs: [],
    fullDescriptions: true,
    items: {
      fmb120: {
        name: "FMB120 GPS Tracker",
        tagline:
          "A compact GNSS/GSM/Bluetooth tracker for fleet vehicles, rental cars and transport operations. Supports compatible vehicle data monitoring and selected remote-control functions.",
        specs: [
          {
            label: "Connectivity",
            value: "GNSS / GSM / Bluetooth",
          },
        ],
        linkLabel: "View FMB120 details",
      },
      fmb920: {
        name: "FMB920 GPS Tracker",
        tagline:
          "A compact tracker for light vehicles, rental fleets and delivery operations, with Bluetooth connectivity and an internal backup battery.",
        specs: [
          {
            label: "Connectivity",
            value: "GNSS / GSM / Bluetooth",
          },
        ],
        linkLabel: "View FMB920 details",
      },
      fmb202: {
        name: "FMB202 GPS Tracker",
        tagline:
          "A rugged IP67-rated tracker designed for suitable applications such as trailers, refrigerated transport, agriculture and other assets exposed to demanding conditions.",
        specs: [
          {
            label: "Protection",
            value: "IP67 waterproof",
          },
        ],
        linkLabel: "View FMB202 details",
      },
      "ibutton-reader-tag": {
        name: "iButton Reader & Tag",
        tagline:
          "Help identify drivers using compatible tracking hardware. Suitable for fleet applications that require driver identification and supported immobilizer functions.",
        specs: [
          {
            label: "Protocol",
            value: "1-Wire",
          },
        ],
      },
      "rfid-reader-tag": {
        name: "RFID Reader & Tag",
        tagline:
          "Support driver identification with compatible RFID readers, cards or key fobs for fleet management workflows.",
        specs: [],
      },
      "fuel-sensor": {
        name: "Fuel Level Sensor",
        tagline:
          "Monitor fuel levels in compatible tanks and vehicles to support fuel-use analysis and operational reporting.",
        specs: [],
      },
      "temperature-sensor": {
        name: "Temperature Sensor",
        tagline:
          "Monitor temperature through compatible tracking devices, helping businesses review conditions in suitable transport and storage applications.",
        specs: [
          {
            label: "Protocol",
            value: "1-Wire",
          },
        ],
      },
      "lv-can200": {
        name: "LV-CAN200 CAN Adapter",
        tagline:
          "Connect compatible light-vehicle CAN data to supported tracking systems for additional vehicle information.",
        specs: [
          {
            label: "Interface",
            value: "CAN1 / CAN2",
          },
        ],
      },
      "bluetooth-temperature-humidity": {
        name: "Bluetooth Temperature & Humidity Sensor",
        tagline:
          "Collect temperature and humidity readings wirelessly for compatible monitoring and asset-tracking applications.",
        specs: [
          {
            label: "Connectivity",
            value: "Bluetooth 4.0 LE",
          },
        ],
      },
    },
  },
  journey: {
    heading: "The Right Hardware for Every Tracking Need",
    paragraphs: [
      "Explore how compatible GPS devices and accessories work together to provide location, driver and asset information through the LOCATOR platform.",
    ],
    order: ["choose", "install", "connect", "monitor"],
    items: {
      choose: {
        title: "Choose Your Device",
        image: "/tracking-devices/fmb120.webp",
        description:
          "Select suitable tracking hardware based on your vehicle, equipment and monitoring requirements.",
      },
      install: {
        title: "Install & Configure",
        image:
          "/regulatory/securepath-premium/securepath-premium-device-installation.webp",
        description:
          "Configure compatible devices and accessories for the intended tracking application.",
      },
      connect: {
        title: "Connect to LOCATOR",
        image: "/showcase/desktop-dashboard.webp",
        description:
          "View supported device information through the fleet management platform.",
      },
      monitor: {
        title: "Monitor Your Operations",
        image: "/showcase/desktop-dashboard.webp",
        description:
          "Use available location, vehicle and sensor data to support day-to-day decisions.",
      },
    },
    cta: {
      label: "Talk to a Hardware Expert",
      href: "/contact",
    },
  },
  whyChoose: {
    heading: "Hardware That Works with Your Fleet Platform",
    order: ["selection", "accessories", "connected", "installation", "scale"],
    items: {
      selection: {
        title: "Device Selection Support",
        desc: "Choose hardware suited to your vehicle or asset.",
        accent: "#1360ee",
        assetIndex: 0,
      },
      accessories: {
        title: "Compatible Accessories",
        desc: "Explore driver identification, CAN and sensor options.",
        accent: "#1360ee",
        assetIndex: 2,
      },
      connected: {
        title: "Connected Monitoring",
        desc: "Bring supported device data into one platform.",
        accent: "#1360ee",
        assetIndex: 2,
      },
      installation: {
        title: "Installation & Configuration",
        desc: "Get guidance on setup for compatible devices.",
        accent: "#1360ee",
        assetIndex: 1,
      },
      scale: {
        title: "Scalable Options",
        desc: "Explore hardware for individual vehicles or larger fleets.",
        accent: "#1360ee",
        assetIndex: 0,
      },
    },
  },
  faq: {
    categories: [
      {
        id: "all",
        label: "All questions",
      },
      {
        id: "devices",
        label: "Devices",
      },
      {
        id: "sensors",
        label: "Sensors",
      },
      {
        id: "deployment",
        label: "Deployment",
      },
    ],
    order: [
      "catalog",
      "choose",
      "fleets",
      "compare",
      "sensors",
      "connectivity",
      "gcc",
      "purchase",
    ],
    items: {
      catalog: {
        q: "What GPS tracking devices does LOCATOR offer?",
        cat: "devices",
        a: "The current catalogue includes FMB120, FMB920 and FMB202 trackers, plus selected driver identification devices, sensors and CAN accessories. Availability may vary.",
      },
      choose: {
        q: "How do I choose the right GPS tracker?",
        cat: "devices",
        a: "The right device depends on the vehicle type, power supply, connectivity, installation conditions and the data you need to monitor. Contact the team for a suitable recommendation.",
      },
      fleets: {
        q: "Can these devices track trucks and commercial fleets?",
        cat: "devices",
        a: "Suitable devices can support selected cars, vans, trucks, rental vehicles, trailers and other fleet applications. Check compatibility before installation.",
      },
      compare: {
        q: "What is the difference between FMB120, FMB920 and FMB202?",
        cat: "devices",
        a: "They differ in their intended applications, connectivity and hardware characteristics. The FMB202, for example, has an IP67 protection rating, while the FMB920 is designed for compact light-vehicle tracking.",
      },
      sensors: {
        q: "Can I monitor fuel and temperature?",
        cat: "sensors",
        a: "Compatible fuel and temperature sensors can provide relevant readings through supported hardware. Confirm device compatibility and current availability before ordering.",
      },
      connectivity: {
        q: "Do GPS trackers require a SIM card or mobile connectivity?",
        cat: "deployment",
        a: "Devices using GSM connectivity typically require an appropriate mobile network connection and service arrangement. Requirements depend on the device and deployment location.",
      },
      gcc: {
        q: "Can the devices be used outside the UAE?",
        cat: "deployment",
        a: "Country-specific network compatibility, device availability, installation and support should be confirmed for Saudi Arabia, Oman, Kuwait and Qatar before deployment.",
      },
      purchase: {
        q: "Can I purchase a tracker without the software?",
        cat: "deployment",
        a: "Ask LOCATOR about available hardware packages, software requirements and standalone device compatibility before purchasing.",
      },
    },
  },
  finalCta: {
    eyebrow: "",
    heading: "Find the Right Tracking Device for Your Business",
    accent: "",
    paragraphs: [
      "Tell us what you need to track and which data matters most. LOCATOR can help you explore compatible GPS trackers, accessories and IoT sensors for your fleet or assets.",
    ],
    primaryCta: {
      label: "Request Device Pricing",
      href: "/contact",
    },
    secondaryCta: {
      label: "Talk to an Expert",
      href: "/contact",
    },
    trustItems: [],
  },
} satisfies TrackingDevicesOverride;
