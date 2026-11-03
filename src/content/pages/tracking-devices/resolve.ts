import { isCountryCode, type CountryCode } from "@/config/countries";
import { DEVICES } from "@/components/service/tracking-devices/devices-data";
import { resolveMarketContent } from "../../resolve-market-content";
import { sharedTrackingDevices } from "./shared";
import { globalTrackingDevices } from "./global";
import { qaTrackingDevices } from "./qa";
import { saTrackingDevices } from "./sa";
import { kwTrackingDevices } from "./kw";
import { omTrackingDevices } from "./om";
import {
  trackingDeviceSections,
  type TrackingDevicesContent,
  type TrackingDevicesOverride,
} from "./schema";
const overrides: Record<CountryCode, TrackingDevicesOverride> = {
  global: globalTrackingDevices,
  qa: qaTrackingDevices,
  sa: saTrackingDevices,
  kw: kwTrackingDevices,
  om: omTrackingDevices,
};
export function validateTrackingDevices(content: TrackingDevicesContent) {
  if (
    content.sectionOrder[0] !== "hero" ||
    !content.enabled.hero ||
    new Set(content.sectionOrder).size !== content.sectionOrder.length ||
    content.sectionOrder.some((id) => !trackingDeviceSections.includes(id))
  )
    throw Error("Invalid tracking-device section order");
  for (const key of ["catalog", "journey", "whyChoose", "faq"] as const) {
    const section = content[key];
    if (
      content.enabled[key] &&
      (!section.order.length ||
        new Set(section.order).size !== section.order.length ||
        section.order.some((id) => !Object.hasOwn(section.items, id)))
    )
      throw Error(`Invalid tracking-device ${key} order`);
  }
  if (
    content.catalog.order.some(
      (id) =>
        !DEVICES.some((device) => device.slug === id) ||
        content.catalog.items[id].slug !== id
    )
  )
    throw Error("Unknown catalogue product or changed detail link");
  if (
    content.hero.accent &&
    !content.hero.heading.includes(content.hero.accent)
  )
    throw Error("Invalid hero accent");
  if (
    content.enabled.whyChoose &&
    content.whyChoose.order.some((id) => {
      const i = content.whyChoose.items[id].assetIndex;
      return !Number.isInteger(i) || i < 0 || i > 2;
    })
  )
    throw Error("Invalid reason icon");
  if (content.enabled.faq) {
    const ids = content.faq.categories.map((category) => category.id);
    if (
      !ids.includes("all") ||
      new Set(ids).size !== ids.length ||
      content.faq.order.some((id) => !ids.includes(content.faq.items[id].cat))
    )
      throw Error("Invalid FAQ category");
  }
  return content;
}
export function getTrackingDevicesContent(market: CountryCode) {
  if (!isCountryCode(market)) throw Error("Unsupported page market");
  return validateTrackingDevices(
    resolveMarketContent<TrackingDevicesContent>(
      sharedTrackingDevices,
      overrides,
      market
    )
  );
}
