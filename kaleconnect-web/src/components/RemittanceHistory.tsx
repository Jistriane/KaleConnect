"use client";

import { useState, useEffect } from "react";

type HistoryTransaction = {
  id: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  recipientName: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
};

export default function RemittanceHistory() {
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do histórico
    setTimeout(() => {
      const mockTransactions: HistoryTransaction[] = [
        {
          id: "TX_001",
          date: new Date(Date.now() - 86400000).toISOString(),
          fromCurrency: "XLM",
          toCurrency: "BRL",
          amount: 100,
          recipientName: "João Silva",
          status: "completed",
          txHash: "0x1234...abcd"
        },
        {
          id: "TX_002", 
          date: new Date(Date.now() - 172800000).toISOString(),
          fromCurrency: "USDC",
          toCurrency: "USD",
          amount: 50,
          recipientName: "Maria Santos",
          status: "completed",
          txHash: "0x5678...efgh"
        },
        {
          id: "TX_003",
          date: new Date(Date.now() - 259200000).toISOString(),
          fromCurrency: "XLM",
          toCurrency: "EUR",
          amount: 75,
          recipientName: "Pedro Costa",
          status: "pending"
        }
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "pending":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "⚪";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">📊 Histórico de Remessas</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">📊 Histórico de Remessas</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>Nenhuma remessa encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{getStatusIcon(tx.status)}</span>
                    <div>
                      <p className="font-medium">
                        {tx.amount} {tx.fromCurrency} → {tx.toCurrency}
                      </p>
                      <p className="text-sm text-gray-600">
                        Para: {tx.recipientName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: {tx.id}</span>
                    <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                    {tx.txHash && (
                      <span className="font-mono">Hash: {tx.txHash}</span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                    {tx.status === "completed" ? "Concluída" :
                     tx.status === "pending" ? "Pendente" : "Falhou"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {transactions.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-brand-teal hover:text-brand-teal-dark text-sm font-medium">
            Ver Todas as Transações →
          </button>
        </div>
      )}
    </div>
  );
}
