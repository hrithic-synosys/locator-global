import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { isCountryCode } from "@/config/countries";
import { productUpdatesCacheTag } from "@/lib/cms-blog/cache-policy";

// CMS cache notification for Product Updates. Same rules as /api/revalidate/blogs,
// with its own secret, a required `collection: "product-updates"` field and the
// `market_product_updates` acknowledgement the CMS sender verifies.
export const runtime = "nodejs";
const MAX_BODY_BYTES = 4096;
const COLLECTION = "product-updates";
const reply = (status: number, body: object) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
const slug = (value: unknown) =>
  typeof value === "string" &&
  value.length <= 240 &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export async function POST(request: Request) {
  const secret = process.env.CMS_PRODUCT_UPDATES_REVALIDATION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32)
    return reply(503, { success: false, error: "not_configured" });
  const auth = request.headers.get("authorization") || "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!supplied || !timingSafeEqual(digest(secret), digest(supplied)))
    return reply(401, { success: false, error: "unauthorized" });
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return reply(415, { success: false, error: "json_required" });
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    return reply(413, { success: false, error: "payload_too_large" });
  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { success: false, error: "invalid_json" });
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return reply(413, { success: false, error: "payload_too_large" });
      }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply(400, { success: false, error: "invalid_json" });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return reply(400, { success: false, error: "invalid_payload" });
  const data = payload as Record<string, unknown>;
  if (
    Object.keys(data).some(
      (key) => !["collection", "market", "slug", "previousSlug"].includes(key)
    ) ||
    data.collection !== COLLECTION ||
    typeof data.market !== "string" ||
    !isCountryCode(data.market) ||
    !slug(data.slug) ||
    (data.previousSlug !== undefined && !slug(data.previousSlug))
  )
    return reply(400, { success: false, error: "invalid_payload" });
  try {
    // Immediate expiry: the next visitor must not get an archived/removed update.
    revalidateTag(productUpdatesCacheTag(data.market), { expire: 0 });
    return reply(200, {
      success: true,
      collection: COLLECTION,
      market: data.market,
      slug: data.slug,
      ...(data.previousSlug ? { previousSlug: data.previousSlug } : {}),
      invalidated: "market_product_updates",
    });
  } catch {
    return reply(500, { success: false, error: "revalidation_failed" });
  }
}
