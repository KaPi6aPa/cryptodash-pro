export const formatCurrency = (value: number, compact: boolean = false): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(value);
};