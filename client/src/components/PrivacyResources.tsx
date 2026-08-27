import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, EyeOff, FileCheck2, KeyRound, MessageCircleMore, SearchCheck, ShieldCheck } from "lucide-react";

type PrivacyCategory = "Private browsing" | "Information verification" | "Password hygiene" | "Private storage & communication" | "Digital privacy review";

type PrivacyResource = {
  title: string;
  category: PrivacyCategory;
  issuer: string;
  summary: string;
  boundary: string;
  href: string;
  icon: typeof ShieldCheck;
};

export const curatedPrivacyResources: PrivacyResource[] = [
  {
    title: "DuckDuckGo",
    category: "Private browsing",
    issuer: "DuckDuckGo",
    summary: "A privacy-focused search and browser option with tracker and cookie protections described by its publisher.",
    boundary: "Use privacy settings to protect your own browsing; this is not a tool for evading lawful requirements or targeting others.",
    href: "https://duckduckgo.com/",
    icon: EyeOff,
  },
  {
    title: "Startpage",
    category: "Private browsing",
    issuer: "Startpage",
    summary: "A private-search option that describes unprofiled results and a no-search-history approach.",
    boundary: "Use for your own research privacy and still follow source terms, law, and the Hub’s responsible-use protocol.",
    href: "https://www.startpage.com/",
    icon: EyeOff,
  },
  {
    title: "Google Fact Check Explorer",
    category: "Information verification",
    issuer: "Google Fact Check Tools",
    summary: "Search published fact checks about a claim, topic, or image before treating online material as reliable.",
    boundary: "A fact-check result is context, not a substitute for reviewing original sources, dates, methodology, and jurisdiction.",
    href: "https://toolbox.google.com/factcheck/explorer",
    icon: SearchCheck,
  },
  {
    title: "Verification Handbook",
    category: "Information verification",
    issuer: "European Journalism Centre",
    summary: "A public guide to verifying digital content, especially user-generated photos, videos, and reports in emergency coverage.",
    boundary: "Verify content lawfully and ethically; do not use media analysis to identify, track, or expose private individuals.",
    href: "https://verificationhandbook.com/",
    icon: FileCheck2,
  },
  {
    title: "KeePass Password Safe",
    category: "Password hygiene",
    issuer: "KeePass",
    summary: "An open-source password manager intended to keep unique account credentials in an encrypted local database.",
    boundary: "Manage only credentials you own or administer. Never use password tools to access another person’s account.",
    href: "https://keepass.info/",
    icon: KeyRound,
  },
  {
    title: "1Password",
    category: "Password hygiene",
    issuer: "1Password",
    summary: "A credential-management platform for individual and organizational account access controls.",
    boundary: "Use only for authorized accounts and secrets; the Hub never asks for, receives, or stores credentials.",
    href: "https://1password.com/",
    icon: KeyRound,
  },
  {
    title: "Sync",
    category: "Private storage & communication",
    issuer: "Sync",
    summary: "A privacy-oriented cloud storage and sharing option that describes encrypted file storage and backup features.",
    boundary: "Confirm retention, sharing, legal, and organizational requirements before placing evidence or sensitive material in any cloud service.",
    href: "https://www.sync.com/",
    icon: ShieldCheck,
  },
  {
    title: "Matrix",
    category: "Private storage & communication",
    issuer: "Matrix.org Foundation",
    summary: "An open network for secure, decentralized communication with an ecosystem of clients and servers.",
    boundary: "Use communications tools responsibly; do not use them to coordinate harassment, impersonation, evasion, or prohibited activity.",
    href: "https://matrix.org/",
    icon: MessageCircleMore,
  },
  {
    title: "Google Results About You",
    category: "Digital privacy review",
    issuer: "Google Search Help",
    summary: "An official, self-directed support path for reviewing whether your own personal contact information appears in Google Search results and requesting eligible removals.",
    boundary: "Use only for your own information or with clear authority. A removal from Search may not remove the source page, and eligibility is determined by Google.",
    href: "https://support.google.com/websearch/answer/12719076",
    icon: EyeOff,
  },
  {
    title: "EFF Cover Your Tracks",
    category: "Digital privacy review",
    issuer: "Electronic Frontier Foundation",
    summary: "A self-directed browser awareness test that explains how trackers can observe browser characteristics and fingerprinting signals.",
    boundary: "Run it only for your own browser. Do not use fingerprint information to profile, correlate, or identify another person’s device.",
    href: "https://coveryourtracks.eff.org/",
    icon: ShieldCheck,
  },
];

export const PRIVACY_RESOURCE_CATEGORIES: Array<"All" | PrivacyCategory> = ["All", "Private browsing", "Information verification", "Password hygiene", "Private storage & communication", "Digital privacy review"];

export function filterCuratedPrivacyResources(category: "All" | PrivacyCategory) {
  return category === "All" ? curatedPrivacyResources : curatedPrivacyResources.filter((resource) => resource.category === category);
}

export function PrivacyResources() {
  const [category, setCategory] = useState<(typeof PRIVACY_RESOURCE_CATEGORIES)[number]>("All");
  const visibleResources = useMemo(() => filterCuratedPrivacyResources(category), [category]);

  return <section id="privacy-resources" className="relative overflow-hidden bg-[#edf3ed] px-6 py-14 sm:px-10 xl:px-16 xl:py-20"><div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(15,89,116,0.13)_1px,transparent_1px)] [background-size:22px_22px]" /><div className="relative mx-auto max-w-6xl"><div className="grid gap-10 xl:grid-cols-[0.78fr_1.22fr]"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">02C · Privacy & personal security</p><h1 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">Protect your work without stepping outside the line.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#536561]">This page audited 238 displayed links from the supplied directory and retained ten individually reviewed, defensive resources. It is for protecting your own accounts, devices, information, and research practice—not anonymity, evasion, or access to others’ data.</p><div className="mt-8 border-l-4 border-[#cf765e] bg-[#fff3ed] p-5 text-sm leading-6 text-[#74463b]"><div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a95545]"><ShieldCheck className="h-4 w-4" /> Defensive-use boundary</div><p className="mt-3">Anonymous proxies, temporary numbers or email, virtual cloud devices, leak searches, fake identities, account tools, tracking, and payment-evasion links from the directory are intentionally not reproduced.</p></div><div className="mt-7 border border-[#b7ccc4] bg-[#f8fbf7] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]"><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">A practical privacy routine</p><ol className="mt-4 space-y-3 text-xs leading-5 text-[#4c625d]"><li className="flex gap-3"><span className="font-mono text-[#176c75]">01</span><span>Use unique credentials and a manager for accounts you own or administer.</span></li><li className="flex gap-3"><span className="font-mono text-[#176c75]">02</span><span>Verify significant claims against original and independent sources before citing them.</span></li><li className="flex gap-3"><span className="font-mono text-[#176c75]">03</span><span>Keep sensitive materials in tools and storage approved for your own legal and organizational context.</span></li></ol></div></div><div><div className="flex flex-wrap gap-2 border-b border-[#b8cbc3] pb-5" aria-label="Filter curated privacy resources">{PRIVACY_RESOURCE_CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.11em] transition-colors ${category === item ? "border-[#0f5974] bg-[#0f5974] text-white" : "border-[#9fbdb4] bg-[#fffdf8] text-[#245c60] hover:border-[#0f5974] hover:bg-white"}`}>{item}</button>)}</div><div className="mt-6 grid gap-4 md:grid-cols-2">{visibleResources.map((resource, index) => { const Icon = resource.icon; return <article key={resource.title} className="relative flex min-h-[325px] flex-col overflow-hidden border border-[#b8cbc3] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(15,89,116,0.09)]"><span className="absolute right-0 top-0 border-b border-l border-[#c9d7cf] bg-[#e9f1ed] px-3 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#176c75]">Entry {String(index + 1).padStart(2, "0")}</span><span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Icon className="h-5 w-5" /></span><p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">{resource.category}</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">{resource.title}</h2><p className="mt-3 text-sm leading-6 text-[#596d67]">{resource.summary}</p><div className="mt-auto border-t border-dashed border-[#c8d7cf] pt-4"><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#37736e]">{resource.issuer}</p><p className="mt-2 text-xs leading-5 text-[#607670]">{resource.boundary}</p><a href={resource.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0f5974] underline decoration-[#8dacaa] underline-offset-4 hover:text-[#123e50]"><ExternalLink className="h-3.5 w-3.5" /> Open defensive resource</a></div></article>; })}</div><div className="mt-6 grid gap-4 sm:grid-cols-2"><a href="/research-sandbox" className="border border-[#a8c4bb] bg-[#e2efea] p-5 transition-colors hover:bg-[#d6e7df]"><CheckCircle2 className="h-5 w-5 text-[#0f5974]" /><p className="mt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#176c75]">Local-only practice</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Open Research Sandbox</h2><p className="mt-3 text-sm leading-6 text-[#536561]">Plan authorized device and workstation testing without remote devices, accounts, or outside access.</p></a><a href="/responsible-use" className="border border-[#a8c4bb] bg-[#eff4ec] p-5 transition-colors hover:bg-[#e3eddf]"><ShieldCheck className="h-5 w-5 text-[#0f5974]" /><p className="mt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#176c75]">Research boundary</p><h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Review Responsible Use</h2><p className="mt-3 text-sm leading-6 text-[#536561]">Keep every source choice, evidence note, and privacy practice aligned with the Hub’s protocol.</p></a></div></div></div></div></section>;
}
