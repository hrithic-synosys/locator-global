import { marketMetadata } from '@/lib/country/metadata';
import type { CountryCode } from '@/config/countries';
import type { Metadata } from 'next'
import ScrollReveal from '@/components/software/ScrollReveal'
import TaskManagerHero from '@/components/service/task-manager/TaskManagerHero'
import ServiceTaskManager from '@/components/service/ServiceTaskManager'
import ServiceModuleTabs from '@/components/service/ServiceModuleTabs'
import Footer from '@/components/layouts/Footer'

const pageMetadata: Metadata = {
  title: 'Task Manager — Service',
  description:
    'Assign, track, and complete field jobs in real time with Locator Task Manager — dispatch jobs, collect field data, and sync with your CRM/ERP.',
  alternates: { canonical: '/service/task-manager' },
}

export default function TaskManagerPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollReveal />
      <TaskManagerHero />
      <ServiceTaskManager />
      <ServiceModuleTabs active="task-manager" />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ market: CountryCode }> }): Promise<Metadata> {
  const { market } = await params;
  return marketMetadata(pageMetadata, market, "/service/task-manager");
}
