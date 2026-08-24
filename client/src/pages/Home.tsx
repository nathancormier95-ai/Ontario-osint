/**
 * Civic Field Notes style reminder: an asymmetric archive desk with warm paper surfaces,
 * evidence-first source stamps, calm accountability, and Ontario Lake teal as the action signal.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  Compass,
  ExternalLink,
  FileSearch,
  FolderSearch,
  Landmark,
  MailCheck,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { resources } from "@/lib/resources";
import { isPayPalConfigured, siteConfig } from "@/lib/site-config";

type WorkbenchTab = "name" | "social" | "email";

const workbenchTabs: { value: WorkbenchTab; label: string; icon: LucideIcon; caption: string }[] = [
  { value: "name", label: "Name lead", icon: FileSearch, caption: "Public source query" },
  { value: "social", label: "Profile lead", icon: FolderSearch, caption: "Public social search" },
  { value: "email", label: "Email check", icon: MailCheck, caption: "Local format only" },
];

const socialPlatforms = [
  { label: "LinkedIn", domain: "linkedin.com/in" },
  { label: "Instagram", domain: "instagram.com" },
  { label: "X", domain: "x.com" },
  { label: "Facebook", domain: "facebook.com" },
];

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [socialQuery, setSocialQuery] = useState("");
  const [socialPlatform, setSocialPlatform] = useState(socialPlatforms[0].domain);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [resourceFilter, setResourceFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(resources.map((resource) => resource.category)))];
  const visibleResources = useMemo(
    () =>
      resourceFilter === "All"
        ? resources
        : resources.filter((resource) => resource.category === resourceFilter),
    [resourceFilter],
  );

  const normalizedEmail = email.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  function requireConsent() {
    if (consent) return true;
    toast.error("Confirm the responsible-use statement before opening an external search.");
    return false;
  }

  function runNameSearch() {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      toast.error("Enter a first and last name to prepare a search.");
      return;
    }
    if (!requireConsent()) return;
    const query = `"${fullName}" Ontario public source`;
    openExternal(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    toast.success("Opening your selected external search in a new tab.");
  }

  function runSocialSearch() {
    if (!socialQuery.trim()) {
      toast.error("Enter an exact public name or handle to prepare a search.");
      return;
    }
    if (!requireConsent()) return;
    const query = `site:${socialPlatform} "${socialQuery.trim()}"`;
    openExternal(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    toast.success("Opening your selected external profile search in a new tab.");
  }

  function handlePayPal() {
    if (!isPayPalConfigured) {
      toast.info("Add your hosted PayPal button URL in client/src/lib/site-config.ts to activate checkout.");
      return;
    }
    openExternal(siteConfig.paypalCheckoutUrl);
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-[#152327] selection:bg-[#c6e4e9] selection:text-[#123747]">
      <div className="paper-grain pointer-events-none fixed inset-0 z-40 opacity-70" />
      <div className="relative mx-auto flex min-h-screen max-w-[1680px] flex-col lg:flex-row">
        <aside className="relative z-20 border-b border-[#d7d0c4] bg-[#eee8da]/95 px-5 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-[276px] lg:flex-none lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <button
              type="button"
              onClick={() => scrollToId("top")}
              className="group flex items-center gap-3 text-left"
              aria-label="Return to the top of Ontario Research Hub"
            >
              <img
                src="/manus-storage/ontario-research-logo_38e0db65.png"
                alt="Ontario Research Hub compass lens mark"
                className="h-12 w-12 object-contain transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105"
              />
              <span>
                <span className="block font-display text-[1.35rem] leading-none tracking-[-0.04em] text-[#133740]">
                  Ontario
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0f5974]">
                  Research Hub
                </span>
              </span>
            </button>
            <span className="hidden h-8 border-l border-[#c9c0b1] lg:block" />
          </div>

          <div className="mt-7 hidden lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#68716d]">Ontario · CA</p>
            <div className="mt-3 h-px w-full bg-[#cbc3b7]" />
            <nav className="mt-5 space-y-1" aria-label="Main navigation">
              {[
                ["01", "Workbench", "workbench"],
                ["02", "Source ledger", "sources"],
                ["03", "Responsible use", "responsible-use"],
                ["04", "Support desk", "support"],
              ].map(([number, label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToId(id)}
                  className="group flex w-full items-center gap-3 px-2 py-2 text-left text-sm font-medium text-[#39494b] transition-colors hover:bg-[#dce9e5] hover:text-[#0f5974]"
                >
                  <span className="font-mono text-[10px] text-[#86908a]">{number}</span>
                  <span>{label}</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 hidden border-l-2 border-[#be5949] pl-4 lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3473a]">Research protocol</p>
            <p className="mt-2 text-xs leading-5 text-[#52605d]">
              Use public sources lawfully. Do not harass, impersonate, or build dossiers on private individuals.
            </p>
          </div>

          <div className="mt-auto hidden lg:block lg:pt-8">
            <button
              type="button"
              onClick={() => scrollToId("support")}
              className="group flex w-full items-center justify-between border border-[#aac8c7] bg-[#0f5974] px-4 py-3 text-left text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#104b62] active:scale-[0.98]"
            >
              Support the desk
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1" id="top">
          <section className="relative overflow-hidden border-b border-[#d7d0c4] bg-[#dce9e5]">
            <img
              src="/manus-storage/ontario-research-hero_171e7fca.jpg"
              alt="Editorial research desk with Ontario map materials and magnifying lens"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-85 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(231,239,233,0.98)_0%,rgba(231,239,233,0.9)_42%,rgba(231,239,233,0.2)_78%,rgba(231,239,233,0.15)_100%)]" />
            <div className="relative grid min-h-[550px] gap-8 px-6 py-12 sm:px-10 md:py-16 xl:grid-cols-[minmax(0,680px)_1fr] xl:px-16 xl:py-20">
              <div className="flex max-w-2xl flex-col justify-between">
                <div>
                  <div className="source-stamp inline-flex items-center gap-2 border border-[#91b9bb] bg-[#eaf4f0]/80 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#15596b]">
                    <MapPinned className="h-3.5 w-3.5" />
                    Ontario-focused · public sources
                  </div>
                  <h1 className="mt-7 max-w-[680px] font-display text-[clamp(3.2rem,7vw,6.9rem)] leading-[0.88] tracking-[-0.065em] text-[#143038]">
                    Start with a source you can cite.
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-7 text-[#3a5050] md:text-lg">
                    A responsible research desk for locating Ontario public records, legal information, open data, and public-profile leads—without collecting identifiers on this site.
                  </p>
                </div>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => scrollToId("workbench")}
                    className="group inline-flex items-center justify-center gap-3 bg-[#0f5974] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#104b62] active:scale-[0.98]"
                  >
                    Open the workbench
                    <Compass className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToId("sources")}
                    className="inline-flex items-center justify-center gap-2 border-b border-[#315a5d] pb-1 text-sm font-semibold text-[#244f53] transition-colors hover:border-[#0f5974] hover:text-[#0f5974]"
                  >
                    Browse verified sources <ArrowDownRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="hidden items-end justify-end xl:flex">
                <div className="max-w-[260px] border-l border-[#58969b] bg-[#e9eee3]/90 p-5 shadow-[8px_8px_0_rgba(15,89,116,0.15)] backdrop-blur">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f5974]">Field note 01</p>
                  <p className="mt-3 font-display text-2xl leading-none text-[#183a40]">A lead is not a conclusion.</p>
                  <p className="mt-3 text-xs leading-5 text-[#4b5c57]">Record where information came from and respect each source’s terms, access limits, and publication rules.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="workbench" className="scroll-mt-6 bg-[#f8f5ee] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#cfc7b8] pb-5">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">01 · Research workbench</p>
                    <h2 className="mt-3 font-display text-4xl tracking-[-0.045em] text-[#19343a] md:text-5xl">Choose the narrowest useful path.</h2>
                  </div>
                  <p className="max-w-xs text-sm leading-6 text-[#63716e]">Each workflow opens your search directly with an external provider. The Hub does not save, submit, or compile the information you enter.</p>
                </div>

                <div className="mt-7 grid gap-7 lg:grid-cols-[188px_minmax(0,1fr)]">
                  <div className="border-l border-[#b9c4bc] pl-4">
                    {workbenchTabs.map(({ value, label, icon: Icon, caption }) => {
                      const isActive = activeTab === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setActiveTab(value as WorkbenchTab)}
                          className={`mb-2 flex w-full items-start gap-3 px-3 py-3 text-left transition-all ${isActive ? "bg-[#dce9e5] text-[#0f5974] shadow-[3px_3px_0_rgba(15,89,116,0.14)]" : "text-[#52605d] hover:bg-[#eee8da]"}`}
                        >
                          <Icon className="mt-0.5 h-4 w-4 flex-none" />
                          <span>
                            <span className="block text-sm font-semibold">{label}</span>
                            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] opacity-75">{caption}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative border border-[#cfc7b8] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(31,61,62,0.08)] sm:p-7">
                    <div className="absolute right-0 top-0 h-8 w-8 border-b border-l border-[#cfc7b8] bg-[#f4f1e8]" />
                    {activeTab === "name" && (
                      <div className="animate-enter">
                        <div className="flex items-start gap-4">
                          <span className="flex h-9 w-9 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Search className="h-4 w-4" /></span>
                          <div>
                            <h3 className="font-display text-3xl tracking-[-0.04em] text-[#18383d]">First & last name lead</h3>
                            <p className="mt-1 text-sm leading-6 text-[#61706c]">Prepare an exact-name query for an external web search. Add your own source filters after opening the result.</p>
                          </div>
                        </div>
                        <div className="mt-7 grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="field-label">First name</span>
                            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="field-input" placeholder="e.g., Alex" autoComplete="off" />
                          </label>
                          <label className="block">
                            <span className="field-label">Last name</span>
                            <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="field-input" placeholder="e.g., Morgan" autoComplete="off" />
                          </label>
                        </div>
                        <button type="button" onClick={runNameSearch} className="primary-action mt-6"><ExternalLink className="h-4 w-4" /> Open public-source search</button>
                      </div>
                    )}

                    {activeTab === "social" && (
                      <div className="animate-enter">
                        <div className="flex items-start gap-4">
                          <span className="flex h-9 w-9 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><FolderSearch className="h-4 w-4" /></span>
                          <div>
                            <h3 className="font-display text-3xl tracking-[-0.04em] text-[#18383d]">Public-profile lead</h3>
                            <p className="mt-1 text-sm leading-6 text-[#61706c]">Use an exact public name or handle. This is a search shortcut, not a profile verification service.</p>
                          </div>
                        </div>
                        <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_170px]">
                          <label className="block"><span className="field-label">Name or public handle</span><input value={socialQuery} onChange={(event) => setSocialQuery(event.target.value)} className="field-input" placeholder="e.g., alexmorgan" autoComplete="off" /></label>
                          <label className="block"><span className="field-label">Search space</span><select value={socialPlatform} onChange={(event) => setSocialPlatform(event.target.value)} className="field-input appearance-none">{socialPlatforms.map((platform) => <option key={platform.domain} value={platform.domain}>{platform.label}</option>)}</select></label>
                        </div>
                        <button type="button" onClick={runSocialSearch} className="primary-action mt-6"><ExternalLink className="h-4 w-4" /> Open profile search</button>
                      </div>
                    )}

                    {activeTab === "email" && (
                      <div className="animate-enter">
                        <div className="flex items-start gap-4">
                          <span className="flex h-9 w-9 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><MailCheck className="h-4 w-4" /></span>
                          <div>
                            <h3 className="font-display text-3xl tracking-[-0.04em] text-[#18383d]">Email format check</h3>
                            <p className="mt-1 text-sm leading-6 text-[#61706c]">This local check only reviews syntax in your browser. It does not send the address to any service or claim account ownership.</p>
                          </div>
                        </div>
                        <label className="mt-7 block"><span className="field-label">Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" placeholder="name@example.ca" inputMode="email" autoComplete="off" /></label>
                        {normalizedEmail && (
                          <div className={`mt-5 flex items-start gap-3 border-l-2 px-4 py-3 text-sm leading-6 ${emailIsValid ? "border-[#43806d] bg-[#e7f1e9] text-[#245746]" : "border-[#be5949] bg-[#f9e9e4] text-[#8a4035]"}`}>
                            {emailIsValid ? <Check className="mt-0.5 h-4 w-4 flex-none" /> : <X className="mt-0.5 h-4 w-4 flex-none" />}
                            <span>{emailIsValid ? "This address follows a standard email format. No external check was performed." : "This does not look like a complete standard email format. Review the address locally before taking any next step."}</span>
                          </div>
                        )}
                        <div className="mt-6 border-t border-dashed border-[#d2cbc0] pt-5 text-xs leading-5 text-[#66736e]">For security-sensitive assessments, use a vetted service only with authorization from the address owner or your organization.</div>
                      </div>
                    )}

                    {activeTab !== "email" && (
                      <label className="mt-7 flex items-start gap-3 border-t border-dashed border-[#d2cbc0] pt-5 text-xs leading-5 text-[#61706c]">
                        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0f5974]" />
                        <span>I confirm that I have a lawful, legitimate purpose and will respect privacy, platform terms, and publication restrictions.</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <aside className="relative overflow-hidden border border-[#b3c9c3] bg-[#dce9e5] p-6 shadow-[6px_6px_0_rgba(15,89,116,0.12)] xl:mt-14">
                <img src="/manus-storage/research-workbench_f864f589.jpg" alt="Research notebook materials arranged on a desk" className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply" />
                <div className="relative">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f5974]">Before you search</p>
                  <h3 className="mt-4 font-display text-3xl leading-none tracking-[-0.045em] text-[#18393f]">Keep your working record clean.</h3>
                  <div className="mt-7 space-y-5">
                    {[
                      { icon: ShieldCheck, title: "Set a research purpose", copy: "Know the question you are trying to answer before collecting a lead." },
                      { icon: BookOpen, title: "Record the source", copy: "Keep a link, access date, and the context where information appeared." },
                      { icon: BadgeCheck, title: "Verify independently", copy: "A public result can be inaccurate, incomplete, or stale." },
                    ].map(({ icon: Icon, title, copy }) => (
                      <div key={title} className="flex gap-3">
                        <Icon className="mt-0.5 h-4 w-4 flex-none text-[#0f5974]" />
                        <p className="text-xs leading-5 text-[#415653]"><strong className="font-semibold text-[#244c4d]">{title}.</strong> {copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section id="sources" className="scroll-mt-6 border-y border-[#b6c7c1] bg-[#17393f] px-6 py-14 text-[#edf1e7] sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b3d6d0]">02 · Source ledger</p>
                <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em]">Direct sources, stated scope.</h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-[#c5d2ca]">Start from the issuing institution or a recognized legal-information publisher. Open each destination in a new tab and follow its specific access terms.</p>
                <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter resource categories">
                  {categories.map((category) => (
                    <button key={category} type="button" onClick={() => setResourceFilter(category)} className={`border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${resourceFilter === category ? "border-[#c9eeeb] bg-[#c9eeeb] text-[#17393f]" : "border-[#52767a] text-[#d7e4dc] hover:border-[#c9eeeb] hover:text-white"}`}>{category}</button>
                  ))}
                </div>
              </div>
              <div className="grid gap-px bg-[#52767a] sm:grid-cols-2">
                {visibleResources.map((resource, index) => (
                  <a key={resource.title} href={resource.href} target="_blank" rel="noreferrer" className="group flex min-h-[220px] flex-col bg-[#17393f] p-5 transition-colors hover:bg-[#20494c]">
                    <div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#a8cac6]">{String(index + 1).padStart(2, "0")} · {resource.category}</span><ExternalLink className="h-4 w-4 text-[#a8cac6] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
                    <h3 className="mt-6 font-display text-3xl leading-none tracking-[-0.04em] text-[#f3f4eb]">{resource.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#b7c7bf]">{resource.description}</p>
                    <span className="mt-auto pt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8fb8b3]">{resource.note}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section id="responsible-use" className="scroll-mt-6 bg-[#f8f5ee] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[370px] overflow-hidden border border-[#d2cabd] bg-[#ebe6da]">
                <img src="/manus-storage/ontario-source-map_203feff5.jpg" alt="Archival map materials and source-stamp tokens" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute bottom-0 left-0 max-w-sm bg-[#f6f2e9]/95 p-5 backdrop-blur-sm"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f5974]">Method matters</p><p className="mt-2 text-sm leading-6 text-[#3c514f]">Public availability does not erase privacy, context, copyright, or publication limits.</p></div>
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">03 · Responsible use</p>
                <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19363b]">Build a trail—not a target file.</h2>
                <p className="mt-6 max-w-lg text-base leading-7 text-[#52625e]">Ontario Research Hub is an orientation tool. It helps people find source pages and prepare transparent searches, but it does not identify people, scrape accounts, access private data, or establish facts.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Landmark, title: "Use stated sources", body: "Prefer the issuing institution." },
                    { icon: CircleAlert, title: "Respect limits", body: "Do not copy, share, or reuse restricted results." },
                    { icon: Sparkles, title: "Keep context", body: "Separate leads from verified findings." },
                  ].map(({ icon: Icon, title, body }) => <div key={title} className="border-t-2 border-[#0f5974] pt-4"><Icon className="h-4 w-4 text-[#0f5974]" /><h3 className="mt-4 text-sm font-semibold text-[#244a4d]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#65736e]">{body}</p></div>)}
                </div>
              </div>
            </div>
          </section>

          <section id="support" className="scroll-mt-6 bg-[#cbdcd4] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-8 border border-[#97b8b0] bg-[#eaf0e8] p-6 shadow-[9px_9px_0_rgba(15,89,116,0.16)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">04 · Support desk</p>
                <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#19383e] md:text-5xl">Keep the source ledger open.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#52625f]">This GitHub-hosted front end uses a PayPal hosted checkout link, so payment entry occurs on PayPal rather than on this site. Add your approved hosted button URL, terms, privacy notice, and refund policy before enabling a live payment page.</p>
              </div>
              <div className="min-w-[260px] border-l-2 border-[#0f5974] pl-5">
                <p className="text-sm font-semibold text-[#244b4e]">{siteConfig.supportLabel}</p>
                <p className="mt-1 text-xs leading-5 text-[#65736e]">Secure checkout opens on PayPal.</p>
                <button type="button" onClick={handlePayPal} className="primary-action mt-5 w-full justify-center"><span className="font-bold">PayPal</span> Continue to checkout <ExternalLink className="h-4 w-4" /></button>
                {!isPayPalConfigured && <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8e4a3f]">Setup required: add hosted payment URL</p>}
              </div>
            </div>
          </section>

          <footer className="border-t border-[#cfc7b8] bg-[#eee8da] px-6 py-7 sm:px-10 xl:px-16">
            <div className="flex flex-col justify-between gap-5 text-xs leading-5 text-[#64706c] md:flex-row md:items-center">
              <p>Ontario Research Hub is a front-end source directory. It does not provide legal advice, investigative services, or identity verification.</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f5974]">No identifier storage · outbound sources only</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
