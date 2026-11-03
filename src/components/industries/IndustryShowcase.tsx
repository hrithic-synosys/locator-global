import ServiceFleetShowcase from '@/components/service/ServiceFleetShowcase';
import type { IndustryShowcaseContent } from '@/content/pages/industries/detail-schema';

// Adapt editorial cards to the existing showcase instead of duplicating its UI.
export default function IndustryShowcase({ content, id, reverse = false }: { content: IndustryShowcaseContent; id: string; reverse?: boolean }) {
  return <ServiceFleetShowcase
    id={id}
    image={content.image}
    reverse={reverse}
    content={{
      eyebrow: content.eyebrow,
      heading: content.heading,
      paragraphs: content.paragraphs,
      subheading: '',
      secondaryParagraphs: [],
      order: content.order,
      items: Object.fromEntries(content.order.map(key => {
        const item = content.items[key];
        return [key, { title: item.title, desc: item.description, assetIndex: item.icon === 'cost' ? 5 : item.icon === 'shield' ? 3 : item.icon === 'cargo' ? 2 : 0 }];
      })),
    }}
  />;
}
