/**
 * Civic Field Notes style reminder: source availability is a maintenance signal, not proof of a record or a research result.
 */
import { CircleAlert, CircleCheckBig, Clock3, ExternalLink, Loader2, LockKeyhole, RefreshCcw, ShieldAlert, SignalHigh } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const statusAppearance = {
  available: { label: "Reachable", icon: CircleCheckBig, className: "border-[#74b989] bg-[#dff1dd] text-[#245d41]" },
  restricted: { label: "Access restricted", icon: ShieldAlert, className: "border-[#dfb05a] bg-[#fff0c7] text-[#725018]" },
  attention: { label: "Needs review", icon: CircleAlert, className: "border-[#e38a77] bg-[#ffe0d7] text-[#8d3e32]" },
  unreachable: { label: "Unavailable", icon: CircleAlert, className: "border-[#a67db5] bg-[#f1e0f3] text-[#6d3f77]" },
} as const;

function displayCheckedAt(value?: string) {
  if (!value) return "No on-demand check has been run in this session.";
  return `Checked ${new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))}`;
}

export function SourceSelfCheck() {
  const { isAuthenticated, loading: accountLoading } = useAuth();
  const checker = trpc.sourceStatus.run.useMutation();
  const results = checker.data?.results ?? [];
  const availableCount = results.filter((result) => result.status === "available").length;

  return (
    <section id="source-status" className="scroll-mt-6 overflow-hidden border-y border-[#b4c9c2] bg-[#f4eee1] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden border border-[#b8c6bc] bg-[#fffdf7] shadow-[10px_10px_0_rgba(36,96,93,0.13)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#e88364_0%,#e88364_22%,#e0c55f_22%,#e0c55f_47%,#71b591_47%,#71b591_72%,#6498bf_72%,#6498bf_100%)]" />
        <div className="grid gap-9 p-6 pt-10 lg:grid-cols-[0.78fr_1.22fr] sm:p-9 sm:pt-12">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#156a75]">03A · Source status</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.88] tracking-[-0.055em] text-[#1b3d45]">Keep the source path open.</h2>
            <p className="mt-5 text-sm leading-6 text-[#526662]">Run a bounded availability check against the fixed public-source ledger. The check sends no research terms, names, VINs, files, or visitor-provided URLs.</p>
            <div className="mt-7 border-l-4 border-[#e88364] bg-[#fff2ec] p-4 text-xs leading-5 text-[#75443a]"><strong className="font-semibold">Scope note.</strong> A reachable page only confirms that the destination responded. It does not confirm access rights, a successful search, a current record, or the accuracy of a source’s content.</div>
          </div>

          <div className="border border-[#b8c6bc] bg-[#eef5ee] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#156a75]">On-demand monitor</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-[#1b3d45]">Approved sources only.</h3></div><span className="flex items-center gap-2 border border-[#87a69a] bg-[#fffdf7] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#47665e]"><SignalHigh className="h-3.5 w-3.5 text-[#3b9079]" /> {results.length ? `${availableCount}/${results.length} reachable` : "Ready"}</span></div>

            {!accountLoading && !isAuthenticated && <div className="mt-6 border border-[#ddc467] bg-[#fff3c8] p-4"><div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 flex-none text-[#705018]" /><div><p className="text-sm font-semibold text-[#624514]">Sign in to run availability checks.</p><p className="mt-1 text-xs leading-5 text-[#76591f]">This protects the fixed source monitor from unnecessary automated traffic. It never stores a check history in your account.</p></div></div><Button type="button" size="sm" onClick={startLogin} className="mt-4 rounded-none bg-[#85662d] text-white hover:bg-[#6f5427]"><LockKeyhole className="h-3.5 w-3.5" /> Create account / sign in</Button></div>}
            {accountLoading && <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5f7872]">Checking account access…</p>}
            {isAuthenticated && <><div className="mt-6 flex flex-wrap items-center gap-3"><Button type="button" onClick={() => checker.mutate()} disabled={checker.isPending} className="rounded-none bg-[#176c75] text-white hover:bg-[#105962]"><RefreshCcw className={`h-4 w-4 ${checker.isPending ? "animate-spin" : ""}`} /> {checker.isPending ? "Checking approved sources…" : results.length ? "Run self-check again" : "Run self-check"}</Button><span className="flex items-center gap-2 text-xs text-[#5d706b]"><Clock3 className="h-3.5 w-3.5 text-[#61918b]" /> {displayCheckedAt(checker.data?.checkedAt)}</span></div>{checker.isError && <p className="mt-4 border border-[#df9986] bg-[#fff0ea] p-3 text-xs leading-5 text-[#87463b]">The source monitor could not complete. Your research data was not affected; try again later.</p>}{results.length > 0 && <div className="mt-6 grid gap-2 sm:grid-cols-2">{results.map((result) => { const appearance = statusAppearance[result.status]; const Icon = appearance.icon; return <a key={result.id} href={result.href} target="_blank" rel="noreferrer" className={`group flex items-start gap-3 border p-3 text-left transition-transform hover:-translate-y-0.5 ${appearance.className}`}><Icon className="mt-0.5 h-4 w-4 flex-none" /><span className="min-w-0 flex-1"><span className="block text-xs font-semibold leading-5">{result.title}</span><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">{appearance.label}{result.statusCode ? ` · HTTP ${result.statusCode}` : ""} · {result.durationMs} ms</span></span><ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-none opacity-70 group-hover:opacity-100" /></a>; })}</div>}</>}
          </div>
        </div>
      </div>
    </section>
  );
}
