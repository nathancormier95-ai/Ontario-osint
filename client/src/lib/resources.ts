/**
 * Civic Field Notes style reminder: every recommended resource is a named, direct source.
 * These links are intentionally outbound; the site does not collect or relay search inputs.
 */
export type Resource = {
  title: string;
  description: string;
  href: string;
  category: "Public records" | "Legal" | "Open data" | "Archives";
  note: string;
};

export const resources: Resource[] = [
  {
    title: "Ontario Business Registry",
    description:
      "Search basic public information for Ontario businesses and not-for-profit corporations.",
    href: "https://www.appmybizaccount.gov.on.ca/onbis/master/entry.pub?applicationCode=onbis-master&businessService=registerItemSearch",
    category: "Public records",
    note: "Official ServiceOntario resource",
  },
  {
    title: "Ontario Courts case search",
    description:
      "Access the correct court search pathway for the Toronto region or other Ontario locations.",
    href: "https://www.ontario.ca/page/search-court-cases-online",
    category: "Legal",
    note: "Publication and reuse restrictions apply",
  },
  {
    title: "Ontario Data Catalogue",
    description:
      "Discover provincial datasets published for public use, analysis, and responsible reuse.",
    href: "https://data.ontario.ca/",
    category: "Open data",
    note: "Official Government of Ontario catalogue",
  },
  {
    title: "Archives of Ontario",
    description:
      "Start with archival guides, indexes, and historical Ontario records maintained by the province.",
    href: "https://www.archives.gov.on.ca/en/index.aspx",
    category: "Archives",
    note: "Use archive-specific access guidance",
  },
  {
    title: "CanLII — Ontario",
    description:
      "Read publicly available Ontario decisions and legislation from the Canadian Legal Information Institute.",
    href: "https://www.canlii.org/en/on/",
    category: "Legal",
    note: "Independent legal information institute",
  },
  {
    title: "Toronto Open Data",
    description:
      "Browse City of Toronto datasets, maps, and documentation for municipal research questions.",
    href: "https://open.toronto.ca/",
    category: "Open data",
    note: "Municipal open-data portal",
  },
];
