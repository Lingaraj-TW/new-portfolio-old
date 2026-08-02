import { productNavItems } from "@/content/products";

export type SuiteItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Marketing / concept pages for each app in the portfolio suite. */
export const productPlatformRoutes = productNavItems.map(({ name, href }) => ({
  href,
  label: name,
}));

export function isProductPlatformPage(pathname: string): boolean {
  return productPlatformRoutes.some(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

/** Marketing / concept demo routes — dashboard apps stay at /profeed and /proinsights. */
export function getSuiteNavItems(): SuiteItem[] {
  return productPlatformRoutes.map(({ label, href }) => ({ label, href }));
}

export const portfolioPrimaryNav = [
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "/#contact", label: "Contact" },
] as const;
