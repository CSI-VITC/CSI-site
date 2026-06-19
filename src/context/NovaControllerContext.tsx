"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

interface NovaControllerApi {
  openWithQuery: (query: string) => void;
}

interface NovaControllerContextValue {
  askNova: (query: string) => void;
  registerNovaController: (api: NovaControllerApi | null) => void;
}

const NovaControllerContext = createContext<NovaControllerContextValue | null>(null);

export function NovaControllerProvider({ children }: { children: ReactNode }) {
  const controllerRef = useRef<NovaControllerApi | null>(null);

  const registerNovaController = useCallback((api: NovaControllerApi | null) => {
    controllerRef.current = api;
  }, []);

  const askNova = useCallback((query: string) => {
    controllerRef.current?.openWithQuery(query);
  }, []);

  const value = useMemo(
    () => ({ askNova, registerNovaController }),
    [askNova, registerNovaController]
  );

  return <NovaControllerContext.Provider value={value}>{children}</NovaControllerContext.Provider>;
}

export function useNovaController() {
  const ctx = useContext(NovaControllerContext);
  if (!ctx) throw new Error("useNovaController must be used within NovaControllerProvider");
  return ctx;
}
