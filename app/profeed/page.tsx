import type { Metadata } from "next";

import { PublicFeedView } from "@/components/feed/PublicFeedView";

export const metadata: Metadata = {
  title: "ProFeed — Content feed",
  description:
    "Public writing feed — documentation insights, portfolio updates, and technical notes.",
};

export const dynamic = "force-dynamic";

export default function ProFeedPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight">ProFeed</h1>
      <div className="mt-4 max-w-3xl">
        <PublicFeedView />
      </div>
    </div>
  );
}
