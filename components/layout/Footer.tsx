import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, type LucideIcon } from "lucide-react";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { ReloadHomeLink } from "@/components/shared/ReloadHomeLink";
import { footer } from "@/content/contact";
import { siteBrand } from "@/content/homepage";

type ConnectIcon = LucideIcon | typeof LinkedInIcon | typeof GitHubIcon;

const connectIconMap: Record<string, ConnectIcon> = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Email: Mail,
  Phone: Phone,
};

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="site-footer-col site-footer-col--nav">
      <h3 className="site-footer-heading">{title}</h3>
      <ul className="site-footer-links">
        {links.map((link) => (
          <li key={link.label}>
            {link.href === "/" ? (
              <ReloadHomeLink href="/" className="site-footer-link">
                {link.label}
              </ReloadHomeLink>
            ) : (
              <Link href={link.href} className="site-footer-link">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const prodocBody = footer.prodoc.note.replace(
    `This site showcases ${footer.prodoc.highlight} — `,
    "",
  );

  return (
    <footer className="site-footer shrink-0">
      <div className="site-footer-fx" aria-hidden>
        <div className="site-footer-fx-orb site-footer-fx-orb--left" />
        <div className="site-footer-fx-orb site-footer-fx-orb--right" />
        <div className="site-footer-fx-grid" />
      </div>

      <div className="site-footer-container">
        <div className="site-footer-grid">
          <div className="site-footer-col site-footer-col--brand">
            <div className="site-footer-brand-row">
              <div className="site-footer-avatar" aria-hidden>
                <span className="site-footer-avatar-ring" />
                <Image
                  src="/images/profile-photo.jpg"
                  alt=""
                  width={44}
                  height={44}
                  className="site-footer-avatar-img"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="site-footer-brand-name"
                  style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}
                >
                  {siteBrand.name}
                </p>
                <p
                  className="site-footer-brand-subtitle"
                  style={{
                    fontSize: "12px",
                    background: "linear-gradient(135deg, #9333EA, #EC4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {siteBrand.subtitle}
                </p>
              </div>
            </div>

            <p className="site-footer-brand-desc">{footer.brand.description}</p>

            <p className="site-footer-brand-prodoc">
              <Link href={footer.prodoc.demoHref} className="site-footer-link font-medium text-accent">
                {footer.prodoc.highlight}
              </Link>
              {" — "}
              {prodocBody}
            </p>
          </div>

          <FooterLinkGroup title="Navigate" links={footer.navigate} />

          <div className="site-footer-col site-footer-col--connect">
            <h3 className="site-footer-heading">Connect</h3>
            <div className="site-footer-social-row">
              {footer.connect.map((item) => {
                const Icon = connectIconMap[item.label];
                if (!Icon) return null;
                const isBrand = Icon === LinkedInIcon || Icon === GitHubIcon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="site-footer-social"
                    aria-label={item.label}
                    {...("external" in item && item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {isBrand ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="site-footer-divider" aria-hidden />

        <div className="site-footer-legal">
          <p className="site-footer-bottom">
            <span className="site-footer-bottom-strong">{footer.builtWith.philosophy}</span>
            <span className="site-footer-bottom-sep">-</span>
            {footer.builtWith.powered}
          </p>
          <p className="site-footer-copyright">
            © {year} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** @deprecated Use Footer */
export const SiteFooter = Footer;
