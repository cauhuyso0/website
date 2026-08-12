"use client";

import type { SweetnessOption, ToppingOption } from "@/lib/strapi/types";
import type { ProductCustomizationValue } from "@/lib/product-customization";

type ProductCustomizationProps = {
  flavorOptions: ToppingOption[];
  sweetnessOptions: SweetnessOption[];
  value: ProductCustomizationValue;
  onChange: (value: ProductCustomizationValue) => void;
};

function formatOptionLabel(label: string, isFavorite?: boolean): string {
  return isFavorite ? `${label} *` : label;
}

function OptionChip({
  label,
  isFavorite,
  selected,
  onSelect,
}: {
  label: string;
  isFavorite?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition active:scale-[0.98] ${
        selected
          ? "border-brand bg-brand text-surface ring-2 ring-brand/30"
          : "border-line bg-surface text-brand hover:border-accent"
      }`}
    >
      {formatOptionLabel(label, isFavorite)}
    </button>
  );
}

export function ProductCustomization({
  flavorOptions,
  sweetnessOptions,
  value,
  onChange,
}: ProductCustomizationProps) {
  return (
    <div className="relative z-10 space-y-6 border-t border-line pt-6">
      {flavorOptions.length > 0 ? (
        <div>
          <p className="mb-3 font-[family-name:var(--font-display)] text-lg text-brand">
            Chọn vị
          </p>
          <div className="flex flex-wrap gap-2">
            {flavorOptions.map((option, index) => (
              <OptionChip
                key={`flavor-${option.label}-${index}`}
                label={option.label}
                isFavorite={option.isFavorite}
                selected={value.flavor === option.label}
                onSelect={() => onChange({ ...value, flavor: option.label })}
              />
            ))}
          </div>
          {!value.flavor ? (
            <p className="mt-2 text-sm text-muted">Vui lòng chọn một vị</p>
          ) : null}
        </div>
      ) : null}

      {sweetnessOptions.length > 0 ? (
        <div>
          <p className="mb-3 font-[family-name:var(--font-display)] text-lg text-brand">
            Độ ngọt
          </p>
          <div className="flex flex-wrap gap-2">
            {sweetnessOptions.map((option, index) => (
              <OptionChip
                key={`sweetness-${option.label}-${index}`}
                label={option.label}
                selected={value.sweetness === option.label}
                onSelect={() => onChange({ ...value, sweetness: option.label })}
              />
            ))}
          </div>
          {!value.sweetness ? (
            <p className="mt-2 text-sm text-muted">Vui lòng chọn độ ngọt</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
