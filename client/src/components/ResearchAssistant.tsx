/**
 * Civic Field Notes style reminder: a restrained research guide, not a surveillance console.
 * Conversation remains in page memory; requests are sent only after an authenticated user chooses to send them.
 */
import { useState } from "react";
import { Bot, Loader2, LockKeyhole, RotateCcw, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ResearchAssistantProps = {
  isAuthenticated: boolean;
  displayName?: string | null;
  onAccountEntry: () => void;
};

const starterPrompts = [
  "Which Ontario source should I use to verify a corporate registration?",
  "How should I document a land-title source in my citation log?",
  "Help me choose a privacy-first workflow for supplier due diligence.",
  "What does this website store locally, and what is not stored here?",
];

const openingMessage: Message = {
  role: "assistant",
  content: "I can help you select official Ontario sources, prepare privacy-conscious research workflows, and record source context. Please do not enter personal identifiers, credentials, payment data, or sensitive records.",
};

export function ResearchAssistant({ isAuthenticated, displayName, onAccountEntry }: ResearchAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([openingMessage]);
  const [input, setInput] = useState("");
  const chatMutation = trpc.aiAssistant.chat.useMutation({
    onSuccess: (response) => {
      setMessages((current) => [...current, { role: "assistant", content: response.reply }]);
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "The research guide is unavailable right now. You can still use the source ledger and browser-local citation log." },
      ]);
      toast.error("The research guide could not respond. Please try again shortly.");
    },
  });

  function sendMessage(content = input) {
    const text = content.trim();
    if (!text || chatMutation.isPending) return;
    if (!isAuthenticated) {
      onAccountEntry();
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    chatMutation.mutate({
      messages: nextMessages.slice(-8).map(({ role, content: messageContent }) => ({ role, content: messageContent })),
    });
  }

  function resetSession() {
    setMessages([openingMessage]);
    setInput("");
    toast.success("Assistant session cleared from this page.");
  }

  function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  if (!isAuthenticated) {
    return (
      <section id="ai-guide" className="scroll-mt-6 border-y border-[#a9c4bd] bg-[#143e43] px-6 py-14 text-[#edf3eb] sm:px-10 xl:px-16 xl:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 border border-[#4f7a7a] bg-[#17393f] p-6 shadow-[8px_8px_0_rgba(7,31,35,0.22)] md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8cac6]">06 · Research guide</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.92] tracking-[-0.05em] text-white md:text-5xl">Use the assistant only when you are ready to send a question.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#c6d8d1]">Sign in or create an account to access the safety-bounded research guide. It helps with source selection, citation practices, and lawful workflow planning; it is not a person lookup, scan, or private-data tool.</p>
            <div className="mt-5 flex items-start gap-3 border-l-2 border-[#d5c86d] pl-4 text-xs leading-5 text-[#d9e7df]"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#d5c86d]" /><span>Only send questions you are comfortable sharing with the assistant provider. Do not include personal identifiers, credentials, payment data, or confidential records.</span></div>
          </div>
          <div className="min-w-[210px]"><Button type="button" onClick={onAccountEntry} className="w-full rounded-none bg-[#d5c86d] text-[#14393d] hover:bg-[#e4d77a]"><LockKeyhole className="h-4 w-4" /> Create account / sign in</Button><p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#9bc0bb]">Manus-hosted account access</p></div>
        </div>
      </section>
    );
  }

  return (
    <section id="ai-guide" className="scroll-mt-6 border-y border-[#a9c4bd] bg-[#dce9e5] px-6 py-14 sm:px-10 xl:px-16 xl:py-20">
      <div className="grid gap-10 xl:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f5974]">06 · Research guide</p>
          <h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.055em] text-[#19383d]">A second set of eyes for your research path.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#526561]">Welcome, {displayName || "researcher"}. Ask for source selection, privacy controls, or citation guidance—not person or device intelligence.</p>
          <div className="mt-7 border border-[#8db0a8] bg-[#eff3eb] p-5 shadow-[5px_5px_0_rgba(15,89,116,0.1)]"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#0f5974]" /><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Session boundary</p><p className="mt-2 text-xs leading-5 text-[#50625e]">Conversation history remains in this page only and clears on refresh or when you clear the session. Sending a message submits it to the server-side research guide for a response.</p></div></div></div>
          <div className="mt-7"><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0f5974]">Suggested starting points</p><div className="mt-3 space-y-2">{starterPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={chatMutation.isPending} className="group flex w-full items-start gap-3 border-l-2 border-[#96b8b0] bg-[#eff3eb] px-4 py-3 text-left text-sm leading-5 text-[#435e59] transition-colors hover:border-[#0f5974] hover:bg-[#f8f5ee] disabled:opacity-60"><Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-[#0f5974]" /><span>{prompt}</span></button>)}</div></div>
        </div>
        <div className="border border-[#92b6ad] bg-[#fffdf8] p-3 shadow-[8px_8px_0_rgba(15,89,116,0.14)] sm:p-5">
          <div className="flex items-center justify-between gap-4 border-b border-[#d3ccc0] px-2 pb-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Bot className="h-4 w-4" /></span><div><p className="font-display text-2xl leading-none tracking-[-0.04em] text-[#19383d]">Ontario research guide</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#5e7a77]">Safety-bounded assistant</p></div></div><Button type="button" variant="ghost" size="sm" onClick={resetSession} disabled={chatMutation.isPending} className="rounded-none text-[#765047] hover:bg-[#f4e8e1] hover:text-[#653d34]"><RotateCcw className="h-3.5 w-3.5" /> Clear</Button></div>
          <div className="mt-4 flex min-h-[620px] flex-col border border-[#d3ccc0] bg-[#fffdf8]">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#dce9e5] text-[#0f5974]"><Bot className="h-4 w-4" /></span>}<div className={`max-w-[84%] whitespace-pre-wrap px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#0f5974] text-white" : "border border-[#d3ccc0] bg-[#f8f5ee] text-[#36534f]"}`}>{message.content}</div>{message.role === "user" && <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#e5eee8] text-[#0f5974]"><User className="h-4 w-4" /></span>}</div>)}
              {chatMutation.isPending && <div className="flex items-center gap-3 text-sm text-[#0f5974]"><span className="flex h-8 w-8 items-center justify-center bg-[#dce9e5]"><Bot className="h-4 w-4" /></span><span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Preparing a research-focused response…</span></div>}
            </div>
            <form onSubmit={submitMessage} className="border-t border-[#d3ccc0] bg-[#f8f5ee] p-4"><label className="field-label">Your research question</label><div className="mt-2 flex items-end gap-3"><Textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask about an Ontario source, citation practice, or safe research workflow…" className="min-h-24 resize-none rounded-none border-[#cfc7b8] bg-[#fffdf8] text-[#19383d]" /><Button type="submit" disabled={chatMutation.isPending || !input.trim()} className="h-24 rounded-none bg-[#0f5974] px-4 text-white hover:bg-[#104b62]" aria-label="Send research question">{chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button></div><p className="mt-2 text-xs leading-5 text-[#687671]">Do not include personal identifiers, credentials, payment data, or confidential records.</p></form>
          </div>
        </div>
      </div>
    </section>
  );
}
