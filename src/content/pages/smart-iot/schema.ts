import type { CtaContent, CtaLink } from '../../page-schema';

export type SmartIotHeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
};
export type SmartIotBlock = {
  id: string; eyebrow: string; title: string; body: string;
  image: string; imageW: number; imageH: number;
};
export type SmartIotFeaturesContent = {
  eyebrow: string; heading: string; description: string;
  items: Array<{ title: string; desc: string }>;
};
export type SmartIotFaq = { q: string; a: string };
export type SmartIotContent = {
  seo: { title: string; description: string; keywords: string[] };
  hero: SmartIotHeroContent;
  blocks: SmartIotBlock[];
  features: SmartIotFeaturesContent;
  faq: SmartIotFaq[];
  finalCta: CtaContent;
};
