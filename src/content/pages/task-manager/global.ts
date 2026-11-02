import type { TaskManagerOverride } from "./schema";

// Approved Global PDF copy. Shared service components define the Why Choose and FAQ UI.
export const globalTaskManager = {
  seo: {
    title: "Field Task Management Software | LOCATOR",
    absoluteTitle: true,
    description:
      "Assign jobs, track task progress and manage field teams with LOCATOR Task Manager. Organise deliveries, inspections and reports in one platform.",
    keywords: [
      "Task management software",
      "Field task management",
      "task management app",
      "job scheduling software",
      "driver task management",
      "field team management",
      "task tracking software",
    ],
  },
  sectionOrder: [
    "hero",
    "introduction",
    "benefits",
    "tools",
    "industries",
    "whyChoose",
    "faq",
    "modules",
    "finalCta",
  ],
  enabled: {
    benefits: true,
    tools: true,
    industries: true,
    whyChoose: true,
    faq: true,
    finalCta: true,
  },
  hero: {
    heading: "Smart Task Management for Field Teams",
    accent: "",
    paragraphs: [
      "Assign jobs, coordinate field staff and track task progress from one platform. LOCATOR helps businesses manage daily field operations, collect job details and improve team accountability.",
    ],
    primaryCta: {
      label: "Get a Quote",
      href: "/get-a-quote",
    },
    secondaryCta: {
      label: "Book a Demo",
      href: "/get-a-free-demo",
    },
    eyebrowStyle: "compact",
  },
  introduction: {
    eyebrow: "Task Manager",
    heading: "Manage Every Task from One Place",
    paragraphs: [
      "Create and assign jobs through the web dashboard, then let field staff receive and update tasks through the mobile app. Monitor progress, collect completion details and keep your office and field teams connected.",
    ],
    itemsLabel: "",
    listStyle: "bullets",
    items: [
      "Easy task assignment and scheduling",
      "Live task status updates",
      "Location and time-window details",
      "Photos, notes and inspection reports where supported",
      "Payment status monitoring",
      "Compatible CRM/ERP integration",
    ],
  },
  benefits: {
    heading: "Make Field Operations Simpler and Smarter",
    order: ["assignment", "progress", "proof", "visibility"],
    items: {
      assignment: {
        title: "Easy Task Assignment",
        description:
          "Assign jobs to the right staff member with task details, locations and scheduled time windows.",
      },
      progress: {
        title: "Real-Time Progress Tracking",
        description:
          "Monitor assigned, in-progress and completed jobs from the dashboard.",
      },
      proof: {
        title: "Digital Proof of Completion",
        description:
          "Collect available job notes, photographs, signatures and inspection details to support task verification.",
      },
      visibility: {
        title: "Performance Visibility",
        description:
          "Review task completion records and available reports to identify delays and improve team coordination.",
      },
    },
  },
  tools: {
    heading: "Connected Tools for Office and Field Teams",
    order: ["dashboard", "app"],
    items: {
      dashboard: {
        title: "Web Dashboard",
        description:
          "Manage job assignments, review task statuses and access available task records from a central dashboard.",
      },
      app: {
        title: "Mobile App",
        description:
          "Help field staff access job details, update task progress and submit supported completion information while on the move.",
      },
    },
    cta: {
      label: "Explore the Task Manager",
      href: "#task-manager",
    },
  },
  industries: {
    heading: "Task Management for Different Industries",
    order: ["fmcg", "logistics", "facility", "healthcare", "sales"],
    items: {
      fmcg: {
        title: "FMCG & Distribution",
        description:
          "Coordinate store deliveries, manage assigned stops and review job completion details.",
      },
      logistics: {
        title: "Transportation & Logistics",
        description:
          "Organise transport-related jobs, track progress and improve coordination between dispatchers and field teams.",
      },
      facility: {
        title: "Facility Management",
        description:
          "Assign maintenance visits, record inspection details and monitor service completion.",
      },
      healthcare: {
        title: "Healthcare Transport",
        description:
          "Coordinate scheduled transport jobs and track task progress for relevant healthcare fleet operations.",
      },
      sales: {
        title: "Sales & Field Services",
        description:
          "Organise customer visits, distribute field assignments and review activity records.",
      },
    },
    paragraphs: [
      "Coordinate deliveries, service visits and field activities with a workflow suited to your team's daily operations.",
    ],
  },
  whyChoose: {
    heading: "More Control Over Your Daily Operations",
    order: [
      "central",
      "coordination",
      "records",
      "accountability",
      "workflows",
    ],
    items: {
      central: {
        title: "Centralised Task Management",
        desc: "Manage jobs and task statuses from one dashboard.",
        accent: "#1360ee",
        assetIndex: 0,
      },
      coordination: {
        title: "Better Team Coordination",
        desc: "Keep dispatchers and field staff connected.",
        accent: "#1360ee",
        assetIndex: 2,
      },
      records: {
        title: "Digital Records",
        desc: "Store available task notes, photos and completion details.",
        accent: "#1360ee",
        assetIndex: 1,
      },
      accountability: {
        title: "Improved Accountability",
        desc: "Review task progress and completion history.",
        accent: "#1360ee",
        assetIndex: 1,
      },
      workflows: {
        title: "Connected Workflows",
        desc: "Explore compatible CRM/ERP integration to reduce duplicate data entry.",
        accent: "#1360ee",
        assetIndex: 2,
      },
    },
    eyebrow: "Why LOCATOR",
  },
  faq: {
    heading: "Frequently asked questions",
    order: [
      "system",
      "assign",
      "progress",
      "proof",
      "locations",
      "integration",
      "industries",
      "gcc",
    ],
    items: {
      system: {
        q: "What is a task management system for field teams?",
        a: "It is a tool for creating, assigning and tracking jobs for staff working outside the office, such as delivery drivers, sales representatives and service technicians.",
        cat: "tasks",
      },
      assign: {
        q: "Can I assign tasks to drivers and field staff?",
        a: "Yes. LOCATOR Task Manager lets administrators assign jobs through the platform and share task details with field staff through the mobile app.",
        cat: "tasks",
      },
      progress: {
        q: "Can I track task progress in real time?",
        a: "The dashboard supports task status tracking, including assigned, in-progress and completed jobs. The available updates depend on staff activity and system configuration.",
        cat: "tasks",
      },
      proof: {
        q: "Can field staff upload proof of completion?",
        a: "Supported workflows can collect information such as photos, notes, signatures and inspection details, depending on the task configuration.",
        cat: "field",
      },
      locations: {
        q: "Can I assign tasks with specific locations and time windows?",
        a: "Task records can include location and time-window details to help teams organise their daily assignments.",
        cat: "field",
      },
      integration: {
        q: "Does Task Manager integrate with CRM or ERP software?",
        a: "Compatible CRM/ERP integrations may be available to help synchronise information and reduce duplicate entry. Confirm compatibility with your existing system.",
        cat: "integration",
      },
      industries: {
        q: "Which industries can use LOCATOR Task Manager?",
        a: "It can support suitable workflows in FMCG distribution, logistics, facility management, healthcare transport, sales and other field-service operations.",
        cat: "field",
      },
      gcc: {
        q: "Can I use Task Manager across the GCC?",
        a: "The platform may be suitable for businesses operating across the region. Confirm country-specific availability, connectivity and support requirements with the LOCATOR team.",
        cat: "coverage",
      },
    },
    categories: [
      {
        id: "all",
        label: "All questions",
      },
      {
        id: "tasks",
        label: "Tasks",
      },
      {
        id: "field",
        label: "Field Operations",
      },
      {
        id: "integration",
        label: "Integration",
      },
      {
        id: "coverage",
        label: "Coverage",
      },
    ],
  },
  finalCta: {
    eyebrow: "",
    heading: "Keep Your Field Team Moving",
    accent: "",
    paragraphs: [
      "Simplify job assignments, follow task progress and manage field operations with LOCATOR Task Manager. Tell us about your workflow and discover how a connected task management platform can support your business.",
    ],
    primaryCta: {
      label: "Get a Quote",
      href: "/get-a-quote",
    },
    secondaryCta: {
      label: "Book a Live Demo",
      href: "/get-a-free-demo",
    },
    trustItems: [],
  },
} satisfies TaskManagerOverride;
