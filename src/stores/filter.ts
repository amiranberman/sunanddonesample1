import { filterSchema } from "@/schemas/filter";
import { z } from "zod";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface FilterState {
  filter?: z.infer<typeof filterSchema>;
  setFilter: (filter: z.infer<typeof filterSchema>) => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      filter: {},
      setFilter: (filter) => set(() => ({ filter })),
    }),
    { name: "filter-storage" }
  )
);
