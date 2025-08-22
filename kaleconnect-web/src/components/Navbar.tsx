"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "pt" || stored === "en") setLang(stored);
  }, []);

  const toggleLang = () => {
    const next = lang === "pt" ? "en" : "pt";
    setLang(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", next);
      window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
    }
  };

  // Active helpers
  const isActive = (href: string) => pathname === href;

  const t = (pt: string, en: string) => (lang === "pt" ? pt : en);

  if (!mounted) return null;

  return (
    <header className="brand-navbar">
      <div className="flex items-center gap-3">
        <Image src="/kaleconnect-logo.png" alt="KaleConnect" width={36} height={36} priority className="rounded-lg shadow-sm" />
        <div>
          <strong className="text-[18px] font-bold bg-gradient-to-r from-brand-teal to-brand-sky bg-clip-text text-transparent">
            KaleConnect
          </strong>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1">
            {t("Remessas Inteligentes", "Smart Remittances")}
          </div>
        </div>
      </div>
      <nav className="flex items-center gap-1 sm:gap-4" role="navigation" aria-label={t("Navegação principal", "Main navigation")}>
        <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`} aria-current={isActive("/") ? "page" : undefined} title={t("Página inicial", "Home page")}>
          <span className="hidden sm:inline">{t("🏠 Início", "🏠 Home")}</span>
          <span className="sm:hidden">🏠</span>
        </Link>
        <Link href="/remittances" className={`nav-link ${isActive("/remittances") ? "active" : ""}`} aria-current={isActive("/remittances") ? "page" : undefined} title={t("Enviar remessas", "Send remittances")}>
          <span className="hidden sm:inline">{t("💸 Remessas", "💸 Remittances")}</span>
          <span className="sm:hidden">💸</span>
        </Link>
        <Link href="/kyc" className={`nav-link ${isActive("/kyc") ? "active" : ""}`} aria-current={isActive("/kyc") ? "page" : undefined} title={t("Verificação de identidade", "Identity verification")}>
          <span className="hidden sm:inline">{t("🛡️ KYC", "🛡️ KYC")}</span>
          <span className="sm:hidden">🛡️</span>
        </Link>
        <Link href="/audit" className={`nav-link ${isActive("/audit") ? "active" : ""}`} aria-current={isActive("/audit") ? "page" : undefined} title={t("Auditoria de transações", "Transaction audit")}>
          <span className="hidden sm:inline">{t("🔍 Auditoria", "🔍 Audit")}</span>
          <span className="sm:hidden">🔍</span>
        </Link>
        <Link href="/chat" className={`nav-link ${isActive("/chat") ? "active" : ""}`} aria-current={isActive("/chat") ? "page" : undefined} title={t("Assistente IA", "AI Assistant")}>
          <span className="hidden sm:inline">{t("🤖 Chat", "🤖 Chat")}</span>
          <span className="sm:hidden">🤖</span>
        </Link>
        <button
          onClick={toggleLang}
          className="btn-lang is-active ml-2"
          aria-label={t("Alternar idioma para inglês", "Switch language to Portuguese")}
          title={t("Alternar idioma", "Toggle language")}
        >
          <span className="font-semibold">{lang === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}</span>
        </button>
      </nav>
    </header>
  );
}
