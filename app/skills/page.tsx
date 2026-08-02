import { redirect } from "next/navigation";

/** Skills live on the homepage — legacy route redirects to in-page section. */
export default function SkillsPage() {
  redirect("/#skills");
}
