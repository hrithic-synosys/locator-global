import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/software/ScrollReveal'
import DeviceDetail from '@/components/service/tracking-devices/DeviceDetail'
import Footer from '@/components/layouts/Footer'
import { DEVICES, getDevice } from '@/components/service/tracking-devices/devices-data'

export function generateStaticParams() {
  return DEVICES.map((d) => ({ slug: d.slug }))
}

async function getPageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const device = getDevice(slug)
  if (!device) return {}

  return {
    title: `${device.name} — Tracking Devices`,
    description: device.tagline,
    alternates: { canonical: `/service/tracking-devices/${device.slug}` },
    openGraph: {
      title: `${device.name} | Locator`,
      description: device.tagline,
      url: `/service/tracking-devices/${device.slug}`,
      type: 'website',
    },
  }
}

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const device = getDevice(slug)
  if (!device) notFound()

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <DeviceDetail device={device} />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode; slug: string }> }): Promise<Metadata> {
  const { market, slug } = await params;
  return marketMetadata(await getPageMetadata({ params }), market, `/service/tracking-devices/${slug}`);
}
