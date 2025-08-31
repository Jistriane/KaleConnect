"use client";

import { useState, useEffect } from "react";
import RealTimeResults from "./RealTimeResults";

type DemoStep = "quote" | "remittance" | "kyc" | "results";

interface DemoState {
  activeStep: DemoStep;
  quote: any;
  remittance: any;
  kyc: any;
  isProcessing: boolean;
}

export default function InteractiveDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    activeStep: "quote",
    quote: null,
    remittance: null,
    kyc: null,
    isProcessing: false
  });

  const [autoProgress, setAutoProgress] = useState(false);

  // Buscar dados reais das APIs
  useEffect(() => {
    if (demoState.activeStep === "quote" && !demoState.quote) {
      // Buscar cotação real da API
      const fetchRealQuote = async () => {
        try {
          const response = await fetch("/api/rates?from=XLM&to=BRL&amount=10");
          const data = await response.json();
          
          setDemoState(prev => ({
            ...prev,
            quote: {
              from: data.from,
              to: data.to,
              amount: data.amount,
              toAmount: data.toAmount,
              rate: data.rate,
              feePct: data.feePct,
              timestamp: new Date(),
              validUntil: new Date(Date.now() + 5 * 60 * 1000)
            }
          }));
        } catch (error) {
          console.error("Erro ao buscar cotação real:", error);
          // Fallback para dados simulados em caso de erro
          setDemoState(prev => ({
            ...prev,
            quote: {
              from: "XLM",
              to: "BRL",
              amount: 10,
              toAmount: 18.848,
              rate: 1.9,
              feePct: 0.8,
              timestamp: new Date(),
              validUntil: new Date(Date.now() + 5 * 60 * 1000)
            }
          }));
        }
      };
      
      fetchRealQuote();
    }
  }, [demoState.activeStep, demoState.quote]);

  // Auto progresso quando habilitado
  useEffect(() => {
    if (!autoProgress) return;

    const intervals = {
      quote: 3000,
      remittance: 4000,
      kyc: 3000,
      results: 5000
    };

    const timeout = setTimeout(() => {
      progressToNextStep();
    }, intervals[demoState.activeStep]);

    return () => clearTimeout(timeout);
  }, [demoState.activeStep, autoProgress]);

  const progressToNextStep = () => {
    const steps: DemoStep[] = ["quote", "remittance", "kyc", "results"];
    const currentIndex = steps.indexOf(demoState.activeStep);
    const nextIndex = (currentIndex + 1) % steps.length;
    
    if (nextIndex === 0) {
      // Reset demo
      resetDemo();
      return;
    }

    const nextStep = steps[nextIndex];
    setDemoState(prev => ({ ...prev, activeStep: nextStep, isProcessing: true }));

    // Criar dados reais usando as APIs
    const createRealData = async () => {
      try {
        const newState = { ...demoState, isProcessing: false };
        
        switch (nextStep) {
          case "remittance":
            // Criar remessa real via API
            const remitResponse = await fetch("/api/remit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "XLM",
                to: "BRL", 
                amount: 10,
                userId: "demo_user"
              })
            });
            const remitData = await remitResponse.json();
            
            newState.remittance = {
              id: remitData.id,
              status: remitData.status,
              amount: remitData.amount,
              currency: remitData.from,
              recipient: "João Silva",
              estimatedTime: "2-5 minutos",
              lastUpdated: new Date()
            };
            break;
            
          case "kyc":
            // Iniciar processo KYC real via API
            const kycResponse = await fetch("/api/kyc/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: "demo_user",
                level: "intermediate"
              })
            });
            const kycData = await kycResponse.json();
            
            newState.kyc = {
              id: kycData.id,
              status: kycData.status,
              level: "intermediate",
              submittedAt: new Date(),
              documents: ["passport.pdf", "proof_of_address.pdf"]
            };
            break;
            
          case "results":
            // Atualizar status via APIs reais
            if (newState.remittance) {
              // Simular que a remessa foi processada
              newState.remittance.status = "settled";
              newState.remittance.actualTime = "3m 24s";
              newState.remittance.txHash = "0x" + Math.random().toString(16).slice(2, 18);
            }
            if (newState.kyc) {
              // Simular que KYC foi aprovado
              newState.kyc.status = "approved";
              newState.kyc.approvedAt = new Date();
              newState.kyc.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            }
            break;
        }
        
        setDemoState(newState);
      } catch (error) {
        console.error("Erro ao criar dados reais:", error);
        // Fallback para dados simulados
        setDemoState(prev => {
          const newState = { ...prev, isProcessing: false };
          
          switch (nextStep) {
            case "remittance":
              newState.remittance = {
                id: `remit_${Math.random().toString(36).slice(2, 8)}`,
                status: "processing",
                amount: 10,
                currency: "XLM",
                recipient: "João Silva",
                estimatedTime: "2-5 minutos",
                lastUpdated: new Date()
              };
              break;
              
            case "kyc":
              newState.kyc = {
                id: `kyc_${Math.random().toString(36).slice(2, 8)}`,
                status: "review",
                level: "intermediate",
                submittedAt: new Date(),
                documents: ["passport.pdf", "proof_of_address.pdf"]
              };
              break;
              
            case "results":
              if (newState.remittance) {
                newState.remittance.status = "settled";
                newState.remittance.actualTime = "3m 24s";
                newState.remittance.txHash = "0x1234567890abcdef";
              }
              if (newState.kyc) {
                newState.kyc.status = "approved";
                newState.kyc.approvedAt = new Date();
                newState.kyc.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              }
              break;
          }
          
          return newState;
        });
      }
    };
    
    setTimeout(() => {
      createRealData();
    }, 1500);
  };

  const resetDemo = () => {
    setDemoState({
      activeStep: "quote",
      quote: null,
      remittance: null,
      kyc: null,
      isProcessing: false
    });
  };

  const jumpToStep = (step: DemoStep) => {
    setAutoProgress(false);
    setDemoState(prev => ({ ...prev, activeStep: step }));
  };

  const getStepIcon = (step: DemoStep) => {
    const icons = {
      quote: "💱",
      remittance: "⚡",
      kyc: "🛡️",
      results: "📊"
    };
    return icons[step];
  };

  const getStepTitle = (step: DemoStep) => {
    const titles = {
      quote: "Cotação em Tempo Real",
      remittance: "Enviar Remessa",
      kyc: "Verificação KYC",
      results: "Resultados Finais"
    };
    return titles[step];
  };

  const getStepDescription = (step: DemoStep) => {
    const descriptions = {
      quote: "Obtenha cotações atualizadas instantaneamente",
      remittance: "Processe sua remessa internacional",
      kyc: "Verifique sua identidade para compliance",
      results: "Acompanhe todos os status em tempo real"
    };
    return descriptions[step];
  };

  const isStepCompleted = (step: DemoStep) => {
    switch (step) {
      case "quote":
        return !!demoState.quote;
      case "remittance":
        return !!demoState.remittance;
      case "kyc":
        return !!demoState.kyc;
      case "results":
        return demoState.remittance?.status === "settled" && demoState.kyc?.status === "approved";
      default:
        return false;
    }
  };

  const isStepActive = (step: DemoStep) => {
    return demoState.activeStep === step;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🎯 Demo Interativa
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Explore o fluxo completo de remessas internacionais
        </p>
        
        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setAutoProgress(!autoProgress)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              autoProgress 
                ? "bg-green-600 text-white shadow-lg" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {autoProgress ? "🔄 Auto-Demo Ativo" : "▶️ Iniciar Auto-Demo"}
          </button>
          
          <button
            onClick={progressToNextStep}
            disabled={demoState.isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {demoState.isProcessing ? "⏳ Processando..." : "⏭️ Próximo Passo"}
          </button>
          
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
          {(["quote", "remittance", "kyc", "results"] as DemoStep[]).map((step, index) => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => jumpToStep(step)}
                className={`
                  group relative px-4 py-3 rounded-lg transition-all duration-300 min-w-[120px]
                  ${isStepActive(step) 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105" 
                    : isStepCompleted(step)
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{getStepIcon(step)}</div>
                  <div className="text-xs font-medium">{getStepTitle(step)}</div>
                </div>
                
                {/* Status indicator */}
                {isStepCompleted(step) && !isStepActive(step) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                
                {isStepActive(step) && demoState.isProcessing && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
                )}
              </button>
              
              {index < 3 && (
                <div className={`w-8 h-0.5 mx-2 transition-colors ${
                  isStepCompleted(step) ? "bg-green-400" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[200px]">
        {/* Current Step Description */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {getStepIcon(demoState.activeStep)} {getStepTitle(demoState.activeStep)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {getStepDescription(demoState.activeStep)}
          </p>
        </div>

        {/* Step-specific Content */}
        {demoState.activeStep === "quote" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {!demoState.quote ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Obtendo cotação em tempo real...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                    {demoState.quote.amount} {demoState.quote.from} → {demoState.quote.toAmount.toFixed(3)} {demoState.quote.to}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Taxa: {demoState.quote.feePct}% | Câmbio: 1 {demoState.quote.from} = {demoState.quote.rate} {demoState.quote.to}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {demoState.activeStep === "remittance" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {demoState.isProcessing ? (
              <div className="text-center">
                <div className="animate-pulse w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Processando remessa na blockchain...</p>
              </div>
            ) : demoState.remittance ? (
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Remessa ID: {demoState.remittance.id}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    demoState.remittance.status === "processing" 
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {demoState.remittance.status === "processing" ? "🔄 Processando" : "✅ Concluída"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Aguardando início da remessa...
              </div>
            )}
          </div>
        )}

        {demoState.activeStep === "kyc" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {demoState.isProcessing ? (
              <div className="text-center">
                <div className="animate-bounce w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Verificando documentos KYC...</p>
              </div>
            ) : demoState.kyc ? (
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    KYC ID: {demoState.kyc.id}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    demoState.kyc.status === "review" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {demoState.kyc.status === "review" ? "👀 Em Revisão" : "✅ Aprovado"}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Nível: {demoState.kyc.level} | Docs: {demoState.kyc.documents?.length || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Aguardando verificação KYC...
              </div>
            )}
          </div>
        )}

        {demoState.activeStep === "results" && (
          <div>
            {demoState.quote || demoState.remittance || demoState.kyc ? (
              <RealTimeResults
                quote={demoState.quote}
                remittance={demoState.remittance}
                kyc={demoState.kyc}
                loading={demoState.isProcessing}
              />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <div className="text-6xl mb-4">📊</div>
                <p>Complete os passos anteriores para ver os resultados</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Progresso da Demo</span>
          <span>
            {Object.values(demoState).filter(v => v !== null && typeof v === 'object').length}/3 completos
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(Object.values(demoState).filter(v => v !== null && typeof v === 'object').length / 3) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
