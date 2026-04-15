// @ts-check

import { themes as prismThemes } from "prism-react-renderer";

const APP_URL = process.env.PRODOC_APP_URL || "http://localhost:3000";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ProDoc",
  tagline: "Documentation as a product — portfolio edition",
  // Intentionally omit `favicon` to avoid binary assets in-repo.

  future: {
    v4: true,
  },

  // These values are required by Docusaurus, but Vercel will provide the real URL.
  url: "https://prodoc.example.com",
  baseUrl: "/",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */ ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  customFields: {
    appUrl: APP_URL,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "ProDoc",
        logo: {
          alt: "ProDoc",
          src: "img/logo.svg",
        },
        items: [
          { to: "/", label: "Docs", position: "left" },
          {
            href: `${APP_URL}/profeed`,
            label: "ProFeed",
            position: "right",
          },
          {
            href: `${APP_URL}/proinsights`,
            label: "ProInsights",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Platform",
            items: [
              { label: "ProFeed", href: `${APP_URL}/profeed` },
              { label: "ProInsights", href: `${APP_URL}/proinsights` },
            ],
          },
          {
            title: "Author",
            items: [{ label: "Portfolio home", href: APP_URL }],
          },
        ],
        copyright: `© ${new Date().getFullYear()} ProDoc — Technical writing portfolio demo.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

