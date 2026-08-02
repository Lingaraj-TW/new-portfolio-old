const FLOW_DEFS = (
  <svg className="absolute h-0 w-0" aria-hidden focusable="false">
    <defs>
      <linearGradient id="flow-in" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9333EA" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#9333EA" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="flow-out" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="flow-down" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(147,51,234,0.15)" />
        <stop offset="100%" stopColor="rgba(236,72,153,0.45)" />
      </linearGradient>
      <marker id="marker-in" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#9333EA" />
      </marker>
      <marker id="marker-out" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#EC4899" />
      </marker>
    </defs>
  </svg>
);

function ConnectorHorizontal({
  variant = "in",
  className = "",
}: {
  variant?: "in" | "out";
  className?: string;
}) {
  const stroke = variant === "in" ? "url(#flow-in)" : "url(#flow-out)";
  const marker = variant === "in" ? "url(#marker-in)" : "url(#marker-out)";

  return (
    <div
      className={`group flex w-full min-w-[2.5rem] max-w-[5rem] items-center px-1 ${className}`}
      aria-hidden
    >
      <svg
        className="h-2 w-full transition-opacity duration-300 group-hover:opacity-100 opacity-80"
        viewBox="0 0 80 8"
        preserveAspectRatio="none"
      >
        <path
          d="M 2 4 L 68 4"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd={marker}
        />
      </svg>
    </div>
  );
}

function ConnectorVertical({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2 ${className}`} aria-hidden>
      <svg className="h-8 w-2" viewBox="0 0 8 32" preserveAspectRatio="none">
        <path
          d="M 4 2 L 4 26"
          fill="none"
          stroke="url(#flow-down)"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#marker-in)"
        />
      </svg>
    </div>
  );
}

function FlowNode({
  label,
  sub,
  hub,
  branch,
  lane,
  className = "",
}: {
  label: string;
  sub: string;
  hub?: boolean;
  branch?: boolean;
  lane?: "input" | "output" | "branch";
  className?: string;
}) {
  const laneAccent =
    lane === "input"
      ? "border-l-2 border-l-accent/50"
      : lane === "output"
        ? "border-l-2 border-l-secondary-accent/50"
        : lane === "branch"
          ? "border-l-2 border-l-emerald-500/40"
          : "";

  const base =
    "relative flex w-full flex-col items-center rounded-2xl border px-4 py-3.5 text-center transition duration-300";

  const surface = hub
    ? "border-accent/45 bg-card shadow-[0_0_0_1px_rgba(147,51,234,0.18),0_16px_48px_rgba(147,51,234,0.14)] hover:border-accent/55 hover:shadow-[0_0_0_1px_rgba(147,51,234,0.28),0_20px_56px_rgba(147,51,234,0.18)]"
    : branch
      ? "border-emerald-500/25 bg-card/95 hover:border-emerald-500/40"
      : "border-border-card bg-card/95 hover:border-border-hover hover:bg-card";

  return (
    <div className={`${base} ${surface} ${laneAccent} ${className}`}>
      <span
        className={`font-bold text-foreground ${hub ? "text-lg sm:text-xl" : "text-sm"}`}
      >
        {label}
      </span>
      <span className="mt-1 text-xs leading-snug text-muted-foreground">{sub}</span>
    </div>
  );
}

function ColumnLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/60 lg:mb-3">
      {children}
    </p>
  );
}

function DesktopWorkflow() {
  const gridCols =
    "lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(220px,280px)_4.5rem_minmax(0,1fr)]";

  return (
    <div className="hidden lg:block">
      <div className={`mb-5 grid ${gridCols} gap-x-2`}>
        <p className="col-start-1 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
          Discover & assist
        </p>
        <p className="col-start-3 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
          Core platform
        </p>
        <p className="col-start-5 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
          Measure & improve
        </p>
      </div>

      <div className={`grid ${gridCols} grid-rows-2 items-center gap-y-8`}>
        <FlowNode
          lane="input"
          label="ProAssist"
          sub="Ask AI · smart search"
          className="col-start-1 row-start-1 max-w-[200px] justify-self-end"
        />
        <ConnectorHorizontal variant="in" className="col-start-2 row-start-1" />
        <FlowNode
          hub
          label="ProDoc"
          sub="Create & publish docs"
          className="col-start-3 row-span-2 row-start-1 max-w-[260px] justify-self-center py-5"
        />
        <ConnectorHorizontal variant="out" className="col-start-4 row-start-1" />
        <FlowNode
          lane="output"
          label="ProInsights"
          sub="Analytics & health"
          className="col-start-5 row-start-1 max-w-[200px] justify-self-start"
        />

        <FlowNode
          lane="input"
          label="ProFeed"
          sub="Feedback & triage"
          className="col-start-1 row-start-2 max-w-[200px] justify-self-end"
        />
        <ConnectorHorizontal variant="in" className="col-start-2 row-start-2" />
        <ConnectorHorizontal variant="out" className="col-start-4 row-start-2" />
        <FlowNode
          lane="output"
          label="Improve docs"
          sub="Close the loop"
          className="col-start-5 row-start-2 max-w-[200px] justify-self-start"
        />
      </div>

      <div className="mx-auto mt-5 flex max-w-[260px] flex-col items-center" aria-hidden>
        <svg className="h-9 w-2" viewBox="0 0 8 36" aria-hidden>
          <path
            d="M 4 0 L 4 30"
            fill="none"
            stroke="url(#flow-down)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}

function MobileWorkflow() {
  return (
    <div className="flex flex-col items-center gap-0 lg:hidden">
      <ColumnLabel>Discover & assist</ColumnLabel>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <FlowNode lane="input" label="ProAssist" sub="Ask AI · smart search" />
        <FlowNode lane="input" label="ProFeed" sub="Feedback & triage" />
      </div>

      <ConnectorVertical />

      <ColumnLabel>Core platform</ColumnLabel>
      <FlowNode hub label="ProDoc" sub="Create & publish docs" className="max-w-sm" />

      <ConnectorVertical />

      <ColumnLabel>Measure & improve</ColumnLabel>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <FlowNode lane="output" label="ProInsights" sub="Analytics & content health" />
        <FlowNode lane="output" label="Improve docs" sub="Close the loop" />
      </div>

      <ConnectorVertical />
    </div>
  );
}

export function EcosystemDiagram() {
  return (
    <figure className="w-full">
      {FLOW_DEFS}
      <figcaption className="sr-only">
        ProAssist and ProFeed connect to ProDoc; ProDoc feeds ProInsights and closes the
        improvement loop; ProAPI provides a separate developer portal branch.
      </figcaption>

      <div className="mx-auto max-w-5xl">
        <DesktopWorkflow />
        <MobileWorkflow />

        <div className="mt-4 border-t border-border-card pt-5 lg:mt-2 lg:pt-6">
          <ColumnLabel>Developer portal</ColumnLabel>
          <FlowNode
            branch
            label="ProAPI"
            sub="API reference · OpenAPI · SDK examples"
            lane="branch"
            className="mx-auto max-w-xl"
          />
          <p className="mx-auto mt-2 text-center text-[11px] text-muted-foreground/80">
            Separate branch for developer experience and API documentation.
          </p>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-muted-foreground">
          Five applications. One documentation intelligence platform. Built for SaaS teams
          that treat docs as product infrastructure.
        </p>
      </div>
    </figure>
  );
}
