import { useRef, useState } from "react";
import { ArrowUpRight, Bot, Loader2, LockKeyhole, MessageCircle, Send, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type BubbleMessage = { role: "user" | "assistant"; content: string; guide?: { headline: string; summary: string; sourceCue: string; citationCue: string; safetyNote: string } };

export const COPILOT_BUBBLE_STARTERS = [
  "Plan a source-first Ontario research question.",
  "Help me make a citation-ready source note.",
  "Which Ontario data source fits an aggregate question?",
] as const;

const openingBubbleMessage: BubbleMessage = { role: "assistant", content: "I can help turn an Ontario research question into a source-first plan. Do not enter personal identifiers, credentials, payment data, or confidential records." };

export function createFreshCopilotBubbleSession(): BubbleMessage[] {
  return [openingBubbleMessage];
}

export function isActiveCopilotBubbleSession(responseVersion: number, currentVersion: number) {
  return responseVersion === currentVersion;
}

export function shouldOpenResearchCopilotFromSearch(search: string) {
  return new URLSearchParams(search).get("copilot") === "open";
}

export function ResearchCopilotBubble() {
  const { isAuthenticated, user, loading } = useAuth();
  const [open, setOpen] = useState(() => typeof window !== "undefined" && shouldOpenResearchCopilotFromSearch(window.location.search));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<BubbleMessage[]>(createFreshCopilotBubbleSession);
  const sessionVersion = useRef(0);
  const pendingRequestVersion = useRef(0);
  const chatMutation = trpc.aiAssistant.chat.useMutation({
    onSuccess: (response) => {
      if (!isActiveCopilotBubbleSession(pendingRequestVersion.current, sessionVersion.current)) return;
      setMessages((current) => [...current, { role: "assistant", content: response.reply, guide: response.guide }]);
    },
    onError: () => {
      if (!isActiveCopilotBubbleSession(pendingRequestVersion.current, sessionVersion.current)) return;
      setMessages((current) => [...current, { role: "assistant", content: "The research copilot is unavailable right now. You can still use the source ledger, Ontario Data, and citation log." }]);
      toast.error("The research copilot could not respond. Please try again shortly.");
    },
  });

  function sendMessage(content = input) {
    const text = content.trim();
    if (!text || chatMutation.isPending) return;
    if (!isAuthenticated) { startLogin(); return; }
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    pendingRequestVersion.current = sessionVersion.current;
    chatMutation.mutate({ messages: nextMessages.slice(-6).map(({ role, content: messageContent }) => ({ role, content: messageContent })) });
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      sessionVersion.current += 1;
      setInput("");
      setMessages(createFreshCopilotBubbleSession());
    }
  }

  return <Dialog open={open} onOpenChange={handleOpenChange}><DialogTrigger asChild><button type="button" aria-label="Open Ontario Research Copilot" className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 border border-[#90b8ae] bg-[#143e43] p-2.5 pr-4 text-left text-[#f2f5ec] shadow-[5px_5px_0_rgba(15,89,116,0.22)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5c86d] sm:bottom-7 sm:right-7"><span className="relative flex h-11 w-11 items-center justify-center bg-[#d5c86d] text-[#153b40]"><MessageCircle className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 bg-[#3a8b83] ring-2 ring-[#d5c86d]" /></span><span className="hidden sm:block"><span className="block font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-[#a9cbc6]">Research desk</span><span className="mt-1 block font-display text-lg leading-none">Ask the copilot</span></span></button></DialogTrigger><DialogContent className="max-h-[min(760px,calc(100dvh-2rem))] max-w-[calc(100%-1rem)] overflow-hidden rounded-none border-[#88aaa3] bg-[#f8f5ee] p-0 shadow-[12px_12px_0_rgba(15,89,116,0.26)] sm:max-w-2xl"><DialogHeader className="border-b border-[#c9d7cf] bg-[#dce9e5] px-5 py-5 pr-12"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#0f5974] text-white"><Bot className="h-4 w-4" /></span><div><DialogTitle className="font-display text-3xl leading-none tracking-[-0.045em] text-[#19383d]">Ontario Research Copilot</DialogTitle><DialogDescription className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-[#53736e]">Source-first · safety-bounded · session-only</DialogDescription></div></div></DialogHeader>{loading ? <div className="flex min-h-64 items-center justify-center text-sm text-[#0f5974]"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing your research desk…</div> : !isAuthenticated ? <div className="p-6 sm:p-8"><div className="border-l-4 border-[#d5c86d] bg-[#fffdf8] p-5"><LockKeyhole className="h-5 w-5 text-[#0f5974]" /><h2 className="mt-4 font-display text-3xl leading-none tracking-[-0.04em] text-[#19383d]">Sign in before sending a question.</h2><p className="mt-3 text-sm leading-6 text-[#556762]">The copilot uses the protected, account-backed research guide. This panel does not keep a chat history after you close or refresh it.</p><Button type="button" onClick={() => startLogin()} className="mt-5 rounded-none bg-[#0f5974] text-white hover:bg-[#104b62]">Sign in to ask a source question <ArrowUpRight className="h-4 w-4" /></Button></div></div> : <div className="flex max-h-[calc(min(760px,100dvh-2rem)-118px)] flex-col"><div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Bot className="h-3.5 w-3.5" /></span>}<div className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#0f5974] text-white" : "border border-[#d3ccc0] bg-[#fffdf8] text-[#36534f]"}`}>{message.guide ? <div><p className="font-display text-2xl leading-none tracking-[-0.035em] text-[#1c4449]">{message.guide.headline}</p><p className="mt-3">{message.guide.summary}</p><div className="mt-4 border-t border-dashed border-[#c9d3cc] pt-3 text-xs leading-5"><p><strong className="text-[#245d60]">Source direction:</strong> {message.guide.sourceCue}</p><p className="mt-2"><strong className="text-[#245d60]">Citation cue:</strong> {message.guide.citationCue}</p><p className="mt-2 border-l-2 border-[#cf765e] pl-3 text-[#714b43]"><strong>Boundary:</strong> {message.guide.safetyNote}</p></div></div> : <p className="whitespace-pre-wrap">{message.content}</p>}</div>{message.role === "user" && <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center bg-[#e5eee8] text-[#0f5974]"><UserRound className="h-3.5 w-3.5" /></span>}</div>)}{chatMutation.isPending && <div className="flex items-center gap-2 text-sm text-[#0f5974]"><Loader2 className="h-4 w-4 animate-spin" /> Building a source-first research brief…</div>}</div><form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="border-t border-[#c9d7cf] bg-[#f1f5ef] p-4"><div className="mb-2 flex items-center justify-between"><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#176c75]">Welcome, {user?.name || "researcher"}</p><span className="font-mono text-[9px] text-[#66807a]">{input.length}/2000</span></div><div className="mb-3 flex flex-wrap gap-2">{COPILOT_BUBBLE_STARTERS.map((starter) => <button key={starter} type="button" onClick={() => sendMessage(starter)} disabled={chatMutation.isPending} className="border border-[#b7ccc4] bg-[#fffdf8] px-2.5 py-1.5 text-left text-[10px] leading-4 text-[#315954] transition-colors hover:border-[#0f5974] hover:bg-white disabled:opacity-60"><Sparkles className="mr-1 inline h-3 w-3 text-[#0f5974]" />{starter}</button>)}</div><div className="flex items-end gap-3"><Textarea value={input} maxLength={2000} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask for an Ontario source, data direction, or citation plan…" className="min-h-20 resize-none rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" /><Button type="submit" disabled={chatMutation.isPending || !input.trim()} className="h-20 rounded-none bg-[#0f5974] px-4 text-white hover:bg-[#104b62]" aria-label="Send research question">{chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button></div><p className="mt-2 flex items-center gap-2 text-[11px] leading-5 text-[#687671]"><ShieldCheck className="h-3.5 w-3.5 text-[#176c75]" /> Do not enter personal identifiers, credentials, payment data, or confidential records.</p></form></div>}</DialogContent></Dialog>;
}
