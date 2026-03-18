export const formatCurrency = (input: number | string, hideCurrency?: boolean) => {
  return `${hideCurrency ? '' : 'Rp'} ${Number(input)?.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
};
