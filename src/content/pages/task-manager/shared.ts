import type { TaskManagerContent } from "./schema";
import { softwareCtaContent } from "../../shared/software-cta";

// Preserved country baseline. Global's approved copy belongs in global.ts.
export const sharedTaskManager: TaskManagerContent = {
  seo: {
    title: "Task Manager — Service",
    absoluteTitle: false,
    description:
      "Assign, track, and complete field jobs in real time with Locator Task Manager — dispatch jobs, collect field data, and sync with your CRM/ERP.",
    keywords: [],
  },
  sectionOrder: ["hero", "introduction", "modules"],
  enabled: {
    hero: true,
    introduction: true,
    benefits: false,
    tools: false,
    industries: false,
    whyChoose: false,
    faq: false,
    modules: true,
    finalCta: false,
  },
  hero: {
    eyebrowStyle: "large",
    eyebrow: "Field Team & Job Scheduling",
    heading: "Task Manager",
    accent: "Task",
    paragraphs: [
      "Assign tasks, track progress in real time, and manage field operations effortlessly. Collect data, monitor performance, and keep your team productive from one place.",
    ],
    image: "/services/task-manager-hero-banner.webp",
    primaryCta: { label: "Get a Free Quote", href: "/get-a-quote" },
    secondaryCta: { label: "Get a Free Demo", href: "/get-a-free-demo" },
  },
  introduction: {
    eyebrow: "MODULE",
    heading: "Task Manager",
    paragraphs: [
      "Assign tasks directly to field staff through the app. Admin users can dispatch jobs, track live progress, collect custom field data, capture inspection reports, and monitor payment status. Integration with CRM/ERP ensures real-time sync, eliminating duplicate entries and improving team efficiency.",
    ],
    itemsLabel: "Best suited for",
    items: [
      "FMCG delivery vans",
      "Logistics trucks",
      "Facility service cars",
      "Healthcare fleets",
      "Sales executive vehicles",
    ],
    listStyle: "chips",
  },
  benefits: { heading: "", paragraphs: [], order: [], items: {} },
  tools: {
    heading: "",
    paragraphs: [],
    order: [],
    items: {},
    cta: { label: "", href: "#task-manager" },
    image: "/software/modules/task-manager/task-manager.webp",
    imageAlt:
      "LOCATOR Task Manager dashboard showing assignments and task statuses",
    imageW: 1600,
    imageH: 863,
  },
  industries: {
    heading: "",
    paragraphs: [],
    order: [],
    items: {},
    image: "/industries/field-services/block-1.webp",
    imageAlt:
      "Field service technician preparing equipment for an assigned visit",
    imageW: 1672,
    imageH: 941,
  },
  whyChoose: {
    eyebrow: "Why LOCATOR",
    heading: "",
    paragraphs: [],
    order: [],
    items: {},
  },
  faq: { eyebrow: "FAQ", heading: "", categories: [], order: [], items: {} },
  finalCta: softwareCtaContent,
};
