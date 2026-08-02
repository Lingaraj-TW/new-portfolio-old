import { redirect } from "next/navigation";

/** Legacy URL — inbox is public read; admin sign-in lives at /admin/login */
export default function ProFeedInboxLoginRedirectPage() {
  redirect("/profeed/inbox");
}
