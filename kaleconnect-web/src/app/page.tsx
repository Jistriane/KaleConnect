"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WalletButtons from "@/components/WalletButtons";
import ElisaChat from "@/components/ElisaChat";
import InteractiveDemo from "@/components/InteractiveDemo";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export default function Home() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  // sincroniza com Navbar (localStorage + evento 'langchange')
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
  // Estados da UI
  const [showElisa, setShowElisa] = useState(false);

  const t = (key: string) => {
    const dict: Record<string, { pt: string; en: string }> = {
      title: { pt: "KaleConnect – Revolucione suas Remessas Internacionais", en: "KaleConnect – Revolutionize Your International Remittances" },
      subtitle: { pt: "Transfira dinheiro globalmente com a simplicidade de um chat. Seguro, transparente e instantâneo.", en: "Transfer money globally with the simplicity of a chat. Secure, transparent and instant." },
      hero: { pt: "A próxima geração de remessas internacionais", en: "The next generation of international remittances" },
      heroDesc: { pt: "Conecte-se ao futuro das finanças descentralizadas com nossa plataforma inteligente que combina IA, blockchain e experiência de usuário excepcional.", en: "Connect to the future of decentralized finance with our smart platform that combines AI, blockchain and exceptional user experience." },
      passkey: { pt: "🔐 Entrar com Passkey", en: "🔐 Sign in with Passkey" },
      connect: { pt: "💼 Conectar Carteiras", en: "💼 Connect Wallets" },

      apis: { pt: "🔗 APIs Disponíveis:", en: "🔗 Available APIs:" },
      features: { pt: "Recursos Principais", en: "Key Features" },
      passkeyRegisterFailed: { pt: "❌ Falha no registro do Passkey", en: "❌ Passkey registration failed" },
      passkeyAuthSuccess: { pt: "✅ Autenticado com sucesso!", en: "✅ Successfully authenticated!" },
      passkeyAuthFailed: { pt: "❌ Falha na autenticação", en: "❌ Authentication failed" },
      passkeyFlowError: { pt: "⚠️ Erro no processo de autenticação", en: "⚠️ Authentication process error" },
      remittancesCard: { pt: "Remessas Internacionais", en: "International Remittances" },
      remittancesDesc: { pt: "Envie dinheiro globalmente com taxas baixas e velocidade incomparável", en: "Send money globally with low fees and unmatched speed" },
      kycCard: { pt: "Verificação Segura", en: "Secure Verification" },
      kycDesc: { pt: "Processo KYC simplificado e compliance total com regulamentações", en: "Simplified KYC process with full regulatory compliance" },
      auditCard: { pt: "Auditoria Transparente", en: "Transparent Audit" },
      auditDesc: { pt: "Rastreabilidade completa de todas as transações na blockchain", en: "Complete traceability of all transactions on blockchain" },
      chatCard: { pt: "Assistente IA", en: "AI Assistant" },
      chatDesc: { pt: "Elisa, sua assistente pessoal para navegação e suporte 24/7", en: "Elisa, your personal assistant for navigation and 24/7 support" },
    };
    return dict[key]?.[lang] ?? key;
  };

  async function onPasskey() {
    const username = "user@example.com"; // TODO: trocar por usuário logado/identificado
    try {
      // 1) Registration options
      const regResponse = await fetch(`/api/auth/passkey/register/options?username=${encodeURIComponent(username)}`);
      if (!regResponse.ok) {
        throw new Error(`Falha ao obter opções de registro: ${regResponse.status}`);
      }
      const regOpts = await regResponse.json();
      
      // Verificar se as opções estão válidas
      if (!regOpts || !regOpts.challenge) {
        throw new Error("Opções de registro inválidas recebidas do servidor");
      }
      
      // 2) startRegistration no navegador
      const attResp = await startRegistration(regOpts);
      
      // 3) Enviar atestado para verificação no servidor
      const regVerifyResponse = await fetch(`/api/auth/passkey/register/verify`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ username, attResp }) 
      });
      
      if (!regVerifyResponse.ok) {
        throw new Error(`Falha na verificação de registro: ${regVerifyResponse.status}`);
      }
      
      const regVerify = await regVerifyResponse.json();
      if (!regVerify?.verified) {
        alert(t("passkeyRegisterFailed"));
        return;
      }
      
      // 4) Authentication options
      const authOptsResponse = await fetch(`/api/auth/passkey/login/options?username=${encodeURIComponent(username)}`);
      if (!authOptsResponse.ok) {
        throw new Error(`Falha ao obter opções de login: ${authOptsResponse.status}`);
      }
      const authOpts = await authOptsResponse.json();
      
      // 5) startAuthentication
      const authResp = await startAuthentication(authOpts);
      
      // 6) Verificar autenticação
      const authVerifyResponse = await fetch(`/api/auth/passkey/login/verify`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ username, authResp }) 
      });
      
      if (!authVerifyResponse.ok) {
        throw new Error(`Falha na verificação de autenticação: ${authVerifyResponse.status}`);
      }
      
      const authVerify = await authVerifyResponse.json();
      if (authVerify?.verified) {
        alert(t("passkeyAuthSuccess"));
      } else {
        alert(t("passkeyAuthFailed"));
      }
    } catch (e: unknown) {
      let msg = t("passkeyFlowError");
      
      if (e instanceof Error) {
        if (e.name === 'NotAllowedError') {
          msg = lang === "pt" 
            ? "Operação cancelada ou não permitida pelo navegador. Tente novamente." 
            : "Operation cancelled or not allowed by browser. Please try again.";
        } else if (e.name === 'InvalidStateError') {
          msg = lang === "pt"
            ? "Credencial já existe. Tente fazer login ao invés de registro."
            : "Credential already exists. Try logging in instead of registering.";
        } else if (e.message.includes('Falha ao obter')) {
          msg = e.message;
        } else {
          msg = e.message || t("passkeyFlowError");
        }
      }
      
      console.warn('Erro no Passkey:', e);
      alert(msg);
    }
  }







  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <header id="dashboard" className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">KaleConnect</h1>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => setLang("pt")} className={`btn-lang ${lang === "pt" ? "is-active" : ""}`}>PT-BR</button>
            <button onClick={() => setLang("en")} className={`btn-lang ${lang === "en" ? "is-active" : ""}`}>EN</button>
          </div>
        </header>

        <main className="mt-10 space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-teal to-brand-sky bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-brand-teal/10 to-brand-sky/10 rounded-2xl p-6 border border-brand-teal/20">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {t("hero")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("heroDesc")}
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-slate-200">
              {t("features")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/remittances" className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-teal/50 transition-all duration-300 hover:shadow-lg">
                <div className="text-brand-teal text-2xl mb-3">💸</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brand-teal transition-colors">
                  {t("remittancesCard")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("remittancesDesc")}
                </p>
              </Link>

              <Link href="/kyc" className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-sky/50 transition-all duration-300 hover:shadow-lg">
                <div className="text-brand-sky text-2xl mb-3">🛡️</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brand-sky transition-colors">
                  {t("kycCard")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("kycDesc")}
                </p>
              </Link>

              <Link href="/audit" className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-slate/50 transition-all duration-300 hover:shadow-lg">
                <div className="text-brand-slate text-2xl mb-3">🔍</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brand-slate transition-colors">
                  {t("auditCard")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("auditDesc")}
                </p>
              </Link>

              <Link href="/chat" className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-lavender/50 transition-all duration-300 hover:shadow-lg">
                <div className="text-brand-lavender text-2xl mb-3">🤖</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brand-lavender transition-colors">
                  {t("chatCard")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("chatDesc")}
                </p>
              </Link>
            </div>
          </section>

          {/* Authentication Section */}
          <section className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-center mb-6 text-slate-800 dark:text-slate-200">
              🚀 Comece Agora - {lang === "pt" ? "Autenticação Segura" : "Secure Authentication"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <button
                className="btn-passkey h-12 rounded-xl font-medium hover:opacity-95 flex items-center justify-center gap-2 transition-all duration-300"
                onClick={onPasskey}
              >
                {t("passkey")}
              </button>
              <div className="h-12">
                <WalletButtons label={t("connect")} />
              </div>
            </div>
          </section>

          {/* Demo Interativa Aprimorada */}
          <section>
            <InteractiveDemo />
          </section>



          {/* AI Chat Assistant */}
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center gap-2">
                🤖 {lang === "pt" ? "Assistente IA Elisa" : "Elisa AI Assistant"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {lang === "pt" 
                  ? "Converse com nossa assistente inteligente para orientações sobre remessas, KYC e mais" 
                  : "Chat with our intelligent assistant for guidance on remittances, KYC and more"
                }
              </p>
            </div>
            <ElisaChat />
          </section>
        </main>

        <footer className="mt-16 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔗</span>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t("apis")}</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md">/api/rates</code>
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md">/api/remit</code>
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md">/api/kyc/*</code>
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md">/api/health</code>
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md">/api/audit</code>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              {lang === "pt" 
                ? "KaleConnect - Conectando o futuro das remessas internacionais com tecnologia blockchain e IA." 
                : "KaleConnect - Connecting the future of international remittances with blockchain technology and AI."
              }
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
