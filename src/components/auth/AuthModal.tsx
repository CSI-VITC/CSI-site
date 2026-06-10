"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import "./Rbac.css";

interface AuthModalProps {
  onAuthenticated?: () => void;
}

export function AuthModal({ onAuthenticated }: AuthModalProps) {
  const { signIn, signUp, demoSignIn, isDemoMode, authOpen, authMode, closeAuth } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authOpen) setMode(authMode);
  }, [authOpen, authMode]);

  const finish = () => {
    closeAuth();
    onAuthenticated?.();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password, displayName || email.split("@")[0] || "Member");
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDemo = (role: "user" | "admin") => {
    demoSignIn(role);
    finish();
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <div
          className="rbac-auth-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          onClick={closeAuth}
        >
          <motion.div
            className="rbac-auth-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 id="auth-title" className="rbac-auth-title">
              {mode === "signin" ? "Sign in to CSI" : "Create your account"}
            </h1>
            <p className="rbac-auth-subtitle">
              Sign in to save resources, track events, access certificates, and personalize your experience.
            </p>

            {isDemoMode ? (
              <div className="rbac-auth-demo">
                <span className="rbac-auth-demo-label">Demo mode — choose a role</span>
                <div className="rbac-auth-demo-row">
                  <button type="button" className="rbac-auth-btn" onClick={() => handleDemo("user")}>
                    Member
                  </button>
                  <button type="button" className="rbac-auth-btn rbac-auth-btn--primary" onClick={() => handleDemo("admin")}>
                    Administrator
                  </button>
                </div>
                <p className="rbac-auth-subtitle" style={{ marginTop: 16, marginBottom: 0 }}>
                  Configure Firebase env vars for production authentication.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {error && (
                  <p className="rbac-auth-error" role="alert">
                    {error}
                  </p>
                )}
                {mode === "signup" && (
                  <div className="rbac-auth-field">
                    <label className="rbac-auth-label" htmlFor="auth-name">
                      Display name
                    </label>
                    <input
                      id="auth-name"
                      className="rbac-auth-input"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="rbac-auth-field">
                  <label className="rbac-auth-label" htmlFor="auth-email">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    className="rbac-auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="rbac-auth-field">
                  <label className="rbac-auth-label" htmlFor="auth-password">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    className="rbac-auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>
                <button type="submit" className="rbac-auth-btn rbac-auth-btn--primary" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                </button>
                <p className="rbac-auth-switch">
                  {mode === "signin" ? "New member?" : "Already have an account?"}
                  <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                    {mode === "signin" ? "Create account" : "Sign in"}
                  </button>
                </p>
              </form>
            )}
            <button type="button" className="rbac-unlock-ghost" style={{ marginTop: 14, width: "100%" }} onClick={closeAuth}>
              Continue exploring as Guest
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
