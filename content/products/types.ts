export type ProductFeature = {
  title: string;
  body: string;
};

export type ProductMetric = {
  label: string;
  value: string;
  hint: string;
};

export type ProductNavItem = {
  slug: string;
  name: string;
  subtitle: string;
  href: string;
  iconKey: "FileText" | "Sparkles" | "MessageSquare" | "BarChart3" | "Code2";
};

export type ProductPageContent = {
  slug: string;
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    tagline: string;
    problem?: string;
  };
  features: ProductFeature[];
  metrics: ProductMetric[];
  builtForTags: string[];
  liveDemo?: {
    label: string;
    href: string;
  };
  flowSteps?: ProductFeature[];
  flowStepsHeading?: string;
  governanceFeatures?: ProductFeature[];
};
