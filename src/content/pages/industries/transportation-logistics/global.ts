import type { IndustryDetailContent } from '../detail-schema';

export const globalTransportationLogistics: IndustryDetailContent = {
  seo: {
    title: 'Transportation & Logistics Fleet Tracking | LOCATOR',
    description: 'Track transport and logistics vehicles with LOCATOR. Monitor live locations, review routes, manage fleet activity and coordinate deliveries.',
    keywords: ['Fleet tracking for transportation and logistics', 'Logistics fleet management', 'GPS tracking for trucks', 'transportation fleet tracking', 'vehicle tracking system', 'fleet telematics'],
  },
  hero: {
    eyebrow: 'Transportation & Logistics Fleet Solutions',
    heading: 'GPS Tracking & Fleet Management for Transportation and Logistics',
    description: 'Track vehicles, monitor routes and improve fleet visibility with LOCATOR. Help your transport and logistics team coordinate deliveries, review driver activity and manage daily operations through one connected platform.',
    image: '/industries/transportation-logistics/hero.webp',
    imageAlt: 'Transport trucks and commercial fleets at a logistics terminal',
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Demo', href: '/get-a-free-demo' },
  },
  blocks: [{
    subtitle: 'Real-time fleet visibility',
    title: 'Know Where Your Fleet Is. Stay Ahead of Delays.',
    desc: ['Monitor vehicle locations, trip history, stops and journey progress from a central dashboard. Give dispatch teams better visibility to coordinate transport operations and respond to unexpected delays.'],
    featuresLabel: '',
    features: ['Live GPS vehicle tracking', 'Trip history and route playback', 'Geofence and route-deviation alerts', 'Stop, parking and idle-time reports', 'Multi-vehicle and multi-branch monitoring', 'Journey information for delivery coordination'],
    image: '/industries/transportation-logistics/block-1.webp',
  }],
  sections: [
    {
      kind: 'showcase', id: 'transport-efficiency', reverse: true,
      content: {
        eyebrow: 'Improve fleet efficiency and control costs',
        heading: 'Reduce Waste. Improve Fleet Performance.',
        paragraphs: ['Understand how vehicles are used and identify opportunities to improve daily operations. LOCATOR helps fleet managers review driving patterns, idling, mileage and vehicle activity to support better operational decisions.'],
        image: { src: '/industries/transportation-logistics/operations-planning.webp', alt: 'Transport operations coordinator reviewing routes in a logistics dispatch office', width: 1536, height: 1024 },
        order: ['routes', 'drivers', 'maintenance', 'dispatch'],
        items: {
          routes: { title: 'Route & Trip Monitoring', description: 'Review routes, stops and journey history to identify delays and improve transport planning.', icon: 'monitor' },
          drivers: { title: 'Driver Behaviour Monitoring', description: 'Review speeding, harsh braking and excessive idling where supported to encourage responsible driving.', icon: 'shield' },
          maintenance: { title: 'Vehicle Maintenance', description: 'Use service reminders and available mileage data to plan maintenance and help reduce unexpected downtime.', icon: 'cost' },
          dispatch: { title: 'Better Dispatch Coordination', description: 'Give operations teams access to fleet activity and journey information to support day-to-day decisions.', icon: 'cargo' },
        },
      },
    },
    {
      kind: 'showcase', id: 'transport-sectors',
      content: {
        eyebrow: 'Industries we support',
        heading: 'Supporting Transportation Across Different Sectors',
        paragraphs: [],
        image: { src: '/industries/transportation-logistics/transport-sectors.webp', alt: 'Freight, refrigerated transport and delivery vehicles at a logistics terminal', width: 1536, height: 1024 },
        order: ['freight', 'distribution', 'temperature', 'passenger'],
        items: {
          freight: { title: 'Freight & Cargo Transport', description: 'Monitor truck locations, review journey history and improve visibility across freight operations.', icon: 'cargo' },
          distribution: { title: 'Distribution & Delivery Fleets', description: 'Coordinate vehicle movements, monitor stops and support delivery planning across service areas.', icon: 'monitor' },
          temperature: { title: 'Temperature-Controlled Transport', description: 'Use compatible temperature sensors to monitor selected conditions during transportation.', icon: 'shield' },
          passenger: { title: 'Passenger & Commercial Transport', description: 'Improve vehicle visibility and review fleet activity with suitable GPS tracking solutions.', icon: 'monitor' },
        },
      },
    },
    {
      kind: 'cards', id: 'transport-solutions',
      content: {
        eyebrow: 'Transport and logistics solutions',
        heading: 'Connected Tools for Every Stage of Transport',
        paragraphs: ['Bring vehicle tracking, driver monitoring and fleet operations together with solutions designed around your business needs.'],
        order: ['gps', 'fleet', 'video', 'tasks', 'iot', 'maintenance'],
        items: {
          gps: { title: 'GPS Vehicle Tracking', description: 'Monitor locations, trips and vehicle activity.', icon: 'monitor' },
          fleet: { title: 'Fleet Telematics', description: 'Review driving patterns, mileage and available vehicle data.', icon: 'cargo' },
          video: { title: 'Video Telematics', description: 'Use compatible cameras to review driving events and available footage.', icon: 'camera' },
          tasks: { title: 'Task Manager', description: 'Assign jobs to field staff and monitor task progress.', icon: 'shield' },
          iot: { title: 'Smart IoT & Asset Tracking', description: 'Track compatible trailers, containers and other valuable assets.', icon: 'cargo' },
          maintenance: { title: 'Fleet Maintenance', description: 'Manage service reminders and monitor available vehicle maintenance information.', icon: 'cost' },
        },
      },
    },
  ],
  whyChoose: {
    eyebrow: 'Why choose LOCATOR?', heading: 'More Visibility for Every Journey', paragraphs: [],
    order: ['monitoring', 'insights', 'safety', 'assets', 'workflows', 'flexible'],
    items: {
      monitoring: { title: 'Centralised Fleet Monitoring', desc: 'View connected vehicles through one platform.', accent: '#1360ee', assetIndex: 0 },
      insights: { title: 'Operational Insights', desc: 'Use available reports to understand vehicle and driver activity.', accent: '#1360ee', assetIndex: 2 },
      safety: { title: 'Driver Safety Support', desc: 'Review driving events and compatible camera alerts.', accent: '#1360ee', assetIndex: 1 },
      assets: { title: 'Asset Visibility', desc: 'Track compatible trailers, containers and equipment.', accent: '#1360ee', assetIndex: 0 },
      workflows: { title: 'Connected Workflows', desc: 'Explore integrations with compatible business systems.', accent: '#1360ee', assetIndex: 2 },
      flexible: { title: 'Flexible Fleet Solutions', desc: 'Select suitable devices and features for your operation.', accent: '#1360ee', assetIndex: 1 },
    },
  },
  faq: {
    eyebrow: 'Frequently asked questions', heading: 'Transportation and logistics fleet tracking',
    categories: [{ id: 'all', label: 'All questions' }],
    order: ['tracking', 'trucks', 'fuel', 'drivers', 'assets', 'maintenance', 'integrations', 'countries'],
    items: {
      tracking: { cat: 'all', q: 'How does GPS tracking help transportation and logistics companies?', a: 'GPS tracking helps businesses monitor vehicle locations, review routes, understand trip activity and coordinate transport operations more effectively.' },
      trucks: { cat: 'all', q: 'Can I monitor multiple trucks from one dashboard?', a: 'Yes. LOCATOR provides centralised monitoring for connected vehicles, helping fleet teams review locations and available activity across their fleet.' },
      fuel: { cat: 'all', q: 'Can GPS tracking help reduce fuel costs?', a: 'Tracking and telematics reports can help identify excessive idling, inefficient driving patterns and other areas for operational improvement. Actual savings depend on fleet conditions and how the data is used.' },
      drivers: { cat: 'all', q: 'Can I monitor driver behaviour?', a: 'Supported tracking devices and telematics systems can record selected events such as speeding, harsh braking and excessive idling. Compatible AI cameras may provide additional driver-monitoring features.' },
      assets: { cat: 'all', q: 'Can LOCATOR track trailers and containers?', a: 'Suitable GPS asset-tracking devices can support compatible trailers, containers and other mobile assets. Device selection depends on the asset and its monitoring requirements.' },
      maintenance: { cat: 'all', q: 'Does LOCATOR support fleet maintenance?', a: 'Available mileage data and service reminders can help fleet managers organise maintenance schedules and monitor upcoming service requirements.' },
      integrations: { cat: 'all', q: 'Can LOCATOR integrate with logistics or ERP software?', a: 'Integration may be possible with compatible ERP, CRM, dispatch and logistics systems. Contact the team to confirm your specific integration requirements.' },
      // Express targeting guidance as visitor copy; do not claim availability.
      countries: { cat: 'all', q: 'Which countries does this solution target?', a: 'This solution is intended for transportation and logistics businesses in the UAE, Saudi Arabia, Oman, Kuwait and Qatar, excluding Bahrain. Confirm country-specific availability, connectivity, installation and support before deployment.' },
    },
  },
  finalCta: {
    eyebrow: '', heading: 'Take Control of Your Transportation Fleet',
    paragraphs: ['Improve vehicle visibility, coordinate transport operations and make informed fleet decisions with LOCATOR. Tell us about your vehicles, routes and operational requirements to explore a suitable solution.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' },
    trustItems: [],
  },
};
