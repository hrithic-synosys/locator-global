import type { SmartIotContent } from './schema';

export const globalSmartIot: SmartIotContent = {
  seo: {
    title: 'Smart IoT & Asset Tracking Solutions | LocatorGlobal',
    description: 'Track vehicles, equipment and business assets with GPS tracking and IoT sensors. Explore smart asset monitoring solutions across the GCC.',
    keywords: ['Smart IoT Solutions', 'GPS Asset Tracking', 'IoT Asset Tracking', 'Industrial IoT Solutions', 'Equipment Tracking', 'IoT Sensors', 'GPS Asset Monitoring'],
  },
  hero: {
    eyebrow: 'Smart IoT & Asset Intelligence',
    heading: 'Smart IoT & GPS Asset Tracking Solutions',
    description: 'Get real-time visibility into vehicles, equipment, machinery and business assets with connected GPS tracking and IoT technology. Monitor asset locations, track equipment usage and use sensor data to improve operational control across the GCC.',
    primaryCta: { label: 'Get a Free Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Request a Demo', href: '/get-a-free-demo' },
  },
  blocks: [
    {
      id: 'gps-asset-tracking', eyebrow: 'GPS Asset Tracking', title: 'GPS Asset Tracking',
      body: 'Keep track of valuable business assets with GPS tracking and IoT monitoring. Monitor shipping containers, refrigerated trailers, rental equipment, boats and other mobile assets. Use live location updates, movement history and geofence alerts to improve asset visibility, reduce loss and coordinate operations across the GCC.',
      image: '/services/smart-iot/gps-asset-tracking.webp', imageW: 1672, imageH: 941,
    },
    {
      id: 'equipment-machinery', eyebrow: 'Equipment & Heavy Machinery Monitoring', title: 'Equipment & Heavy Machinery Monitoring',
      body: 'Monitor construction machinery and industrial equipment across project sites with GPS and IoT telematics. Track equipment location, review usage and idle time, and receive maintenance alerts where supported. Improve equipment utilisation, reduce avoidable downtime and maintain better control of machinery across your operations.',
      image: '/services/smart-iot/equipment-machinery.webp', imageW: 1672, imageH: 941,
    },
    {
      id: 'iot-sensors', eyebrow: 'IoT Sensors & Telemetry Projects', title: 'IoT Sensors & Telemetry Projects',
      body: 'Connect business assets with IoT sensors to monitor important operating conditions. Track temperature, fuel and liquid levels, door status, vibration, tilt and generator activity using compatible sensors. Turn collected data into useful alerts and reports to support faster decisions and more efficient operations across the GCC.',
      image: '/services/smart-iot/iot-sensors.webp', imageW: 1619, imageH: 972,
    },
  ],
  features: {
    eyebrow: 'One Connected Platform', heading: 'Intelligence That Connects Every Asset',
    description: 'Bring vehicle, equipment and sensor information together through one connected platform. Access useful asset insights, monitor activity and make informed operational decisions.',
    items: [
      { title: 'Centralised Asset Intelligence Dashboard', desc: 'View asset locations, equipment activity and IoT sensor information through a centralised dashboard.' },
      { title: 'Enterprise CRM/ERP Integration', desc: 'Connect supported fleet and IoT data with your existing business systems to improve information sharing and operational workflows.' },
      { title: 'Geofence & POI Smart Alerts', desc: 'Create virtual boundaries around important locations and receive alerts when tracked assets enter or leave selected zones.' },
      { title: 'Predictive Maintenance & Service Automation', desc: 'Use equipment usage data and configured service reminders to plan maintenance, identify potential issues and reduce avoidable downtime.' },
    ],
  },
  faq: [
    { q: 'What is GPS Asset Tracking in IoT?', a: 'GPS asset tracking uses connected tracking devices and IoT technology to monitor the location, movement and, where supported, status of assets such as machinery, containers, vehicles and equipment.' },
    { q: 'Can GPS trackers monitor fixed assets like tanks or containers?', a: 'Yes. Suitable GPS devices and IoT sensors can monitor selected fixed or mobile assets, including tanks and containers. The right solution depends on the asset, installation requirements and connectivity.' },
    { q: 'What heavy equipment can be tracked using telematics?', a: 'Depending on device compatibility, equipment such as forklifts, generators, cranes, excavators, bulldozers and loaders can be monitored using GPS tracking and industrial IoT telematics.' },
    { q: 'How does heavy machinery monitoring improve operations?', a: 'Equipment monitoring helps businesses understand asset location, usage and idle time. This information can support better equipment utilisation, maintenance planning and site coordination.' },
    { q: 'What types of IoT sensors are commonly used in business operations?', a: 'Common sensor applications include temperature, vibration, tilt, fuel or liquid level, door status, voltage and machine-load monitoring. The available options depend on the selected hardware and project requirements.' },
    { q: 'How does IoT telemetry help businesses make smarter decisions?', a: 'IoT telemetry collects information from connected devices and sensors, turning it into reports and alerts. Businesses can use these insights to improve monitoring, maintenance planning, safety and operational control.' },
    { q: 'Can IoT sensor alerts be received in real time?', a: 'Yes. Compatible devices can send alerts when configured conditions or thresholds are triggered. Alert availability depends on the sensor, device, network connection and platform configuration.' },
    { q: 'What are the benefits of GPS and IoT asset monitoring for GCC businesses?', a: 'GPS and IoT monitoring can help businesses improve asset visibility, reduce the risk of asset loss, monitor equipment usage, identify unusual activity and coordinate field operations more effectively.' },
    { q: 'Are GPS and IoT tracking solutions suitable for GCC operating conditions?', a: 'Device suitability depends on its environmental rating, installation and network compatibility. Our team can help identify suitable tracking hardware for the operating conditions and locations of your assets.' },
    { q: 'How does LOCATOR combine fleet and IoT asset monitoring?', a: 'LOCATOR brings compatible GPS tracking devices, IoT sensors, geofence alerts and asset information together through a centralised platform, helping businesses monitor vehicles and equipment in one place.' },
  ],
  finalCta: {
    eyebrow: 'Get Started Today', heading: 'Put Your Assets on One Connected Platform',
    paragraphs: ['Improve asset visibility with GPS tracking, IoT sensors and connected monitoring solutions. Talk to LOCATOR about managing your vehicles, equipment and business assets across the GCC.'],
    primaryCta: { label: 'Get a Quote', href: '/get-a-quote' },
    secondaryCta: { label: 'Book a Live Demo', href: '/get-a-free-demo' },
    trustItems: ['No long-term contract options', 'Setup support and onboarding', 'Dedicated support team'],
  },
};
