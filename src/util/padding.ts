export const padding = (value: string, padding: number = 0) => {
  if (value.length >= padding) return value;
  const paddingAmount = padding - value.length;
  return value + " ".repeat(paddingAmount);
};
