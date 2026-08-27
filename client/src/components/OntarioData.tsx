import { useMemo, useState } from "react";
import { BarChart3, CloudSun, Database, ExternalLink, Map, MapPinned, ShieldCheck, UsersRound } from "lucide-react";
import { resources } from "@/lib/resources";

type DataFocus = "All" | "Province-wide" | "Maps & places" | "Population" | "Climate & environment" | "Health" | "Municipal";

type DataSource = {
  title: string;
  focus: Exclude<DataFocus, "All">;
  href: string;
  issuer: string;
  summary: string;
  access: string;
  icon: typeof Database;
  accent: string;
};

const dataSources: DataSource[] = [
  {
    title: "Ontario Data Catalogue",
    focus: "Province-wide",
    href: "https://data.ontario.ca/",
    issuer: "Government of Ontario",
    summary: "Search provincial open datasets across economy, housing, health, education, justice, transportation, and more.",
    access: "Check each dataset’s licence, update date, and methodology.",
    icon: Database,
    accent: "bg-[#3a8b83] text-[#f3fff9]",
  },
  {
    title: "Ontario GeoHub",
    focus: "Maps & places",
    href: "https://geohub.lio.gov.on.ca/",
    issuer: "Geospatial Ontario",
    summary: "Find authoritative provincial geospatial layers, imagery, boundaries, elevation, water, forestry, and mapping applications.",
    access: "Maps and layers are context tools; confirm scale, date, and source limits.",
    icon: Map,
    accent: "bg-[#357fa1] text-[#eefaff]",
  },
  {
    title: "Ontario Census Profile",
    focus: "Population",
    href: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/search-recherche/lst/results-resultats.cfm?Lang=E&GEOCODE=35",
    issuer: "Statistics Canada",
    summary: "Browse official 2021 Census information for Ontario and drill down to communities and census geographies.",
    access: "Use aggregate geography data; avoid treating population figures as person-level information.",
    icon: UsersRound,
    accent: "bg-[#72578f] text-[#fbf6ff]",
  },
  {
    title: "Ontario Climate Projections",
    focus: "Climate & environment",
    href: "https://data.ontario.ca/dataset/climate-data-high-resolution-projections",
    issuer: "Government of Ontario",
    summary: "Access provincial climate-projection data and the related Ontario Climate Data Portal resources.",
    access: "Distinguish modeled projections from observed conditions and record the scenario used.",
    icon: CloudSun,
    accent: "bg-[#bf6b4c] text-[#fff7ed]",
  },
  {
    title: "Ontario Health Open Data",
    focus: "Health",
    href: "https://www.ontariohealth.ca/system/data/open.html",
    issuer: "Ontario Health",
    summary: "Review Ontario Health’s open-data inventory and release information for available system-level datasets.",
    access: "Use published aggregate data only; do not attempt to identify people from health information.",
    icon: BarChart3,
    accent: "bg-[#748a3f] text-[#f7ffe7]",
  },
];

export function OntarioData() {
  const [focus, setFocus] = useState<DataFocus>("All");
  const focuses: DataFocus[] = ["All", "Province-wide", "Maps & places", "Population", "Climate & environment", "Health", "Municipal"];
  const municipalSources = useMemo(() => resources.filter((resource) => resource.municipality), []);
  const visibleSources = focus === "Municipal" ? [] : dataSources.filter((source) => focus === "All" || source.focus === focus);

  return (
    <section id="ontario-data" className="bg-[#e4efeb] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-9 xl:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#176c75]">03A · Ontario data</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.88] tracking-[-0.055em] text-[#173c43] md:text-6xl">Data for the province—used with context.</h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-[#506761]">Start with official, aggregate, and documented sources for Ontario data. This page opens public portals in a new tab; it does not search, store, combine, or profile data for you.</p>
            <div className="mt-8 border-l-4 border-[#d9765e] bg-[#fff2ec] p-5 text-sm leading-6 text-[#74463b]">
              <div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a95545]"><ShieldCheck className="h-4 w-4" /> Data-use boundary</div>
              <p className="mt-3">Check the dataset licence, coverage period, methodology, and any reuse restrictions before relying on or publishing a result. Public datasets are not a reason to create a record about an identifiable person.</p>
            </div>
            <div className="mt-8 border border-[#b7ccc4] bg-[#f4faf6] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">A small data practice</p>
              <ol className="mt-4 space-y-3 text-xs leading-5 text-[#4c625d]">
                <li className="flex gap-3"><span className="font-mono text-[#176c75]">01</span><span>State the geographic question before choosing a portal.</span></li>
                <li className="flex gap-3"><span className="font-mono text-[#176c75]">02</span><span>Record the source, edition, date accessed, and definition of each field used.</span></li>
                <li className="flex gap-3"><span className="font-mono text-[#176c75]">03</span><span>Use aggregate results responsibly and verify important findings against the issuer’s documentation.</span></li>
              </ol>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 border-b border-[#b8cbc3] pb-5" aria-label="Filter Ontario data sources">
              {focuses.map((item) => <button key={item} type="button" onClick={() => setFocus(item)} className={`border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.11em] transition-colors ${focus === item ? "border-[#176c75] bg-[#176c75] text-white" : "border-[#9fbdb4] bg-[#f7fbf8] text-[#245c60] hover:border-[#176c75] hover:bg-white"}`}>{item}</button>)}
            </div>

            {focus !== "Municipal" && <div className="mt-6 grid gap-4 md:grid-cols-2">{visibleSources.map((source) => { const Icon = source.icon; return <a key={source.title} href={source.href} target="_blank" rel="noreferrer" className="card-lift group flex min-h-[280px] flex-col border border-[#b8cbc3] bg-[#fffdf8] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.09)]"><div className="flex items-start justify-between gap-4"><span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${source.accent} px-2.5 py-1.5`}>{source.focus}</span><ExternalLink className="h-4 w-4 text-[#4d7f7e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><Icon className="mt-7 h-6 w-6 text-[#176c75]" /><h2 className="mt-4 font-display text-3xl leading-none tracking-[-0.04em] text-[#1b4248]">{source.title}</h2><p className="mt-3 text-sm leading-6 text-[#596d67]">{source.summary}</p><div className="mt-auto border-t border-dashed border-[#c8d7cf] pt-4"><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#37736e]">{source.issuer}</p><p className="mt-2 text-xs leading-5 text-[#607670]">{source.access}</p></div></a>; })}</div>}

            {focus === "Municipal" && <div className="mt-6 grid gap-4 sm:grid-cols-2">{municipalSources.map((source) => <a key={source.title} href={source.href} target="_blank" rel="noreferrer" className="card-lift group flex min-h-[210px] flex-col border border-[#b8cbc3] bg-[#fffdf8] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.09)]"><div className="flex items-center justify-between gap-3"><span className="bg-[#357fa1] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#eefaff]">{source.municipality}</span><ExternalLink className="h-4 w-4 text-[#4d7f7e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><MapPinned className="mt-6 h-5 w-5 text-[#176c75]" /><h2 className="mt-4 font-display text-3xl leading-none tracking-[-0.04em] text-[#1b4248]">{source.title}</h2><p className="mt-3 text-sm leading-6 text-[#596d67]">{source.description}</p><p className="mt-auto pt-4 font-mono text-[8px] uppercase tracking-[0.13em] text-[#37736e]">Open-data portal · check municipal terms</p></a>)}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
