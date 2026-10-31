import type { FleetOverride } from "./schema";

// Fleet Telematics Locator service page (2).pdf; editorial keywords are stored, not displayed.
// Statistics remain disabled until company figures and units are verified.
export const globalFleetTelematics = {
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
      "Keep track of your vehicles, monitor daily trips and manage your fleet from one platform. LOCATOR helps businesses stay informed about vehicle activity and coordinate their drivers more easily.",
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
    heading: "Fleet Tracking Solutions for Different Industries",
    paragraphs: [
      "Every industry manages vehicles differently. LOCATOR's GPS tracking and fleet management solutions help businesses monitor connected vehicles, review trips and coordinate daily operations. Explore the solutions relevant to your industry.",
    ],
    showVehicleTypes: false,
    cta: {
      label: "Explore Industry Solutions",
      href: "/industries",
    },
    items: {
      fmcg: {
        title: "FMCG & Distribution",
        desc: "Monitor delivery vans, pickups and distribution vehicles moving between warehouses, shops and customer locations. Review routes and vehicle activity to help coordinate daily deliveries.",
        keywords: ["FMCG fleet tracking", "distribution fleet management"],
      },
      transport: {
        title: "Transportation & Logistics",
        desc: "Track trucks and commercial vehicles travelling between depots, warehouses and delivery destinations. Use trip history and vehicle alerts to maintain visibility across transport operations.",
        keywords: ["Logistics fleet tracking", "GPS tracking for trucks"],
      },
      construction: {
        title: "Construction & Heavy Equipment",
        desc: "Monitor compatible construction vehicles and machinery across different project sites. Check equipment locations and available usage information to help manage assets and plan operations.",
        keywords: [
          "Construction equipment tracking",
          "heavy machinery GPS tracking",
        ],
      },
      facility: {
        title: "Facility Management",
        desc: "Coordinate service vehicles and mobile maintenance teams working across multiple properties. Review vehicle movements and trip records to help organise daily service visits.",
        keywords: [
          "Facility management fleet tracking",
          "service vehicle tracking",
        ],
      },
      healthcare: {
        title: "Healthcare Transport",
        desc: "Maintain visibility into connected healthcare transport and service vehicles. Review reported locations and journey information to help coordinate daily transport activities.",
        keywords: ["Healthcare fleet tracking", "medical transport tracking"],
      },
      travel: {
        title: "Travel & Tourism",
        desc: "Monitor compatible tour vehicles, coaches and passenger transport fleets. Check vehicle locations and recorded journeys to help coordinate schedules and daily transport operations.",
        keywords: ["Tourism fleet management", "bus GPS tracking"],
      },
      rental: {
        title: "Rental & Leasing",
        desc: "Track rental cars, leased vehicles and compatible equipment across branches and customer locations. Review trip history and use supported movement alerts to monitor fleet activity.",
        keywords: ["Rental fleet GPS tracking", "car rental tracking system"],
      },
      petroleum: {
        title: "Petroleum & Fuel Transport",
        desc: "Monitor compatible fuel transport vehicles and review recorded journeys. GPS tracking helps your team maintain visibility as vehicles travel between depots and delivery locations.",
        keywords: ["Fuel transport tracking", "petroleum fleet management"],
      },
      vet: {
        title: "Veterinary & Pet Care",
        desc: "Keep track of mobile veterinary service vehicles and pet transport fleets. Use vehicle location and trip information to help coordinate appointments and travel between customer locations.",
        keywords: [
          "Veterinary fleet tracking",
          "pet transport vehicle tracking",
        ],
      },
      government: {
        title: "Public & Government Services",
        desc: "Maintain visibility into connected municipal and public-service vehicles. Review fleet activity and available trip records to help coordinate vehicles operating across different locations.",
        keywords: [
          "Government fleet tracking",
          "public service vehicle monitoring",
        ],
      },
      waste: {
        title: "Waste Management",
        desc: "Monitor waste collection vehicles and review recorded routes and stops. Use tracking information to help coordinate collection activities and identify routes that may need attention.",
        keywords: [
          "Waste management fleet tracking",
          "waste collection vehicle tracking",
        ],
      },
      school: {
        title: "School & Educational Transport",
        desc: "Monitor connected school buses and educational transport vehicles. Review vehicle locations and trip history to help transport teams coordinate routes and daily operations.",
        keywords: [
          "School bus GPS tracking",
          "school transport fleet management",
        ],
      },
    },
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
