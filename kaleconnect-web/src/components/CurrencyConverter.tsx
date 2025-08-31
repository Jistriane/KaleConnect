"use client";

import { useState, useEffect } from "react";

type ConversionRate = {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
};

const POPULAR_PAIRS = [
  { from: "XLM", to: "BRL", flag: "🌟→🇧🇷" },
  { from: "XLM", to: "USD", flag: "🌟→🇺🇸" },
  { from: "USDC", to: "BRL", flag: "💵→🇧🇷" },
  { from: "USD", to: "EUR", flag: "🇺🇸→🇪🇺" },
];

export default function CurrencyConverter() {
  const [rates, setRates] = useState<ConversionRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPair, setSelectedPair] = useState(POPULAR_PAIRS[0]);
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const ratePromises = POPULAR_PAIRS.map(async (pair) => {
          const res = await fetch(`/api/rates?from=${pair.from}&to=${pair.to}&amount=1`);
          const data = await res.json();
          return {
            from: pair.from,
            to: pair.to,
            rate: data.rate,
            lastUpdated: new Date()
          };
        });
        
        const fetchedRates = await Promise.all(ratePromises);
        setRates(fetchedRates);
      } catch (error) {
        console.error("Erro ao buscar taxas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    
    // Atualizar taxas a cada 30 segundos
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentRate = () => {
    return rates.find(r => r.from === selectedPair.from && r.to === selectedPair.to);
  };

  const formatCurrency = (value: number, currency: string) => {
    const formatters: Record<string, Intl.NumberFormat> = {
      "BRL": new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      "USD": new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      "EUR": new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    };
    
    if (formatters[currency]) {
      return formatters[currency].format(value);
    }
    
    return `${value.toFixed(4)} ${currency}`;
  };

  const currentRate = getCurrentRate();
  const convertedAmount = currentRate ? amount * currentRate.rate : 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">💱 Conversor de Moedas</h3>
        {currentRate && (
          <span className="text-xs text-gray-500">
            Atualizado: {currentRate.lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Currency Pair Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {POPULAR_PAIRS.map((pair) => (
          <button
            key={`${pair.from}-${pair.to}`}
            onClick={() => setSelectedPair(pair)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPair.from === pair.from && selectedPair.to === pair.to
                ? 'bg-brand-teal text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pair.flag} {pair.from}/{pair.to}
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Valor a Converter</label>
        <div className="relative">
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            placeholder="0.00"
          />
          <span className="absolute right-3 top-3 text-gray-500">
            {selectedPair.from}
          </span>
        </div>
      </div>

      {/* Conversion Result */}
      {loading ? (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ) : currentRate ? (
        <div className="bg-gradient-to-r from-brand-teal/10 to-brand-sky/10 rounded-lg p-4 border border-brand-teal/20">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Você receberá aproximadamente:</p>
            <p className="text-2xl font-bold text-brand-teal">
              {formatCurrency(convertedAmount, selectedPair.to)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Taxa: 1 {selectedPair.from} = {currentRate.rate.toFixed(4)} {selectedPair.to}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-red-700 text-center">
            Erro ao carregar taxa de conversão
          </p>
        </div>
      )}

      {/* Live Rates Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">📈 Taxas em Tempo Real</h4>
        <div className="space-y-2">
          {rates.map((rate) => (
            <div
              key={`${rate.from}-${rate.to}`}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span className="text-sm font-medium">
                {rate.from}/{rate.to}
              </span>
              <span className="text-sm text-gray-600">
                {rate.rate.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
