import type { IndustryBlock } from '@/components/industries/industries-data';
import type { CardSection, CtaContent, ServiceFaqContent, ServiceWhyChooseContent } from '../../page-schema';
import type { IndustriesHeroContent } from './global';
import type { ShowcaseImage } from '@/components/service/ServiceFleetShowcase';

export type IndustryShowcaseContent = CardSection & { eyebrow: string; image: ShowcaseImage };
export type IndustryDetailSection =
  | { kind: 'showcase'; id: string; content: IndustryShowcaseContent; reverse?: boolean }
  | { kind: 'cards' | 'solutions' | 'directory'; id: string; content: CardSection & { eyebrow: string } };

export type IndustryDetailContent = {
  seo: { title: string; description: string; keywords: string[] };
  hero: IndustriesHeroContent & { image: string };
  blocks: Array<IndustryBlock & { image?: string; imagePosition?: string }>;
  utilisation?: IndustryShowcaseContent;
  applications?: IndustryShowcaseContent;
  sections?: IndustryDetailSection[];
  whyChoose: ServiceWhyChooseContent;
  faq: ServiceFaqContent;
  finalCta: CtaContent;
};
