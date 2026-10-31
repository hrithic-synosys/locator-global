import { isCountryCode, type CountryCode } from "@/config/countries";
import { resolveMarketContent } from "../../resolve-market-content";
import { sharedFleetTelematics } from "./shared";
import { globalFleetTelematics } from "./global";
import { qaFleetTelematics } from "./qa";
import { saFleetTelematics } from "./sa";
import { kwFleetTelematics } from "./kw";
import { omFleetTelematics } from "./om";
import { fleetSections, type FleetContent, type FleetOverride } from "./schema";

const overrides: Record<CountryCode, FleetOverride> = {
  global: globalFleetTelematics,
  qa: qaFleetTelematics,
  sa: saFleetTelematics,
  kw: kwFleetTelematics,
  om: omFleetTelematics,
};

export function validateFleetTelematics(content: FleetContent) {
  if (
    content.sectionOrder[0] !== "hero" ||
    !content.enabled.hero ||
    new Set(content.sectionOrder).size !== content.sectionOrder.length ||
    content.sectionOrder.some((id) => !fleetSections.includes(id))
  )
    throw Error("Invalid Fleet Telematics section order");
  for (const key of [
    "benefits",
    "showcase",
    "industries",
    "process",
    "videoTelematics",
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
  for (const [key, count] of [
    ["benefits", 10],
    ["showcase", 6],
    ["process", 4],
    ["whyChoose", 3],
  ] as const) {
    for (const id of content[key].order) {
      const index = content[key].items[id].assetIndex;
      if (!Number.isInteger(index) || index < 0 || index >= count)
        throw Error(`Invalid ${key} asset binding`);
    }
  }
  if (
    content.faq.order.some(
      (id) =>
        !content.faq.categories.some(
          (cat) => cat.id === content.faq.items[id].cat
        )
    )
  )
    throw Error("Unknown FAQ category");
  return content;
}

export function getFleetTelematicsContent(market: CountryCode) {
  if (!isCountryCode(market)) throw Error("Unsupported page market");
  const content = validateFleetTelematics(
    resolveMarketContent<FleetContent>(sharedFleetTelematics, overrides, market)
  );
  if (
    market === "global" &&
    content.enabled.statistics &&
    (!content.statistics.verified || !content.statistics.items.length)
  )
    throw Error("Global statistics require verified company figures");
  return content;
}
