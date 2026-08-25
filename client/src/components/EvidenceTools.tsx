/**
 * Civic Field Notes style reminder: evidence supports a defined research question; it does not justify broader surveillance.
 * Adapted from the uploaded archive's Domain OSINT and File Analyzer concepts with no active scanning, no uploads, and no server storage.
 */
import { useRef, useState } from "react";
import { Check, Copy, ExternalLink, FileSearch, Globe2, Hash, Info, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FileEvidence = {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  sha256: string;
  magicBytes: string;
};

type DomainSourceKind = "icann" | "certificates";

export const CANADIAN_VEHICLE_SPECS_URL = "https://vpic.nhtsa.dot.gov/decoder/CaVehSpec?year=2026";
export const MAX_LOCAL_FILE_BYTES = 25 * 1_024 * 1_024;

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatBytes(bytes: number) {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

export function normalizeDomain(value: string) {
  const candidate = value.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0]?.replace(/^www\./, "") ?? "";
  const parts = candidate.split(".");
  const isIpv4 = parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
  if (isIpv4) return null;
  const valid = /^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i.test(candidate);
  return valid ? candidate : null;
}

export function normalizeVin(value: string) {
  const candidate = value.toUpperCase().replace(/[\s-]/g, "");
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(candidate) ? candidate : null;
}

export function buildDomainSourceUrl(domain: string, kind: DomainSourceKind) {
  return kind === "icann"
    ? `https://lookup.icann.org/en/lookup?name=${encodeURIComponent(domain)}`
    : `https://crt.sh/?q=${encodeURIComponent(`%.${domain}`)}`;
}

export function buildVinReferenceUrl(vin: string) {
  return `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`;
}

export function isVinReferenceAuthorized(vin: string, hasAcknowledged: boolean) {
  return Boolean(normalizeVin(vin)) && hasAcknowledged;
}

export function canAnalyzeLocalFileSize(size: number) {
  return size <= MAX_LOCAL_FILE_BYTES;
}

export async function copyEvidenceHash(hash: string, writeText: (value: string) => Promise<void>) {
  await writeText(hash);
}

export async function analyzeLocalFile(file: File): Promise<FileEvidence> {
  const buffer = await file.arrayBuffer();
  const firstBytes = new Uint8Array(buffer.slice(0, 12));
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return {
    name: file.name,
    size: file.size,
    type: file.type || "Unspecified browser type",
    lastModified: new Date(file.lastModified).toLocaleString(),
    sha256: bytesToHex(digest),
    magicBytes: Array.from(firstBytes).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ") || "No bytes available",
  };
}

export function EvidenceTools() {
  const [domain, setDomain] = useState("");
  const [vin, setVin] = useState("");
  const [vinConsent, setVinConsent] = useState(false);
  const [fileEvidence, setFileEvidence] = useState<FileEvidence | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openDomainSource(kind: DomainSourceKind) {
    const normalized = normalizeDomain(domain);
    if (!normalized) {
      toast.error("Enter a complete domain such as example.ca. This tool does not accept IP addresses or URLs with paths.");
      return;
    }
    const href = buildDomainSourceUrl(normalized, kind);
    window.open(href, "_blank", "noopener,noreferrer");
    toast.success("Opening the selected public domain source in a new tab.");
  }

  function openVehicleReference() {
    const normalized = normalizeVin(vin);
    if (!normalized) {
      toast.error("Enter a complete 17-character VIN. I, O, and Q are not used in standard VINs.");
      return;
    }
    if (!isVinReferenceAuthorized(vin, vinConsent)) {
      toast.error("Confirm the vehicle-reference acknowledgement before opening the official decoder.");
      return;
    }
    window.open(buildVinReferenceUrl(normalized), "_blank", "noopener,noreferrer");
    toast.success("Opening the official public vehicle-specification source in a new tab.");
  }

  async function handleFile(file?: File) {
    if (!file) return;
    if (!canAnalyzeLocalFileSize(file.size)) {
      toast.error("Choose a file of 25 MB or less for local browser analysis.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const evidence = await analyzeLocalFile(file);
      setFileEvidence(evidence);
      toast.success("Local file evidence prepared. No file was uploaded.");
    } catch {
      toast.error("The browser could not read this file locally.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function copyHash() {
    if (!fileEvidence) return;
    try {
      await copyEvidenceHash(fileEvidence.sha256, (value) => navigator.clipboard.writeText(value));
      toast.success("SHA-256 copied to your clipboard.");
    } catch {
      toast.error("Your browser did not allow clipboard access.");
    }
  }

  return (
    <section id="evidence-tools" className="scroll-mt-6 border-y border-[#a9c4bd] bg-[#dce9e5] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">02 · Evidence tools</p>
          <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">Keep the evidence path local and deliberate.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#536561]">This desk adapts selected archive tools into non-invasive research aids. It does not scan networks, enumerate services, upload files, or collect identifiers.</p>
          <div className="mt-8 border border-[#8db0a8] bg-[#eff3eb] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#0f5974]" /><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Use boundary</p><p className="mt-2 text-xs leading-5 text-[#50625e]">Use domain sources only for a site you own, administer, or are authorized to assess. Use local file evidence only with files you may lawfully inspect. A hash or file header is context—not a safety verdict.</p></div></div></div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="border border-[#91b5ad] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(15,89,116,0.1)] sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Globe2 className="h-5 w-5" /></span>
            <p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Public domain sources</p>
            <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Open a domain record.</h3>
            <p className="mt-3 text-sm leading-6 text-[#5c6d68]">Prepare a domain, then choose an independent public source. No request is sent by this site; the selected source opens in a separate tab.</p>
            <label className="mt-5 block"><span className="field-label">Domain only</span><Input value={domain} onChange={(event) => setDomain(event.target.value)} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" placeholder="example.ca" autoComplete="off" /></label>
            <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button type="button" onClick={() => openDomainSource("icann")} variant="outline" className="rounded-none border-[#779b94] text-[#0f5974] hover:bg-[#e5eee8]"><ExternalLink className="h-3.5 w-3.5" /> ICANN lookup</Button><Button type="button" onClick={() => openDomainSource("certificates")} variant="outline" className="rounded-none border-[#779b94] text-[#0f5974] hover:bg-[#e5eee8]"><ExternalLink className="h-3.5 w-3.5" /> Certificate log</Button></div>
          </article>

          <article className="border border-[#91b5ad] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(15,89,116,0.1)] sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><FileSearch className="h-5 w-5" /></span>
            <p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Local file evidence</p>
            <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Hash a file in your browser.</h3>
            <p className="mt-3 text-sm leading-6 text-[#5c6d68]">Generate a SHA-256 hash, inspect the first bytes, and capture browser-visible file facts. The file stays on your device and is never uploaded or executed.</p>
            <input ref={inputRef} type="file" className="sr-only" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <Button type="button" onClick={() => inputRef.current?.click()} disabled={isAnalyzing} className="mt-5 w-full rounded-none bg-[#0f5974] text-white hover:bg-[#104b62]"><Upload className="h-4 w-4" /> {isAnalyzing ? "Preparing local evidence…" : "Choose a file (25 MB max)"}</Button>
          </article>

          <article className="border border-[#91b5ad] bg-[#fffdf8] p-5 shadow-[6px_6px_0_rgba(15,89,116,0.1)] lg:col-span-2 sm:p-6">
            <div className="grid gap-6 md:grid-cols-[0.78fr_1.22fr] md:items-start"><div><span className="flex h-10 w-10 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Hash className="h-5 w-5" /></span><p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Public vehicle reference</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Read the specification—not the owner.</h3><p className="mt-3 text-sm leading-6 text-[#5c6d68]">The VIN workflow from the uploaded archive is adapted as an external official vehicle-specification reference. It does not search an Ontario licence plate, locate a vehicle, identify an owner, or establish history.</p></div><div><label className="block"><span className="field-label">17-character VIN</span><Input value={vin} onChange={(event) => setVin(event.target.value.toUpperCase())} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] font-mono tracking-[0.1em] text-[#19383d]" placeholder="1HGBH41JXMN109186" maxLength={22} autoComplete="off" /></label><label className="mt-4 flex items-start gap-3 border border-[#b9ccc5] bg-[#edf3ed] p-3 text-xs leading-5 text-[#405b56]"><input type="checkbox" checked={vinConsent} onChange={(event) => setVinConsent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0f5974]" /><span>I have a lawful purpose to review this vehicle’s encoded specification. I will not use this tool to infer ownership, location, insurance, or other sensitive information.</span></label><Button type="button" onClick={openVehicleReference} className="mt-4 rounded-none bg-[#0f5974] text-white hover:bg-[#104b62]"><ExternalLink className="h-4 w-4" /> Open official VIN specification source</Button><a href={CANADIAN_VEHICLE_SPECS_URL} target="_blank" rel="noreferrer" className="mt-3 flex items-start gap-2 border border-[#8facaa] bg-[#f8f5ee] p-3 text-left text-xs leading-5 text-[#315e63] transition-colors hover:bg-[#e5eee8]"><ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-none" /><span><strong className="font-semibold">Canadian Vehicle Specifications</strong> · vehicle-dimensions reference compiled annually by Transport Canada; not a registration, ownership, plate, location, insurance, or vehicle-history search.</span></a><p className="mt-3 text-xs leading-5 text-[#6a7873]">The VIN is sent directly to the official external decoder only after you choose to open it; the Hub does not save or transmit it.</p></div></div>
          </article>

          {fileEvidence && <article className="border border-[#7fa9a0] bg-[#143e43] p-5 text-[#edf3eb] shadow-[6px_6px_0_rgba(7,31,35,0.18)] lg:col-span-2 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#4f7a7a] pb-4"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a8cac6]">Local result · no upload</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-white">{fileEvidence.name}</h3></div><span className="flex items-center gap-2 border border-[#d5c86d] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#d5c86d]"><Check className="h-3.5 w-3.5" /> Browser only</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a8cac6]">SHA-256</p><div className="mt-2 flex gap-2"><code className="min-w-0 flex-1 break-all border border-[#4f7a7a] bg-[#0d2d31] p-3 text-xs leading-5 text-[#e6eee9]">{fileEvidence.sha256}</code><Button type="button" size="icon" onClick={copyHash} className="h-auto rounded-none bg-[#d5c86d] text-[#14393d] hover:bg-[#e4d77a]" aria-label="Copy SHA-256"><Copy className="h-4 w-4" /></Button></div></div><div className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs leading-5 text-[#c5d6cf]"><p><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#a8cac6]">Size</span>{formatBytes(fileEvidence.size)}</p><p><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#a8cac6]">Browser type</span>{fileEvidence.type}</p><p><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#a8cac6]">Modified</span>{fileEvidence.lastModified}</p><p><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#a8cac6]">First bytes</span><code className="text-[#edf3eb]">{fileEvidence.magicBytes}</code></p></div></div><div className="mt-5 flex items-start gap-3 border-t border-[#4f7a7a] pt-4 text-xs leading-5 text-[#bed4cd]"><Info className="mt-0.5 h-4 w-4 flex-none text-[#d5c86d]" /><span>Use this evidence to compare a known-good hash or document a file’s provenance. It does not establish that a file is safe or malicious.</span></div></article>}
        </div>
      </div>
    </section>
  );
}
