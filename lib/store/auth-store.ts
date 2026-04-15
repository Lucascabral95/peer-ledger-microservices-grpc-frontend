import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSessionModel } from "@/domain/models";
import { AUTH_STORAGE_KEYS } from "@/shared/constants";

interface AuthStoreState {
  session: AuthSessionModel | null;
  setSession: (session: AuthSessionModel) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: AUTH_STORAGE_KEYS.session,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }

        return window.localStorage;
      }),
      partialize: (state) => ({
        session: state.session,
      }),
    },
  ),
);
