import type { IndustryDetailContent } from '../detail-schema';

export const globalConstruction: IndustryDetailContent = {
  seo: {
    title: 'Construction Equipment GPS Tracking | LOCATOR',
    description: 'Track construction vehicles, heavy machinery and equipment with LOCATOR GPS tracking. Monitor locations, idle time and equipment usage.',
    keywords: ['GPS tracking for construction equipment', 'Construction fleet management', 'heavy equipment tracking', 'GPS tracking for excavators', 'machinery tracking system', 'construction vehicle tracking'],
  },
  hero: {
    eyebrow: 'Construction', heading: 'GPS Tracking & Fleet Management for Construction',
    description: 'Gain real-time visibility of construction vehicles, heavy machinery and valuable equipment with LOCATOR. Monitor asset locations, site movements and equipment usage to improve operational control across your construction projects.',
    image: '/industries/construction/hero.webp', imageAlt: 'Construction vehicles and heavy equipment at a project site',
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' }, secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' },
  },
  blocks: [{
    subtitle: 'Real-Time Visibility of Vehicles & Machinery', title: 'Know Where Your Construction Assets Are',
    desc: ['Managing multiple construction sites, vehicles and machines can be challenging. LOCATOR helps you monitor your fleet and connected assets from one centralized platform, giving your team better visibility of equipment movements and usage.'],
    featuresLabel: 'Key Features',
    features: [
      'Live GPS Tracking: Monitor the locations of supported vehicles and GPS-enabled assets.',
      'Site Entry & Exit Alerts: Set up geofences around construction sites and receive alerts when tracked assets enter or leave.',
      'Equipment Usage Monitoring: Review operating hours, movement and idle time where supported by the installed device.',
      'Unauthorized Movement Alerts: Receive alerts for unexpected vehicle or asset movement when configured.',
      'Multi-Site Monitoring: View tracked assets operating across different project locations.',
      'Trip History & Reports: Review vehicle movements and activity to support operational planning.',
    ],
    image: '/industries/construction/block-1.webp',
  }],
  sections: [
    {
      kind: 'showcase', id: 'construction-efficiency', reverse: true,
      content: {
        eyebrow: 'Improve Construction Fleet Efficiency', heading: 'Reduce Downtime and Improve Equipment Utilization',
        paragraphs: ['Unplanned equipment downtime, unnecessary idling and poor asset visibility can affect construction schedules and operating costs. LOCATOR provides fleet and asset data to help managers make informed decisions about equipment use, maintenance and resource allocation.'],
        image: { src: '/industries/construction/equipment-coordination.webp', alt: 'Site supervisor reviewing equipment activity with construction machinery nearby', width: 1536, height: 1024 },
        order: ['utilization', 'fuel', 'maintenance', 'reporting'],
        items: {
          utilization: { title: 'Equipment Utilization', description: 'Understand where tracked machinery is located and review its usage patterns to identify underused or idle assets.', icon: 'cargo' },
          fuel: { title: 'Fuel & Idle-Time Monitoring', description: 'Monitor supported fuel data and vehicle idle time to help identify potential inefficiencies and investigate unusual consumption.', icon: 'cost' },
          maintenance: { title: 'Maintenance Planning', description: 'Use service schedules, reminders and available engine-hour data to help plan preventive maintenance and reduce avoidable downtime.', icon: 'shield' },
          reporting: { title: 'Fleet & Project Reporting', description: 'Review trip history, movement and activity reports to support resource planning and day-to-day site operations.', icon: 'monitor' },
        },
      },
    },
    {
      kind: 'showcase', id: 'construction-solutions',
      content: {
        eyebrow: 'Construction Fleet Tracking Solutions', heading: 'Connected Solutions for Construction Operations',
        paragraphs: ['LOCATOR brings GPS tracking, fleet telematics and asset-monitoring capabilities together to help construction businesses manage their mobile operations.'],
        image: { src: '/industries/construction/block-2.webp', alt: 'Construction equipment and commercial vehicles supporting site operations', width: 1536, height: 1024 },
        order: ['vehicles', 'machinery', 'assets', 'telematics'],
        items: {
          vehicles: { title: 'Construction Vehicle Tracking', description: 'Track dump trucks, pickups, service vehicles and other fleet vehicles. Review locations, trips and movement history to support better fleet coordination.', icon: 'monitor' },
          machinery: { title: 'Heavy Machinery & Equipment Monitoring', description: 'Monitor compatible machinery and equipment using suitable GPS devices or IoT solutions, depending on the asset and required data.', icon: 'cargo' },
          assets: { title: 'Asset Tracking & Geofencing', description: 'Monitor the location and movement of supported assets and configure site boundaries to help identify unexpected movement.', icon: 'shield' },
          telematics: { title: 'Fleet Telematics & Driver Visibility', description: 'Use available vehicle data and compatible video telematics solutions to support driver oversight and safer fleet operations.', icon: 'camera' },
        },
      },
    },
    {
      kind: 'cards', id: 'construction-operations',
      content: {
        eyebrow: 'Who Can Benefit?', heading: 'Construction Tracking Solutions for Different Operations', paragraphs: [],
        order: ['building', 'roads', 'rental', 'quarry', 'generators', 'projects'],
        items: {
          building: { title: 'Building & Infrastructure Contractors', description: 'Monitor construction vehicles and equipment supporting projects across multiple sites.', icon: 'cargo' },
          roads: { title: 'Road & Civil Engineering Companies', description: 'Review vehicle movements and coordinate fleets working across project areas.', icon: 'monitor' },
          rental: { title: 'Heavy Equipment Rental Companies', description: 'Improve visibility of machinery deployed at customer locations.', icon: 'cargo' },
          quarry: { title: 'Quarry & Earthmoving Operations', description: 'Monitor compatible heavy vehicles and review usage activity.', icon: 'shield' },
          generators: { title: 'Equipment & Generator Fleets', description: 'Track supported mobile assets and review their location and movement.', icon: 'cost' },
          projects: { title: 'Large Construction Projects', description: 'Centralize fleet visibility to support coordination between site teams and operations managers.', icon: 'monitor' },
        },
      },
    },
  ],
  whyChoose: {
    eyebrow: 'Why Choose LOCATOR?', heading: 'Smarter Fleet Visibility for Construction Businesses',
    paragraphs: ['LOCATOR helps construction businesses connect vehicle tracking, telematics and asset monitoring within a centralized platform.'],
    order: ['monitoring', 'visibility', 'decisions', 'alerts', 'scale', 'support'],
    items: {
      monitoring: { title: 'Centralized Monitoring', desc: 'View tracked vehicles and compatible assets from one platform.', accent: '#1360ee', assetIndex: 0 },
      visibility: { title: 'Better Asset Visibility', desc: 'Understand where equipment is located and review movement history.', accent: '#1360ee', assetIndex: 2 },
      decisions: { title: 'Informed Decisions', desc: 'Use available reports to support utilization, maintenance and operational planning.', accent: '#1360ee', assetIndex: 0 },
      alerts: { title: 'Configurable Alerts', desc: 'Set geofences and movement alerts according to operational requirements.', accent: '#1360ee', assetIndex: 1 },
      scale: { title: 'Scalable Solutions', desc: 'Select suitable tracking devices and monitoring features based on fleet size and asset type.', accent: '#1360ee', assetIndex: 0 },
      support: { title: 'Local UAE Support', desc: 'Access LOCATOR’s UAE operations for consultation, installation and support.', accent: '#1360ee', assetIndex: 2 },
    },
  },
  faq: {
    eyebrow: 'Frequently Asked Questions', heading: 'Construction GPS Tracking FAQs', categories: [{ id: 'all', label: 'All questions' }],
    order: ['tracking', 'machinery', 'sites', 'movement', 'usage', 'maintenance', 'uae', 'integration'],
    items: {
      tracking: { cat: 'all', q: 'What is GPS tracking for construction equipment?', a: 'Construction GPS tracking uses GPS-enabled devices and software to monitor the location and movement of vehicles, machinery and compatible equipment. Depending on the device, additional information such as operating hours or engine data may also be available.' },
      machinery: { cat: 'all', q: 'Can LOCATOR track excavators, bulldozers and cranes?', a: 'LOCATOR can support suitable tracking solutions for compatible heavy machinery. The appropriate device and available data depend on the machine type, installation requirements and monitoring objectives.' },
      sites: { cat: 'all', q: 'Can I monitor equipment across multiple construction sites?', a: 'Yes. You can view tracked assets from a centralized platform and configure geofences for supported site locations, subject to your system configuration.' },
      movement: { cat: 'all', q: 'Can LOCATOR help prevent unauthorized equipment movement?', a: 'Configured movement alerts and geofences can help identify unexpected activity. GPS tracking supports monitoring but does not, by itself, guarantee theft prevention or asset recovery.' },
      usage: { cat: 'all', q: 'Can I monitor equipment operating hours and idle time?', a: 'Operating-hour and idle-time monitoring may be available depending on the installed device and the data supported by the vehicle or machine.' },
      maintenance: { cat: 'all', q: 'Does LOCATOR support maintenance planning?', a: 'LOCATOR’s fleet management capabilities include service scheduling and reminders. Equipment-specific maintenance planning depends on the available operating data and system configuration.' },
      uae: { cat: 'all', q: 'Is LOCATOR suitable for construction fleets in the UAE?', a: 'LOCATOR provides fleet tracking and telematics services in the UAE. Contact the team to discuss your fleet, equipment types, project locations and installation requirements.' },
      integration: { cat: 'all', q: 'Can LOCATOR integrate with construction or ERP software?', a: 'Integration may be possible depending on the third-party platform, available interfaces and project requirements. Contact LOCATOR to confirm compatibility before committing to an integration.' },
    },
  },
  finalCta: {
    eyebrow: '', heading: 'Take Control of Your Construction Fleet',
    paragraphs: ['Improve visibility of construction vehicles, machinery and equipment with LOCATOR GPS tracking and telematics solutions. Get in touch to find the right setup for your projects.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' }, secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' }, trustItems: [],
  },
};
