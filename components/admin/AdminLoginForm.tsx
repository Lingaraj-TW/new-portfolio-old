"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm({
  defaultNext = "/admin/dashboard",
}: {
  defaultNext?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || defaultNext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
          const supabase = createSupabaseBrowserClient();
          const { error: signError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signError) {
            setError(signError.message);
            return;
          }
          router.replace(next.startsWith("/") ? next : defaultNext);
          router.refresh();
        } catch {
          setError("Unexpected error.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="block text-sm font-medium text-foreground/80">
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none ring-ring/30 focus:ring-2 focus:ring-ring"
        />
      </label>
      <label className="block text-sm font-medium text-foreground/80">
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none ring-ring/30 focus:ring-2 focus:ring-ring"
        />
      </label>
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
