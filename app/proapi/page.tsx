"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FlaskConical, Terminal } from "lucide-react";

import { ProApiGlassCard } from "@/components/proapi/ProApiGlassCard";
import { portalMetrics } from "@/lib/proapi/mock-data";

const metrics = [
  { label: "APIs Published", value: portalMetrics.apisPublished },
  { label: "Endpoints", value: portalMetrics.endpoints },
  { label: "SDKs", value: portalMetrics.sdks },
  { label: "Avg Integration Time", value: `${portalMetrics.avgIntegrationMinutes} min` },
];

export default function ProApiLandingPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7C3AED]">
          ProAPI
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Developer Portal
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Everything developers need to integrate, test, and ship faster.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/proapi/getting-started"
            className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A855F7]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/proapi/api-reference"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-[#7C3AED]/30"
          >
            <Terminal className="h-4 w-4 text-[#7C3AED]" />
            Browse APIs
          </Link>
          <Link
            href="/proapi/playground"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-[#7C3AED]/30"
          >
            <FlaskConical className="h-4 w-4 text-[#7C3AED]" />
            Try Playground
          </Link>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <ProApiGlassCard className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-[#7C3AED]">{m.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{m.label}</p>
            </ProApiGlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/proapi/api-reference", title: "API Reference", icon: Terminal, desc: "Stripe-style three-column explorer with try-it console." },
          { href: "/proapi/authentication", title: "Authentication", icon: BookOpen, desc: "API keys, Bearer, OAuth 2.0, and JWT flows." },
          { href: "/proapi/sdks", title: "SDK Center", icon: BookOpen, desc: "Official SDKs with install commands and examples." },
        ].map((card) => (
          <Link key={card.href} href={card.href}>
            <ProApiGlassCard className="h-full p-5 transition hover:border-[#7C3AED]/30">
              <card.icon className="h-5 w-5 text-[#7C3AED]" />
              <h2 className="mt-3 font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.desc}</p>
            </ProApiGlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
