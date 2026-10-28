import { notFound } from "next/navigation";
import type { CountryCode } from "@/config/countries";
import { globalRegulatoryPath } from "@/config/regulatory";
import { marketMetadata } from "@/lib/country/metadata";
import { globalRegulatoryMetadata } from "@/content/global-regulatory";
import GlobalRegulatoryPage from "@/components/regulatory/GlobalRegulatoryPage";

type Props = { params: Promise<{ market: CountryCode }> };

export default async function GlobalCompliancePage({ params }: Props) {
  if ((await params).market !== "global") notFound();
  return <GlobalRegulatoryPage />;
}

export async function generateMetadata({ params }: Props) {
  const { market } = await params;
  if (market !== "global") notFound();
  return marketMetadata(globalRegulatoryMetadata, market, globalRegulatoryPath);
}
