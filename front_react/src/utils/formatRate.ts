export const formatRate = (rate: number, decimals: number = 4): string => {
  return rate.toFixed(decimals);
};