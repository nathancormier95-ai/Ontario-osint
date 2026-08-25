/**
 * Civic Field Notes style reminder: a warm paper ledger for source-level research notes.
 * This component is intentionally browser-local and makes privacy boundaries explicit.
 */
import { useEffect, useState } from "react";
import { Download, FileDown, FileText, ListPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CitationEntry = {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  accessedOn: string;
  purpose: string;
  notes: string;
  savedAt: string;
};

type CitationDraft = Omit<CitationEntry, "id" | "savedAt">;

const STORAGE_KEY = "ontario-research-hub/citation-log/v1";

const blankDraft = (): CitationDraft => ({
  sourceTitle: "",
  sourceUrl: "",
  accessedOn: new Date().toISOString().slice(0, 10),
  purpose: "",
  notes: "",
});

function readEntries(): CitationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function displayDate(value: string) {
  if (!value) return "No access date";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(date);
}

export function CitationLog() {
  const [entries, setEntries] = useState<CitationEntry[]>(readEntries);
  const [draft, setDraft] = useState<CitationDraft>(blankDraft);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      toast.error("Your browser could not save the citation log locally.");
    }
  }, [entries]);

  function updateDraft(field: keyof CitationDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sourceTitle = draft.sourceTitle.trim();
    const sourceUrl = draft.sourceUrl.trim();

    if (!sourceTitle || !sourceUrl || !draft.accessedOn) {
      toast.error("Add a source title, source URL, and access date before saving locally.");
      return;
    }

    try {
      const parsedUrl = new URL(sourceUrl);
      if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error("Unsupported protocol");
    } catch {
      toast.error("Use a complete http:// or https:// source URL.");
      return;
    }

    const entry: CitationEntry = {
      id: crypto.randomUUID(),
      sourceTitle,
      sourceUrl,
      accessedOn: draft.accessedOn,
      purpose: draft.purpose.trim(),
      notes: draft.notes.trim(),
      savedAt: new Date().toISOString(),
    };
    setEntries((current) => [entry, ...current]);
    setDraft(blankDraft());
    toast.success("Citation saved locally in this browser.");
  }

  function exportCsv() {
    if (!entries.length) {
      toast.error("Add at least one citation before exporting.");
      return;
    }
    const headings = ["Source title", "Source URL", "Access date", "Research purpose", "Notes", "Saved locally"];
    const rows = entries.map((entry) => [entry.sourceTitle, entry.sourceUrl, entry.accessedOn, entry.purpose, entry.notes, entry.savedAt]);
    const csv = [headings, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    downloadFile("ontario-research-hub-citation-log.csv", csv, "text/csv;charset=utf-8");
    toast.success("CSV citation log downloaded.");
  }

  function exportMarkdown() {
    if (!entries.length) {
      toast.error("Add at least one citation before exporting.");
      return;
    }
    const markdown = [
      "# Ontario Research Hub — Citation Log",
      "",
      "> Exported from the browser-local citation log. Review entries before sharing and remove unnecessary personal information.",
      "",
      ...entries.flatMap((entry, index) => [
        `## ${index + 1}. ${entry.sourceTitle}`,
        "",
        `- **Source URL:** ${entry.sourceUrl}`,
        `- **Access date:** ${entry.accessedOn}`,
        `- **Research purpose:** ${entry.purpose || "Not recorded"}`,
        `- **Notes:** ${entry.notes || "None"}`,
        "",
      ]),
    ].join("\n");
    downloadFile("ontario-research-hub-citation-log.md", markdown, "text/markdown;charset=utf-8");
    toast.success("Markdown citation log downloaded.");
  }

  function removeEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    toast.success("Citation removed from this browser.");
  }

  function clearEntries() {
    if (!entries.length) return;
    if (window.confirm("Clear every citation stored in this browser? This cannot be undone.")) {
      setEntries([]);
      toast.success("Local citation log cleared.");
    }
  }

  return (
    <section id="citation-log" className="scroll-mt-6 bg-[#f8f5ee] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">05 · Local citation log</p>
          <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">Keep a citation trail that stays with you.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#536561]">Save source-level references, access dates, purpose notes, and observations in your own browser. Nothing is sent to this website or a third-party service.</p>
          <div className="mt-8 border border-[#afc6bf] bg-[#e5eee8] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Local-only boundary</p>
            <ul className="mt-4 space-y-3 text-xs leading-5 text-[#46615c]">
              <li className="flex gap-3"><span className="font-mono text-[#0f5974]">01</span><span>Entries are stored only in this browser’s local storage.</span></li>
              <li className="flex gap-3"><span className="font-mono text-[#0f5974]">02</span><span>Exports download directly to your device; no account is required.</span></li>
              <li className="flex gap-3"><span className="font-mono text-[#0f5974]">03</span><span>Keep entries source-focused and avoid unnecessary personal information.</span></li>
            </ul>
          </div>
        </div>

        <div className="border border-[#b6c7c1] bg-[#fffdf8] p-5 shadow-[8px_8px_0_rgba(31,61,62,0.08)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#d2cbc0] pb-5">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Research record</p>
              <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-[#19383d]">Add a source citation.</h3>
            </div>
            <span className="border border-[#9abbb4] bg-[#e5eee8] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0f5974]">{entries.length} local {entries.length === 1 ? "entry" : "entries"}</span>
          </div>

          <form className="mt-6" onSubmit={saveEntry}>
            <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
              <label className="block"><span className="field-label">Source title</span><Input value={draft.sourceTitle} onChange={(event) => updateDraft("sourceTitle", event.target.value)} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" placeholder="e.g., Ontario Business Registry" autoComplete="off" /></label>
              <label className="block"><span className="field-label">Access date</span><Input type="date" value={draft.accessedOn} onChange={(event) => updateDraft("accessedOn", event.target.value)} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" /></label>
            </div>
            <label className="mt-4 block"><span className="field-label">Source URL</span><Input type="url" value={draft.sourceUrl} onChange={(event) => updateDraft("sourceUrl", event.target.value)} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" placeholder="https://…" autoComplete="off" /></label>
            <label className="mt-4 block"><span className="field-label">Research purpose <span className="normal-case tracking-normal text-[#7a8781]">(optional)</span></span><Input value={draft.purpose} onChange={(event) => updateDraft("purpose", event.target.value)} className="mt-2 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" placeholder="e.g., Confirming a supplier’s active registration" autoComplete="off" /></label>
            <label className="mt-4 block"><span className="field-label">Source notes <span className="normal-case tracking-normal text-[#7a8781]">(optional)</span></span><Textarea value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} className="mt-2 min-h-24 rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" placeholder="Record the relevant scope, limitations, or follow-up needed—without copying unnecessary personal details." /></label>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button type="submit" className="rounded-none bg-[#0f5974] text-white hover:bg-[#104b62]"><ListPlus className="h-4 w-4" /> Save citation locally</Button>
              <span className="text-xs leading-5 text-[#6a7873]">Saved only after you choose this action.</span>
            </div>
          </form>

          <div className="mt-8 border-t border-[#d2cbc0] pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Stored locally</p><p className="mt-1 text-sm text-[#536561]">Download your own citation trail or delete entries from this browser.</p></div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={exportCsv} className="rounded-none border-[#8facaa] text-[#0f5974] hover:bg-[#e5eee8]"><Download className="h-3.5 w-3.5" /> CSV</Button>
                <Button type="button" variant="outline" size="sm" onClick={exportMarkdown} className="rounded-none border-[#8facaa] text-[#0f5974] hover:bg-[#e5eee8]"><FileDown className="h-3.5 w-3.5" /> Markdown</Button>
                <Button type="button" variant="ghost" size="sm" onClick={clearEntries} disabled={!entries.length} className="rounded-none text-[#9a5144] hover:bg-[#f5e6df] hover:text-[#7f3f34]"><Trash2 className="h-3.5 w-3.5" /> Clear</Button>
              </div>
            </div>

            {entries.length ? (
              <div className="mt-5 divide-y divide-[#d9d1c5] border-y border-[#d9d1c5]">
                {entries.map((entry) => (
                  <article key={entry.id} className="group py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h4 className="font-display text-2xl leading-none tracking-[-0.035em] text-[#1b3b40]">{entry.sourceTitle}</h4><a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-[#0f5974] underline-offset-2 hover:underline">{entry.sourceUrl}</a></div><Button type="button" variant="ghost" size="icon-sm" onClick={() => removeEntry(entry.id)} className="flex-none rounded-none text-[#9a5144] opacity-100 hover:bg-[#f5e6df] hover:text-[#7f3f34] sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Remove ${entry.sourceTitle}`}><Trash2 className="h-4 w-4" /></Button></div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-[#65736e]"><span><strong className="font-semibold text-[#425b57]">Accessed:</strong> {displayDate(entry.accessedOn)}</span>{entry.purpose && <span><strong className="font-semibold text-[#425b57]">Purpose:</strong> {entry.purpose}</span>}</div>
                    {entry.notes && <p className="mt-2 text-xs leading-5 text-[#64716c]">{entry.notes}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-4 border border-dashed border-[#c8c1b5] bg-[#f8f5ee] p-5 text-[#63716d]"><FileText className="h-5 w-5 flex-none text-[#0f5974]" /><p className="text-sm leading-6">No citations are stored in this browser yet. Add your first source when you are ready to create a local record.</p></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
