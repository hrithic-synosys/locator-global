import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import type { CountryCode } from "../../../config/countries";
import { pinRelease, PublicationUnavailable } from "./store";

// Proxy replaces this header on EVERY matched request. Never copy a caller's
// pin: it could name an older release containing withdrawn articles.
export const PIN_HEADER = "x-locator-publication-pins";
export const publishedRelease = cache(async (market: CountryCode) => {
  await connection();
  const encoded = (await headers()).get(PIN_HEADER);
  let pointer: unknown;
  if (encoded) {
    try {
      pointer = JSON.parse(encoded)[market];
    } catch {
      throw new PublicationUnavailable();
    }
  }
  return pinRelease(process.env.LOCATOR_PUBLISHED_ROOT || "", market, pointer);
});
