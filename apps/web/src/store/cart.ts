"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string;
  productDocumentId: string;
  productSlug: string;
  productName: string;
  variantDocumentId?: string;
  variantName?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
  customizationKey?: string;
  customizationNote?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

function buildKey(
  productDocumentId: string,
  variantDocumentId?: string,
  customizationKey?: string
): string {
  return `${productDocumentId}:${variantDocumentId ?? "base"}:${customizationKey ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = buildKey(
          item.productDocumentId,
          item.variantDocumentId,
          item.customizationKey
        );
        const existing = get().items.find((entry) => entry.key === key);
        if (existing) {
          set({
            items: get().items.map((entry) =>
              entry.key === key
                ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
                : entry
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              ...item,
              key,
              quantity: item.quantity ?? 1,
            },
          ],
        });
      },
      removeItem: (key) => {
        set({ items: get().items.filter((item) => item.key !== key) });
      },
      updateQuantity: (key, quantity) => {
        if (quantity < 1) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.key === key ? { ...item, quantity } : item
          ),
        });
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    }),
    {
      name: "hieu-hien-cart",
    }
  )
);
