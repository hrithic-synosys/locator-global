import "server-only";
import { CmsRequestError } from "./client";
import { CmsPayloadError } from "./validation";

// Keep an unavailable service distinct from a successful empty collection or
// an authoritative article 404. Reuse this boundary for future CMS sections.
export type CmsResource<T> =
  | { status: "ready"; data: T }
  | { status: "unavailable" };

export async function loadCmsResource<T>(
  load: () => Promise<T>
): Promise<CmsResource<T>> {
  try {
    return { status: "ready", data: await load() };
  } catch (error) {
    if (error instanceof CmsRequestError || error instanceof CmsPayloadError) {
      return { status: "unavailable" };
    }
    // Programming errors and Next navigation signals still reach their proper
    // boundary instead of being silently presented as an empty CMS response.
    throw error;
  }
}
