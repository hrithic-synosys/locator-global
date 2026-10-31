import type { VideoTelematicsOverride } from "./schema";
// Preserved tutorial draft. Set true only after replacing it with approved copy.
export const qaVideoTelematicsEnabled = false;
export const qaVideoTelematics = {
  hero: {
    heading: "Your approved Qatar heading",
  },

  finalCta: {
    paragraphs: ["Your Qatar-specific closing paragraph."],
  },
} satisfies VideoTelematicsOverride;
