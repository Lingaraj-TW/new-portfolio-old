"use client";

import { CodeSampleTabs } from "@/components/proapi/CodeSampleTabs";
import type { ApiEndpoint } from "@/lib/proapi/types";

export function AuthCodeSample({ endpoint }: { endpoint: ApiEndpoint }) {
  return <CodeSampleTabs endpoint={endpoint} />;
}
