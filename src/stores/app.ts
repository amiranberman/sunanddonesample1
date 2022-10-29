import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  loading: boolean;
  loadingMessage: string;
  load: (message?: string) => void;
  unload: () => void;
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    loading: false,
    loadingMessage: "Just a moment...",
    load: (message) =>
      set((state) => ({
        loading: true,
        loadingMessage: message ?? state.loadingMessage,
      })),
    unload: () =>
      set(() => ({ loading: false, loadingMessage: "Just a moment..." })),
    headerHeight: 0,
    setHeaderHeight: (height: number) => set(() => ({ headerHeight: height })),
  }))
);
