/**
 * Civic Field Notes style reminder: an asymmetric archive desk with warm paper surfaces,
 * evidence-first source stamps, calm accountability, and Ontario Lake teal as the action signal.
 */
import { useEffect, useMemo, useState } from "react";
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
  LogIn,
  LogOut,
  MailCheck,
  MapPinned,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { resources, type Resource } from "@/lib/resources";
import { isPayPalConfigured, siteConfig } from "@/lib/site-config";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CitationLog } from "@/components/CitationLog";
import { EvidenceTools } from "@/components/EvidenceTools";
import { ResearchAssistant } from "@/components/ResearchAssistant";
import { SourceSelfCheck } from "@/components/SourceSelfCheck";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

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

const sectionNav = [
  { number: "01", label: "Workbench", id: "workbench", detail: "Guided leads" },
  { number: "02", label: "Evidence tools", id: "evidence-tools", detail: "Local & outbound" },
  { number: "03", label: "Source ledger", id: "sources", detail: `${resources.length} direct sources` },
  { number: "03A", label: "Source status", id: "source-status", detail: "On-demand monitor" },
  { number: "04", label: "Responsible use", id: "responsible-use", detail: "Method protocol" },
  { number: "05", label: "Registry & land", id: "registry-guide", detail: "Privacy-first" },
  { number: "06", label: "Citation log", id: "citation-log", detail: "Browser-local" },
  { number: "07", label: "Research guide", id: "ai-guide", detail: "Account access" },
  { number: "08", label: "Support desk", id: "support", detail: "Hosted checkout" },
] as const;

const categoryBadgeStyles: Record<Resource["category"], string> = {
  "Public records": "bg-[#3a8b83] text-[#f3fff9]",
  Legal: "bg-[#72578f] text-[#fbf6ff]",
  "Open data": "bg-[#247ba0] text-[#eefaff]",
  Archives: "bg-[#a85c7c] text-[#fff2f7]",
  Property: "bg-[#bf6b4c] text-[#fff7ed]",
  Regulatory: "bg-[#748a3f] text-[#f7ffe7]",
};

const visualAssets = {
  hero:
    import.meta.env.BASE_URL === "/"
      ? "/manus-storage/ontario-research-hero_171e7fca.jpg"
      : `${import.meta.env.BASE_URL}assets/ontario-research-hero.jpg`,
  sourceMap:
    import.meta.env.BASE_URL === "/"
      ? "/manus-storage/ontario-source-map_203feff5.jpg"
      : `${import.meta.env.BASE_URL}assets/ontario-source-map.jpg`,
  workbench:
    import.meta.env.BASE_URL === "/"
      ? "/manus-storage/research-workbench_f864f589.jpg"
      : `${import.meta.env.BASE_URL}assets/research-workbench.jpg`,
  logo:
    import.meta.env.BASE_URL === "/"
      ? "/manus-storage/ontario-research-logo_38e0db65.png"
      : `${import.meta.env.BASE_URL}assets/ontario-research-logo.png`,
};

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { user, loading: accountLoading, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<WorkbenchTab>("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [socialQuery, setSocialQuery] = useState("");
  const [socialPlatform, setSocialPlatform] = useState(socialPlatforms[0].domain);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [resourceFilter, setResourceFilter] = useState("All");
  const [municipalityFilter, setMunicipalityFilter] = useState("All municipalities");
  const [activeSection, setActiveSection] = useState<(typeof sectionNav)[number]["id"]>("workbench");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const categories = ["All", ...Array.from(new Set(resources.map((resource) => resource.category)))];
  const municipalities = Array.from(
    new Set(resources.flatMap((resource) => (resource.municipality ? [resource.municipality] : []))),
  );
  const visibleResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          (resourceFilter === "All" || resource.category === resourceFilter) &&
          (municipalityFilter === "All municipalities" || resource.municipality === municipalityFilter),
      ),
    [municipalityFilter, resourceFilter],
  );

  const normalizedEmail = email.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  useEffect(() => {
    const sections = sectionNav
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (activeEntry) setActiveSection(activeEntry.target.id as (typeof sectionNav)[number]["id"]);
      },
      { rootMargin: "-14% 0px -62% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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

  function navigateToSection(id: (typeof sectionNav)[number]["id"]) {
    setActiveSection(id);
    scrollToId(id);
  }

  function handleMunicipalityChange(value: string) {
    setMunicipalityFilter(value);
    if (value !== "All municipalities") setResourceFilter("Open data");
  }

  function handleAccountEntry() {
    startLogin();
  }

  async function handleLogout() {
    try {
      await logout();
      toast.success("You are signed out of the research workspace.");
    } catch {
      toast.error("Sign-out could not be completed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-[#152327] selection:bg-[#c6e4e9] selection:text-[#123747]">
      <div className="paper-grain pointer-events-none fixed inset-0 z-40 opacity-70" />
      <div className="relative mx-auto flex min-h-screen max-w-[1680px] flex-col lg:flex-row">
        <aside className="sticky top-0 isolate z-20 overflow-hidden border-b border-[#2c6467] bg-[#12393f] px-5 py-3 text-[#ecf0e7] shadow-[0_12px_36px_rgba(7,31,35,0.18)] lg:h-screen lg:w-[296px] lg:flex-none lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(224,244,234,0.05)_1px,transparent_1px),linear-gradient(rgba(224,244,234,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="pointer-events-none absolute bottom-0 left-7 top-0 hidden w-px bg-[#4e8080] opacity-60 lg:block" />
          <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between lg:block">
            <button
              type="button"
              onClick={() => scrollToId("top")}
              className="group flex items-center gap-3 text-left"
              aria-label="Return to the top of Ontario Research Hub"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-[#80b9b6] bg-[#f0ede2] shadow-[3px_3px_0_rgba(195,232,223,0.32)]">
                <img src={visualAssets.logo} alt="Ontario Research Hub compass lens mark" className="h-10 w-10 object-contain transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105" />
              </span>
              <span>
                <span className="block font-display text-[1.45rem] leading-none tracking-[-0.04em] text-[#f1eee2]">
                  Ontario
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9fd5cf]">
                  Research Hub
                </span>
              </span>
            </button>
            <div className="flex items-center gap-3 lg:hidden">
              <span className="h-7 border-l border-[#4e8080]" />
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <button type="button" className="inline-flex items-center gap-2 border border-[#89b9b4] bg-[#1b4a50] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f0eee3] transition-colors hover:bg-[#25565b]" aria-label="Open site navigation">
                    <Menu className="h-4 w-4" /> Menu
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-[360px] gap-0 border-[#4e8080] bg-[#12393f] p-0 text-[#edf1e7] sm:max-w-[360px]">
                  <SheetHeader className="border-b border-[#4e8080] p-6 pr-14 text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center border border-[#80b9b6] bg-[#f0ede2]"><img src={visualAssets.logo} alt="" className="h-9 w-9 object-contain" /></span>
                      <div>
                        <SheetTitle className="font-display text-2xl tracking-[-0.04em] text-[#f1eee2]">Ontario Research Hub</SheetTitle>
                        <SheetDescription className="mt-1 font-mono text-[9px] uppercase tracking-[0.17em] text-[#9fd5cf]">Field guide · public sources</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-5" aria-label="Mobile navigation">
                    {sectionNav.map(({ number, label, id, detail }) => {
                      const isCurrent = activeSection === id;
                      return (
                        <button key={id} type="button" onClick={() => { navigateToSection(id); setMobileNavOpen(false); }} aria-current={isCurrent ? "page" : undefined} className={`flex items-center gap-3 border-l-2 px-3 py-4 text-left transition-colors ${isCurrent ? "border-[#d5c86d] bg-[#e4eee7] text-[#12393f]" : "border-transparent text-[#d4e4dd] hover:border-[#80b9b6] hover:bg-[#1c4a50]"}`}>
                          <span className={`font-mono text-[10px] ${isCurrent ? "text-[#0f5974]" : "text-[#83b5b0]"}`}>{number}</span>
                          <span className="min-w-0"><span className="block text-sm font-semibold leading-none">{label}</span><span className={`mt-1 block font-mono text-[8px] uppercase tracking-[0.12em] ${isCurrent ? "text-[#3d6668]" : "text-[#8eb9b4]"}`}>{detail}</span></span>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </button>
                      );
                    })}
                  </nav>
                  <div className="mt-auto border-t border-[#4e8080] p-5">
                    <div className="mb-4 border border-[#3e7274] bg-[#0d2d31]/80 p-4">
                      {accountLoading ? <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9cbc6]">Checking workspace…</p> : isAuthenticated ? <><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#d5c86d]" /><p className="text-sm font-semibold text-white">{user?.name || "Signed-in researcher"}</p></div><button type="button" onClick={handleLogout} className="mt-3 flex w-full items-center justify-between border border-[#85afa9] px-3 py-2 text-xs font-semibold text-[#d7e4dc] hover:bg-[#1c4a50]"><span>Sign out</span><LogOut className="h-3.5 w-3.5" /></button></> : <><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9cbc6]">Optional workspace</p><p className="mt-2 text-xs leading-5 text-[#d7e4dc]">Sign in to use the research guide. The citation log stays available without an account.</p><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={handleAccountEntry} className="border border-[#d5c86d] bg-[#d5c86d] px-2 py-2 text-xs font-semibold text-[#14393d]">Create account</button><button type="button" onClick={handleAccountEntry} className="border border-[#85afa9] px-2 py-2 text-xs font-semibold text-[#d7e4dc]">Sign in</button></div></>}
                    </div>
                    <button type="button" onClick={() => { navigateToSection("support"); setMobileNavOpen(false); }} className="flex w-full items-center justify-between bg-[#d5c86d] px-4 py-3 text-left text-sm font-semibold text-[#14393d]">
                      Support the desk <ArrowDownRight className="h-4 w-4" />
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="mt-8 hidden lg:block">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#d5c86d] shadow-[0_0_0_3px_rgba(213,200,109,0.16)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b4d9d4]">Field guide · Ontario</p>
            </div>
            <div className="mt-4 h-px w-full bg-[#4e8080]" />
            <nav className="mt-5 space-y-2" aria-label="Main navigation">
              {sectionNav.map(({ number, label, id, detail }) => {
                const isCurrent = activeSection === id;
                return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateToSection(id)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`group relative flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-all duration-200 ${isCurrent ? "border-[#d5c86d] bg-[#e4eee7] text-[#12393f] shadow-[4px_4px_0_rgba(4,20,23,0.2)]" : "border-transparent text-[#d4e4dd] hover:border-[#80b9b6] hover:bg-[#1c4a50] hover:text-white"}`}
                >
                  <span className={`font-mono text-[10px] ${isCurrent ? "text-[#0f5974]" : "text-[#83b5b0]"}`}>{number}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-none">{label}</span>
                    <span className={`mt-1 block font-mono text-[8px] uppercase tracking-[0.12em] ${isCurrent ? "text-[#3d6668]" : "text-[#8eb9b4]"}`}>{detail}</span>
                  </span>
                  <ChevronRight className={`ml-auto h-4 w-4 flex-none transition-all ${isCurrent ? "translate-x-0 text-[#0f5974]" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 hidden border border-[#3e7274] bg-[#0d2d31]/80 p-4 lg:block">
            {accountLoading ? <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9cbc6]">Checking workspace…</p> : isAuthenticated ? <><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#d5c86d]" /><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9cbc6]">Research workspace</p><p className="mt-1 text-sm font-semibold text-white">{user?.name || "Signed-in researcher"}</p></div></div><button type="button" onClick={handleLogout} className="mt-4 flex w-full items-center justify-between border border-[#85afa9] px-3 py-2 text-xs font-semibold text-[#d7e4dc] hover:bg-[#1c4a50]"><span>Sign out</span><LogOut className="h-3.5 w-3.5" /></button></> : <><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9cbc6]">Optional workspace</p><p className="mt-2 text-xs leading-5 text-[#d7e4dc]">Create an account to access the research guide. The browser-local citation log never requires one.</p><button type="button" onClick={handleAccountEntry} className="mt-4 flex w-full items-center justify-between bg-[#d5c86d] px-3 py-2.5 text-left text-xs font-semibold text-[#14393d]">Create account <LogIn className="h-3.5 w-3.5" /></button><button type="button" onClick={handleAccountEntry} className="mt-2 w-full border border-[#85afa9] px-3 py-2 text-xs font-semibold text-[#d7e4dc] hover:bg-[#1c4a50]">Sign in</button></>}
          </div>

          <div className="mt-7 hidden border border-[#3e7274] bg-[#0d2d31]/80 p-4 lg:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d5c86d]">Research protocol</p>
            <p className="mt-2 text-xs leading-5 text-[#cfdfd8]">
              Use public sources lawfully. Do not harass, impersonate, or build dossiers on private individuals.
            </p>
          </div>

          <div className="mt-auto hidden lg:block lg:pt-8">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#89b9b4]">Desk status · open</p>
            <button
              type="button"
              onClick={() => navigateToSection("support")}
              className="group flex w-full items-center justify-between border border-[#d5c86d] bg-[#d5c86d] px-4 py-3 text-left text-sm font-semibold text-[#14393d] transition-all hover:-translate-y-0.5 hover:bg-[#e4d77a] active:scale-[0.98]"
            >
              Support the desk
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
          </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1" id="top">
          <section className="relative overflow-hidden border-b border-[#d7d0c4] bg-[#dce9e5]">
            <img
              src={visualAssets.hero}
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
                <img src={visualAssets.workbench} alt="Research notebook materials arranged on a desk" className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply" />
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

          <EvidenceTools />

          <section id="sources" className="scroll-mt-6 border-y border-[#b6c7c1] bg-[#17393f] px-6 py-14 text-[#edf1e7] sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b3d6d0]">03 · Source ledger</p>
                <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em]">Direct sources, stated scope.</h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-[#c5d2ca]">Start from the issuing institution or a recognized legal-information publisher. Open each destination in a new tab and follow its specific access terms.</p>
                <div className="mt-8 border-y border-[#3f696b] py-5">
                  <label className="block">
                    <span className="flex items-center justify-between gap-4 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a8cac6]">
                      Municipality focus
                      {municipalityFilter !== "All municipalities" && <span className="bg-[#d5c86d] px-2 py-1 text-[8px] text-[#16373c]">OPEN DATA ONLY</span>}
                    </span>
                    <select value={municipalityFilter} onChange={(event) => handleMunicipalityChange(event.target.value)} className="mt-3 w-full border border-[#6b9190] bg-[#143e43] px-3 py-3 text-sm font-semibold text-[#edf3eb] outline-none transition-colors focus:border-[#d5c86d] focus:ring-1 focus:ring-[#d5c86d]">
                      <option value="All municipalities">All municipalities</option>
                      {municipalities.map((municipality) => <option key={municipality} value={municipality}>{municipality}</option>)}
                    </select>
                  </label>
                  <p className="mt-2 text-xs leading-5 text-[#a7c0ba]">Choose a city to show its municipal open-data portal; provincial and citywide sources remain available under all municipalities.</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter resource categories">
                  {categories.map((category) => (
                    <button key={category} type="button" onClick={() => setResourceFilter(category)} className={`border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${resourceFilter === category ? "border-[#c9eeeb] bg-[#c9eeeb] text-[#17393f]" : "border-[#52767a] text-[#d7e4dc] hover:border-[#c9eeeb] hover:text-white"}`}>{category}</button>
                  ))}
                </div>
              </div>
              <div className="grid gap-px bg-[#52767a] sm:grid-cols-2">
                {visibleResources.map((resource, index) => (
                  <a key={resource.title} href={resource.href} target="_blank" rel="noreferrer" className="group flex min-h-[220px] flex-col bg-[#17393f] p-5 transition-colors hover:bg-[#20494c]">
                    <div className="flex items-center justify-between gap-3"><span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${categoryBadgeStyles[resource.category]} px-2.5 py-1.5`}>{String(index + 1).padStart(2, "0")} · {resource.category}</span><ExternalLink className="h-4 w-4 flex-none text-[#a8cac6] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
                    {resource.municipality && <span className="mt-3 w-fit border border-[#698d91] bg-[#234e52] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#e7c96f]">{resource.municipality}</span>}
                    <h3 className="mt-6 font-display text-3xl leading-none tracking-[-0.04em] text-[#f3f4eb]">{resource.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#b7c7bf]">{resource.description}</p>
                    <span className="mt-auto pt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8fb8b3]">{resource.note}</span>
                  </a>
                ))}
                {visibleResources.length === 0 && (
                  <div className="flex min-h-[220px] flex-col justify-center bg-[#17393f] p-6 text-[#c5d2ca] sm:col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a8cac6]">No matching source</p>
                    <p className="mt-3 max-w-md font-display text-3xl leading-none text-[#f3f4eb]">Try a different filter combination.</p>
                    <button type="button" onClick={() => { setResourceFilter("All"); setMunicipalityFilter("All municipalities"); }} className="mt-5 w-fit border border-[#c9eeeb] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c9eeeb] hover:bg-[#c9eeeb] hover:text-[#17393f]">Clear filters</button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <SourceSelfCheck />

          <section id="responsible-use" className="scroll-mt-6 bg-[#f8f5ee] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[370px] overflow-hidden border border-[#d2cabd] bg-[#ebe6da]">
                <img src={visualAssets.sourceMap} alt="Archival map materials and source-stamp tokens" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute bottom-0 left-0 max-w-sm bg-[#f6f2e9]/95 p-5 backdrop-blur-sm"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f5974]">Method matters</p><p className="mt-2 text-sm leading-6 text-[#3c514f]">Public availability does not erase privacy, context, copyright, or publication limits.</p></div>
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">04 · Responsible use</p>
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

          <section id="registry-guide" className="scroll-mt-6 border-y border-[#a9c4bd] bg-[#d7e6df] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">05 · Registry & land</p>
                <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">Research records—not people.</h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-[#4c615e]">Use corporate and land records to answer a defined entity, property, or transaction question. Keep only what the question requires, preserve the source context, and never turn an isolated record into a personal dossier.</p>
                <div className="mt-8 border-l-2 border-[#d5c86d] bg-[#edf3eb]/80 px-5 py-4">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#496e70]">Working rule</p>
                  <p className="mt-2 font-display text-2xl leading-none tracking-[-0.035em] text-[#24454a]">The smallest useful record is usually the most responsible one.</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <article className="border border-[#8baea7] bg-[#f8f5ee] p-6 shadow-[6px_6px_0_rgba(15,89,116,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Building2 className="h-5 w-5" /></span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#55716e]">Corporate registry</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Start with the entity.</h3>
                  <p className="mt-3 text-sm leading-6 text-[#536561]">Document the business, legal, compliance, or due-diligence question first. Search the organization before considering individual names, and retain only the fields needed to answer that stated question.</p>
                  <a href="https://www.ontario.ca/page/ontario-business-registry" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#0f5974] pb-1 text-xs font-semibold text-[#0f5974] transition-colors hover:text-[#16495b]">Open Ontario Business Registry <ExternalLink className="h-3.5 w-3.5" /></a>
                </article>

                <article className="border border-[#8baea7] bg-[#f8f5ee] p-6 shadow-[6px_6px_0_rgba(15,89,116,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Landmark className="h-5 w-5" /></span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#55716e]">Land title research</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Start with the parcel.</h3>
                  <p className="mt-3 text-sm leading-6 text-[#536561]">Use a property, legal-description, or transaction question as the starting point. Review only the title or instrument required, keep paid results access-controlled, and avoid combining ownership details with unrelated personal data.</p>
                  <a href="https://www.onland.ca/ui/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#0f5974] pb-1 text-xs font-semibold text-[#0f5974] transition-colors hover:text-[#16495b]">Open OnLand <ExternalLink className="h-3.5 w-3.5" /></a>
                </article>

                <div className="border border-[#8baea7] bg-[#143e43] p-6 text-[#edf3eb] lg:col-span-2">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#4f7a7a] pb-4">
                    <div>
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a8cac6]">Research control card</p>
                      <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em]">Five controls before you save a record.</h3>
                    </div>
                    <span className="border border-[#d5c86d] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#d5c86d]">Purpose-first</span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                      { icon: CircleAlert, title: "Purpose record", copy: "Write the question before searching." },
                      { icon: FileSearch, title: "Minimum collection", copy: "Keep the smallest relevant extract." },
                      { icon: ShieldCheck, title: "Access control", copy: "Share only with authorized roles." },
                      { icon: BookOpen, title: "Retention review", copy: "Set a project-end deletion date." },
                      { icon: BadgeCheck, title: "Source verification", copy: "Log issuer, link, and access date." },
                    ].map(({ icon: Icon, title, copy }, index) => (
                      <div key={title} className="border-l border-[#4f7a7a] pl-4 first:border-l-0 first:pl-0 sm:first:border-l-0 xl:border-l xl:pl-4 xl:first:border-l-0 xl:first:pl-0">
                        <span className="font-mono text-[9px] text-[#89b9b4]">0{index + 1}</span>
                        <Icon className="mt-3 h-4 w-4 text-[#d5c86d]" />
                        <h4 className="mt-3 text-sm font-semibold text-white">{title}</h4>
                        <p className="mt-1 text-xs leading-5 text-[#bed4cd]">{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CitationLog />

          <ResearchAssistant isAuthenticated={isAuthenticated} displayName={user?.name} onAccountEntry={handleAccountEntry} />

          <section id="support" className="scroll-mt-6 bg-[#cbdcd4] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
            <div className="grid gap-8 border border-[#97b8b0] bg-[#eaf0e8] p-6 shadow-[9px_9px_0_rgba(15,89,116,0.16)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">08 · Support desk</p>
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
