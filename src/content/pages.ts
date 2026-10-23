/** Extend this interface as sections are migrated; existing JSX need not move. */
export interface PageContentMap {
  home: { hero?: { heading?: string; image?: string } };
  regulatoryShahin: RegulatoryPageContent;
  regulatoryAsateel: RegulatoryPageContent;
  regulatorySecurepath: RegulatoryPageContent;
  regulatorySecurepathPremium: RegulatoryPageContent;
}

export type RegulatoryPageContent = {
  hero?: { name?: string; title?: string; description?: string; image?: string };
};

export type ContentOverrides = { [P in keyof PageContentMap]?: PageContentMap[P] };
