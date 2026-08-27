/**
 * Civic Field Notes style reminder: a personal research shelf that organizes only citations a researcher explicitly chose to sync.
 */
import { useMemo, useState } from "react";
import { Archive, Check, FolderPlus, Layers3, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type Accent = "teal" | "coral" | "violet" | "gold" | "blue";

type Draft = { name: string; description: string; accent: Accent };

const blankDraft = (): Draft => ({ name: "", description: "", accent: "teal" });

const accents: Record<Accent, { label: string; chip: string; card: string }> = {
  teal: { label: "Lake teal", chip: "bg-[#3a8b83]", card: "border-[#73aaa1] bg-[#e5f3ee]" },
  coral: { label: "Archive coral", chip: "bg-[#cf765e]", card: "border-[#e5a08c] bg-[#fff0ea]" },
  violet: { label: "Legal violet", chip: "bg-[#7a5e98]", card: "border-[#b6a2cc] bg-[#f2ebfa]" },
  gold: { label: "Registry gold", chip: "bg-[#b89432]", card: "border-[#ddc578] bg-[#fff6d9]" },
  blue: { label: "Data blue", chip: "bg-[#357fa1]", card: "border-[#89b9d0] bg-[#e7f5fb]" },
};

export function PersonalDashboard() {
  const { user, isAuthenticated, loading: accountLoading } = useAuth();
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const overview = trpc.researchCollections.overview.useQuery(undefined, { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false });

  const setOverview = (state: NonNullable<typeof overview.data>) => utils.researchCollections.overview.setData(undefined, state);
  const createMutation = trpc.researchCollections.create.useMutation({
    onSuccess: (state) => { setOverview(state); setDraft(blankDraft()); toast.success("Research collection created in your account."); },
    onError: (error) => toast.error(error.message),
  });
  const updateMutation = trpc.researchCollections.update.useMutation({
    onSuccess: (state) => { setOverview(state); setDraft(blankDraft()); setEditingId(null); toast.success("Research collection updated."); },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = trpc.researchCollections.delete.useMutation({
    onSuccess: (state) => { setOverview(state); toast.success("Collection deleted. Your synced citations remain in your account."); },
    onError: (error) => toast.error(error.message),
  });

  const state = overview.data;
  const collections = state?.collections ?? [];
  const citationsById = useMemo(() => new Map((state?.citations ?? []).map((citation) => [citation.id, citation])), [state?.citations]);
  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function updateDraft<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) { toast.error("Add a collection name before saving."); return; }
    const collection = { name: draft.name.trim(), description: draft.description.trim(), accent: draft.accent };
    if (editingId) updateMutation.mutate({ id: editingId, collection });
    else createMutation.mutate(collection);
  }

  function beginEdit(collection: NonNullable<typeof state>["collections"][number]) {
    setEditingId(collection.id);
    setDraft({ name: collection.name, description: collection.description, accent: collection.accent as Accent });
  }

  function cancelEdit() { setEditingId(null); setDraft(blankDraft()); }

  function deleteCollection(id: string, name: string) {
    if (window.confirm(`Delete “${name}”? Citations stay in your synced account log.`)) deleteMutation.mutate({ id });
  }

  return (
    <section id="dashboard" className="scroll-mt-6 bg-[#eaf1ee] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#176c75]">05A · Personal dashboard</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.88] tracking-[-0.055em] text-[#1b3d45]">Keep a research shelf, not a dossier.</h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#536762]">Organize account-backed citations into named collections. Browser-local citations remain yours and are never copied here unless you explicitly enable and run citation sync.</p>
            <div className="mt-7 border-l-4 border-[#c97760] bg-[#fff1eb] p-4 text-xs leading-5 text-[#74463b]"><strong className="font-semibold">Your control.</strong> Collections contain citation references only. You can delete a collection without deleting its citations, or disconnect citation sync to delete all account-backed collections and synced citations.</div>
          </div>

          <div className="border border-[#b5c9c1] bg-[#fffdf8] p-5 shadow-[8px_8px_0_rgba(26,103,100,0.12)] sm:p-7">
            {!accountLoading && !isAuthenticated && <div className="flex min-h-[280px] flex-col justify-center border border-dashed border-[#aabeb6] bg-[#f5faf6] p-6 text-center"><Archive className="mx-auto h-9 w-9 text-[#176c75]" /><h3 className="mt-4 font-display text-3xl leading-none text-[#1b3d45]">Your shelf is ready when you are.</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5d716c]">Sign in to create collections. You will still need to explicitly enable citation sync before account-backed citations can be assigned.</p><Button type="button" onClick={startLogin} className="mx-auto mt-5 rounded-none bg-[#176c75] text-white hover:bg-[#105962]">Create account / sign in</Button></div>}
            {accountLoading && <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5e7c75]">Checking research workspace…</p>}
            {isAuthenticated && overview.isLoading && <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5e7c75]">Loading your account-backed research shelf…</p>}
            {isAuthenticated && !overview.isLoading && !state?.enabled && <div className="border border-[#dfc26a] bg-[#fff4cf] p-5"><ShieldCheck className="h-6 w-6 text-[#74561b]" /><h3 className="mt-3 font-display text-3xl leading-none text-[#604916]">Citation sync is off.</h3><p className="mt-3 text-sm leading-6 text-[#705c29]">Enable it in the Citation Log to create an explicit account-backed copy. Until then, your citations remain only in your browser and collections stay unavailable.</p></div>}
            {isAuthenticated && !overview.isLoading && state?.enabled && <><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d5ddd5] pb-5"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">{user?.name || "Researcher"}’s workspace</p><h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.04em] text-[#1b3d45]">{collections.length} collection{collections.length === 1 ? "" : "s"} · {state.citations.length} synced citation{state.citations.length === 1 ? "" : "s"}</h3></div><span className="flex items-center gap-2 border border-[#8eb9ab] bg-[#e8f4ec] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#31665b]"><Check className="h-3.5 w-3.5" /> Sync enabled</span></div>

              <form className="mt-6 border border-[#c7d5cd] bg-[#f7fbf7] p-4 sm:p-5" onSubmit={saveCollection}><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#176c75]">{editingId ? "Edit collection" : "New collection"}</p><p className="mt-1 text-xs text-[#627670]">Use collections for projects, evidence sets, or review contexts—not profiles of people.</p></div>{editingId && <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="rounded-none text-[#657a74] hover:bg-white">Cancel</Button>}</div><div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]"><label className="block"><span className="field-label">Collection name</span><Input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} className="mt-2 rounded-none border-[#bdcec5] bg-white text-[#193a40]" placeholder="e.g., Supplier review" autoComplete="off" /></label><label className="block"><span className="field-label">Accent</span><select value={draft.accent} onChange={(event) => updateDraft("accent", event.target.value as Accent)} className="mt-2 h-10 w-full border border-[#bdcec5] bg-white px-3 text-sm font-semibold text-[#193a40] outline-none focus:border-[#176c75]">{Object.entries(accents).map(([value, accent]) => <option key={value} value={value}>{accent.label}</option>)}</select></label></div><label className="mt-4 block"><span className="field-label">Context <span className="normal-case tracking-normal text-[#7b8c86]">(optional)</span></span><Textarea value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} className="mt-2 min-h-20 rounded-none border-[#bdcec5] bg-white text-[#193a40]" placeholder="Describe the authorized research purpose and scope." /></label><Button type="submit" disabled={isBusy} className="mt-4 rounded-none bg-[#176c75] text-white hover:bg-[#105962]"><FolderPlus className="h-4 w-4" /> {editingId ? "Save collection" : "Create collection"}</Button></form>

              {collections.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{collections.map((collection) => { const accent = accents[collection.accent as Accent] ?? accents.teal; const citations = collection.citationIds.map((id) => citationsById.get(id)).filter(Boolean); return <article key={collection.id} className={`border p-5 ${accent.card}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className={`mb-4 block h-2 w-10 ${accent.chip}`} /><h4 className="font-display text-3xl leading-none tracking-[-0.04em] text-[#1c3d43]">{collection.name}</h4>{collection.description && <p className="mt-3 text-xs leading-5 text-[#506661]">{collection.description}</p>}</div><div className="flex gap-1"><Button type="button" variant="ghost" size="icon-sm" onClick={() => beginEdit(collection)} className="rounded-none text-[#3e625f] hover:bg-white" aria-label={`Edit ${collection.name}`}><Pencil className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon-sm" onClick={() => deleteCollection(collection.id, collection.name)} className="rounded-none text-[#9b5145] hover:bg-white" aria-label={`Delete ${collection.name}`}><Trash2 className="h-4 w-4" /></Button></div></div><div className="mt-5 border-t border-black/10 pt-4"><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#4e6d66]">{citations.length} assigned citation{citations.length === 1 ? "" : "s"}</p>{citations.length ? <ul className="mt-3 space-y-2">{citations.slice(0, 3).map((citation) => citation ? <li key={citation.id} className="truncate text-xs font-semibold text-[#234a4f]">{citation.sourceTitle}</li> : null)}</ul> : <p className="mt-3 text-xs leading-5 text-[#627570]">Assign a synced citation from the Citation Log below.</p>}</div></article>; })}</div> : <div className="mt-6 flex items-center gap-4 border border-dashed border-[#b6cac0] bg-[#f7fbf8] p-5 text-[#61766f]"><Layers3 className="h-6 w-6 flex-none text-[#176c75]" /><p className="text-sm leading-6">Create your first collection, then use the Citation Log to assign synced citations to it. Collection titles and context stay within your account.</p></div>}</>}
          </div>
        </div>
      </div>
    </section>
  );
}
