"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { detectLang, type ElisaMessage } from "@/lib/elisa";

export default function ElisaChat() {
  const [messages, setMessages] = useState<ElisaMessage[]>([
    { role: "assistant", content: "Olá! Eu sou a Elisa. Como posso ajudar?", lang: "pt" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const uiLang = useMemo(() => detectLang(input), [input]);

  useEffect(() => setMounted(true), []);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const nextMsgs: ElisaMessage[] = [...messages, { role: "user", content: text, lang: uiLang }];
    setMessages(nextMsgs);
    setLoading(true);
    try {
      const res = await fetch("/api/elisa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current ?? undefined,
          message: text,
          lang: uiLang,
          context: {
            kyc: true,
            remit: true,
          },
        }),
      });
      const data = await res.json();
      if (data?.sessionId && !sessionIdRef.current) sessionIdRef.current = data.sessionId;
      const reply = String(data?.reply ?? (uiLang === "pt" ? "Desculpe, não entendi." : "Sorry, I didn't understand."));
      setMessages(m => [...m, { role: "assistant", content: reply, lang: data?.lang ?? uiLang }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: uiLang === "pt" ? "Ocorreu um erro ao falar com a Elisa." : "An error occurred talking to Elisa.", lang: uiLang }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  if (!mounted) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-100 dark:border-indigo-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🤖</span>
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {uiLang === "pt" ? "Elisa Assistente" : "Elisa Assistant"}
            </div>
            <div className="text-xs text-slate-500">
              {uiLang === "pt" ? "Assistente IA especializada" : "Specialized AI Assistant"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">
            {uiLang.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "assistant" ? "" : "flex-row-reverse"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.role === "assistant" 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                : "bg-gradient-to-r from-brand-teal to-brand-sky"
            }`}>
              <span className="text-white text-xs">
                {m.role === "assistant" ? "🤖" : "👤"}
              </span>
            </div>
            <div className={`flex-1 ${m.role === "assistant" ? "" : "text-right"}`}>
              <div className={`inline-block max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                m.role === "assistant"
                  ? "bg-indigo-50 dark:bg-indigo-950 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  : "bg-brand-teal/10 dark:bg-brand-teal/20 text-slate-700 dark:text-slate-300 rounded-tr-sm"
              }`}>
                {m.content}
              </div>
              <div className={`text-xs text-slate-500 mt-1 ${m.role === "assistant" ? "" : "text-right"}`}>
                {m.role === "assistant" ? "Elisa" : (uiLang === "pt" ? "Você" : "You")}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🤖</span>
            </div>
            <div className="flex-1">
              <div className="inline-block bg-indigo-50 dark:bg-indigo-950 px-4 py-2 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-indigo-100 dark:border-indigo-900">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={uiLang === "pt" ? "💬 Digite sua mensagem..." : "💬 Type your message..."}
            className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm min-h-[48px] max-h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            rows={1}
          />
          <button
            disabled={loading || !input.trim()}
            onClick={() => void send()}
            className={`h-12 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              loading || !input.trim()
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <span>{loading ? (uiLang === "pt" ? "⏳" : "⏳") : "🚀"}</span>
            {loading ? (uiLang === "pt" ? "Enviando..." : "Sending...") : (uiLang === "pt" ? "Enviar" : "Send")}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500 text-center">
          {uiLang === "pt"
            ? "🎯 Elisa pode orientar sobre remessas, KYC, educação financeira e antifraude"
            : "🎯 Elisa can guide on remittances, KYC, financial education and anti-fraud"}
        </p>
      </div>
    </div>
  );
}
