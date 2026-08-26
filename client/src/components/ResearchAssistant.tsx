/**
 * Civic Field Notes style reminder: a structured research copilot, not a surveillance console.
 * Conversation remains in page memory; requests are sent only after an authenticated user chooses to send them.
 */
import { useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Database, FileCheck2, Landmark, Loader2, LockKeyhole, Quote, RotateCcw, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type ResearchRoute = "workbench" | "evidence-tools" | "sources" | "ontario-data" | "registry-guide" | "citation-log" | "responsible-use";
type AssistantGuide = { headline: string; summary: string; steps: string[]; sourceCue: string; citationCue: string; safetyNote: string; route: ResearchRoute };
type Message = { role: "user" | "assistant"; content: string; guide?: AssistantGuide };

type ResearchAssistantProps = { isAuthenticated: boolean; displayName?: string | null; onAccountEntry: () => void };

const starterPrompts = [
  { label: "Entity verification", prompt: "Plan a source-first Ontario workflow to verify a corporate registration for due diligence.", icon: Landmark },
  { label: "Data question", prompt: "Which Ontario public data source is most appropriate for an aggregate municipal data question?", icon: Database },
  { label: "Citation-ready note", prompt: "Help me create a citation-ready record for an Ontario public source I accessed today.", icon: Quote },
  { label: "Safe workflow", prompt: "Help me plan a privacy-first research workflow that does not collect personal identifiers.", icon: ShieldCheck },
];

const routeLabels: Record<ResearchRoute, { label: string; href: string }> = {
  workbench: { label: "Open the workbench", href: "/workbench" },
  "evidence-tools": { label: "Review evidence tools", href: "/evidence-tools" },
  sources: { label: "Browse source ledger", href: "/sources" },
  "ontario-data": { label: "Explore Ontario data", href: "/ontario-data" },
  "registry-guide": { label: "Review registry & land guidance", href: "/registry-guide" },
  "citation-log": { label: "Open citation log", href: "/citation-log" },
  "responsible-use": { label: "Read responsible-use protocol", href: "/responsible-use" },
};

const openingMessage: Message = {
  role: "assistant",
  content: "I can turn an Ontario research question into a short source-first plan with a citation cue and a safe next step. Please do not enter personal identifiers, credentials, payment data, or confidential records.",
};

export function ResearchAssistant({ isAuthenticated, displayName, onAccountEntry }: ResearchAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([openingMessage]);
  const [input, setInput] = useState("");
  const chatMutation = trpc.aiAssistant.chat.useMutation({
    onSuccess: (response) => setMessages((current) => [...current, { role: "assistant", content: response.reply, guide: response.guide }]),
    onError: () => {
      setMessages((current) => [...current, { role: "assistant", content: "The research copilot is unavailable right now. You can still use the source ledger, Ontario Data page, and browser-local citation log." }]);
      toast.error("The research copilot could not respond. Please try again shortly.");
    },
  });

  function sendMessage(content = input) {
    const text = content.trim();
    if (!text || chatMutation.isPending) return;
    if (!isAuthenticated) { onAccountEntry(); return; }
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    chatMutation.mutate({ messages: nextMessages.slice(-8).map(({ role, content: messageContent }) => ({ role, content: messageContent })) });
  }

  function resetSession() {
    setMessages([openingMessage]);
    setInput("");
    toast.success("Research copilot session cleared from this page.");
  }

  function submitMessage(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); sendMessage(); }

  if (!isAuthenticated) {
    return <section id="ai-guide" className="border-y border-[#a9c4bd] bg-[#143e43] px-6 py-14 text-[#edf3eb] sm:px-10 xl:px-16 xl:py-20"><div className="mx-auto grid max-w-5xl gap-8 border border-[#4f7a7a] bg-[#17393f] p-6 shadow-[8px_8px_0_rgba(7,31,35,0.22)] md:grid-cols-[1fr_auto] md:items-center md:p-9"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8cac6]">07 · Research copilot</p><h2 className="mt-3 font-display text-4xl leading-[0.92] tracking-[-0.05em] text-white md:text-5xl">Turn a research question into a responsible next step.</h2><p className="mt-5 max-w-2xl text-sm leading-6 text-[#c6d8d1]">Sign in to use an Ontario-focused copilot for source selection, research planning, data context, and citation preparation. It is not a person lookup, scan, or private-data tool.</p><div className="mt-5 flex items-start gap-3 border-l-2 border-[#d5c86d] pl-4 text-xs leading-5 text-[#d9e7df]"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#d5c86d]" /><span>Only send questions you are comfortable sharing with the assistant provider. Do not include personal identifiers, credentials, payment data, or confidential records.</span></div></div><div className="min-w-[210px]"><Button type="button" onClick={onAccountEntry} className="w-full rounded-none bg-[#d5c86d] text-[#14393d] hover:bg-[#e4d77a]"><LockKeyhole className="h-4 w-4" /> Create account / sign in</Button><p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#9bc0bb]">Manus-hosted account access</p></div></div></section>;
  }

  return <section id="ai-guide" className="border-y border-[#a9c4bd] bg-[#dce9e5] px-6 py-14 sm:px-10 xl:px-16 xl:py-20"><div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">07 · Ontario research copilot</p><h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">A clearer next step for every research question.</h2><p className="mt-5 max-w-md text-sm leading-6 text-[#526561]">Welcome, {displayName || "researcher"}. The copilot returns a compact plan, source direction, citation cue, and safe next page—not person or device intelligence.</p><div className="mt-7 border border-[#8db0a8] bg-[#eff3eb] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#0f5974]" /><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Session boundary</p><p className="mt-2 text-xs leading-5 text-[#50625e]">Conversation history remains in this page only and clears on refresh or when you clear the session. Sending a question submits it to the server-side copilot for a response.</p></div></div></div><div className="mt-7"><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Choose a research lane</p><div className="mt-3 grid gap-2">{starterPrompts.map(({ label, prompt, icon: Icon }) => <button key={label} type="button" onClick={() => sendMessage(prompt)} disabled={chatMutation.isPending} className="group flex w-full items-center gap-3 border-l-2 border-[#96b8b0] bg-[#eff3eb] px-4 py-3 text-left transition-colors hover:border-[#0f5974] hover:bg-[#f8f5ee] disabled:opacity-60"><span className="flex h-8 w-8 items-center justify-center bg-[#d7e8e1] text-[#0f5974]"><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-semibold text-[#365953]">{label}</span><span className="mt-0.5 block text-xs text-[#61736e]">Start a structured, source-first plan</span></span><ArrowRight className="ml-auto h-4 w-4 text-[#50807d] transition-transform group-hover:translate-x-0.5" /></button>)}</div></div></div><div className="border border-[#92b6ad] bg-[#fffdf8] p-3 shadow-[8px_8px_0_rgba(15,89,116,0.14)] sm:p-5"><div className="flex items-center justify-between gap-4 border-b border-[#d3ccc0] px-2 pb-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Bot className="h-4 w-4" /></span><div><p className="font-display text-2xl leading-none tracking-[-0.04em] text-[#19383d]">Ontario research copilot</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#5e7a77]">Structured · safety-bounded</p></div></div><Button type="button" variant="ghost" size="sm" onClick={resetSession} disabled={chatMutation.isPending} className="rounded-none text-[#765047] hover:bg-[#f4e8e1] hover:text-[#653d34]"><RotateCcw className="h-3.5 w-3.5" /> Clear</Button></div><div className="mt-4 flex min-h-[660px] flex-col border border-[#d3ccc0] bg-[#fffdf8]"><div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Bot className="h-4 w-4" /></span>}<div className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#0f5974] text-white" : "border border-[#d3ccc0] bg-[#f8f5ee] text-[#36534f]"}`}>{message.guide ? <div><p className="font-display text-2xl leading-none tracking-[-0.035em] text-[#1c4449]">{message.guide.headline}</p><p className="mt-3">{message.guide.summary}</p><div className="mt-4 grid gap-2 border-t border-dashed border-[#c9d3cc] pt-3">{message.guide.steps.map((step, stepIndex) => <div key={step} className="flex gap-3 text-xs leading-5"><span className="flex h-5 w-5 flex-none items-center justify-center bg-[#d5e8e1] font-mono text-[9px] font-semibold text-[#176c75]">{stepIndex + 1}</span><span>{step}</span></div>)}</div><div className="mt-4 grid gap-2 border-t border-dashed border-[#c9d3cc] pt-3 text-xs leading-5"><p><strong className="font-semibold text-[#245d60]">Source direction:</strong> {message.guide.sourceCue}</p><p><strong className="font-semibold text-[#245d60]">Citation cue:</strong> {message.guide.citationCue}</p><p className="border-l-2 border-[#cf765e] pl-3 text-[#714b43]"><strong className="font-semibold">Boundary:</strong> {message.guide.safetyNote}</p></div><a href={routeLabels[message.guide.route].href} className="mt-4 inline-flex items-center gap-2 border-b border-[#0f5974] pb-1 text-xs font-semibold text-[#0f5974] transition-colors hover:text-[#16495b]">{routeLabels[message.guide.route].label} <ArrowRight className="h-3.5 w-3.5" /></a></div> : <p className="whitespace-pre-wrap">{message.content}</p>}</div>{message.role === "user" && <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#e5eee8] text-[#0f5974]"><User className="h-4 w-4" /></span>}</div>)}{chatMutation.isPending && <div className="flex items-center gap-3 text-sm text-[#0f5974]"><span className="flex h-8 w-8 items-center justify-center bg-[#dce9e5]"><Bot className="h-4 w-4" /></span><span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Building a source-first research brief…</span></div>}</div><form onSubmit={submitMessage} className="border-t border-[#d3ccc0] bg-[#f8f5ee] p-4"><div className="flex items-center justify-between gap-3"><label className="field-label mb-0">Your research question</label><span className="font-mono text-[9px] text-[#66807a]">{input.length}/2000</span></div><div className="mt-2 flex items-end gap-3"><Textarea value={input} maxLength={2000} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask for an Ontario source, a citation-ready note, a data direction, or a safe research plan…" className="min-h-24 resize-none rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" /><Button type="submit" disabled={chatMutation.isPending || !input.trim()} className="h-24 rounded-none bg-[#0f5974] px-4 text-white hover:bg-[#104b62]" aria-label="Send research question">{chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button></div><p className="mt-2 flex items-center gap-2 text-xs leading-5 text-[#687671]"><FileCheck2 className="h-3.5 w-3.5 text-[#176c75]" /> You control each next step. Do not include personal identifiers, credentials, payment data, or confidential records.</p></form></div></div></div></section>;
}
