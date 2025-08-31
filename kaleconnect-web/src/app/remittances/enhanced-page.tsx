"use client";

import { useState, useEffect } from "react";
import WalletButtons from "@/components/WalletButtons";
import RemittanceHistory from "@/components/RemittanceHistory";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function EnhancedRemittancesPage() {
  const [activeTab, setActiveTab] = useState<"send" | "history" | "converter">("send");
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "pt" || stored === "en") setLang(stored);
  }, []);

  const t = (key: string) => {
    const dict: Record<string, { pt: string; en: string }> = {
      title: { pt: "💸 Central de Remessas", en: "💸 Remittance Center" },
      subtitle: { pt: "Gerencie suas remessas internacionais com facilidade", en: "Manage your international remittances with ease" },
      
      // Tabs
      sendMoney: { pt: "Enviar Dinheiro", en: "Send Money" },
      history: { pt: "Histórico", en: "History" },
      converter: { pt: "Conversor", en: "Converter" },
      
      // Quick Stats
      totalSent: { pt: "Total Enviado", en: "Total Sent" },
      lastTransaction: { pt: "Última Transação", en: "Last Transaction" },
      savings: { pt: "Economia em Taxas", en: "Fee Savings" },
      
      // Send Money Section
      quickSend: { pt: "Envio Rápido", en: "Quick Send" },
      recentRecipients: { pt: "Destinatários Recentes", en: "Recent Recipients" },
      sendNow: { pt: "Enviar Agora", en: "Send Now" },
      
      // Features
      lowFees: { pt: "Taxas Baixas", en: "Low Fees" },
      fastTransfer: { pt: "Transferência Rápida", en: "Fast Transfer" },
      secure: { pt: "Seguro", en: "Secure" },
      transparent: { pt: "Transparente", en: "Transparent" },
    };
    return dict[key]?.[lang] ?? key;
  };

  const quickStats = [
    {
      label: t("totalSent"),
      value: "R$ 25.430,00",
      icon: "💰",
      color: "text-green-600"
    },
    {
      label: t("lastTransaction"),
      value: "2 dias atrás",
      icon: "📅",
      color: "text-blue-600"
    },
    {
      label: t("savings"),
      value: "R$ 1.230,00",
      icon: "💡",
      color: "text-purple-600"
    }
  ];

  const features = [
    {
      icon: "💸",
      title: t("lowFees"),
      description: "Taxas competitivas a partir de 0.5%"
    },
    {
      icon: "⚡",
      title: t("fastTransfer"),
      description: "Transferências em até 5 minutos"
    },
    {
      icon: "🔒",
      title: t("secure"),
      description: "Protegido por blockchain"
    },
    {
      icon: "👁️",
      title: t("transparent"),
      description: "Acompanhe em tempo real"
    }
  ];

  const recentRecipients = [
    { name: "João Silva", currency: "BRL", flag: "🇧🇷" },
    { name: "Maria Santos", currency: "USD", flag: "🇺🇸" },
    { name: "Pedro Costa", currency: "EUR", flag: "🇪🇺" }
  ];

  const renderSendMoneyTab = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Send Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">{t("quickSend")}</h3>
            
            {/* Wallet Connection */}
            <div className="mb-6">
              <WalletButtons label="Conectar Carteira" />
            </div>

            {/* Quick Send Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">De</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal">
                  <option>🌟 XLM - Stellar Lumens</option>
                  <option>💵 USDC - USD Coin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Para</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal">
                  <option>🇧🇷 BRL - Real Brasileiro</option>
                  <option>🇺🇸 USD - US Dollar</option>
                  <option>🇪🇺 EUR - Euro</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Valor</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
              />
            </div>

            <button className="w-full bg-brand-teal text-white py-3 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors">
              {t("sendNow")}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Recipients */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-4">{t("recentRecipients")}</h4>
            <div className="space-y-3">
              {recentRecipients.map((recipient, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-lg">{recipient.flag}</span>
                  <div>
                    <p className="font-medium">{recipient.name}</p>
                    <p className="text-sm text-gray-600">{recipient.currency}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-brand-teal/10 to-brand-sky/10 rounded-xl p-6 border border-brand-teal/20">
            <h4 className="font-semibold mb-4">✨ Nossos Diferenciais</h4>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-sky bg-clip-text text-transparent mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {[
              { key: "send", label: t("sendMoney"), icon: "💸" },
              { key: "history", label: t("history"), icon: "📊" },
              { key: "converter", label: t("converter"), icon: "💱" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-teal text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "send" && renderSendMoneyTab()}
          {activeTab === "history" && (
            <div className="max-w-4xl mx-auto">
              <RemittanceHistory />
            </div>
          )}
          {activeTab === "converter" && (
            <div className="max-w-2xl mx-auto">
              <CurrencyConverter />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
