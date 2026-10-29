/* eslint-disable @typescript-eslint/no-require-imports -- Local Node verification fixtures. */
// Test-process dependency replacement, never imported by application code.
if (
  process.env.LOCATOR_LOCAL_FORM_FIXTURE !== "true" ||
  !process.env.LOCATOR_TEST_CONTROL
)
  throw Error("Explicit local form fixture required");
const fs = require("fs");
const original = global.fetch;
const used = new Set();
global.fetch = async (input, options) => {
  const url = String(input?.url || input);
  if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
    const control = JSON.parse(
      fs.readFileSync(process.env.LOCATOR_TEST_CONTROL)
    );
    if (control.provider === "offline") throw Error("Mock provider offline");
    const token = new URLSearchParams(options.body).get("response");
    if (control.provider === "reject" || used.has(token))
      return Response.json({ success: false });
    const action = token.match(
      /^token-(career_application|quick_contact|contact|quote|demo)-/
    )?.[1];
    if (!action) return Response.json({ success: false });
    used.add(token);
    return Response.json({ success: true, action, hostname: "localhost" });
  }
  if (/^https?:/.test(url) && !/^http:\/\/(127\.0\.0\.1|localhost):/.test(url))
    throw Error("External HTTP blocked in local form fixture");
  return original(input, options);
};
