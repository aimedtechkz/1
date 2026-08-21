import { create } from "zustand";
import type { Product } from "@/lib/catalog";

type QuoteState = {
  open: boolean;
  product: Product | null;
  openFor: (product?: Product | null) => void;
  close: () => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  open: false,
  product: null,
  openFor: (product = null) => set({ open: true, product }),
  close: () => set({ open: false }),
}));
