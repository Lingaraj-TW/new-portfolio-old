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
          router.replace("/profeed/portal/login");
          router.refresh();
          setPending(false);
        }
      }}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
