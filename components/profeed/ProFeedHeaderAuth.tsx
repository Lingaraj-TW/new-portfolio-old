"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createSupabaseBrowserClient, supabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function ProFeedHeaderAuth({
  loginHref = "/admin/login?next=/profeed/inbox",
}: {
  loginHref?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || pathname?.includes("/login")) {
      setSignedIn(false);
      return;
    }
    void supabase.auth
      .getUser()
      .then(({ data }) => setSignedIn(!!data.user))
      .catch(() => setSignedIn(false));
  }, [pathname]);

  if (!isSupabaseConfigured() || pathname?.includes("/login")) {
    return null;
  }

  if (!signedIn) {
    return (
      <Link
        href={loginHref}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/90 hover:bg-muted dark:border-border dark:bg-muted dark:hover:bg-muted"
      >
        Sign in to triage
      </Link>
    );
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
          router.replace("/profeed/inbox");
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
