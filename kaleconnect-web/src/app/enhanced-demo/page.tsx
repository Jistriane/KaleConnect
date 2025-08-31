"use client";

import { useState, useEffect } from "react";
import InteractiveDemo from "@/components/InteractiveDemo";

export default function EnhancedDemoPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "pt" || stored === "en") setLang(stored);
  }, []);

  const t = (key: string) => {
    const dict: Record<string, { pt: string; en: string }> = {
      title: { pt: "🚀 Demo Aprimorada - KaleConnect", en: "🚀 Enhanced Demo - KaleConnect" },
      subtitle: { pt: "Experimente o fluxo completo de remessas internacionais", en: "Experience the complete international remittance flow" },
      description: { pt: "Uma demonstração interativa que mostra como funciona todo o processo de envio de remessas com blockchain, desde a cotação até a confirmação final.", en: "An interactive demonstration showing how the entire remittance sending process works with blockchain, from quote to final confirmation." },
      
      // Features
      features: { pt: "🎯 Recursos da Demo", en: "🎯 Demo Features" },
      realTimeQuotes: { pt: "Cotações em Tempo Real", en: "Real-time Quotes" },
      blockchainIntegration: { pt: "Integração Blockchain", en: "Blockchain Integration" },
      kycCompliance: { pt: "Compliance KYC", en: "KYC Compliance" },
      liveTracking: { pt: "Acompanhamento ao Vivo", en: "Live Tracking" },
      
      // Benefits
      benefits: { pt: "💡 Benefícios", en: "💡 Benefits" },
      lowFees: { pt: "Taxas Baixas", en: "Low Fees" },
      fastTransfers: { pt: "Transferências Rápidas", en: "Fast Transfers" },
      transparency: { pt: "Transparência Total", en: "Total Transparency" },
      security: { pt: "Máxima Segurança", en: "Maximum Security" },
      
      // Instructions
      instructions: { pt: "📋 Como Usar", en: "📋 How to Use" },
      step1: { pt: "Clique em 'Iniciar Auto-Demo' para ver o fluxo automático", en: "Click 'Start Auto-Demo' to see the automatic flow" },
      step2: { pt: "Use 'Próximo Passo' para avançar manualmente", en: "Use 'Next Step' to advance manually" },
      step3: { pt: "Clique em qualquer etapa para navegar diretamente", en: "Click on any step to navigate directly" },
      step4: { pt: "Observe como cada componente se atualiza em tempo real", en: "Watch how each component updates in real-time" },
    };
    return dict[key]?.[lang] ?? key;
  };

  const features = [
    {
      icon: "💱",
      title: t("realTimeQuotes"),
      description: "Cotações atualizadas a cada segundo com as melhores taxas do mercado"
    },
    {
      icon: "⛓️",
      title: t("blockchainIntegration"),
      description: "Transações processadas diretamente na blockchain Stellar"
    },
    {
      icon: "🛡️",
      title: t("kycCompliance"),
      description: "Verificação automática de identidade para compliance regulatório"
    },
    {
      icon: "📊",
      title: t("liveTracking"),
      description: "Acompanhamento em tempo real de todas as etapas da transação"
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: t("lowFees"),
      description: "Taxas até 80% menores que bancos tradicionais",
      metric: "0.8%"
    },
    {
      icon: "⚡",
      title: t("fastTransfers"),
      description: "Transferências concluídas em minutos, não dias",
      metric: "< 5min"
    },
    {
      icon: "👁️",
      title: t("transparency"),
      description: "Acompanhe cada etapa da transação na blockchain",
      metric: "100%"
    },
    {
      icon: "🔒",
      title: t("security"),
      description: "Criptografia de nível militar e auditoria completa",
      metric: "Máxima"
    }
  ];

  const instructions = [
    t("step1"),
    t("step2"), 
    t("step3"),
    t("step4")
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800 max-w-4xl mx-auto">
            <p className="text-gray-700 dark:text-gray-300">
              {t("description")}
            </p>
          </div>
        </header>

        {/* Main Demo */}
        <div className="mb-12">
          <InteractiveDemo />
        </div>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            {t("features")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            {t("benefits")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{benefit.icon}</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {benefit.metric}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            {t("instructions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {instruction}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              Pronto para começar? 🚀
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Experimente remessas internacionais da próxima geração
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/remittances"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                💸 Enviar Remessa
              </a>
              <a
                href="/kyc"
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                🛡️ Verificar KYC
              </a>
              <a
                href="/audit"
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                📊 Ver Auditoria
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
