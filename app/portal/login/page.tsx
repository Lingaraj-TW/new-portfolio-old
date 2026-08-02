import { redirect } from "next/navigation";

/** Legacy URL — public portal view needs no login. */
export default function PortalLoginRedirectPage() {
  redirect("/profeed/portal");
}
