"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_SESSION_VALUE,
  ADMIN_USERNAME,
} from "@/lib/admin/session";

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/dashboard";

  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [pending, setPending] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const form = e.currentTarget;
    const username = (
      form.elements.namedItem("username") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      document.cookie = `${ADMIN_SESSION_COOKIE}=${ADMIN_SESSION_VALUE}; path=/; max-age=${ADMIN_SESSION_MAX_AGE}; SameSite=Lax`;
      router.replace(next.startsWith("/") ? next : "/admin/dashboard");
      router.refresh();
      return;
    }

    setError("Invalid credentials");
    setPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-white">
            Pro<span className="text-purple-400">Feed</span>
          </span>
          <p className="mt-1 text-sm text-slate-400">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-1 block text-sm text-slate-300"
            >
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter username"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1 block text-sm text-slate-300"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="text-xs text-slate-500 transition hover:text-purple-400"
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
          {showHint ? (
            <p className="mt-2 rounded-lg bg-white/5 px-4 py-2 text-xs text-slate-400">
              Username is your role. Password is your app name + year (
              {ADMIN_PASSWORD.replace(/\d{4}$/, "YYYY")}).
            </p>
          ) : null}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/profeed/inbox" className="hover:text-purple-300">
            ← Public feedback inbox
          </Link>
          {" · "}
          <Link href="/profeed" className="hover:text-purple-300">
            Content feed
          </Link>
        </p>
      </div>
    </div>
  );
}
