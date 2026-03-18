export const formatCurrency = (input: number | string, hideCurrency?: boolean) => {
  return `${hideCurrency ? '' : 'Rp'} ${Number(input)?.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
};

export const capitalize = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
