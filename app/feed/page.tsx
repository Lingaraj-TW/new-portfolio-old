import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ProFeed — Content feed",
};

export default function FeedRedirectPage() {
  redirect("/profeed");
}
