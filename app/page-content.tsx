"use client";

import Calculator from "@/components/calculator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";
import { Moon } from "lucide-react";

export function HomeContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-800/50 to-emerald-950/90 mix-blend-multiply"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end relative z-20">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-800/50 rounded-full mb-6 ring-1 ring-emerald-400/30 backdrop-blur-sm">
            <Moon className="w-6 h-6 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-emerald-200 max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>
        </div>
        
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.93,197.36,108.14Z" className="fill-emerald-50/30"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Calculator />
      </div>
    </main>
  );
}
