import type { IndustryDetailContent } from '../detail-schema';

export const globalRentalLeasing = {
  seo: {
    title: 'GPS Tracking for Rental Cars & Leasing Fleets | LOCATOR',
    description: 'Manage rental cars, leased vehicles and equipment with LOCATOR GPS tracking. Monitor locations, mileage, trips and unexpected movements.',
    keywords: ['GPS tracking for rental cars', 'Car rental GPS tracking', 'rental fleet management', 'vehicle tracking for leasing companies', 'rental vehicle tracking system', 'GPS tracking for rental equipment'],
  },
  hero: {
    eyebrow: 'Rental & Leasing Fleet Management',
    heading: 'GPS Tracking Solutions for Rental & Leasing Companies',
    description: 'Manage rental cars, commercial vehicles and equipment with greater visibility. LOCATOR helps rental and leasing businesses track asset locations, monitor usage, set movement alerts and manage fleets through one connected platform.',
    image: '/industries/rental-leasing/card.webp',
    imageAlt: 'Rental vehicles ready for collection',
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Demo', href: '/get-a-free-demo' },
  },
  blocks: [
    {
      subtitle: 'Track rental vehicles and equipment',
      title: 'Know Where Every Rental Asset Is',
      desc: ['From cars and vans to trucks, generators and heavy machinery, LOCATOR helps you monitor compatible rental assets across branches, customer locations and job sites.'],
      featuresLabel: '',
      features: ['Live GPS location and trip history', 'Vehicle and equipment usage monitoring', 'Geofence and movement alerts', 'Multi-branch fleet visibility', 'Mileage and engine-hour tracking where supported', 'Centralised asset status and reporting'],
      image: '/industries/rental-leasing/block-1.webp',
    },
    {
      subtitle: 'Reduce unauthorised use and rental risks',
      title: 'Protect Your Assets. Stay in Control.',
      desc: ['Get better visibility into how and where your rental assets are being used. Use configurable alerts and activity records to identify unexpected movement, review usage and support asset recovery when required.'],
      featuresLabel: '',
      features: ['Alerts for movement outside approved zones', 'Monitoring for after-hours activity', 'Better visibility into vehicle and equipment usage', 'Activity history to help investigate disputes', 'Remote immobilisation for compatible vehicles and devices, where legally permitted'],
      image: '/industries/rental-leasing/block-2.webp',
    },
  ],
  utilisation: {
    image: { src: '/showcase/desktop-dashboard.webp', alt: 'LOCATOR fleet dashboard with vehicle locations and activity information', width: 1598, height: 984 },
    eyebrow: 'Improve rental fleet utilisation',
    heading: 'Make Better Use of Every Vehicle and Asset',
    paragraphs: ['Monitor vehicle activity, mileage and equipment operating hours to understand how your fleet is being used. Use these insights to support maintenance planning, manage availability and make better decisions about asset allocation.'],
    order: ['availability', 'usage', 'maintenance'],
    items: {
      availability: { title: 'Fleet Availability', description: 'View asset locations and available status information to help coordinate vehicles across branches.', icon: 'monitor' },
      usage: { title: 'Usage & Operating Hours', description: 'Review mileage, engine hours and activity records where supported to understand equipment utilisation.', icon: 'cargo' },
      maintenance: { title: 'Maintenance Planning', description: 'Use available mileage, operating-hour data and service reminders to help plan maintenance and reduce avoidable downtime.', icon: 'cost' },
    },
  },
  applications: {
    image: { src: '/industries/transportation-logistics/hero.webp', alt: 'Commercial vehicles and trucks across a transport yard', width: 1254, height: 1254 },
    eyebrow: 'Industries and rental applications',
    heading: 'One Platform for Different Rental Businesses',
    paragraphs: ['LOCATOR supports rental and leasing operations managing different types of vehicles and equipment.'],
    order: ['cars', 'commercial', 'equipment', 'generators'],
    items: {
      cars: { title: 'Car Rental & Leasing', description: 'Monitor vehicle locations, review trip history and set alerts for configured movement zones.', icon: 'monitor' },
      commercial: { title: 'Commercial Vehicle Rental', description: 'Track vans, pickups and trucks used by business customers across different locations.', icon: 'cargo' },
      equipment: { title: 'Heavy Equipment Rental', description: 'Monitor compatible machinery, review operating hours and improve visibility across project sites.', icon: 'shield' },
      generators: { title: 'Generator & Equipment Leasing', description: 'Track suitable mobile assets and use supported movement and operating data to manage equipment deployment.', icon: 'cost' },
    },
  },
  whyChoose: {
    eyebrow: 'Why choose LOCATOR?',
    heading: 'More Visibility. Better Rental Fleet Management.',
    paragraphs: [],
    order: ['centralised', 'alerts', 'usage', 'protection', 'scale'],
    items: {
      centralised: { title: 'Centralised Monitoring', desc: 'View supported vehicles and equipment from one platform.', accent: '#1360ee', assetIndex: 0 },
      alerts: { title: 'Movement Alerts', desc: 'Configure geofences and alerts for selected asset movements.', accent: '#1360ee', assetIndex: 1 },
      usage: { title: 'Usage Insights', desc: 'Review mileage, engine hours and trip records where supported.', accent: '#1360ee', assetIndex: 2 },
      protection: { title: 'Asset Protection', desc: 'Improve awareness of unexpected activity and help investigate incidents.', accent: '#1360ee', assetIndex: 1 },
      scale: { title: 'Scalable Fleet Management', desc: 'Manage vehicles and equipment across multiple branches and customer sites.', accent: '#1360ee', assetIndex: 0 },
    },
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    heading: 'Rental and leasing fleet tracking',
    categories: [{ id: 'all', label: 'All questions' }],
    order: ['benefits', 'assets', 'geofence', 'usage', 'unauthorised', 'branches', 'gcc'],
    items: {
      benefits: { cat: 'all', q: 'How can GPS tracking help a rental company?', a: 'GPS tracking helps rental businesses monitor asset locations, review trip history, configure movement alerts and improve visibility into fleet usage.' },
      assets: { cat: 'all', q: 'Can LOCATOR track both rental cars and heavy equipment?', a: 'Compatible tracking devices can support passenger vehicles, commercial vehicles and selected machinery or equipment. The right device depends on the asset and monitoring requirements.' },
      geofence: { cat: 'all', q: 'Can I receive alerts if a rental vehicle leaves an approved area?', a: 'Geofence alerts can notify authorized users when a compatible tracked asset enters or leaves a configured area, subject to device connectivity and settings.' },
      usage: { cat: 'all', q: 'Can I monitor how much a rental vehicle or machine is used?', a: 'Available mileage, trip and engine-hour data can help you review usage. The information provided depends on the device and vehicle compatibility.' },
      unauthorised: { cat: 'all', q: 'Can LOCATOR help with unauthorized vehicle use?', a: 'Movement alerts, trip history and supported remote-control features can help identify and investigate unexpected use. Remote immobilisation should only be used on compatible vehicles and in accordance with applicable laws and agreements.' },
      branches: { cat: 'all', q: 'Can I manage rental assets across multiple branches?', a: 'The platform can provide centralised visibility of compatible connected assets across different locations, helping teams coordinate fleet operations.' },
      // Convert the brief's internal "content is intended" note to visitor copy.
      gcc: { cat: 'all', q: 'Is the solution suitable for rental companies in the GCC?', a: 'For rental businesses in the UAE, Saudi Arabia, Oman, Kuwait and Qatar, confirm device availability, connectivity, installation and support arrangements in each country before deployment.' },
    },
  },
  finalCta: {
    eyebrow: '',
    heading: 'Take Control of Your Rental Fleet',
    paragraphs: ['Whether you manage rental cars, commercial vehicles or heavy equipment, LOCATOR helps you monitor asset locations, understand usage and improve fleet visibility. Tell us about your rental operation to explore a suitable tracking solution.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' },
    trustItems: [],
  },
} satisfies IndustryDetailContent;
