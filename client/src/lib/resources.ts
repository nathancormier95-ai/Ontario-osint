/**
 * Civic Field Notes style reminder: every recommended resource is a named, direct source.
 * These links are intentionally outbound; the site does not collect or relay search inputs.
 */
export type Resource = {
  title: string;
  description: string;
  href: string;
  category: "Public records" | "Legal" | "Open data" | "Archives" | "Property" | "Regulatory" | "Self-service privacy";
  note: string;
  municipality?: "Toronto" | "Ottawa" | "Hamilton" | "Mississauga" | "Brampton";
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
    title: "Ontario Land Registry · OnLand",
    description:
      "Search current and historical property records, including ownership interests, mortgages, transfers, and leases.",
    href: "https://www.onland.ca/ui/",
    category: "Property",
    note: "Official ServiceOntario resource · self-search fee",
  },
  {
    title: "Personal Property Lien Search",
    description:
      "Use Ontario’s Access Now service for personal-property security registrations and lien-related enquiries.",
    href: "https://www.ontario.ca/page/register-security-interest-or-search-lien-access-now",
    category: "Public records",
    note: "Real property and land records are excluded",
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
    title: "Lawyer & Paralegal Directory",
    description:
      "Check Law Society licensing and practising status for Ontario lawyers and paralegals, with business contact details.",
    href: "https://lsodirectory.lso.ca/en-US/",
    category: "Legal",
    note: "Law Society of Ontario · not legal advice",
  },
  {
    title: "Ontario Business Licence Directory",
    description:
      "Find specified regulated business licence, registration, and appointment records, including consumer-sector categories.",
    href: "https://www.ontario.ca/page/search-business-licence-registration-or-appointment",
    category: "Regulatory",
    note: "Provincial directory · updates noted monthly",
  },
  {
    title: "Toronto Open Data",
    description:
      "Explore datasets, maps, visualizations, and documentation published by City divisions and agencies.",
    href: "https://open.toronto.ca/",
    category: "Open data",
    note: "City of Toronto · official open-data portal",
    municipality: "Toronto",
  },
  {
    title: "Open Ottawa",
    description:
      "Browse the City of Ottawa’s public data catalogue and related municipal data tools.",
    href: "https://open.ottawa.ca/",
    category: "Open data",
    note: "City of Ottawa · official open-data portal",
    municipality: "Ottawa",
  },
  {
    title: "Hamilton Open Data",
    description:
      "Find City of Hamilton public information for research, analysis, reporting, and application development.",
    href: "https://open.hamilton.ca/",
    category: "Open data",
    note: "City of Hamilton · catalogue and licence terms",
    municipality: "Hamilton",
  },
  {
    title: "Mississauga Open Data",
    description:
      "Explore the City of Mississauga’s municipal data hub and public dataset catalogue.",
    href: "https://data.mississauga.ca/",
    category: "Open data",
    note: "City of Mississauga · official data hub",
    municipality: "Mississauga",
  },
  {
    title: "Brampton GeoHub",
    description:
      "Explore and download City of Brampton open data through the public GeoHub portal.",
    href: "https://geohub.brampton.ca/pages/data",
    category: "Open data",
    note: "City of Brampton · public open-data hub",
    municipality: "Brampton",
  },
  {
    title: "Canada’s Business Registries",
    description:
      "Find business information from participating official provincial, territorial, and federal registries, then confirm material details with the named registry.",
    href: "https://ised-isde.canada.ca/cbr-rec/en/search",
    category: "Public records",
    note: "Official intergovernmental index · manual research only; automated copying or scraping is prohibited",
  },
  {
    title: "Corporations Canada · Federal Corporation Search",
    description:
      "Confirm the existence and status of a corporation created under federal corporate law using the federal corporate registry.",
    href: "https://ised-isde.canada.ca/cc/lgcy/fdrlCrpSrch.html",
    category: "Public records",
    note: "Federal corporations only · excludes provincial, financial, and foreign corporate laws",
  },
  {
    title: "CRA List of Charities",
    description:
      "Review the Canada Revenue Agency’s public charity information and guidance for organization-level charity status research.",
    href: "https://www.canada.ca/en/revenue-agency/services/charities-giving/list-charities.html",
    category: "Public records",
    note: "Official CRA resource · use for organization records, not personal profiling",
  },
  {
    title: "Canadian Trademarks Database",
    description:
      "Search Canadian trademark applications and registrations to research a brand, product, or business identity before relying on public status information.",
    href: "https://ised-isde.canada.ca/cipo/trademark-search/srch",
    category: "Regulatory",
    note: "Official CIPO database · search results are a reference, not legal advice",
  },
  {
    title: "Canadian Patents Database",
    description:
      "Search laid-open patent applications and granted Canadian patents as an intellectual-property research starting point.",
    href: "https://brevets-patents.ic.gc.ca/opic-cipo/cpd/eng/search/basic.html",
    category: "Regulatory",
    note: "Official CIPO database · record the publication number and status date",
  },
  {
    title: "Ontario IPC · Access and Correction Rights",
    description:
      "Learn how to request access to or correction of your own personal information held by Ontario public-sector institutions and health information custodians.",
    href: "https://www.ipc.on.ca/en/resources/information-individuals/access-and-correction-rights",
    category: "Self-service privacy",
    note: "Official Ontario privacy guidance · use only for your own records or a clearly authorized request",
  },
  {
    title: "Privacy Commissioner of Canada · Access Your Information",
    description:
      "Understand how to request access to your own personal information held by many private-sector organizations under Canada’s federal privacy framework.",
    href: "https://www.priv.gc.ca/en/privacy-topics/accessing-personal-information/api_bus/",
    category: "Self-service privacy",
    note: "Official federal privacy guidance · requests are ordinarily limited to your own information",
  },
  {
    title: "Google Takeout · Your Account Data",
    description:
      "Create an archive of data from Google products you use for your own records, transfer, or account review.",
    href: "https://support.google.com/accounts/answer/3024190?hl=en",
    category: "Self-service privacy",
    note: "Official account-owner export guidance · review archive contents before sharing",
  },
  {
    title: "LinkedIn · Download Your Account Data",
    description:
      "Request a copy of information associated with your own LinkedIn account from the platform’s Settings and Privacy controls.",
    href: "https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data",
    category: "Self-service privacy",
    note: "Official account-owner export guidance · do not use exports to profile other people",
  },
  {
    title: "Facebook · Export Your Information",
    description:
      "Use Meta’s account controls to export a copy of information from your own Facebook account for personal review or retention.",
    href: "https://www.facebook.com/help/212802592074644",
    category: "Self-service privacy",
    note: "Official account-owner export guidance · preserve others’ privacy when reviewing an archive",
  },
];
