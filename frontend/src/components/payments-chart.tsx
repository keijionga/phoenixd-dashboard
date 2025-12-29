"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
  isSameDay,
  isSameWeek,
  isSameMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import type { IncomingPayment, OutgoingPayment } from "@/lib/api";

type Period = "daily" | "weekly" | "monthly";

interface PaymentsChartProps {
  incomingPayments: IncomingPayment[];
  outgoingPayments: OutgoingPayment[];
}

interface ChartData {
  date: string;
  dateLabel: string;
  received: number;
  sent: number;
}

const periodConfig = {
  daily: {
    label: "Daily",
    shortLabel: "D",
    days: 14,
    description: "Last 14 days",
  },
  weekly: {
    label: "Weekly",
    shortLabel: "W",
    weeks: 8,
    description: "Last 8 weeks",
  },
  monthly: {
    label: "Monthly",
    shortLabel: "M",
    months: 6,
    description: "Last 6 months",
  },
};

// Custom tooltip component with glassmorphism style
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 border border-black/10 dark:border-white/10 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.dataKey}:
            </span>
            <span className="font-mono font-medium">
              {entry.value.toLocaleString()} sats
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PaymentsChart({
  incomingPayments,
  outgoingPayments,
}: PaymentsChartProps) {
  const [period, setPeriod] = useState<Period>("daily");
  const config = periodConfig[period];

  const chartData = useMemo(() => {
    const now = new Date();
    const data: ChartData[] = [];

    if (period === "daily") {
      const days = 14;
      const startDate = subDays(now, days - 1);
      const intervals = eachDayOfInterval({ start: startDate, end: now });

      intervals.forEach((date) => {
        const dayStart = startOfDay(date);
        const dateStr = format(dayStart, "yyyy-MM-dd");
        const dateLabel = format(dayStart, "MMM d");

        const received = incomingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameDay(new Date(p.completedAt || p.createdAt), dayStart)
          )
          .reduce((sum, p) => sum + p.receivedSat, 0);

        const sent = outgoingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameDay(new Date(p.completedAt || p.createdAt), dayStart)
          )
          .reduce((sum, p) => sum + p.sent, 0);

        data.push({ date: dateStr, dateLabel, received, sent });
      });
    } else if (period === "weekly") {
      const weeks = 8;
      const startDate = subWeeks(now, weeks - 1);
      const intervals = eachWeekOfInterval(
        { start: startDate, end: now },
        { weekStartsOn: 1 }
      );

      intervals.forEach((date) => {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const dateStr = format(weekStart, "yyyy-MM-dd");
        const dateLabel = format(weekStart, "MMM d");

        const received = incomingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameWeek(new Date(p.completedAt || p.createdAt), weekStart, {
                weekStartsOn: 1,
              })
          )
          .reduce((sum, p) => sum + p.receivedSat, 0);

        const sent = outgoingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameWeek(new Date(p.completedAt || p.createdAt), weekStart, {
                weekStartsOn: 1,
              })
          )
          .reduce((sum, p) => sum + p.sent, 0);

        data.push({ date: dateStr, dateLabel, received, sent });
      });
    } else if (period === "monthly") {
      const months = 6;
      const startDate = subMonths(now, months - 1);
      const intervals = eachMonthOfInterval({ start: startDate, end: now });

      intervals.forEach((date) => {
        const monthStart = startOfMonth(date);
        const dateStr = format(monthStart, "yyyy-MM");
        const dateLabel = format(monthStart, "MMM");

        const received = incomingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameMonth(new Date(p.completedAt || p.createdAt), monthStart)
          )
          .reduce((sum, p) => sum + p.receivedSat, 0);

        const sent = outgoingPayments
          .filter(
            (p) =>
              p.isPaid &&
              isSameMonth(new Date(p.completedAt || p.createdAt), monthStart)
          )
          .reduce((sum, p) => sum + p.sent, 0);

        data.push({ date: dateStr, dateLabel, received, sent });
      });
    }

    return data;
  }, [incomingPayments, outgoingPayments, period]);

  const hasData = chartData.some((d) => d.received > 0 || d.sent > 0);

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            Payment Activity
          </h3>
          <PeriodSelector period={period} onChange={setPeriod} />
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <div className="h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-3">
            <TrendingUp className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No payment activity in the {config.description.toLowerCase()}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Start receiving payments to see your activity chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          Payment Activity
          <span className="text-xs text-muted-foreground font-normal ml-2 hidden sm:inline">
            {config.description}
          </span>
        </h3>
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
              }
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground capitalize">
                  {value}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="received"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReceived)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="sent"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSent)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Period selector component
function PeriodSelector({
  period,
  onChange,
}: {
  period: Period;
  onChange: (period: Period) => void;
}) {
  const periods: Period[] = ["daily", "weekly", "monthly"];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.05]">
      {periods.map((p) => {
        const isActive = period === p;
        const config = periodConfig[p];

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
            title={config.description}
          >
            <Calendar className="h-3 w-3 sm:hidden" />
            <span className="hidden sm:inline">{config.label}</span>
            <span className="sm:hidden">{config.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
