"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatusDatum = { name: string; value: number };
type DayDatum = { day: string; count: number };
type KV = { name: string; value: number };
type StarsDatum = { stars: number; count: number };

const STATUS_COLORS: Record<string, string> = {
  open: "#0ea5e9",
  triaged: "#f59e0b",
  closed: "#14b8a6",
  other: "#94a3b8",
};

const DEFAULT_BAR = "#0d9488";
const TICK = "rgba(71, 85, 105, 0.9)";
const TICK_DIM = "rgba(100, 116, 139, 0.75)";
const GRID = "rgba(100, 116, 139, 0.22)";
const HOVER_CURSOR = "rgba(14, 124, 140, 0.08)";
const HOVER_CURSOR_SOFT = "rgba(14, 124, 140, 0.06)";

function formatShort(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
  } catch {
    return String(n);
  }
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 h-[260px] min-w-0">{children}</div>
    </section>
  );
}

function tooltipStyle() {
  return {
    background: "rgba(15, 23, 42, 0.94)",
    border: "1px solid rgba(71, 85, 105, 0.4)",
    borderRadius: 12,
    color: "#f1f5f9",
    fontSize: 12,
  } as const;
}

export function ProInsightsCharts({
  status,
  daily,
  topPages,
  topTeams,
  topAuthors,
  stars,
}: {
  status: StatusDatum[];
  daily: DayDatum[];
  topPages: KV[];
  topTeams: KV[];
  topAuthors: KV[];
  stars: StarsDatum[];
}) {
  const totalStatus = status.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">
      <Card title="Volume trend" subtitle="Last 14 days">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={daily}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: TICK_DIM }}
            />
            <YAxis
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={34}
              tickFormatter={formatShort}
            />
            <Tooltip
              contentStyle={tooltipStyle()}
              cursor={{ stroke: HOVER_CURSOR_SOFT }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0d9488"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Status mix"
        subtitle={totalStatus ? `${formatShort(totalStatus)} total` : undefined}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle()} />
            <Legend
              verticalAlign="bottom"
              height={28}
              wrapperStyle={{ color: TICK, fontSize: 12 }}
            />
            <Pie
              data={status}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="rgba(0,0,0,0)"
              isAnimationActive={false}
            >
              {status.map((s) => {
                const k = String(s.name || "other").toLowerCase();
                const fill = STATUS_COLORS[k] || STATUS_COLORS.other;
                return <Cell key={s.name} fill={fill} />;
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top pages" subtitle="Where feedback concentrates">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topPages}
            layout="vertical"
            margin={{ top: 8, right: 18, left: 10, bottom: 0 }}
          >
            <CartesianGrid stroke={GRID} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatShort}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle()}
              cursor={{ fill: HOVER_CURSOR }}
            />
            <Bar
              dataKey="value"
              fill={DEFAULT_BAR}
              radius={[8, 8, 8, 8]}
              activeBar={{
                fill: DEFAULT_BAR,
                stroke: "rgba(255,255,255,0.12)",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Stars distribution" subtitle="Ratings histogram">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stars}
            margin={{ top: 8, right: 18, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="stars"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: TICK_DIM }}
            />
            <YAxis
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={34}
              tickFormatter={formatShort}
            />
            <Tooltip
              contentStyle={tooltipStyle()}
              cursor={{ fill: HOVER_CURSOR }}
            />
            <Bar
              dataKey="count"
              fill="#f59e0b"
              radius={[10, 10, 0, 0]}
              activeBar={{
                fill: "#f59e0b",
                stroke: "rgba(255,255,255,0.12)",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top teams" subtitle="Ownership / routing signal">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topTeams}
            margin={{ top: 8, right: 18, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: TICK_DIM }}
            />
            <YAxis
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={34}
              tickFormatter={formatShort}
            />
            <Tooltip
              contentStyle={tooltipStyle()}
              cursor={{ fill: HOVER_CURSOR }}
            />
            <Bar
              dataKey="value"
              fill="#38bdf8"
              radius={[10, 10, 0, 0]}
              activeBar={{
                fill: "#38bdf8",
                stroke: "rgba(255,255,255,0.12)",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top authors" subtitle="Content owners most tagged">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topAuthors}
            margin={{ top: 8, right: 18, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: TICK_DIM }}
            />
            <YAxis
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={34}
              tickFormatter={formatShort}
            />
            <Tooltip
              contentStyle={tooltipStyle()}
              cursor={{ fill: HOVER_CURSOR }}
            />
            <Bar
              dataKey="value"
              fill="#14b8a6"
              radius={[10, 10, 0, 0]}
              activeBar={{
                fill: "#14b8a6",
                stroke: "rgba(255,255,255,0.12)",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
