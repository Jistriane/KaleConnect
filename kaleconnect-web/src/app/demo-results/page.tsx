"use client";

import { useState, useEffect } from "react";
import RealTimeResults from "@/components/RealTimeResults";

export default function DemoResultsPage() {
  const [demoData, setDemoData] = useState({
    quote: {
      from: "XLM",
      to: "BRL", 
      amount: 10,
      toAmount: 18.848,
      rate: 1.9,
      feePct: 0.8,
      timestamp: new Date(),
      validUntil: new Date(Date.now() + 4 * 60 * 1000) // 4 minutos
    },
    remittance: {
      id: "remit_i7awg8r0",
      status: "settled" as const,
      amount: 10,
      currency: "XLM",
      recipient: "João Silva",
      estimatedTime: "2-5 minutos",
      actualTime: "3m 24s",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000) // 2 minutos atrás
    },
    kyc: {
      id: "kyc_amadtar7",
      status: "approved" as const,
      level: "intermediate" as const,
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      documents: ["passport.pdf", "proof_of_address.pdf"]
    }
  });

  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoData(prev => ({
        ...prev,
        quote: {
          ...prev.quote,
          toAmount: 18.848 + (Math.random() - 0.5) * 0.1, // Pequena variação
          timestamp: new Date()
        }
      }));
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const toggleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setShowDemo(!showDemo);
      setLoading(false);
    }, 1000);
  };

  const changeStatus = (type: 'remittance' | 'kyc') => {
    if (type === 'remittance') {
      const statuses = ['pending', 'processing', 'settled', 'failed'] as const;
      const currentIndex = statuses.indexOf(demoData.remittance.status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
      
      setDemoData(prev => ({
        ...prev,
        remittance: {
          ...prev.remittance,
          status: nextStatus,
          lastUpdated: new Date()
        }
      }));
    } else {
      const statuses = ['pending', 'review', 'approved', 'rejected'] as const;
      const currentIndex = statuses.indexOf(demoData.kyc.status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
      
      setDemoData(prev => ({
        ...prev,
        kyc: {
          ...prev.kyc,
          status: nextStatus
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🚀 Demo - Resultados em Tempo Real
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Demonstração da nova interface de resultados aprimorada
          </p>
          
          {/* Demo Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={toggleDemo}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Carregando..." : showDemo ? "Ocultar Demo" : "Mostrar Demo"}
            </button>
            
            <button
              onClick={() => changeStatus('remittance')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Mudar Status Remessa
            </button>
            
            <button
              onClick={() => changeStatus('kyc')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🛡️ Mudar Status KYC
            </button>
          </div>
        </header>

        {/* Demo Component */}
        {showDemo && (
          <RealTimeResults
            quote={demoData.quote}
            remittance={demoData.remittance}
            kyc={demoData.kyc}
            loading={loading}
          />
        )}

        {/* Documentation */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            📚 Funcionalidades Implementadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                💱 Cotação em Tempo Real
              </h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Atualização automática a cada 5s</li>
                <li>• Contador de validade da cotação</li>
                <li>• Breakdown detalhado de taxas</li>
                <li>• Design responsivo e moderno</li>
                <li>• Gradientes e animações suaves</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                📤 Status da Remessa
              </h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Estados visuais distintos</li>
                <li>• Indicadores de progresso</li>
                <li>• Hash da transação exibido</li>
                <li>• Tempo estimado vs real</li>
                <li>• Atualizações em tempo real</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                🛡️ Verificação KYC
              </h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Níveis de verificação (basic/intermediate/advanced)</li>
                <li>• Barra de progresso para pendências</li>
                <li>• Contador de expiração</li>
                <li>• Status de documentos</li>
                <li>• Ações contextuais</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🎨 Design System Aplicado:
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• <strong>Cards Modernos:</strong> Sombras suaves, bordas arredondadas, hover effects</p>
              <p>• <strong>Cores Semânticas:</strong> Verde para sucesso, amarelo para pendente, azul para processando</p>
              <p>• <strong>Tipografia Hierárquica:</strong> Pesos e tamanhos consistentes</p>
              <p>• <strong>Microinterações:</strong> Animações de loading, transições suaves</p>
              <p>• <strong>Responsividade:</strong> Layout adaptável para todos os dispositivos</p>
            </div>
          </div>
        </div>

        {/* Integration Examples */}
        <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            🔧 Como Integrar
          </h2>
          
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`import RealTimeResults from "@/components/RealTimeResults";

// Uso básico
<RealTimeResults 
  quote={quoteData}
  remittance={remittanceData}
  kyc={kycData}
/>

// Com loading state
<RealTimeResults loading={true} />

// Apenas cotação
<RealTimeResults quote={quoteData} />`}
            </pre>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Props opcionais:</strong> Todos os dados são opcionais, o componente se adapta ao que for fornecido</p>
            <p><strong>TypeScript:</strong> Tipagem completa para todas as propriedades</p>
            <p><strong>Responsivo:</strong> Funciona perfeitamente em mobile, tablet e desktop</p>
          </div>
        </div>
      </div>
    </div>
  );
}
