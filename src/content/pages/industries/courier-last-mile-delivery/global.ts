import type { IndustryDetailContent } from '../detail-schema';

export const globalCourierDelivery: IndustryDetailContent = {
  seo: {
    title: 'Courier & Last-Mile Delivery Tracking | LOCATOR',
    description: 'Track delivery vehicles, review routes and coordinate drivers with LOCATOR GPS tracking and fleet management solutions for courier businesses.',
    keywords: ['GPS tracking for courier services', 'Last-mile delivery tracking', 'courier fleet management', 'delivery vehicle tracking', 'GPS tracking for delivery vans', 'fleet tracking software'],
  },
  hero: {
    eyebrow: 'Courier & Last-Mile Delivery Solutions',
    heading: 'GPS Tracking & Fleet Management for Courier and Last-Mile Delivery',
    description: 'Manage delivery vehicles, coordinate drivers and track daily operations with LOCATOR. Get better visibility into delivery routes, vehicle activity and job progress through one connected fleet management platform.',
    image: '/industries/courier-last-mile-delivery/hero.webp',
    imageAlt: 'Courier and delivery vehicles at a distribution facility',
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Demo', href: '/get-a-free-demo' },
  },
  blocks: [{
    subtitle: 'Real-time delivery fleet visibility',
    title: 'Track Every Vehicle. Stay on Top of Every Delivery.',
    desc: ['Monitor courier vans, motorcycles and delivery vehicles from a central dashboard. Review routes, stops and journey history to help dispatch teams coordinate deliveries and respond to delays.'],
    featuresLabel: '',
    features: ['Live GPS vehicle tracking', 'Route history and trip playback', 'Geofence and movement alerts', 'Stop and idle-time monitoring', 'Multi-vehicle fleet visibility', 'Delivery task status updates through supported workflows'],
    image: '/industries/courier-last-mile-delivery/block-1.png',
  }],
  sections: [
    {
      kind: 'showcase', id: 'courier-efficiency', reverse: true,
      content: {
        eyebrow: 'Improve delivery efficiency', heading: 'Faster Operations. Smarter Delivery Management.',
        paragraphs: ['Give your dispatch team the information they need to coordinate drivers, manage delivery schedules and review fleet performance.'],
        image: { src: '/industries/courier-last-mile-delivery/dispatch-coordination.webp', alt: 'Courier dispatcher reviewing delivery routes with vehicles at the depot', width: 1536, height: 1024 },
        order: ['routes', 'coordination', 'drivers', 'reports'],
        items: {
          routes: { title: 'Route & Trip Monitoring', description: 'Review vehicle routes, stops and journey history to identify delays and improve delivery planning.', icon: 'monitor' },
          coordination: { title: 'Delivery Coordination', description: 'Help dispatchers coordinate delivery assignments and monitor task progress through supported workflows.', icon: 'cargo' },
          drivers: { title: 'Driver Performance', description: 'Review available driving data, including speeding, harsh braking and excessive idling, to support better driving practices.', icon: 'shield' },
          reports: { title: 'Fleet Performance Reports', description: 'Use trip records and available reports to understand fleet activity and identify operational improvements.', icon: 'cost' },
        },
      },
    },
    {
      kind: 'showcase', id: 'courier-businesses',
      content: {
        eyebrow: 'Solutions for different delivery businesses', heading: 'Built for Your Delivery Operations', paragraphs: [],
        image: { src: '/industries/courier-last-mile-delivery/block-2.png', alt: 'Delivery van and loading area for daily courier operations', width: 1536, height: 1024 },
        order: ['courier', 'retail', 'food', 'b2b'],
        items: {
          courier: { title: 'Courier & Parcel Delivery', description: 'Track delivery vehicles, review journey history and coordinate daily delivery activity.', icon: 'cargo' },
          retail: { title: 'E-commerce & Retail Delivery', description: 'Improve fleet visibility and help dispatch teams manage delivery schedules and vehicle movements.', icon: 'monitor' },
          food: { title: 'Food & Grocery Delivery', description: 'Monitor delivery vehicles and support dispatch coordination for time-sensitive orders.', icon: 'cost' },
          b2b: { title: 'Business-to-Business Distribution', description: 'Track delivery fleets and review route and stop activity across customer and business locations.', icon: 'cargo' },
        },
      },
    },
    {
      kind: 'cards', id: 'courier-workflow',
      content: {
        eyebrow: 'Simplify last-mile delivery operations', heading: 'Connect Your Delivery Workflow',
        paragraphs: ['LOCATOR combines fleet tracking with compatible task management and telematics tools to help delivery businesses coordinate daily operations.'],
        order: ['gps', 'tasks', 'proof', 'geofence', 'video', 'integration'],
        items: {
          gps: { title: 'GPS Tracking', description: 'Monitor vehicle locations and delivery journeys.', icon: 'monitor' },
          tasks: { title: 'Task Management', description: 'Assign jobs and review task status through supported workflows.', icon: 'cargo' },
          proof: { title: 'Proof of Delivery', description: 'Collect available photos, signatures and delivery notes where supported.', icon: 'shield' },
          geofence: { title: 'Geofence Alerts', description: 'Receive alerts for configured vehicle entry and exit events.', icon: 'monitor' },
          video: { title: 'Video Telematics', description: 'Review available footage and supported driver-monitoring alerts.', icon: 'camera' },
          integration: { title: 'System Integration', description: 'Explore compatible integrations with delivery, CRM and ERP platforms.', icon: 'cargo' },
        },
      },
    },
  ],
  whyChoose: {
    eyebrow: 'Why choose LOCATOR?', heading: 'Better Visibility for Every Delivery', paragraphs: [],
    order: ['monitoring', 'coordination', 'drivers', 'reporting', 'connected'],
    items: {
      monitoring: { title: 'Centralised Monitoring', desc: 'View connected delivery vehicles from one platform.', accent: '#1360ee', assetIndex: 0 },
      coordination: { title: 'Improved Coordination', desc: 'Help dispatch teams monitor vehicle activity and task progress.', accent: '#1360ee', assetIndex: 2 },
      drivers: { title: 'Driver Insights', desc: 'Review available telematics data to support safer driving practices.', accent: '#1360ee', assetIndex: 1 },
      reporting: { title: 'Operational Reporting', desc: 'Use trip history and fleet reports to identify areas for improvement.', accent: '#1360ee', assetIndex: 0 },
      connected: { title: 'Connected Solutions', desc: 'Explore compatible GPS tracking, task management and video telematics tools.', accent: '#1360ee', assetIndex: 2 },
    },
  },
  faq: {
    eyebrow: 'Frequently asked questions', heading: 'Courier and last-mile delivery tracking', categories: [{ id: 'all', label: 'All questions' }],
    order: ['tracking', 'vehicles', 'progress', 'routes', 'mobile', 'proof', 'integration', 'countries'],
    items: {
      tracking: { cat: 'all', q: 'How can GPS tracking help courier companies?', a: 'GPS tracking helps courier businesses monitor vehicle locations, review routes, understand journey activity and coordinate delivery operations.' },
      vehicles: { cat: 'all', q: 'Can I track delivery bikes, vans and trucks?', a: 'Compatible GPS devices can support different vehicle types, including motorcycles, vans and commercial trucks. Device selection depends on the vehicle and required features.' },
      progress: { cat: 'all', q: 'Can I monitor delivery progress in real time?', a: 'You can monitor vehicle movements and use supported task-management workflows to review delivery status. Actual delivery progress depends on the available system integration and staff updates.' },
      routes: { cat: 'all', q: 'Can LOCATOR help improve delivery routes?', a: 'Route history, trip information and fleet activity reports can help teams review routes and identify opportunities to improve delivery planning. Automated route optimisation should be confirmed for your selected solution.' },
      mobile: { cat: 'all', q: 'Can drivers receive delivery tasks on a mobile app?', a: 'Supported mobile workflows allow field staff to receive assigned tasks and update job status. Available features depend on the configured platform.' },
      proof: { cat: 'all', q: 'Can I collect proof of delivery?', a: 'Supported workflows may allow drivers to submit photos, signatures and delivery notes. Confirm the available proof-of-delivery features before deployment.' },
      integration: { cat: 'all', q: 'Can LOCATOR integrate with our delivery software?', a: 'Integration may be possible with compatible delivery, CRM and ERP systems. Share your current software details with the LOCATOR team to confirm compatibility.' },
      // Convert internal page-targeting language to visitor-facing copy.
      countries: { cat: 'all', q: 'Which countries does this solution target?', a: 'This solution is intended for courier and delivery businesses in the UAE, Saudi Arabia, Oman, Kuwait and Qatar, excluding Bahrain. Confirm local service availability, connectivity and support arrangements before deployment.' },
    },
  },
  finalCta: {
    eyebrow: '', heading: 'Make Every Delivery More Visible',
    paragraphs: ['Improve delivery fleet visibility, coordinate drivers and manage daily operations with LOCATOR. Tell us about your delivery fleet and workflow to explore a suitable tracking solution.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' }, secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' }, trustItems: [],
  },
};
