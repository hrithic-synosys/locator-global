/** Extend this interface as sections are migrated; existing JSX need not move. */
export interface PageContentMap {
  home: { hero?: { heading?: string; image?: string } };
}

export type ContentOverrides = { [P in keyof PageContentMap]?: PageContentMap[P] };
