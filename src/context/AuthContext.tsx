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
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import type { AuthUser, UserProfile, UserRole } from "@/types/auth";

const DEMO_STORAGE_KEY = "csi-demo-auth";

interface DemoSession {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  authOpen: boolean;
  authMode: "signin" | "signup";
  openAuth: (mode?: "signin" | "signup") => void;
  closeAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: data.email ?? "",
    displayName: data.displayName ?? "",
    role: (data.role as UserRole) ?? "user",
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

async function createUserProfile(user: User, displayName: string): Promise<UserProfile> {
  const db = getFirebaseDb();
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email ?? "",
    displayName,
    role: "user",
    photoURL: user.photoURL ?? undefined,
    createdAt: new Date().toISOString(),
  };
  if (db) {
    await setDoc(doc(db, "users", user.uid), {
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role,
      photoURL: profile.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
  }
  return profile;
}

function loadDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

function saveDemoSession(session: DemoSession | null) {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(DEMO_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const isDemoMode = !isFirebaseConfigured;

  const openAuth = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  useEffect(() => {
    if (isDemoMode) {
      const demo = loadDemoSession();
      if (demo) {
        setUser({ uid: demo.uid, email: demo.email, displayName: demo.displayName, photoURL: null });
        setProfile({
          uid: demo.uid,
          email: demo.email,
          displayName: demo.displayName,
          role: demo.role,
          createdAt: new Date().toISOString(),
        });
      }
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(mapFirebaseUser(firebaseUser));
      const existing = await fetchUserProfile(firebaseUser.uid);
      setProfile(existing);
      setLoading(false);
    });

    return () => unsub();
  }, [isDemoMode]);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase is not configured");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(mapFirebaseUser(cred.user));
    const existing = await fetchUserProfile(cred.user.uid);
    if (!existing) throw new Error("User profile not found. Contact an administrator.");
    setProfile(existing);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase is not configured");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const newProfile = await createUserProfile(cred.user, displayName);
    setUser(mapFirebaseUser(cred.user));
    setProfile(newProfile);
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      saveDemoSession(null);
      setUser(null);
      setProfile(null);
      return;
    }
    const auth = getFirebaseAuth();
    if (auth) await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  }, [isDemoMode]);

  const demoSignIn = useCallback((role: UserRole) => {
    const session: DemoSession = {
      uid: role === "admin" ? "demo-admin" : "demo-user",
      email: role === "admin" ? "admin@csi.vitc.ac.in" : "member@csi.vitc.ac.in",
      displayName: role === "admin" ? "CSI Administrator" : "CSI Member",
      role,
    };
    saveDemoSession(session);
    setUser({ uid: session.uid, email: session.email, displayName: session.displayName, photoURL: null });
    setProfile({
      uid: session.uid,
      email: session.email,
      displayName: session.displayName,
      role: session.role,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const role = profile?.role ?? null;
  const isAuthenticated = !!user && !!profile;
  const isGuest = !isAuthenticated;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role,
      loading,
      isAuthenticated,
      isGuest,
      isAdmin: role === "admin",
      isDemoMode,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      signOut,
      demoSignIn,
    }),
    [
      user,
      profile,
      role,
      loading,
      isAuthenticated,
      isGuest,
      isDemoMode,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      signOut,
      demoSignIn,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
