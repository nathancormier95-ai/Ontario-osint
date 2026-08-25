/**
 * Source availability checks are intentionally limited to the fixed public-resource catalogue.
 * The route never accepts a visitor-provided URL or research identifier.
 */
import { protectedProcedure, router } from "../_core/trpc";

const CHECK_TIMEOUT_MS = 7_000;
const ALLOWLISTED_SOURCES = [
  { id: "on-business-registry", title: "Ontario Business Registry", href: "https://www.appmybizaccount.gov.on.ca/onbis/master/entry.pub?applicationCode=onbis-master&businessService=registerItemSearch" },
  { id: "onland", title: "Ontario Land Registry · OnLand", href: "https://www.onland.ca/ui/" },
  { id: "personal-property-lien", title: "Personal Property Lien Search", href: "https://www.ontario.ca/page/register-security-interest-or-search-lien-access-now" },
  { id: "ontario-courts", title: "Ontario Courts case search", href: "https://www.ontario.ca/page/search-court-cases-online" },
  { id: "ontario-data", title: "Ontario Data Catalogue", href: "https://data.ontario.ca/" },
  { id: "archives-ontario", title: "Archives of Ontario", href: "https://www.archives.gov.on.ca/en/index.aspx" },
  { id: "canlii-ontario", title: "CanLII — Ontario", href: "https://www.canlii.org/en/on/" },
  { id: "law-society-directory", title: "Lawyer & Paralegal Directory", href: "https://lsodirectory.lso.ca/en-US/" },
  { id: "on-business-licence", title: "Ontario Business Licence Directory", href: "https://www.ontario.ca/page/search-business-licence-registration-or-appointment" },
  { id: "toronto-open-data", title: "Toronto Open Data", href: "https://open.toronto.ca/" },
  { id: "open-ottawa", title: "Open Ottawa", href: "https://open.ottawa.ca/" },
  { id: "hamilton-open-data", title: "Hamilton Open Data", href: "https://open.hamilton.ca/" },
  { id: "mississauga-open-data", title: "Mississauga Open Data", href: "https://data.mississauga.ca/" },
  { id: "brampton-geohub", title: "Brampton GeoHub", href: "https://geohub.brampton.ca/pages/data" },
] as const;

export type SourceAvailability = "available" | "restricted" | "attention" | "unreachable";

export function classifySourceStatus(statusCode: number): SourceAvailability {
  if (statusCode >= 200 && statusCode < 400) return "available";
  if (statusCode === 401 || statusCode === 403) return "restricted";
  return "attention";
}

export async function probeApprovedSource(source: (typeof ALLOWLISTED_SOURCES)[number], fetchImplementation: typeof fetch = fetch) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    let response = await fetchImplementation(source.href, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "OntarioResearchHub-SourceStatus/1.0" },
    });

    // Some public catalogues do not serve HEAD requests. The fixed fallback uses a one-byte range GET.
    if (response.status === 405 || response.status === 501) {
      response = await fetchImplementation(source.href, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "Range": "bytes=0-0", "User-Agent": "OntarioResearchHub-SourceStatus/1.0" },
      });
    }

    return {
      id: source.id,
      title: source.title,
      href: source.href,
      status: classifySourceStatus(response.status),
      statusCode: response.status,
      durationMs: Date.now() - startedAt,
    };
  } catch {
    return {
      id: source.id,
      title: source.title,
      href: source.href,
      status: "unreachable" as const,
      statusCode: null,
      durationMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const sourceStatusRouter = router({
  run: protectedProcedure.mutation(async () => {
    const results = await Promise.all(ALLOWLISTED_SOURCES.map((source) => probeApprovedSource(source)));
    return { checkedAt: new Date().toISOString(), results };
  }),
});

export const approvedSourceChecks = ALLOWLISTED_SOURCES;
