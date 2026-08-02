export type PrimaryNavItem =
  | {
      href: string;
      label: string;
      sectionId: "experience" | "skills" | "portfolio" | "contact";
    }
  | { href: string; label: string; sectionId?: undefined };

export const primaryNav: PrimaryNavItem[] = [
  { href: "#experience", label: "Experience", sectionId: "experience" },
  { href: "#skills", label: "Skills", sectionId: "skills" },
  { href: "#portfolio", label: "Portfolio", sectionId: "portfolio" },
  { href: "#contact", label: "Contact", sectionId: "contact" },
  { href: "/documentation", label: "Docs" },
];

export const scrollSections = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
] as const;
