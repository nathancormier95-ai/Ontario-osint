import { useMemo, useState } from "react";
import { Check, ExternalLink, FileSearch, Laptop, LockKeyhole, Monitor, RotateCcw, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SANDBOX_CHECKLIST = [
  { id: "authorized", label: "I am testing software, files, or a system I own or am expressly authorized to assess." },
  { id: "testData", label: "I will use test data or lawful sample data, not personal credentials, personal accounts, or private records." },
  { id: "localNotes", label: "I will keep my plan and evidence notes under my own control and document the source, date, and scope." },
] as const;

type SandboxCheckId = (typeof SANDBOX_CHECKLIST)[number]["id"];
export type SandboxChecks = Record<SandboxCheckId, boolean>;

export function getSandboxCompletion(checks: SandboxChecks) {
  return SANDBOX_CHECKLIST.filter((item) => checks[item.id]).length;
}

const officialEnvironments = [
  {
    title: "Android Emulator",
    detail: "Test an app against Android device and API configurations on your own computer.",
    boundary: "Use only for authorized app development and testing; it is not an identity, phone-number, or account tool.",
    href: "https://developer.android.com/studio/run/emulator",
    icon: Smartphone,
  },
  {
    title: "Apple simulated devices",
    detail: "Run and debug your own app through Xcode’s simulated-device workflow on a Mac.",
    boundary: "Simulators do not reproduce every physical-device feature; do not use them to impersonate a person or access another account.",
    href: "https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices",
    icon: Monitor,
  },
  {
    title: "Windows Sandbox",
    detail: "Use a disposable Windows environment for local software testing and debugging.",
    boundary: "Review networking settings and keep networking disabled for unknown files unless you have authorization and a lawful need.",
    href: "https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/",
    icon: Laptop,
  },
];

export function ResearchSandbox() {
  const [checks, setChecks] = useState<SandboxChecks>({ authorized: false, testData: false, localNotes: false });
  const completion = useMemo(() => getSandboxCompletion(checks), [checks]);
  const ready = completion === SANDBOX_CHECKLIST.length;

  return (
    <section id="research-sandbox" className="relative overflow-hidden border-y border-[#8aaea7] bg-[#dce9e5] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(23,108,117,0.04)_1px,transparent_1px),linear-gradient(rgba(23,108,117,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative grid gap-10 xl:grid-cols-[0.76fr_1.24fr]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">02A · Research sandbox</p>
          <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">Plan a lawful test bench before you touch a device.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#536561]">This is a local planning desk for authorized software testing, evidence handling, and controlled development environments. It does not create a virtual phone or computer, open a remote desktop, provision an account, or contact another system.</p>
          <div className="mt-8 border border-[#8db0a8] bg-[#eff3eb] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]">
            <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 flex-none text-[#0f5974]" /><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Explicit boundary</p><p className="mt-2 text-xs leading-5 text-[#50625e]">No virtual identities, anonymous accounts, phone numbers, credentials, device identifiers, traffic masking, network scanning, scraping, or third-party system access are available here.</p></div></div>
          </div>
        </div>

        <div className="space-y-5">
          <article className="border border-[#7fa9a0] bg-[#143e43] p-5 text-[#edf3eb] shadow-[7px_7px_0_rgba(7,31,35,0.16)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#4f7a7a] pb-4"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a8cac6]">Local test plan</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-white">Set the scope before the sandbox.</h3></div><span className="border border-[#d5c86d] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#d5c86d]">{completion}/{SANDBOX_CHECKLIST.length} reviewed</span></div>
            <div className="mt-5 space-y-3">
              {SANDBOX_CHECKLIST.map((item) => <label key={item.id} className={`flex cursor-pointer items-start gap-3 border p-3 text-xs leading-5 transition-colors ${checks[item.id] ? "border-[#a4cfc7] bg-[#1f5257] text-white" : "border-[#4f7a7a] bg-[#0d2d31] text-[#c5d6cf] hover:border-[#82aaa5]"}`}><input type="checkbox" checked={checks[item.id]} onChange={(event) => setChecks((current) => ({ ...current, [item.id]: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-[#d5c86d]" /><span>{item.label}</span></label>)}
            </div>
            <div className={`mt-5 flex items-start gap-3 border-t pt-4 text-xs leading-5 ${ready ? "border-[#87b7ad] text-[#eff9f3]" : "border-[#4f7a7a] text-[#bed4cd]"}`}><ShieldCheck className={`mt-0.5 h-4 w-4 flex-none ${ready ? "text-[#d5c86d]" : "text-[#a8cac6]"}`} /><span>{ready ? "Scope recorded locally. You may now choose an official testing reference below; this site will not open or configure an environment for you." : "Complete the local checklist before choosing an external testing reference. Nothing in this card is stored or transmitted."}</span></div>
            <Button type="button" variant="outline" onClick={() => setChecks({ authorized: false, testData: false, localNotes: false })} className="mt-4 rounded-none border-[#7fa9a0] bg-transparent text-[#e8f2ec] hover:bg-[#1f5257] hover:text-white"><RotateCcw className="h-3.5 w-3.5" /> Clear local checklist</Button>
          </article>

          <div className="grid gap-5 lg:grid-cols-3">
            {officialEnvironments.map(({ title, detail, boundary, href, icon: Icon }) => <article key={title} className="flex flex-col border border-[#91b5ad] bg-[#fffdf8] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.09)]"><span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Icon className="h-5 w-5" /></span><p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Official testing reference</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#5c6d68]">{detail}</p><div className="mt-4 border-l-2 border-[#d5c86d] bg-[#f1f5ef] p-3 text-xs leading-5 text-[#405b56]"><strong className="font-semibold text-[#19383d]">Boundary:</strong> {boundary}</div><a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#0f5974] underline decoration-[#8dacaa] underline-offset-4 hover:text-[#123e50]"><ExternalLink className="h-3.5 w-3.5" /> Open official documentation</a></article>)}
          </div>

          <article className="border border-[#91b5ad] bg-[#f8f5ee] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.08)] sm:p-6"><div className="grid gap-5 sm:grid-cols-[auto_1fr]"><span className="flex h-11 w-11 items-center justify-center bg-[#e7ede7] text-[#0f5974]"><FileSearch className="h-5 w-5" /></span><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Evidence handoff</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Keep your workstation notes traceable.</h3><p className="mt-3 text-sm leading-6 text-[#5c6d68]">Before testing, write down the authorized scope, the software/version, the date, and the expected outcome. If you may lawfully inspect a file, the Evidence Tools page can calculate a browser-local SHA-256 hash and first-byte facts without uploading or executing it.</p><a href="/evidence-tools" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0f5974] underline decoration-[#8dacaa] underline-offset-4 hover:text-[#123e50]"><Check className="h-3.5 w-3.5" /> Open browser-local evidence tools</a></div></div></article>
        </div>
      </div>
    </section>
  );
}
