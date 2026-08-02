"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createSupabaseBrowserClient, supabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function PortalLogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (
      !isSupabaseConfigured() ||
      pathname.startsWith("/portal/login") ||
      pathname.startsWith("/profeed/portal/login")
    ) {
      setSignedIn(false);
      return;
    }
    void supabase.auth
      .getUser()
      .then(({ data }) => setSignedIn(!!data.user))
      .catch(() => setSignedIn(false));
  }, [pathname]);

  if (
    !isSupabaseConfigured() ||
    pathname.startsWith("/portal/login") ||
    pathname.startsWith("/profeed/portal/login") ||
    !signedIn
  ) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          const client = createSupabaseBrowserClient();
          await client.auth.signOut();
        } finally {
          router.replace("/profeed/portal");
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
