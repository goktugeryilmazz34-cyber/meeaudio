"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type AuthUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function profileForUser(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  fallback: { name: string; email: string },
): Promise<AuthUser> {
  const { data } = await supabase
    .from("profiles")
    .select("name, email, role")
    .eq("id", userId)
    .maybeSingle();

  return {
    id: userId,
    name: data?.name ?? fallback.name,
    email: data?.email ?? fallback.email,
    role: (data?.role as AuthUser["role"]) ?? "user",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const mapped = await profileForUser(supabase, authUser.id, {
        name: authUser.user_metadata?.name ?? authUser.email?.split("@")[0] ?? "",
        email: authUser.email ?? "",
      });
      setUser(mapped);
      setLoading(false);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      const mapped = await profileForUser(supabase, session.user.id, {
        name:
          session.user.user_metadata?.name ??
          session.user.email?.split("@")[0] ??
          "",
        email: session.user.email ?? "",
      });
      setUser(mapped);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(input) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: input.email.trim().toLowerCase(),
          password: input.password,
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Giriş başarısız.");
        const mapped = await profileForUser(supabase, data.user.id, {
          name: data.user.user_metadata?.name ?? "",
          email: data.user.email ?? input.email,
        });
        setUser(mapped);
        return mapped;
      },
      async signUp(input) {
        const email = input.email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email,
          password: input.password,
          options: { data: { name: input.name.trim() } },
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Kayıt başarısız.");
        const mapped = await profileForUser(supabase, data.user.id, {
          name: input.name.trim(),
          email,
        });
        setUser(mapped);
        return mapped;
      },
      async signOut() {
        await supabase.auth.signOut();
        setUser(null);
      },
    }),
    [user, loading, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  }
  return ctx;
}

export { isAdmin };
