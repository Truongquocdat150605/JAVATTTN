"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Revenue chart data
const revenueData = [
  { month: "T1", revenue: 45000000, expenses: 12000000 },
  { month: "T2", revenue: 52000000, expenses: 15000000 },
  { month: "T3", revenue: 48000000, expenses: 11000000 },
  { month: "T4", revenue: 61000000, expenses: 18000000 },
  { month: "T5", revenue: 55000000, expenses: 14000000 },
  { month: "T6", revenue: 67000000, expenses: 16000000 },
  { month: "T7", revenue: 72000000, expenses: 19000000 },
  { month: "T8", revenue: 69000000, expenses: 17000000 },
  { month: "T9", revenue: 78000000, expenses: 21000000 },
  { month: "T10", revenue: 82000000, expenses: 23000000 },
  { month: "T11", revenue: 76000000, expenses: 20000000 },
  { month: "T12", revenue: 89000000, expenses: 25000000 },
];

// Occupancy data
const occupancyData = [
  { month: "T1", rate: 75 },
  { month: "T2", rate: 78 },
  { month: "T3", rate: 82 },
  { month: "T4", rate: 85 },
  { month: "T5", rate: 88 },
  { month: "T6", rate: 92 },
  { month: "T7", rate: 95 },
  { month: "T8", rate: 93 },
  { month: "T9", rate: 90 },
  { month: "T10", rate: 88 },
  { month: "T11", rate: 85 },
  { month: "T12", rate: 87 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value) + "đ";
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs text-muted-foreground">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.dataKey === "revenue" && "Doanh thu: "}
            {item.dataKey === "expenses" && "Chi phí: "}
            {item.dataKey === "rate" && "Tỷ lệ: "}
            <span className="font-medium text-foreground">
              {item.dataKey === "rate"
                ? `${item.value}%`
                : formatVND(item.value)}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={revenueData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(0.28 0.01 260)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
          tickFormatter={(value) => formatVND(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="oklch(0.65 0.18 250)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="oklch(0.75 0.18 85)"
          strokeWidth={2}
          fill="url(#expensesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={occupancyData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(0.28 0.01 260)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
          domain={[60, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="oklch(0.65 0.2 160)"
          strokeWidth={2}
          dot={{ fill: "oklch(0.65 0.2 160)", strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, stroke: "oklch(0.65 0.2 160)", strokeWidth: 2, fill: "oklch(0.17 0.01 260)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={revenueData.slice(-6)}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(0.28 0.01 260)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
          tickFormatter={(value) => formatVND(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="revenue"
          fill="oklch(0.65 0.18 250)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
