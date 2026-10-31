import { isCountryCode, type CountryCode } from "@/config/countries";
import { resolveMarketContent } from "../../resolve-market-content";
import { sharedVideoTelematics } from "./shared";
import { globalVideoTelematics } from "./global";
import { qaVideoTelematics, qaVideoTelematicsEnabled } from "./qa";
import { saVideoTelematics } from "./sa";
import { kwVideoTelematics } from "./kw";
import { omVideoTelematics } from "./om";
import {
  videoTelematicsSections,
  type VideoTelematicsContent,
  type VideoTelematicsOverride,
} from "./schema";

const overrides: Record<CountryCode, VideoTelematicsOverride> = {
  global: globalVideoTelematics,
  qa: qaVideoTelematicsEnabled ? qaVideoTelematics : {},
  sa: saVideoTelematics,
  kw: kwVideoTelematics,
  om: omVideoTelematics,
};
export function validateVideoTelematics(content: VideoTelematicsContent) {
  if (
    content.sectionOrder[0] !== "hero" ||
    !content.enabled.hero ||
    new Set(content.sectionOrder).size !== content.sectionOrder.length ||
    content.sectionOrder.some((id) => !videoTelematicsSections.includes(id))
  )
    throw Error("Invalid Video Telematics section order");
  for (const key of [
    "introFeatures",
    "driverAlerts",
    "showcase",
    "journeySteps",
    "industries",
    "whyChoose",
    "faq",
  ] as const) {
    const section = content[key];
    if (!content.enabled[key]) continue;
    if (
      !section.order.length ||
      new Set(section.order).size !== section.order.length ||
      section.order.some((id) => !Object.hasOwn(section.items, id))
    )
      throw Error(`Invalid ${key} content order`);
  }
  return content;
}
export function getVideoTelematicsContent(market: CountryCode) {
  if (!isCountryCode(market)) throw Error("Unsupported page market");
  return validateVideoTelematics(
    resolveMarketContent<VideoTelematicsContent>(
      sharedVideoTelematics,
      overrides,
      market
    )
  );
}
