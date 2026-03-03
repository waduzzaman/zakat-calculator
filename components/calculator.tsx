"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calculator as CalcIcon, Coins, Landmark, Briefcase, TrendingDown, Info, ChevronRight, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import { ZakatAssets, ZakatLiabilities, calculateZakat, formatCurrency } from "@/lib/zakat-utils";
import { useLanguage } from "@/lib/i18n";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
];

export default function Calculator() {
  const { language, t } = useLanguage();
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (language === 'bn') {
      setTimeout(() => setCurrency('BDT'), 0);
    } else if (language === 'en') {
      setTimeout(() => setCurrency('USD'), 0);
    }
  }, [language]);

  const [nisabType, setNisabType] = useState<"gold" | "silver">("silver");
  
  // Default Nisab values (approximate, users should update based on current market)
  const [goldPricePerGram, setGoldPricePerGram] = useState(65);
  const [silverPricePerGram, setSilverPricePerGram] = useState(0.85);

  useEffect(() => {
    if (currency === 'BDT') {
      setTimeout(() => {
        setGoldPricePerGram(10500);
        setSilverPricePerGram(160);
      }, 0);
    } else if (currency === 'USD') {
      setTimeout(() => {
        setGoldPricePerGram(65);
        setSilverPricePerGram(0.85);
      }, 0);
    }
  }, [currency]);

  const nisabGold = goldPricePerGram * 85; // 85 grams of gold
  const nisabSilver = silverPricePerGram * 595; // 595 grams of silver
  const activeNisab = nisabType === "gold" ? nisabGold : nisabSilver;

  const [assets, setAssets] = useState<ZakatAssets>({
    cashInHand: 0,
    cashInBank: 0,
    goldValue: 0,
    silverValue: 0,
    investments: 0,
    businessInventory: 0,
    propertyForSale: 0,
    moneyOwedToYou: 0,
  });

  const [liabilities, setLiabilities] = useState<ZakatLiabilities>({
    debtsToPay: 0,
    immediateExpenses: 0,
  });

  const handleAssetChange = (key: keyof ZakatAssets, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets((prev) => ({ ...prev, [key]: numValue }));
  };

  const handleLiabilityChange = (key: keyof ZakatLiabilities, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLiabilities((prev) => ({ ...prev, [key]: numValue }));
  };

  const results = calculateZakat(assets, liabilities, activeNisab);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-6">
        {/* Settings Card */}
        <Card className="border-emerald-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-emerald-500 w-full"></div>
          <CardHeader className="bg-emerald-50/50 pb-4">
            <CardTitle className="text-xl font-serif text-emerald-900 flex items-center gap-2">
              <CalcIcon className="w-5 h-5 text-emerald-600" />
              {t.calcSettings}
            </CardTitle>
            <CardDescription>
              {t.calcSettingsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">{t.currency}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder={t.selectCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>{t.nisabStandard}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-emerald-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{t.nisabTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Tabs value={nisabType} onValueChange={(v) => setNisabType(v as "gold" | "silver")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="silver">{t.silver}</TabsTrigger>
                  <TabsTrigger value="gold">{t.gold}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goldPrice">{t.goldPrice}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                  {CURRENCIES.find(c => c.code === currency)?.symbol}
                </span>
                <Input 
                  id="goldPrice" 
                  type="number" 
                  min="0"
                  className="pl-8" 
                  value={goldPricePerGram || ""} 
                  onChange={(e) => setGoldPricePerGram(parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="silverPrice">{t.silverPrice}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                  {CURRENCIES.find(c => c.code === currency)?.symbol}
                </span>
                <Input 
                  id="silverPrice" 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="pl-8" 
                  value={silverPricePerGram || ""} 
                  onChange={(e) => setSilverPricePerGram(parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Card */}
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100">
            <CardTitle className="text-xl font-serif text-emerald-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              {t.zakatableAssets}
            </CardTitle>
            <CardDescription>
              {t.zakatableAssetsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Cash */}
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-800 flex items-center gap-2 border-b border-emerald-100 pb-2">
                <Coins className="w-4 h-4" /> {t.cashBank}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cashInHand">{t.cashInHand}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="cashInHand" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.cashInHand || ""} 
                      onChange={(e) => handleAssetChange("cashInHand", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashInBank">{t.cashInBank}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="cashInBank" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.cashInBank || ""} 
                      onChange={(e) => handleAssetChange("cashInBank", e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Precious Metals */}
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-800 flex items-center gap-2 border-b border-emerald-100 pb-2">
                <Coins className="w-4 h-4" /> {t.goldSilver}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goldValue">{t.valueGold}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="goldValue" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.goldValue || ""} 
                      onChange={(e) => handleAssetChange("goldValue", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="silverValue">{t.valueSilver}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="silverValue" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.silverValue || ""} 
                      onChange={(e) => handleAssetChange("silverValue", e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Investments & Business */}
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-800 flex items-center gap-2 border-b border-emerald-100 pb-2">
                <Briefcase className="w-4 h-4" /> {t.investmentsBusiness}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investments">{t.sharesInvestments}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="investments" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.investments || ""} 
                      onChange={(e) => handleAssetChange("investments", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessInventory">{t.businessInventory}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="businessInventory" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.businessInventory || ""} 
                      onChange={(e) => handleAssetChange("businessInventory", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyForSale">{t.propertyForSale}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="propertyForSale" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.propertyForSale || ""} 
                      onChange={(e) => handleAssetChange("propertyForSale", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moneyOwedToYou">{t.moneyOwedToYou}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}
                    </span>
                    <Input 
                      id="moneyOwedToYou" 
                      type="number" 
                      min="0"
                      className="pl-8" 
                      value={assets.moneyOwedToYou || ""} 
                      onChange={(e) => handleAssetChange("moneyOwedToYou", e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities Card */}
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100">
            <CardTitle className="text-xl font-serif text-emerald-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              {t.deductibleLiabilities}
            </CardTitle>
            <CardDescription>
              {t.deductibleLiabilitiesDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debtsToPay">{t.outstandingDebts}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                    {CURRENCIES.find(c => c.code === currency)?.symbol}
                  </span>
                  <Input 
                    id="debtsToPay" 
                    type="number" 
                    min="0"
                    className="pl-8" 
                    value={liabilities.debtsToPay || ""} 
                    onChange={(e) => handleLiabilityChange("debtsToPay", e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="immediateExpenses">{t.immediateExpenses}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">
                    {CURRENCIES.find(c => c.code === currency)?.symbol}
                  </span>
                  <Input 
                    id="immediateExpenses" 
                    type="number" 
                    min="0"
                    className="pl-8" 
                    value={liabilities.immediateExpenses || ""} 
                    onChange={(e) => handleLiabilityChange("immediateExpenses", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Panel - Sticky on Desktop */}
      <div className="lg:col-span-4">
        <div className="sticky top-6">
          <Card className="border-emerald-200 shadow-md bg-white overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white text-center">
              <h3 className="font-serif text-xl opacity-90 mb-1">{t.yourZakat}</h3>
              <div className="text-4xl font-bold tracking-tight">
                {formatCurrency(results.zakatPayable, currency)}
              </div>
              <p className="text-emerald-100 text-sm mt-2">
                {results.isEligible 
                  ? t.eligible 
                  : t.notEligible}
              </p>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-700">{t.totalAssets}</span>
                <span className="font-medium">{formatCurrency(results.totalAssets, currency)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-700">{t.totalLiabilities}</span>
                <span className="font-medium text-red-500">-{formatCurrency(results.totalLiabilities, currency)}</span>
              </div>
              <Separator className="bg-emerald-100" />
              <div className="flex justify-between items-center font-medium">
                <span className="text-emerald-900">{t.netZakatableAssets}</span>
                <span>{formatCurrency(results.netAssets, currency)}</span>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-4 mt-6 border border-emerald-100">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-emerald-600 font-medium uppercase tracking-wider">{t.nisabThreshold}</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(activeNisab, currency)}</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 mt-2 overflow-hidden">
                  <motion.div 
                    className={`h-2 rounded-full ${results.isEligible ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((results.netAssets / activeNisab) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[10px] text-emerald-600 mt-2 text-center">
                  {nisabType === 'gold' ? t.basedOnGold : t.basedOnSilver}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-emerald-50/50 p-6 border-t border-emerald-100">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                {t.saveCalculation}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 bg-white rounded-xl p-5 border border-emerald-100 shadow-sm">
            <h4 className="font-serif font-medium text-emerald-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-500" />
              {t.didYouKnow}
            </h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {t.zakatInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
