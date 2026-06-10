"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "csi-admin-a11y";

export interface AdminA11ySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  textScale: number;
}

interface AdminA11yContextValue extends AdminA11ySettings {
  setHighContrast: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setTextScale: (v: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const defaults: AdminA11ySettings = {
  highContrast: false,
  reducedMotion: false,
  textScale: 100,
};

const AdminA11yContext = createContext<AdminA11yContextValue | null>(null);

export function AdminA11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminA11ySettings>(defaults);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...defaults, ...JSON.parse(stored) });
    } catch {
      /* ignore */
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setSettings((s) => ({ ...s, reducedMotion: true }));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, mounted]);

  const setHighContrast = useCallback((highContrast: boolean) => {
    setSettings((s) => ({ ...s, highContrast }));
  }, []);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setSettings((s) => ({ ...s, reducedMotion }));
  }, []);

  const setTextScale = useCallback((textScale: number) => {
    setSettings((s) => ({ ...s, textScale }));
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setHighContrast,
      setReducedMotion,
      setTextScale,
      toggleHighContrast: () => setSettings((s) => ({ ...s, highContrast: !s.highContrast })),
      toggleReducedMotion: () => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion })),
    }),
    [settings, setHighContrast, setReducedMotion, setTextScale]
  );

  const rootClass = [
    settings.highContrast ? "aem--high-contrast" : "",
    settings.reducedMotion ? "aem--reduced-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AdminA11yContext.Provider value={value}>
      <div
        className={rootClass}
        style={{ "--aem-text-scale": `${settings.textScale}%` } as React.CSSProperties}
      >
        {children}
      </div>
    </AdminA11yContext.Provider>
  );
}

export function useAdminA11y() {
  const ctx = useContext(AdminA11yContext);
  if (!ctx) throw new Error("useAdminA11y must be used within AdminA11yProvider");
  return ctx;
}

export function useOptionalAdminA11y() {
  return useContext(AdminA11yContext);
}
