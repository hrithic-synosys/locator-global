import type { CtaContent, CtaLink, ServiceFaqContent } from '../../page-schema';

// Global listing-page copy only. Industry detail pages keep their own content.
export type IndustriesHeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  imageAlt: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
};
export type IndustriesGridContent = {
  heading: string;
  description: string;
  items: Record<string, { name: string; description: string }>;
};

export const globalIndustries = {
  hero: {
    eyebrow: 'Industries We Serve',
    heading: 'Fleet Tracking Solutions for Every Industry',
    description: 'Every industry has different operational challenges. LOCATOR combines GPS tracking, fleet management, video telematics and IoT solutions to help businesses monitor vehicles, manage assets and coordinate field teams more effectively.',
    imageAlt: 'Connected commercial fleets across different industries',
    primaryCta: { label: 'Explore Our Solutions', href: '#industry-solutions' },
    secondaryCta: { label: 'Talk to Our Team', href: '/contact' },
  } satisfies IndustriesHeroContent,
  grid: {
    heading: 'Built for Every Fleet, in Every Industry',
    description: 'Discover how LOCATOR helps businesses improve fleet visibility, streamline daily operations and make informed decisions with connected tracking technology.',
    items: {
      'rental-leasing': { name: 'Rental & Leasing', description: 'Track rental vehicles and equipment, monitor usage, set geofence alerts and improve visibility across branches and customer locations.' },
      'transportation-logistics': { name: 'Transportation & Logistics', description: 'Monitor vehicle locations, review routes, manage driver activity and improve coordination across transport and delivery operations.' },
      'courier-last-mile-delivery': { name: 'Courier & Last-Mile Delivery', description: 'Track delivery vehicles, monitor task progress and give dispatch teams better visibility into daily delivery operations.' },
      construction: { name: 'Construction & Heavy Equipment', description: 'Monitor machinery and mobile equipment, review operating activity and improve asset visibility across construction sites.' },
      'field-services': { name: 'Field Services', description: 'Coordinate mobile teams, assign field tasks, monitor job progress and help managers organise daily service visits.' },
      'food-beverage': { name: 'Food & Beverage', description: 'Monitor distribution vehicles, improve delivery visibility and use compatible temperature sensors to help track temperature-sensitive goods.' },
    },
  } satisfies IndustriesGridContent,
  numbers: {
    heading: 'Fleet Intelligence at Scale',
    description: 'Help your business turn connected vehicle and asset data into useful operational insights.',
    // Reuse WhoWeAreNumbers figures, as confirmed by the site owner.
    showStats: true,
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    heading: 'Industries and fleet solutions',
    categories: [{ id: 'all', label: 'All questions' }],
    order: ['industries', 'vehicles', 'locations', 'video', 'delivery', 'equipment', 'iot', 'gcc'],
    items: {
      industries: { cat: 'all', q: 'Which industries does LOCATOR serve?', a: 'LOCATOR supports fleet and asset management use cases across transportation, logistics, rental and leasing, construction, field services, food distribution and other commercial operations.' },
      vehicles: { cat: 'all', q: 'Can LOCATOR support different types of vehicles?', a: 'Compatible tracking solutions can support cars, vans, trucks, buses and selected equipment or machinery. Device suitability depends on the vehicle and required features.' },
      locations: { cat: 'all', q: 'Can I monitor vehicles across multiple locations?', a: 'The platform can help businesses view supported vehicles and assets through a central dashboard, subject to device connectivity and configuration.' },
      video: { cat: 'all', q: 'Does LOCATOR offer video telematics?', a: 'Yes. LOCATOR offers video telematics solutions with compatible cameras and supported driver-monitoring features. Available capabilities depend on the selected hardware and configuration.' },
      delivery: { cat: 'all', q: 'Can LOCATOR help improve delivery operations?', a: 'GPS tracking, route history, geofence alerts and task management can help teams monitor journeys and coordinate delivery activities.' },
      equipment: { cat: 'all', q: 'Can LOCATOR monitor heavy equipment?', a: 'Compatible tracking devices can support selected construction machinery and other valuable equipment. Monitoring capabilities depend on the installed device.' },
      iot: { cat: 'all', q: 'Does LOCATOR provide IoT monitoring?', a: 'LOCATOR offers IoT solutions for compatible devices and sensors. Available data may include temperature, fuel levels and other supported measurements.' },
      // The brief's "The page can target businesses" is editorial guidance;
      // express it for visitors without claiming unconfirmed local availability.
      gcc: { cat: 'all', q: 'Which GCC countries can use LOCATOR solutions?', a: 'Businesses in the UAE, Saudi Arabia, Oman, Kuwait and Qatar should confirm local availability, installation, connectivity and support arrangements with the LOCATOR team.' },
    },
  } satisfies ServiceFaqContent,
  finalCta: {
    eyebrow: '',
    heading: 'Find the Right Fleet Solution for Your Industry',
    paragraphs: ['Every business has different tracking and operational needs. Tell us about your vehicles, assets and field teams, and explore the LOCATOR solutions that fit your requirements.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' },
    trustItems: [],
  } satisfies CtaContent,
};
