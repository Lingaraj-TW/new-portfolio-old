module.exports = {
  title: 'Linga Raj M — Technical Writer',
  tagline: '7+ Years of Driving User Documentation Excellence',
  url: 'https://lingaraj-tw.github.io',
  baseUrl: '/Technical-Writing-Portfolio/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Lingaraj-TW',
  projectName: 'Technical-Writing-Portfolio',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Lingaraj-TW/Technical-Writing-Portfolio/edit/site-docusaurus/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Linga Raj M',
      logo: {
        alt: 'Linga Raj M',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/docs/intro', label: 'Portfolio', position: 'left' },
        { to: '/about', label: 'About', position: 'left' },
        { to: '/docs/case-study-template', label: 'Case study template', position: 'left' },
        {
          href: 'https://www.linkedin.com/in/lingarajm/',
          label: 'LinkedIn',
          position: 'right',
        },
        { href: 'mailto:lingaraj501@gmail.com', label: 'Say hello', position: 'right' },
        { href: '/assets/cv/CV-Lingaraj-TW.pdf', label: 'CV', position: 'right' }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Work',
          items: [
            { label: 'Portfolio', to: '/docs/intro' },
            { label: "Things I've worked on", to: '/projects' }
          ],
        },
        {
          title: 'Connect',
          items: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lingarajm/' },
            { label: 'Email', href: 'mailto:lingaraj501@gmail.com' }
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Linga Raj M.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      additionalLanguages: ['bash', 'powershell']
    },
  },
};
