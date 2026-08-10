export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceRange(min: number, max?: number | null): string {
  if (max === undefined || max === null || max === min) {
    return formatVnd(min);
  }
  return `${formatVnd(min)} - ${formatVnd(max)}`;
}
