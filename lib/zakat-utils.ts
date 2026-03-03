export interface ZakatAssets {
  cashInHand: number;
  cashInBank: number;
  goldValue: number;
  silverValue: number;
  investments: number;
  businessInventory: number;
  propertyForSale: number;
  moneyOwedToYou: number;
}

export interface ZakatLiabilities {
  debtsToPay: number;
  immediateExpenses: number; // e.g. rent, bills due immediately
}

export interface ZakatCalculationResult {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  isEligible: boolean;
  zakatPayable: number;
}

export const calculateZakat = (
  assets: ZakatAssets,
  liabilities: ZakatLiabilities,
  nisabThreshold: number
): ZakatCalculationResult => {
  const totalAssets = Object.values(assets).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + (Number(val) || 0), 0);
  
  const netAssets = totalAssets - totalLiabilities;
  const isEligible = netAssets >= nisabThreshold;
  const zakatPayable = isEligible ? netAssets * 0.025 : 0;

  return {
    totalAssets,
    totalLiabilities,
    netAssets,
    isEligible,
    zakatPayable,
  };
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
