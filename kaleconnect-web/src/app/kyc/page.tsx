"use client";

import { useState, useEffect } from "react";

export default function KycPage() {
  const [kycId, setKycId] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      title: { pt: "🛡️ Verificação KYC", en: "🛡️ KYC Verification" },
      subtitle: { pt: "Verificação segura e rápida da sua identidade para compliance total.", en: "Secure and fast identity verification for full compliance." },
      description: { pt: "Nosso processo KYC utiliza tecnologia avançada para garantir segurança máxima enquanto mantém a experiência do usuário simples e intuitiva.", en: "Our KYC process uses advanced technology to ensure maximum security while keeping the user experience simple and intuitive." },
      processSection: { pt: "📋 Processo de Verificação", en: "📋 Verification Process" },
      processDesc: { pt: "Inicie sua verificação KYC de forma segura e acompanhe o status em tempo real", en: "Start your KYC verification securely and track status in real-time" },
      startKyc: { pt: "🚀 Iniciar Verificação KYC", en: "🚀 Start KYC Verification" },
      processing: { pt: "Processando...", en: "Processing..." },
      kycLabel: { pt: "🛡️ Status da Verificação", en: "🛡️ Verification Status" },
      results: { pt: "📊 Resultado da Verificação", en: "📊 Verification Result" },
      steps: { pt: "Etapas do Processo", en: "Process Steps" },
      step1: { pt: "1. Documentação", en: "1. Documentation" },
      step1Desc: { pt: "Upload de documentos de identidade", en: "Upload identity documents" },
      step2: { pt: "2. Verificação", en: "2. Verification" },
      step2Desc: { pt: "Análise automática e validação", en: "Automatic analysis and validation" },
      step3: { pt: "3. Aprovação", en: "3. Approval" },
      step3Desc: { pt: "Confirmação final e ativação", en: "Final confirmation and activation" },
    };
    return dict[key]?.[lang] ?? key;
  };

  async function onKyc() {
    try {
      setLoading(true);
      const started = await fetch("/api/kyc/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user@example.com" }),
      }).then(r => r.json());
      if (!started?.id) {
        setKycId(null);
        setKycStatus("error");
        return;
      }
      setKycId(started.id as string);
      setKycStatus(started.status as string);
      let status: string = started.status;
      const id: string = started.id;
      for (let i = 0; i < 4 && status !== "approved" && status !== "rejected"; i++) {
        await new Promise(r => setTimeout(r, 800));
        const s = await fetch(`/api/kyc/status?id=${encodeURIComponent(id)}`).then(r => r.json());
        status = s?.status ?? status;
        setKycStatus(status);
      }
    } catch (error) {
      console.error("Erro no processo KYC:", error);
      setKycStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Header */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-sky to-brand-lavender bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="bg-gradient-to-r from-brand-sky/10 to-brand-lavender/10 rounded-xl p-4 border border-brand-sky/20 max-w-3xl mx-auto">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Process Steps */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
            📋 {t("steps")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("step1")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("step1Desc")}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("step2")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("step2Desc")}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{t("step3")}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{t("step3Desc")}</p>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {t("processSection")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {t("processDesc")}
          </p>
          <div className="flex justify-center">
            <button 
              className="h-12 px-8 rounded-xl btn-outline-sky flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50" 
              onClick={onKyc} 
              disabled={loading}
            >
              {loading ? t("processing") : t("startKyc")}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {(kycId || kycStatus) && (
          <section className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              {t("results")}
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm" aria-live="polite" role="status">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🛡️</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t("kycLabel")}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">ID: {kycId ?? "-"}</p>
                <span className={`badge inline-block ${
                  kycStatus === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                  kycStatus === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  kycStatus === "error" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  "badge-lavender"
                }`}>
                  {kycStatus ?? "-"}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
