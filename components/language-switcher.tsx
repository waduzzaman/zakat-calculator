"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";
import { Language } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "bn", name: "বাংলা" },
    { code: "hi", name: "हिन्दी" },
    { code: "ur", name: "اردو" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-emerald-200" />
      <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
        <SelectTrigger className="w-[120px] h-8 bg-emerald-800/50 border-emerald-700 text-emerald-50 focus:ring-emerald-500">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-emerald-900 border-emerald-800 text-emerald-50">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="focus:bg-emerald-800 focus:text-emerald-50">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
