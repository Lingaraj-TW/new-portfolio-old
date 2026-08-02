import { redirect } from "next/navigation";

/** Legacy URL — public feed has no login wall. */
export default function ProFeedLoginRedirectPage() {
  redirect("/profeed");
}
