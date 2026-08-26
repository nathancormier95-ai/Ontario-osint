import { useMemo, useState } from "react";
import { Archive, Building2, Check, ExternalLink, FileWarning, Landmark, Scale, ShieldCheck } from "lucide-react";

type ResourceCategory = "Ontario & regulatory" | "Archive methods" | "Authorized testing governance";

type CuratedResource = {
  title: string;
  category: ResourceCategory;
  issuer: string;
  summary: string;
  boundary: string;
  href: string;
  icon: typeof Landmark;
};

export const curatedOsintResources: CuratedResource[] = [
  {
    title: "LECA E-Status Check",
    category: "Ontario & regulatory",
    issuer: "Law Enforcement Complaints Agency",
    summary: "Check the current status of an existing LECA complaint file using the file number from your correspondence.",
    boundary: "Use only a file number you are authorized to access. The Hub does not receive or retain it.",
    href: "https://complaint.leca.ca/LECA.Estatus/check_en.php",
    icon: Landmark,
  },
  {
    title: "One-Step Webpages",
    category: "Archive methods",
    issuer: "Stephen P. Morse",
    summary: "A broad set of historical-record, census, immigration, map, calendar, and alphabet research aids, including Canadian historical references.",
    boundary: "Use public or lawfully accessible historical sources with context; do not compile dossiers on living private individuals.",
    href: "https://stevemorse.org/index.html",
    icon: Archive,
  },
  {
    title: "Penetration Testing Execution Standard",
    category: "Authorized testing governance",
    issuer: "PTES",
    summary: "A high-level reference for defining scope, communication, threat modelling, and reporting in authorized security engagements.",
    boundary: "Read as a governance reference only. The Hub does not provide scanning, exploitation, credential, or access tools.",
    href: "http://www.pentest-standard.org/index.php/Main_Page",
    icon: Scale,
  },
];

export const OSINT_RESOURCE_CATEGORIES: Array<"All" | ResourceCategory> = ["All", "Ontario & regulatory", "Archive methods", "Authorized testing governance"];

export function filterCuratedOsintResources(category: "All" | ResourceCategory) {
  return category === "All" ? curatedOsintResources : curatedOsintResources.filter((resource) => resource.category === category);
}

export function OsintResources() {
  const [category, setCategory] = useState<(typeof OSINT_RESOURCE_CATEGORIES)[number]>("All");
  const visibleResources = useMemo(() => filterCuratedOsintResources(category), [category]);

  return (
    <section id="osint-resources" className="relative overflow-hidden bg-[#f4f0e7] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(15,89,116,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,89,116,0.045)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 xl:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">02B · OSINT resources</p>
            <h1 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">A sourced index, not an open-ended tool cabinet.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#536561]">This page reviewed 170 displayed links from the supplied directory and retained only the three that fit the Hub’s narrow lawful, privacy-respecting research model. Every external link opens in a new tab under your control.</p>
            <div className="mt-8 border-l-4 border-[#d9765e] bg-[#fff2ec] p-5 text-sm leading-6 text-[#74463b]"><div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a95545]"><FileWarning className="h-4 w-4" /> Curated exclusion boundary</div><p className="mt-3">The supplied directory also contained phone or device intelligence, geolocation, logging, password recovery, financial validation, scanning, exploitation, dark-web, and evasion links. Those categories are intentionally not reproduced here.</p></div>
            <div className="mt-7 border border-[#b6c7c1] bg-[#e8f1eb] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]"><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">Use with a question</p><ol className="mt-4 space-y-3 text-xs leading-5 text-[#4c625d]"><li className="flex gap-3"><span className="font-mono text-[#176c75]">01</span><span>State the research purpose and your authority before opening a source.</span></li><li className="flex gap-3"><span className="font-mono text-[#176c75]">02</span><span>Record the source, access date, scope, and limitation in your citation log.</span></li><li className="flex gap-3"><span className="font-mono text-[#176c75]">03</span><span>Prefer official Ontario and Canadian sources when they can answer the question directly.</span></li></ol></div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 border-b border-[#cfc7b8] pb-5" aria-label="Filter curated OSINT resources">
              {OSINT_RESOURCE_CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.11em] transition-colors ${category === item ? "border-[#0f5974] bg-[#0f5974] text-white" : "border-[#a6bdb5] bg-[#fffdf8] text-[#245c60] hover:border-[#0f5974] hover:bg-white"}`}>{item}</button>)}
            </div>
            <div className="mt-6 space-y-4">
              {visibleResources.map((resource, index) => { const Icon = resource.icon; return <article key={resource.title} className="relative overflow-hidden border border-[#b8cbc3] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(15,89,116,0.09)] sm:p-6"><div className="absolute right-0 top-0 border-b border-l border-[#c9d7cf] bg-[#e9f1ed] px-3 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#176c75]">Entry {String(index + 1).padStart(2, "0")}</div><div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)_minmax(190px,0.55fr)]"><span className="flex h-11 w-11 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Icon className="h-5 w-5" /></span><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">{resource.category}</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">{resource.title}</h2><p className="mt-3 text-sm leading-6 text-[#5a6c67]">{resource.summary}</p><p className="mt-4 font-mono text-[8px] uppercase tracking-[0.13em] text-[#37736e]">{resource.issuer}</p></div><div className="border-l-2 border-[#d5c86d] bg-[#f4f6ef] p-4 text-xs leading-5 text-[#405b56]"><p className="font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#6f6b36]">Use boundary</p><p className="mt-2">{resource.boundary}</p><a href={resource.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-semibold text-[#0f5974] underline decoration-[#8dacaa] underline-offset-4 hover:text-[#123e50]"><ExternalLink className="h-3.5 w-3.5" /> Open source</a></div></div></article>; })}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2"><a href="/ontario-data" className="border border-[#a8c4bb] bg-[#e4efeb] p-5 transition-colors hover:bg-[#d7e6df]"><Building2 className="h-5 w-5 text-[#0f5974]" /><p className="mt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#176c75]">Ontario-first route</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Open Ontario Data</h2><p className="mt-3 text-sm leading-6 text-[#536561]">Use documented provincial and municipal datasets for geography, policy, environment, population, and more.</p></a><a href="/sources" className="border border-[#a8c4bb] bg-[#edf3ed] p-5 transition-colors hover:bg-[#e2ece5]"><ShieldCheck className="h-5 w-5 text-[#0f5974]" /><p className="mt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#176c75]">Ontario-first route</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Open Source Ledger</h2><p className="mt-3 text-sm leading-6 text-[#536561]">Browse the verified Ontario public-record, legal, regulatory, archive, and municipal references already maintained by the Hub.</p></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
