"use client";

import { useState, useEffect } from "react";
import type { AuditEvent } from "@/lib/audit";

export default function AuditPage() {
  const [userId, setUserId] = useState<string>("user@example.com");
  const [events, setEvents] = useState<AuditEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      title: { pt: "🔍 Auditoria Blockchain", en: "🔍 Blockchain Audit" },
      subtitle: { pt: "Transparência total com rastreabilidade completa de todas as transações.", en: "Total transparency with complete traceability of all transactions." },
      description: { pt: "Nosso sistema de auditoria registra todos os eventos em blockchain, garantindo imutabilidade e transparência para compliance e verificação.", en: "Our audit system records all events on blockchain, ensuring immutability and transparency for compliance and verification." },
      searchSection: { pt: "🔎 Buscar Eventos", en: "🔎 Search Events" },
      searchDesc: { pt: "Digite o ID do usuário para visualizar o histórico completo de eventos", en: "Enter user ID to view complete event history" },
      userIdPlaceholder: { pt: "Digite o ID do usuário...", en: "Enter user ID..." },
      searchButton: { pt: "🔍 Buscar Auditoria", en: "🔍 Search Audit" },
      loading: { pt: "Carregando...", en: "Loading..." },
      noEvents: { pt: "Nenhum evento encontrado para este usuário.", en: "No events found for this user." },
      eventsFound: { pt: "eventos encontrados", en: "events found" },
      eventDetails: { pt: "Detalhes do Evento", en: "Event Details" },
      action: { pt: "Ação", en: "Action" },
      timestamp: { pt: "Data/Hora", en: "Timestamp" },
      eventId: { pt: "ID do Evento", en: "Event ID" },
      payloadRef: { pt: "Referência", en: "Reference" },
      chainHash: { pt: "Hash da Cadeia", en: "Chain Hash" },
      prevHash: { pt: "Hash Anterior", en: "Previous Hash" },
    };
    return dict[key]?.[lang] ?? key;
  };

  async function loadAudit() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/audit?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : (lang === "pt" ? "Erro ao carregar auditoria" : "Error loading audit"));
      setEvents(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Header */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-slate to-brand-teal bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="bg-gradient-to-r from-brand-slate/10 to-brand-teal/10 rounded-xl p-4 border border-brand-slate/20 max-w-3xl mx-auto">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Search Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {t("searchSection")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {t("searchDesc")}
          </p>
          <div className="flex gap-3 items-center max-w-2xl">
            <input
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all"
              placeholder={t("userIdPlaceholder")}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && loadAudit()}
            />
            <button 
              className="h-12 px-6 rounded-xl btn-outline-slate flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50" 
              onClick={loadAudit} 
              disabled={loading}
            >
              {loading ? t("loading") : t("searchButton")}
            </button>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-700 dark:text-red-300 font-medium">
                {lang === "pt" ? "Erro:" : "Error:"} {error}
              </span>
            </div>
          </div>
        )}

        {/* Events Section */}
        {events !== null && (
          <section className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                📋 {t("eventDetails")}
              </h2>
              {events.length > 0 && (
                <span className="text-sm text-slate-500 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {events.length} {t("eventsFound")}
                </span>
              )}
            </div>
            
            {events.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-slate-500">{t("noEvents")}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="text-lg">⚡</span>
                          {evt.action}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {t("timestamp")}: {new Date(evt.ts).toLocaleString()} • {t("eventId")}: {evt.id}
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <div className="font-medium text-slate-600 dark:text-slate-400 mb-1">{t("payloadRef")}:</div>
                        <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{evt.payloadRef}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <div className="font-medium text-slate-600 dark:text-slate-400 mb-1">{t("chainHash")}:</div>
                        <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{evt.chainHash}</div>
                      </div>
                      {evt.prevHash && (
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                          <div className="font-medium text-slate-600 dark:text-slate-400 mb-1">{t("prevHash")}:</div>
                          <div className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{evt.prevHash}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
