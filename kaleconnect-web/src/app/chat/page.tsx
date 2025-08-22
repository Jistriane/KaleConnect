"use client";

import { useState, useEffect } from "react";
import ElisaChat from "@/components/ElisaChat";

export default function ChatPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "pt" || stored === "en") setLang(stored);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang?: "pt" | "en" } | undefined;
      if (detail?.lang) setLang(detail.lang);
    };
    window.addEventListener("langchange", handler as EventListener);
    return () => window.removeEventListener("langchange", handler as EventListener);
  }, []);

  const t = (key: string) => {
    const dict: Record<string, { pt: string; en: string }> = {
      title: { pt: "🤖 Assistente IA Elisa", en: "🤖 Elisa AI Assistant" },
      subtitle: { pt: "Sua assistente pessoal para navegação, suporte e orientações financeiras 24/7.", en: "Your personal assistant for navigation, support and financial guidance 24/7." },
      description: { pt: "Elisa é nossa assistente de IA avançada, especializada em remessas internacionais, KYC, compliance e educação financeira. Ela está aqui para ajudar você a navegar pela plataforma e responder suas dúvidas.", en: "Elisa is our advanced AI assistant, specialized in international remittances, KYC, compliance and financial education. She's here to help you navigate the platform and answer your questions." },
      capabilities: { pt: "🎯 Capacidades da Elisa", en: "🎯 Elisa's Capabilities" },
      cap1: { pt: "💸 Orientação sobre Remessas", en: "💸 Remittance Guidance" },
      cap1Desc: { pt: "Ajuda com processos de envio e recebimento", en: "Help with sending and receiving processes" },
      cap2: { pt: "🛡️ Suporte KYC", en: "🛡️ KYC Support" },
      cap2Desc: { pt: "Orientações sobre verificação de identidade", en: "Identity verification guidance" },
      cap3: { pt: "📚 Educação Financeira", en: "📚 Financial Education" },
      cap3Desc: { pt: "Explicações sobre blockchain e criptomoedas", en: "Explanations about blockchain and cryptocurrencies" },
      cap4: { pt: "🔍 Detecção de Fraudes", en: "🔍 Fraud Detection" },
      cap4Desc: { pt: "Alertas e prevenção contra golpes", en: "Alerts and scam prevention" },
    };
    return dict[key]?.[lang] ?? key;
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Header */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800 max-w-3xl mx-auto">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Capabilities Grid */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
            {t("capabilities")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 rounded-xl border border-teal-200 dark:border-teal-800">
              <div className="text-2xl mb-2">💸</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("cap1")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("cap1Desc")}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("cap2")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("cap2Desc")}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("cap3")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("cap3Desc")}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("cap4")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("cap4Desc")}</p>
            </div>
          </div>
        </section>

        {/* Chat Interface */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
          <ElisaChat />
        </section>
      </div>
    </div>
  );
}
