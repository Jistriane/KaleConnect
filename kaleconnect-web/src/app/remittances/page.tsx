"use client";

import { useState, useEffect } from "react";
import WalletButtons from "@/components/WalletButtons";
import RealTimeResults from "@/components/RealTimeResults";

// Tipos para a nova página
type RemittanceFormData = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  recipientAddress: string;
  recipientName: string;
  purpose: string;
};

type Quote = {
  from: string;
  to: string;
  amount: number;
  rate: number;
  feePct: number;
  toAmount: number;
  validUntil: Date;
};

type RemittanceTransaction = {
  id: string;
  status: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  recipient: string;
  fee: number;
  createdAt: string;
  estimatedTime: string;
};

const SUPPORTED_CURRENCIES = [
  { code: "XLM", name: "Stellar Lumens", flag: "🌟" },
  { code: "USDC", name: "USD Coin", flag: "💵" },
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
];

const REMITTANCE_PURPOSES = [
  "Família",
  "Negócios", 
  "Educação",
  "Saúde",
  "Investimento",
  "Outros"
];

export default function RemittancesPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "quote" | "confirm" | "processing" | "complete">("form");
  
  // Form data
  const [formData, setFormData] = useState<RemittanceFormData>({
    fromCurrency: "XLM",
    toCurrency: "BRL",
    amount: 0,
    recipientAddress: "",
    recipientName: "",
    purpose: "Família"
  });

  // Quote and transaction data
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [transaction, setTransaction] = useState<RemittanceTransaction | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Mock KYC data para demonstração
  const [kycData] = useState({
    id: "kyc_amadtar7",
    status: "approved" as const,
    level: "intermediate" as const,
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    documents: ["passport.pdf", "proof_of_address.pdf"]
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "pt" || stored === "en") setLang(stored);
  }, []);

  const t = (key: string) => {
    const dict: Record<string, { pt: string; en: string }> = {
      title: { pt: "💸 Remessas Internacionais", en: "💸 International Remittances" },
      subtitle: { pt: "Envie dinheiro globalmente com segurança e transparência", en: "Send money globally with security and transparency" },
      
      // Form labels
      fromCurrency: { pt: "Moeda de Origem", en: "From Currency" },
      toCurrency: { pt: "Moeda de Destino", en: "To Currency" },
      amount: { pt: "Valor", en: "Amount" },
      recipientAddress: { pt: "Endereço do Destinatário", en: "Recipient Address" },
      recipientName: { pt: "Nome do Destinatário", en: "Recipient Name" },
      purpose: { pt: "Finalidade da Remessa", en: "Remittance Purpose" },
      
      // Steps
      stepForm: { pt: "Formulário", en: "Form" },
      stepQuote: { pt: "Cotação", en: "Quote" },
      stepConfirm: { pt: "Confirmar", en: "Confirm" },
      stepProcessing: { pt: "Processando", en: "Processing" },
      stepComplete: { pt: "Completo", en: "Complete" },
      
      // Buttons
      getQuote: { pt: "Obter Cotação", en: "Get Quote" },
      confirmTransaction: { pt: "Confirmar Transação", en: "Confirm Transaction" },
      sendMoney: { pt: "Enviar Dinheiro", en: "Send Money" },
      newTransaction: { pt: "Nova Transação", en: "New Transaction" },
      
      // Messages
      processing: { pt: "Processando...", en: "Processing..." },
      quoteValid: { pt: "Cotação válida até", en: "Quote valid until" },
      estimatedFee: { pt: "Taxa Estimada", en: "Estimated Fee" },
      exchangeRate: { pt: "Taxa de Câmbio", en: "Exchange Rate" },
      youWillSend: { pt: "Você enviará", en: "You will send" },
      recipientWillReceive: { pt: "Destinatário receberá", en: "Recipient will receive" },
      
      // Wallet section
      walletSection: { pt: "🔐 Conectar Carteiras", en: "🔐 Connect Wallets" },
      walletDesc: { pt: "Conecte sua carteira para enviar a remessa", en: "Connect your wallet to send the remittance" },
      
      // Validation
      required: { pt: "Campo obrigatório", en: "Required field" },
      invalidAmount: { pt: "Valor deve ser maior que zero", en: "Amount must be greater than zero" },
      invalidAddress: { pt: "Endereço inválido", en: "Invalid address" },
    };
    return dict[key]?.[lang] ?? key;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t("invalidAmount");
    }
    
    if (!formData.recipientAddress.trim()) {
      newErrors.recipientAddress = t("required");
    }
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = t("required");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetQuote = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/rates?from=${formData.fromCurrency}&to=${formData.toCurrency}&amount=${formData.amount}`);
      const data = await res.json();
      
      const quote: Quote = {
        from: data.from,
        to: data.to,
        amount: data.amount,
        rate: data.rate,
        feePct: data.feePct,
        toAmount: data.toAmount,
        validUntil: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      };
      
      setCurrentQuote(quote);
      setCurrentStep("quote");
    } catch (error) {
      console.error("Erro ao obter cotação:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = () => {
    setCurrentStep("confirm");
  };

  const handleSendMoney = async () => {
    setLoading(true);
    setCurrentStep("processing");
    
    try {
      const res = await fetch("/api/remit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: formData.fromCurrency,
          to: formData.toCurrency,
          amount: formData.amount,
          userId: "user_demo"
        }),
      });
      
      const data = await res.json();
      
      if (data?.id) {
        const newTransaction: RemittanceTransaction = {
          id: data.id,
          status: data.status,
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
          amount: formData.amount,
          recipient: formData.recipientName,
          fee: currentQuote ? (formData.amount * currentQuote.feePct / 100) : 0,
          createdAt: new Date().toISOString(),
          estimatedTime: "2-5 minutos"
        };
        
        setTransaction(newTransaction);
        setCurrentStep("complete");
        
        // Simular atualizações de status
        setTimeout(() => {
          setTransaction(prev => prev ? {...prev, status: "submitted"} : null);
        }, 2000);
        
        setTimeout(() => {
          setTransaction(prev => prev ? {...prev, status: "settled"} : null);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao enviar remessa:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep("form");
    setCurrentQuote(null);
    setTransaction(null);
    setErrors({});
    setFormData({
      fromCurrency: "XLM",
      toCurrency: "BRL", 
      amount: 0,
      recipientAddress: "",
      recipientName: "",
      purpose: "Família"
    });
  };

  const renderStepIndicator = () => {
    const steps = ["form", "quote", "confirm", "processing", "complete"];
    const stepLabels = [t("stepForm"), t("stepQuote"), t("stepConfirm"), t("stepProcessing"), t("stepComplete")];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2
              ${index <= currentIndex 
                ? 'bg-brand-teal text-white border-brand-teal' 
                : 'bg-gray-100 text-gray-400 border-gray-300'
              }
            `}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-1 mx-2
                ${index < currentIndex ? 'bg-brand-teal' : 'bg-gray-300'}
              `} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFormStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">{t("fromCurrency")}</label>
          <select
            value={formData.fromCurrency}
            onChange={(e) => setFormData({...formData, fromCurrency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
          >
            {SUPPORTED_CURRENCIES.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">{t("toCurrency")}</label>
          <select
            value={formData.toCurrency}
            onChange={(e) => setFormData({...formData, toCurrency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
          >
            {SUPPORTED_CURRENCIES.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium mb-2">{t("amount")}</label>
        <div className="relative">
          <input
            type="number"
            value={formData.amount || ""}
            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
            placeholder="0.00"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-3 top-3 text-gray-500">{formData.fromCurrency}</span>
        </div>
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium mb-2">{t("recipientName")}</label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
          placeholder="Nome completo do destinatário"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
            errors.recipientName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
      </div>

      {/* Recipient Address */}
      <div>
        <label className="block text-sm font-medium mb-2">{t("recipientAddress")}</label>
        <input
          type="text"
          value={formData.recipientAddress}
          onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
          placeholder="Endereço da carteira do destinatário"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
            errors.recipientAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.recipientAddress && <p className="text-red-500 text-sm mt-1">{errors.recipientAddress}</p>}
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium mb-2">{t("purpose")}</label>
        <select
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        >
          {REMITTANCE_PURPOSES.map(purpose => (
            <option key={purpose} value={purpose}>{purpose}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGetQuote}
        disabled={loading}
        className="w-full bg-brand-teal text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors disabled:opacity-50"
      >
        {loading ? t("processing") : t("getQuote")}
      </button>
    </div>
  );

  const renderQuoteStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {currentQuote && (
        <div className="bg-gradient-to-r from-brand-teal/10 to-brand-sky/10 rounded-xl p-6 border border-brand-teal/20">
          <h3 className="text-lg font-semibold mb-4">💱 Cotação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">{t("youWillSend")}</p>
              <p className="text-2xl font-bold text-brand-teal">
                {currentQuote.amount} {currentQuote.from}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">{t("recipientWillReceive")}</p>
              <p className="text-2xl font-bold text-green-600">
                {currentQuote.toAmount.toFixed(2)} {currentQuote.to}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("exchangeRate")}:</span>
              <span>1 {currentQuote.from} = {currentQuote.rate} {currentQuote.to}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("estimatedFee")}:</span>
              <span>{currentQuote.feePct}%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t("quoteValid")}:</span>
              <span>{currentQuote.validUntil.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep("form")}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleConfirmTransaction}
          className="flex-1 bg-brand-teal text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors"
        >
          {t("confirmTransaction")}
        </button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Wallet Connection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{t("walletSection")}</h3>
        <p className="text-sm text-gray-600 mb-4">{t("walletDesc")}</p>
        <WalletButtons label="Conectar Carteira" />
      </div>

      {/* Transaction Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Resumo da Transação</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Destinatário:</span>
            <span className="font-medium">{formData.recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span>Endereço:</span>
            <span className="font-mono text-sm">{formData.recipientAddress.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Finalidade:</span>
            <span>{formData.purpose}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor a Enviar:</span>
            <span className="font-bold">{formData.amount} {formData.fromCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor a Receber:</span>
            <span className="font-bold text-green-600">
              {currentQuote?.toAmount.toFixed(2)} {formData.toCurrency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep("quote")}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleSendMoney}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? t("processing") : t("sendMoney")}
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="animate-spin w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full mx-auto"></div>
      <h3 className="text-xl font-semibold">🚀 Processando sua remessa...</h3>
      <p className="text-gray-600">Aguarde enquanto processamos sua transação na blockchain.</p>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {transaction && (
        <>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-600">Remessa Enviada com Sucesso!</h3>
          </div>
          
          {/* Usar o componente RealTimeResults melhorado */}
          <RealTimeResults
            quote={currentQuote ? {
              from: currentQuote.from,
              to: currentQuote.to,
              amount: currentQuote.amount,
              toAmount: currentQuote.toAmount,
              rate: currentQuote.rate,
              feePct: currentQuote.feePct,
              timestamp: new Date(),
              validUntil: currentQuote.validUntil
            } : undefined}
            remittance={{
              id: transaction.id,
              status: transaction.status as any,
              amount: transaction.amount,
              currency: transaction.fromCurrency,
              recipient: transaction.recipient,
              estimatedTime: transaction.estimatedTime,
              actualTime: transaction.status === 'settled' ? "3m 24s" : undefined,
              txHash: "0x1234567890abcdef1234567890abcdef12345678",
              lastUpdated: new Date()
            }}
            kyc={kycData}
          />

          <div className="text-center">
            <button
              onClick={resetForm}
              className="bg-brand-teal text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors"
            >
              {t("newTransaction")}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-sky bg-clip-text text-transparent mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {currentStep === "form" && renderFormStep()}
          {currentStep === "quote" && renderQuoteStep()}
          {currentStep === "confirm" && renderConfirmStep()}
          {currentStep === "processing" && renderProcessingStep()}
          {currentStep === "complete" && renderCompleteStep()}
        </div>
      </div>
    </div>
  );
}