import { sendGTMEvent } from "@next/third-parties/google";

export type LeadFormType = "contact" | "quote" | "demo";

export function trackLeadSubmission(formType: LeadFormType) {
  if (typeof window === "undefined") return;

  sendGTMEvent({
    event: "locator_lead_submitted",
    form_type: formType,
  });
}