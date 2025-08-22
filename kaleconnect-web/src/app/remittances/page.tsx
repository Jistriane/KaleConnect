"use client";

import { useState, useEffect } from "react";
import WalletButtons from "@/components/WalletButtons";

export default function RemittancesPage() {
  const [quoteText, setQuoteText] = useState<string>("");
  const [remitId, setRemitId] = useState<string | null>(null);
  const [remitStatus, setRemitStatus] = useState<string | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [loading, setLoading] = useState(false);

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
      title: { pt: "💸 Remessas Internacionais", en: "💸 International Remittances" },
      subtitle: { pt: "Envie dinheiro globalmente com segurança, velocidade e transparência total.", en: "Send money globally with security, speed and total transparency." },
      description: { pt: "Nossa plataforma conecta diferentes blockchains para oferecer as melhores taxas e a experiência mais fluida em remessas internacionais.", en: "Our platform connects different blockchains to offer the best rates and the smoothest experience in international remittances." },
      walletSection: { pt: "🔐 Conectar Carteiras", en: "🔐 Connect Wallets" },
      walletDesc: { pt: "Conecte suas carteiras digitais para começar a enviar remessas", en: "Connect your digital wallets to start sending remittances" },
      actionsSection: { pt: "⚡ Ações Rápidas", en: "⚡ Quick Actions" },
      getQuote: { pt: "💱 Obter Cotação", en: "💱 Get Quote" },
      sendRemittance: { pt: "🚀 Enviar Remessa", en: "🚀 Send Remittance" },
      quoteLabel: { pt: "💰 Cotação Atual", en: "💰 Current Quote" },
      remitLabel: { pt: "📤 Status da Remessa", en: "📤 Remittance Status" },
      processing: { pt: "Processando...", en: "Processing..." },
      results: { pt: "📊 Resultados", en: "📊 Results" },
    };
    return dict[key]?.[lang] ?? key;
  };

  async function onQuote() {
    try {
      setLoading(true);
      const res = await fetch("/api/rates?from=XLM&to=BRL&amount=10");
      const data = await res.json();
      setQuoteText(`10 ${data.from} ≈ ${data.toAmount} ${data.to} (${lang === "pt" ? "taxa" : "fee"} ${data.feePct}%)`);
    } catch (error) {
      console.error("Erro ao obter cotação:", error);
      setQuoteText(lang === "pt" ? "Erro ao obter cotação" : "Error getting quote");
    } finally {
      setLoading(false);
    }
  }

  async function onRemit() {
    try {
      setLoading(true);
      const res = await fetch("/api/remit", {
        method: "POST",
        body: JSON.stringify({ from: "XLM", to: "USDC", amount: 5 }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data?.id) {
        setRemitId(null);
        setRemitStatus("error");
        return;
      }
      const id: string = data.id;
      setRemitId(id);
      setRemitStatus(data.status as string);
      // Polling simples até settled/failed
      let current: string = data.status;
      for (let i = 0; i < 5 && current !== "settled" && current !== "failed"; i++) {
        await new Promise(r => setTimeout(r, 800));
        const s = await fetch(`/api/remit/${encodeURIComponent(id)}`).then(r => r.json());
        current = s?.status ?? current;
        setRemitStatus(current);
      }
    } catch (error) {
      console.error("Erro ao enviar remessa:", error);
      setRemitStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Header */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-sky bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="bg-gradient-to-r from-brand-teal/10 to-brand-sky/10 rounded-xl p-4 border border-brand-teal/20 max-w-3xl mx-auto">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Wallet Connection Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {t("walletSection")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {t("walletDesc")}
          </p>
          <div className="h-12">
            <WalletButtons label={lang === "pt" ? "💼 Conectar Carteiras" : "💼 Connect Wallets"} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {t("actionsSection")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            <button 
              className="h-12 rounded-xl btn-outline-slate flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50" 
              onClick={onQuote}
              disabled={loading}
            >
              {loading ? t("processing") : t("getQuote")}
            </button>
            <button 
              className="h-12 rounded-xl btn-outline-teal flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50" 
              onClick={onRemit}
              disabled={loading}
            >
              {loading ? t("processing") : t("sendRemittance")}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {(quoteText || remitId || remitStatus) && (
          <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              {t("results")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {quoteText && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm" aria-live="polite" role="status">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t("quoteLabel")}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{quoteText}</p>
                </div>
              )}
              {(remitId || remitStatus) && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm" aria-live="polite" role="status">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📤</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t("remitLabel")}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID: {remitId ?? "-"}</p>
                    <span className="badge badge-yellow inline-block">{remitStatus ?? "-"}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
