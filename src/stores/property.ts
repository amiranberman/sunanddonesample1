import { Rate } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PropertyState {
  id: string;
  rate?: Rate;
  setPropertyId: (id: string) => void;
  setRate: (rate: Rate) => void;
}

export const usePropertyStore = create<PropertyState>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        setPropertyId: (id) => set(() => ({ id })),
        setRate: (rate) => set(() => ({ rate })),
      }),
      { name: "property-storage" }
    )
  )
);
