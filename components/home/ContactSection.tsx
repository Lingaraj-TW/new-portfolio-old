"use client";

import { useRef, useState } from "react";
import { ChevronDown, Globe, Mail, Phone, Send, type LucideIcon } from "lucide-react";

import {
  ContactMessageEditor,
  type ContactMessageEditorHandle,
} from "@/components/home/ContactMessageEditor";
import { ContactRoleFade } from "@/components/home/ContactRoleFade";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import {
  contactOpportunityRoles,
  contactPage,
  contactSubjectOptions,
  getPortfolioContactLink,
  type ContactSubjectValue,
} from "@/content/contact";

type DirectIcon = LucideIcon | typeof LinkedInIcon;

const inputClassName =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50 focus:ring-1 focus:ring-accent/30";

const contactCardClassName =
  "home-card group flex items-center gap-4 p-4 transition-colors hover:border-accent/40";

type FormState = {
  name: string;
  email: string;
  subject: ContactSubjectValue | "";
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function getDirectContactItems() {
  const portfolio = getPortfolioContactLink();
  const phone = contactPage.links.find((l) => l.icon === "phone");
  const mail = contactPage.links.find((l) => l.icon === "mail");
  const linkedin = contactPage.links.find((l) => l.icon === "linkedin");

  return [
    phone!,
    mail!,
    linkedin!,
    {
      icon: "globe" as const,
      label: "Portfolio",
      value: portfolio.value,
      href: portfolio.href,
      external: true,
    },
  ];
}

const directIcons: Record<"phone" | "mail" | "linkedin" | "globe", DirectIcon> = {
  phone: Phone,
  mail: Mail,
  linkedin: LinkedInIcon,
  globe: Globe,
};

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

export function ContactSection() {
  const directContactItems = getDirectContactItems();
  const messageEditorRef = useRef<ContactMessageEditorHandle>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    const messageHtml = messageEditorRef.current?.getHtml() ?? form.message;
    const messagePlain = messageEditorRef.current?.getText().trim() ?? "";

    if (messagePlain.length < MESSAGE_MIN) {
      setStatus("error");
      setErrorMessage(`Message must be at least ${MESSAGE_MIN} characters.`);
      return;
    }
    if (messagePlain.length > MESSAGE_MAX) {
      setStatus("error");
      setErrorMessage(`Message must be ${MESSAGE_MAX} characters or fewer.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: messageHtml,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      setForm(initialForm);
      messageEditorRef.current?.clear();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-20" aria-label="Contact">
      <div className="contact-section home-panel relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          aria-hidden
        />

        <div className="relative">
        <div className="animate-on-scroll mb-6 text-center">
          <h2 className="mx-auto max-w-4xl font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
              <span>{contactPage.connectLead}</span>
              <ContactRoleFade words={contactOpportunityRoles} />
              <span>opportunities</span>
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            I&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="animate-on-scroll delay-1 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                className={inputClassName}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Your Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClassName}
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Subject
              </label>
              <div className="relative">
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  className={`${inputClassName} cursor-pointer appearance-none pr-10`}
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subject: e.target.value as ContactSubjectValue | "",
                    }))
                  }
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {contactSubjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Your Message
              </label>
              <ContactMessageEditor
                ref={messageEditorRef}
                value={form.message}
                onChange={(html) => setForm((f) => ({ ...f, message: html }))}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="contact-form-submit mt-1 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? "Sending…" : "Send Message"}
                <Send className="h-4 w-4" aria-hidden />
              </span>
            </button>

            {status === "success" && (
              <p
                className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground"
                role="status"
              >
                Message sent! I&apos;ll get back to you within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p
                className="rounded-xl border border-secondary-accent/40 bg-secondary-accent/10 px-4 py-3 text-sm text-foreground"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </form>

          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {contactPage.directContactLabel}
            </p>

            <ul className="mt-4 flex flex-col gap-3">
              {directContactItems.map((link) => {
                const Icon = directIcons[link.icon];
                return (
                  <li key={link.icon}>
                    <a
                      href={link.href}
                      className={contactCardClassName}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10"
                        aria-hidden
                      >
                        {link.icon === "linkedin" ? (
                          <LinkedInIcon className="h-5 w-5 text-accent" />
                        ) : (
                          <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {link.label}
                        </span>
                        <span className="truncate text-sm font-medium text-foreground group-hover:text-accent">
                          {link.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
