import { redirect } from "next/navigation";

/** Legacy URL — portal is public read; customer sign-in is optional via /portal/login flow. */
export default function ProFeedPortalLoginRedirectPage() {
  redirect("/profeed/portal");
}
