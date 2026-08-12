import type { Product, SweetnessOption, ToppingOption } from "@/lib/strapi/types";

export type ProductCustomizationValue = {
  flavor: string;
  sweetness: string;
};

export const DEFAULT_FLAVOR_OPTIONS: ToppingOption[] = [
  { label: "Không topping", priceAddon: 0, isFavorite: false },
  { label: "Đông trùng hạ thảo Bhutan (1 con)", priceAddon: 270000, isFavorite: true },
  { label: "Nấm đông trùng", priceAddon: 85000, isFavorite: true },
  { label: "Saffron", priceAddon: 45000, isFavorite: false },
];

export const DEFAULT_SWEETNESS_OPTIONS: SweetnessOption[] = [
  { label: "0% đường" },
  { label: "30% đường" },
  { label: "50% đường" },
  { label: "70% đường" },
  { label: "100% đường" },
];

const YEN_CHUNG_CATEGORY_SLUG = "yen-chung";

function shouldUseDefaultCustomizationOptions(product: Product): boolean {
  if (product.showCustomization) {
    return true;
  }

  return product.category?.slug === YEN_CHUNG_CATEGORY_SLUG;
}

function mergeFlavorOptions(product: Product): ToppingOption[] {
  const merged: ToppingOption[] =
    product.flavorOptions?.map((option) => ({
      label: option.label,
      isFavorite: option.isFavorite,
      priceAddon: 0,
    })) ?? [];

  for (const option of product.toppingOptions ?? []) {
    if (!merged.some((entry) => entry.label === option.label)) {
      merged.push(option);
    }
  }

  return merged;
}

export function resolveFlavorOptions(product: Product): ToppingOption[] {
  const merged = mergeFlavorOptions(product);
  if (merged.length > 0) {
    return merged;
  }

  return shouldUseDefaultCustomizationOptions(product) ? DEFAULT_FLAVOR_OPTIONS : [];
}

export function resolveSweetnessOptions(product: Product): SweetnessOption[] {
  if (product.sweetnessOptions?.length) {
    return product.sweetnessOptions;
  }

  return shouldUseDefaultCustomizationOptions(product) ? DEFAULT_SWEETNESS_OPTIONS : [];
}

export function hasProductCustomization(product: Product): boolean {
  return (
    resolveFlavorOptions(product).length > 0 ||
    resolveSweetnessOptions(product).length > 0
  );
}

export function getDefaultCustomizationValue(_product: Product): ProductCustomizationValue {
  return {
    flavor: "",
    sweetness: "",
  };
}

export function getFlavorPriceAddon(product: Product, flavorLabel: string): number {
  const option = resolveFlavorOptions(product).find(
    (entry) => entry.label === flavorLabel
  );
  return Number(option?.priceAddon ?? 0);
}

export function formatCustomizationLabel(value: ProductCustomizationValue): string {
  const parts = [
    value.flavor ? `Vị: ${value.flavor}` : "",
    value.sweetness ? `Độ ngọt: ${value.sweetness}` : "",
  ].filter(Boolean);

  return parts.join(" · ");
}

export function buildCustomizationKey(value: ProductCustomizationValue): string {
  return [value.flavor, value.sweetness].join("|");
}
