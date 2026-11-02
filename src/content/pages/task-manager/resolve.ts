import { isCountryCode, type CountryCode } from "@/config/countries";
import { resolveMarketContent } from "../../resolve-market-content";
import { sharedTaskManager } from "./shared";
import { globalTaskManager } from "./global";
import { qaTaskManager } from "./qa";
import { saTaskManager } from "./sa";
import { kwTaskManager } from "./kw";
import { omTaskManager } from "./om";
import {
  taskManagerSections,
  type TaskManagerContent,
  type TaskManagerOverride,
} from "./schema";

const overrides: Record<CountryCode, TaskManagerOverride> = {
  global: globalTaskManager,
  qa: qaTaskManager,
  sa: saTaskManager,
  kw: kwTaskManager,
  om: omTaskManager,
};
export function validateTaskManager(content: TaskManagerContent) {
  if (
    content.sectionOrder[0] !== "hero" ||
    !content.enabled.hero ||
    new Set(content.sectionOrder).size !== content.sectionOrder.length ||
    content.sectionOrder.some((id) => !taskManagerSections.includes(id))
  )
    throw Error("Invalid Task Manager section order");
  if (
    content.hero.accent &&
    !content.hero.heading.startsWith(content.hero.accent)
  )
    throw Error("Task Manager hero accent must start the heading");
  for (const key of [
    "benefits",
    "tools",
    "industries",
    "whyChoose",
    "faq",
  ] as const) {
    const section = content[key];
    if (
      content.enabled[key] &&
      (!section.order.length ||
        new Set(section.order).size !== section.order.length ||
        section.order.some((id) => !Object.hasOwn(section.items, id)))
    )
      throw Error(`Invalid Task Manager ${key} order`);
  }
  if (
    content.enabled.whyChoose &&
    content.whyChoose.order.some((id) => {
      const index = content.whyChoose.items[id].assetIndex;
      return !Number.isInteger(index) || index < 0 || index > 2;
    })
  )
    throw Error("Invalid Task Manager reason icon");
  if (content.enabled.faq) {
    const categories = content.faq.categories.map((category) => category.id);
    if (
      !categories.includes("all") ||
      new Set(categories).size !== categories.length ||
      content.faq.order.some(
        (id) => !categories.includes(content.faq.items[id].cat)
      )
    )
      throw Error("Invalid Task Manager FAQ category");
  }
  return content;
}
export function getTaskManagerContent(market: CountryCode) {
  if (!isCountryCode(market)) throw Error("Unsupported page market");
  return validateTaskManager(
    resolveMarketContent<TaskManagerContent>(
      sharedTaskManager,
      overrides,
      market
    )
  );
}
