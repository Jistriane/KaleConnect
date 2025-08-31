"use client";

import { useState, useEffect } from "react";

type QuoteData = {
  from: string;
  to: string;
  amount: number;
  toAmount: number;
  rate: number;
  feePct: number;
  timestamp: Date;
  validUntil?: Date;
};

type RemittanceStatus = {
  id: string;
  status: "pending" | "processing" | "settled" | "failed";
  amount: number;
  currency: string;
  recipient: string;
  estimatedTime?: string;
  actualTime?: string;
  txHash?: string;
  lastUpdated: Date;
};

type KYCStatus = {
  id: string;
  status: "pending" | "review" | "approved" | "rejected";
  level: "basic" | "intermediate" | "advanced";
  submittedAt: Date;
  approvedAt?: Date;
  expiresAt?: Date;
  documents?: string[];
};

type RealTimeResultsProps = {
  quote?: QuoteData;
  remittance?: RemittanceStatus;
  kyc?: KYCStatus;
  loading?: boolean;
};

export default function RealTimeResults({ 
  quote, 
  remittance, 
  kyc, 
  loading = false 
}: RealTimeResultsProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveQuote, setLiveQuote] = useState(quote);
  const [liveRemittance, setLiveRemittance] = useState(remittance);
  const [liveKyc, setLiveKyc] = useState(kyc);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update quotes in real time
  useEffect(() => {
    if (!quote) return;
    
    const updateQuote = async () => {
      try {
        const response = await fetch(`/api/rates?from=${quote.from}&to=${quote.to}&amount=${quote.amount}`);
        const data = await response.json();
        
        setLiveQuote(prev => prev ? {
          ...prev,
          toAmount: data.toAmount,
          rate: data.rate,
          feePct: data.feePct,
          timestamp: new Date()
        } : null);
      } catch (error) {
        console.error("Error updating quote:", error);
      }
    };

    // Update quote every 30 seconds
    const quoteInterval = setInterval(updateQuote, 30000);
    return () => clearInterval(quoteInterval);
  }, [quote]);

  // Monitor remittance status in real time
  useEffect(() => {
    if (!remittance || remittance.status === "settled" || remittance.status === "failed") return;
    
    const updateRemittanceStatus = async () => {
      try {
        const response = await fetch(`/api/remit/${remittance.id}`);
        const data = await response.json();
        
        if (data.status !== remittance.status) {
          setLiveRemittance(prev => prev ? {
            ...prev,
            status: data.status,
            lastUpdated: new Date(),
            ...(data.status === "settled" && { actualTime: "3m 24s" })
          } : null);
        }
      } catch (error) {
        console.error("Error updating remittance status:", error);
      }
    };

    // Check status every 5 seconds for active remittances
    const statusInterval = setInterval(updateRemittanceStatus, 5000);
    return () => clearInterval(statusInterval);
  }, [remittance]);

  // Use live data if available
  const currentQuote = liveQuote || quote;
  const currentRemittance = liveRemittance || remittance;
  const currentKyc = liveKyc || kyc;

  const getStatusColor = (status: string, type: 'remittance' | 'kyc') => {
    const colors = {
      remittance: {
        pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
        processing: "bg-blue-50 border-blue-200 text-blue-800", 
        settled: "bg-green-50 border-green-200 text-green-800",
        failed: "bg-red-50 border-red-200 text-red-800"
      },
      kyc: {
        pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
        review: "bg-blue-50 border-blue-200 text-blue-800",
        approved: "bg-green-50 border-green-200 text-green-800", 
        rejected: "bg-red-50 border-red-200 text-red-800"
      }
    };
    return colors[type][status as keyof typeof colors[typeof type]] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  const getStatusIcon = (status: string, type: 'remittance' | 'kyc') => {
    const icons = {
      remittance: {
        pending: "⏳",
        processing: "⚡",
        settled: "✅",
        failed: "❌"
      },
      kyc: {
        pending: "📋",
        review: "👀", 
        approved: "✅",
        rejected: "❌"
      }
    };
    return icons[type][status as keyof typeof icons[typeof type]] || "⚪";
  };

  const formatTimeRemaining = (validUntil?: Date) => {
    if (!validUntil) return null;
    const diff = validUntil.getTime() - currentTime.getTime();
    if (diff <= 0) return "Expirada";
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatRelativeTime = (date: Date) => {
    const diff = currentTime.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return "Agora";
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
            📊 Carregando Resultados...
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!quote && !remittance && !kyc) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <span className="animate-pulse">📊</span>
          Resultados em Tempo Real
        </h2>
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Atualizado: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {/* Quote Card */}
        {currentQuote && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Cotação Atual</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Atualizada {formatRelativeTime(currentQuote.timestamp)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {currentQuote.amount} {currentQuote.from}
                  </p>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <div className="w-4 h-0.5 bg-emerald-400"></div>
                    <span className="text-emerald-600 dark:text-emerald-400">≈</span>
                    <div className="w-4 h-0.5 bg-emerald-400"></div>
                  </div>
                  <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                    {currentQuote.toAmount.toFixed(3)} {currentQuote.to}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Taxa:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{currentQuote.feePct}%</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Câmbio:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  1 {currentQuote.from} = {currentQuote.rate.toFixed(4)} {currentQuote.to}
                </span>
              </div>

              {currentQuote.validUntil && (
                <div className={`text-xs p-2 rounded-lg border ${
                  formatTimeRemaining(currentQuote.validUntil) === "Expirada" 
                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
                    : "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <span>Válida por:</span>
                    <span className="font-mono font-bold">
                      {formatTimeRemaining(currentQuote.validUntil)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remittance Status Card */}
        {currentRemittance && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📤</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Status da Remessa</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: <span className="font-mono">{currentRemittance.id}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`rounded-lg p-3 border ${getStatusColor(currentRemittance.status, 'remittance')}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(currentRemittance.status, 'remittance')}</span>
                    <span className="font-semibold capitalize">{currentRemittance.status}</span>
                  </div>
                  {(currentRemittance.status === "processing" || currentRemittance.status === "submitted") && (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentRemittance.amount} {currentRemittance.currency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Para:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentRemittance.recipient}
                  </span>
                </div>

                {currentRemittance.estimatedTime && currentRemittance.status !== "settled" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tempo estimado:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentRemittance.estimatedTime}
                    </span>
                  </div>
                )}

                {currentRemittance.actualTime && currentRemittance.status === "settled" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Concluída em:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {currentRemittance.actualTime}
                    </span>
                  </div>
                )}

                {currentRemittance.txHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hash:</span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate max-w-24">
                      {currentRemittance.txHash}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-500">Última atualização:</span>
                  <span className="text-gray-500 dark:text-gray-500">
                    {formatRelativeTime(currentRemittance.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC Status Card */}
        {currentKyc && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🛡️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Status KYC</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: <span className="font-mono">{currentKyc.id}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`rounded-lg p-3 border ${getStatusColor(currentKyc.status, 'kyc')}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(currentKyc.status, 'kyc')}</span>
                    <span className="font-semibold capitalize">{currentKyc.status}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
                    basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", 
                    advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  }[currentKyc.level]}`}>
                    {currentKyc.level}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Enviado:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(currentKyc.submittedAt)}
                  </span>
                </div>

                {currentKyc.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Aprovado:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatRelativeTime(currentKyc.approvedAt)}
                    </span>
                  </div>
                )}

                {currentKyc.expiresAt && currentKyc.status === "approved" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Expira em:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {Math.ceil((currentKyc.expiresAt.getTime() - currentTime.getTime()) / 86400000)} dias
                    </span>
                  </div>
                )}

                {currentKyc.documents && currentKyc.documents.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Documentos:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentKyc.documents.length} anexos
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for pending/review */}
              {(currentKyc.status === "pending" || currentKyc.status === "review") && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progresso da verificação</span>
                    <span>{currentKyc.status === "pending" ? "25%" : "75%"}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentKyc.status === "pending" ? "w-1/4 bg-yellow-400" : "w-3/4 bg-blue-400"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {currentQuote && (
          <button 
            onClick={() => window.open('/remittances', '_blank')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            💱 Usar Esta Cotação
          </button>
        )}
        
        {currentRemittance && currentRemittance.status !== "settled" && (
          <button 
            onClick={async () => {
              try {
                const response = await fetch(`/api/remit/${currentRemittance.id}`);
                const data = await response.json();
                setLiveRemittance(prev => prev ? { ...prev, ...data, lastUpdated: new Date() } : null);
              } catch (error) {
                console.error("Erro ao atualizar:", error);
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Atualizar Status
          </button>
        )}
        
        {currentKyc && currentKyc.status !== "approved" && (
          <button 
            onClick={() => window.open('/kyc', '_blank')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            📋 Gerenciar KYC
          </button>
        )}

        <button 
          onClick={() => window.open('/audit', '_blank')}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📊 Ver Detalhes
        </button>
      </div>
    </div>
  );
}
