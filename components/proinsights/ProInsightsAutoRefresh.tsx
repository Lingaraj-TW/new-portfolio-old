"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const KEY = "prodoc:proinsights:refresh";

export function broadcastProInsightsRefresh() {
  try {
    window.localStorage.setItem(KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

export function ProInsightsAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      router.refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  return null;
}
