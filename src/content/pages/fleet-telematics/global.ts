import type { FleetOverride } from "./schema";

// Approved Global copy; industry descriptions revised from the supplied November content.
// Industries inherit the empty overview and original tracked-asset lists from shared.ts.
export const globalFleetTelematics = {
  // Commercial intent: fleet managers, logistics companies, transport businesses
  // and commercial vehicle operators. This is editorial guidance, not page copy.
  seo: {
    title: "Fleet Telematics & GPS Tracking Solutions | LocatorGlobal",
    absoluteTitle: true,
    description: "Improve fleet operations with GPS tracking, live vehicle monitoring, route history and fleet alerts. Explore smart fleet telematics across the UAE and GCC.",
    ogTitle: "Fleet Telematics & GPS Tracking Solutions | LocatorGlobal",
    ogDescription: "Improve fleet operations with GPS tracking, live vehicle monitoring, route history and fleet alerts. Explore smart fleet telematics across the UAE and GCC.",
    keywords: ["Fleet Telematics", "GPS Fleet Tracking", "Fleet Management Solutions", "Vehicle Tracking System", "Fleet Tracking Software", "GPS Tracking UAE", "Fleet Telematics GCC"],
  },
  sectionOrder: [
    "hero",
    "benefits",
    "showcase",
    "industries",
    "process",
    "statistics",
    "videoPlayer",
    "videoTelematics",
    "whyChoose",
    "blogs",
    "faq",
    "finalCta",
  ],
  enabled: {
    statistics: false,
  },
  hero: {
    label: "Fleet Telematics",
    heading: "Improve Fleet Operations with GPS Tracking & Telematics",
    paragraphs: [
      "Keep track of your vehicles, monitor daily trips and manage your fleet from one platform.",
    ],
    primaryCta: {
      label: "Get a Quote",
      href: "/get-a-quote",
    },
    secondaryCta: {
      label: "Explore Solutions",
      href: "#fleet-telematics",
    },
    secondaryIsLink: true,
  },
  benefits: {
    heading: "GPS Tracking & Fleet Telematics Features",
    items: {
      liveGps: {
        label: "Live GPS Tracking",
        short:
          "See your vehicles on a map and check their reported locations throughout the day.",
      },
      dashboard: {
        label: "Dynamic Fleet Dashboard",
        short:
          "View vehicle status, trip information and available fleet reports in one place.",
      },
      idle: {
        label: "Instant Idle Alerts",
        short:
          "Identify vehicles that remain idle longer than expected and review their usage.",
      },
      afterHours: {
        label: "After-Hours Vehicle Alerts",
        short:
          "Receive alerts when vehicles move outside your defined working hours, where supported.",
      },
      routeHistory: {
        label: "Daily Route History",
        short:
          "Review previous trips, stops and route details to understand vehicle activity.",
      },
      maintenance: {
        label: "Fleet Service Reminders",
        short:
          "Keep track of scheduled servicing and maintenance with available reminders.",
      },
      tasks: {
        label: "Field Tasks Manager",
        short:
          "Assign jobs to field staff and check task progress through the supported workflow.",
      },
      expenses: {
        label: "Mobile Expense Manager",
        short:
          "Record and review fleet-related expenses using the available expense management features.",
      },
      geofence: {
        label: "Geofence & POI Monitoring",
        short:
          "Set virtual boundaries around depots, offices and customer locations to monitor vehicle movements.",
      },
      routePlanning: {
        label: "AI Route Optimisation",
        short:
          "Use available route-planning features to review journeys and identify opportunities to improve fleet operations.",
      },
    },
  },
  showcase: {
    heading: "Live Vehicle Visibility & Fleet Intelligence",
    paragraphs: [
      "Manage vans, trucks, buses and other commercial vehicles with GPS tracking, trip history, alerts and fleet reports. LOCATOR brings essential fleet information together to help you understand daily operations.",
    ],
    subheading: "",
    secondaryParagraphs: [],
    items: {
      liveGps: {
        title: "Live GPS Tracking",
        desc: "Check vehicle locations and coordinate your fleet from a central map.",
      },
      idle: {
        title: "Instant Idle Alerts",
        desc: "Review unnecessary idling and identify opportunities to improve vehicle utilisation.",
      },
      dashboard: {
        title: "Dynamic Fleet Dashboard",
        desc: "Access vehicle status, trip details and available reports through one dashboard.",
      },
      afterHours: {
        title: "After-Hours Vehicle Alerts",
        desc: "Monitor unexpected vehicle movement outside configured working hours.",
      },
      routeHistory: {
        title: "Daily Route History",
        desc: "Check recorded routes and stops when you need to review a journey.",
      },
      maintenance: {
        title: "Fleet Service Reminders",
        desc: "Keep vehicle maintenance schedules organised with available reminders.",
      },
    },
  },
  industries: {
    showVehicleTypes: true,
    cta: {
      label: "Explore Industry Solutions",
      href: "/industries",
    },
    items: {
      fmcg: {
        title: "FMCG & Distribution",
        desc: "GPS fleet telematics helps vans, pickups, mini-trucks and delivery bikes track distributors and supermarket deliveries in real time. It reduces fuel loss, improves route planning, supports vehicle maintenance, monitors drivers and helps prevent delivery delays, giving FMCG companies across the UAE, Saudi Arabia, Oman, Kuwait and Qatar better control over sales teams and daily stock movement.",
        keywords: ["FMCG fleet tracking", "distribution fleet management"],
      },
      transport: {
        title: "Transportation & Logistics",
        desc: "Monitor trucks, trailers and delivery vans in real time with GPS fleet tracking. Review routes, track driver activity and identify delivery delays. Improve vehicle utilisation, coordinate transport operations and gain better fleet visibility for logistics businesses operating across the UAE and GCC markets.",
        keywords: ["Logistics fleet tracking", "GPS tracking for trucks"],
      },
      construction: {
        title: "Construction & Heavy Equipment",
        desc: "Track construction vehicles and heavy equipment across multiple project sites. Monitor asset locations, review vehicle movements and understand equipment usage. Improve coordination between site teams, reduce unnecessary vehicle downtime and maintain better operational visibility for construction businesses across the UAE and GCC markets.",
        keywords: [
          "Construction equipment tracking",
          "heavy machinery GPS tracking",
        ],
      },
      facility: {
        title: "Facility Management",
        desc: "Manage facility maintenance vehicles and field service teams through real-time GPS tracking. Monitor technician movements, review service routes and improve daily coordination. Gain better visibility into vehicle activity and support efficient facility management operations across the UAE and GCC markets.",
        keywords: [
          "Facility management fleet tracking",
          "service vehicle tracking",
        ],
      },
      healthcare: {
        title: "Healthcare Transport",
        desc: "Monitor ambulances, patient transport vehicles and healthcare service fleets with GPS tracking. View vehicle locations, review routes and improve dispatch visibility. Support better transportation coordination and maintain operational control for healthcare organisations across the UAE and GCC markets.",
        keywords: ["Healthcare fleet tracking", "medical transport tracking"],
      },
      travel: {
        title: "Travel & Tourism",
        desc: "Manage tourist buses, hotel transfers and passenger transport vehicles with real-time GPS tracking. Monitor vehicle movements, review trip history and coordinate transportation schedules. Improve fleet visibility and support reliable travel operations for tourism businesses across the UAE and GCC markets.",
        keywords: ["Tourism fleet management", "bus GPS tracking"],
      },
      rental: {
        title: "Rental & Leasing",
        desc: "Track rental and leasing vehicles with real-time GPS monitoring. Review trip history, monitor vehicle movements and understand fleet utilisation. Improve vehicle visibility, support daily rental operations and maintain better control over your rental fleet across the UAE and GCC markets.",
        keywords: ["Rental fleet GPS tracking", "car rental tracking system"],
      },
      petroleum: {
        title: "Petroleum & Fuel Transport",
        desc: "Monitor fuel tankers, oilfield service vehicles and industrial fleets with GPS tracking. Review vehicle routes, track movements and improve operational visibility. Support fleet coordination and maintain better control over transportation activities for petroleum and energy businesses across the UAE and GCC markets.",
        keywords: ["Fuel transport tracking", "petroleum fleet management"],
      },
      vet: {
        title: "Veterinary & Pet Care",
        desc: "Track mobile veterinary clinics, pet transport vans and animal care service vehicles with GPS monitoring. Review routes, monitor team movements and coordinate appointments. Improve service visibility and manage mobile veterinary operations more efficiently across the UAE and GCC markets.",
        keywords: [
          "Veterinary fleet tracking",
          "pet transport vehicle tracking",
        ],
      },
      government: {
        title: "Public & Government Services",
        desc: "Monitor municipal vehicles, government cars and public service fleets with real-time GPS tracking. Review routes, track vehicle movements and improve team coordination. Gain better operational visibility and support efficient public service transportation across the UAE and GCC markets.",
        keywords: [
          "Government fleet tracking",
          "public service vehicle monitoring",
        ],
      },
      waste: {
        title: "Waste Management",
        desc: "Track waste collection trucks, recycling vehicles and disposal fleets with GPS monitoring. Review collection routes, monitor vehicle movements and improve service coordination. Gain better visibility into daily operations and support efficient waste management services across the UAE and GCC markets.",
        keywords: [
          "Waste management fleet tracking",
          "waste collection vehicle tracking",
        ],
      },
      school: {
        title: "School & Educational Transport",
        desc: "Monitor school buses, minibuses and student transport vehicles with GPS tracking. View vehicle locations, review trip history and improve transport coordination. Give school administrators better fleet visibility and support organised student transportation operations across the UAE and GCC markets.",
        keywords: [
          "School bus GPS tracking",
          "school transport fleet management",
        ],
      },
    },
    eyebrow: "GPS Fleet Services",
  },
  process: {
    heading: "Up and Running in 4 Simple Steps",
    paragraphs: [
      "Getting started with fleet tracking begins with understanding your vehicles and business requirements. LOCATOR helps you explore a tracking setup suitable for your fleet.",
    ],
    closingParagraphs: [],
    cta: {
      label: "Book a Free Site Visit",
      href: "/get-a-quote",
    },
    items: {
      assessment: {
        title: "Fleet Assessment",
        desc: "Discuss your fleet size, vehicle types and tracking requirements with our team.",
      },
      installation: {
        title: "Device Installation",
        desc: "Arrange installation of compatible GPS tracking devices for your vehicles.",
      },
      configuration: {
        title: "Platform Configuration",
        desc: "Set up vehicle records, dashboard access and available alerts according to your needs.",
      },
      training: {
        title: "Training & Go Live",
        desc: "Learn how to use the tracking platform and review the features included in your solution.",
      },
    },
  },
  statistics: {
    heading: "Fleet Tracking Backed by Experience",
    verified: false,
    items: [],
  },
  videoPlayer: {
    eyebrow: "",
    title: "",
    lead: "",
  },
  videoTelematics: {
    heading: "AI-Powered Dash Cameras & MDVR",
    paragraphs: [
      "Get more insight into driving events with compatible vehicle cameras, video monitoring and AI-powered driver alerts.",
    ],
    stats: [],
    cta: {
      label: "Explore Video Telematics",
      href: "/service/video-telematics",
    },
    items: {
      liveVideo: {
        title: "Live HD Video",
        desc: "Review supported road and driver footage when you need more information about a vehicle event.",
      },
      safety: {
        title: "Driver Safety",
        desc: "Use supported camera alerts to help identify selected driving risks and encourage safer driving habits.",
      },
      monitoring: {
        title: "Driver Monitoring",
        desc: "Compatible AI systems can detect certain signs of distraction or drowsiness.",
      },
      incidentReview: {
        title: "Incident Review",
        desc: "Use available recordings to investigate road events and understand what happened.",
      },
    },
  },
  whyChoose: {
    heading: "Why Businesses Choose LOCATOR",
    order: ["features", "options", "information", "integration"],
    items: {
      features: {
        title: "Useful Fleet Features",
        desc: "Track vehicles, review journeys and manage available fleet information through one platform.",
        assetIndex: 0,
        accent: "#1360ee",
      },
      options: {
        title: "Solutions for Different Fleets",
        desc: "Explore tracking options for cars, vans, trucks, buses and compatible equipment.",
        assetIndex: 1,
        accent: "#1360ee",
      },
      information: {
        title: "Clear Fleet Information",
        desc: "Use available alerts and reports to understand vehicle activity and identify issues.",
        assetIndex: 2,
        accent: "#1360ee",
      },
      integration: {
        title: "Software Integration",
        desc: "Connect with supported third-party systems where compatible integrations are available.",
        assetIndex: 0,
        accent: "#1360ee",
      },
    },
  },
  faq: {
    heading: "Frequently asked questions",
    categories: [
      {
        id: "all",
        label: "All questions",
      },
      {
        id: "installation",
        label: "Installation",
      },
      {
        id: "platform",
        label: "Platform & App",
      },
      {
        id: "coverage",
        label: "Coverage",
      },
    ],
    order: [
      "installation",
      "vehicles",
      "dashboard",
      "afterHours",
      "mobile",
      "coverage",
    ],
    items: {
      installation: {
        cat: "installation",
        q: "How long does GPS device installation take?",
        a: "Installation time depends on the vehicle, device and wiring requirements. Contact our team for an estimate based on your fleet.",
      },
      vehicles: {
        cat: "installation",
        q: "What vehicles can LOCATOR track?",
        a: "LOCATOR offers tracking solutions for compatible cars, vans, trucks, buses, motorcycles and selected machinery or equipment.",
      },
      dashboard: {
        cat: "platform",
        q: "Can I monitor multiple vehicles in one dashboard?",
        a: "Yes. A fleet tracking platform can display multiple connected vehicles in one interface. Supported fleet size and features depend on your configuration.",
      },
      afterHours: {
        cat: "platform",
        q: "Can I receive alerts when a vehicle moves after working hours?",
        a: "Compatible configurations can notify authorised users about vehicle movement outside defined working hours.",
      },
      mobile: {
        cat: "platform",
        q: "Does LOCATOR provide a mobile app?",
        a: "LOCATOR supports mobile workflows for relevant fleet and field operations. The available features depend on the application and your selected services.",
      },
      coverage: {
        cat: "coverage",
        q: "Can I track vehicles across the UAE and GCC?",
        a: "LOCATOR has an established presence in the UAE. Contact the team to confirm device availability, installation and support in Saudi Arabia, Oman, Kuwait and Qatar.",
      },
    },
  },
  finalCta: {
    eyebrow: "",
    heading: "Put Your Fleet on One Connected Platform",
    accent: "",
    paragraphs: [
      "Know where your vehicles are, review daily trips and manage your fleet with LOCATOR GPS tracking and telematics solutions.",
      "Tell us about your fleet and the challenges you want to solve. Our team can help you explore the options available for your business.",
    ],
    primaryCta: {
      label: "Get a Quote",
      href: "/get-a-quote",
    },
    secondaryCta: {
      label: "Book a Free Demo",
      href: "/get-a-free-demo",
    },
    trustItems: [],
  },
} satisfies FleetOverride;
