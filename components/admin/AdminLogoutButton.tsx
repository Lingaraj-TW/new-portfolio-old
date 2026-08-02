"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/admin/session";
import { createSupabaseBrowserClient, supabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function clearAdminCookie() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function setAdminCookie() {
  document.cookie = `${ADMIN_SESSION_COOKIE}=true; path=/; max-age=${ADMIN_SESSION_MAX_AGE}; SameSite=Lax`;
}

export function AdminLogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setSignedIn(false);
      return;
    }
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith(`${ADMIN_SESSION_COOKIE}=true`));
    if (hasCookie) {
      setSignedIn(true);
      return;
    }
    if (!isSupabaseConfigured()) {
      setSignedIn(false);
      return;
    }
    void supabase.auth
      .getUser()
      .then(({ data }) => setSignedIn(!!data.user))
      .catch(() => setSignedIn(false));
  }, [pathname]);

  if (pathname === "/admin/login" || !signedIn) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          clearAdminCookie();
          if (isSupabaseConfigured()) {
            const client = createSupabaseBrowserClient();
            await client.auth.signOut();
          }
        } finally {
          router.replace("/profeed");
          router.refresh();
          setPending(false);
        }
      }}
      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/90 hover:bg-muted disabled:opacity-60 dark:border-border dark:bg-muted dark:hover:bg-muted"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

export { clearAdminCookie, setAdminCookie };
