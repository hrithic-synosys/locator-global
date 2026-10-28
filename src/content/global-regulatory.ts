import type { Metadata } from "next";

const title = "GPS Tracking & Regulatory Compliance Solutions | Locator";
const description =
  "Explore GPS vehicle tracking solutions for fleet monitoring, approved tracking devices, OBUs, vehicle tracking reports and regulatory compliance support.";

export const globalRegulatoryMetadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "GPS tracking for regulatory compliance",
    "GPS vehicle tracking",
    "commercial vehicle tracking",
    "GPS tracking devices",
    "on-board unit (OBU)",
    "vehicle tracking requirements",
    "fleet compliance management",
    "GPS tracker installation",
    "fleet monitoring system",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: "/regulatory/shahin/shahin-banner.webp",
        alt: "Commercial truck on the road at sunset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/regulatory/shahin/shahin-banner.webp"],
  },
};

// Team-supplied editorial content; used only by the Global overview.
export const trackingCapabilities = [
  {
    title: "Real-Time GPS Vehicle Tracking",
    text: "Know where your vehicles are and monitor their movements through real-time GPS tracking. Access vehicle locations and route information to improve fleet oversight, support daily operations, and maintain better visibility across your fleet.",
  },
  {
    title: "GPS Tracking Devices and On-Board Units (OBUs)",
    text: "Choose suitable GPS tracking devices and on-board units based on your vehicle type, operational needs, and technical requirements. Where a specific device approval or certification is required, compatibility must be verified against the applicable standards.",
  },
  {
    title: "Vehicle Tracking Data and Reports",
    text: "Access vehicle movement history and tracking reports to support operational monitoring, record-keeping, and compliance-related documentation where applicable. Reliable vehicle data can also help fleet managers review activity and make informed decisions.",
  },
  {
    title: "GPS Tracker Installation and Documentation",
    text: "Get guidance on GPS tracking device selection, installation requirements, and system configuration. Where formal installation certificates or supporting documents are required, these must be obtained in accordance with the applicable procedures.",
  },
  {
    title: "Centralised Fleet Monitoring",
    text: "Manage vehicle locations and fleet activity through a centralised GPS tracking platform. Bring essential tracking information together to simplify fleet supervision and help your team manage vehicles more efficiently.",
  },
  {
    title: "Improved Vehicle Security and Accountability",
    text: "Increase visibility over commercial vehicles and their movements. GPS tracking can help businesses identify unusual activity, investigate route deviations, and reduce risks associated with unauthorised vehicle use.",
  },
] as const;
export const vehicleCategories = [
  {
    title: "Freight and logistics",
    text: "Monitor delivery vehicles and improve visibility throughout transportation operations.",
  },
  {
    title: "Commercial transport",
    text: "Track vehicle movements and support day-to-day fleet management.",
  },
  {
    title: "Passenger transport",
    text: "Maintain oversight of vehicles used for passenger services.",
  },
  {
    title: "Vehicle rental",
    text: "Monitor vehicle locations and improve fleet utilisation.",
  },
  {
    title: "Industrial and specialised vehicles",
    text: "Track vehicles operating in demanding or specialised environments.",
  },
  {
    title: "Cargo transportation",
    text: "Improve visibility over vehicles transporting goods and materials.",
  },
] as const;
export const trackingConsiderations = [
  "Compatibility with your vehicles and existing systems.",
  "Required tracking features and reporting capabilities.",
  "Device approval or certification requirements, where applicable.",
  "Installation and documentation requirements.",
  "Ongoing technical support and system maintenance.",
] as const;
export const regulatoryFaqs = [
  {
    question: "What is GPS tracking for regulatory compliance?",
    answer:
      "GPS tracking for regulatory compliance refers to using vehicle tracking technology to support applicable vehicle monitoring, reporting, registration, or documentation requirements. The exact requirements depend on the vehicle category and relevant jurisdiction.",
  },
  {
    question: "What is an on-board unit (OBU)?",
    answer:
      "An on-board unit is an electronic device installed in a vehicle. Depending on its design, it may support GPS positioning, data transmission, vehicle monitoring, or integration with other systems. Certain applications may require a specifically approved unit.",
  },
  {
    question: "Do commercial vehicles require an approved GPS tracker?",
    answer:
      "Some commercial vehicles are subject to mandatory tracking or device approval requirements, while others are not. Businesses should confirm the rules applicable to their vehicles and operating activities before selecting tracking hardware.",
  },
  {
    question: "Can GPS tracking help with fleet compliance management?",
    answer:
      "GPS tracking can provide vehicle location data, movement history, and reports that support fleet oversight and certain compliance-related processes. It does not automatically guarantee regulatory compliance or replace any required approvals.",
  },
  {
    question: "Does every GPS tracker support regulatory requirements?",
    answer:
      "No. Device compatibility and approval depend on the technical specifications and the relevant requirements. A tracker suitable for general fleet monitoring may not be approved for a specific regulated application.",
  },
] as const;
