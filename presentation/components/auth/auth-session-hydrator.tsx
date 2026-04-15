'use client';

import { useEffect } from "react";

import { getPersistedAuthSession } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";

export function AuthSessionHydrator() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const session = await getPersistedAuthSession();

      if (!isMounted) {
        return;
      }

      if (session) {
        setSession(session);
        return;
      }

      clearSession();
    };

    void syncSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, setSession]);

  return null;
}
