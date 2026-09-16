"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon } from "lucide-react";

interface AnalyticsChartsProps {
  volumeOverTime: { date: string; count: number; positive: number; negative: number; neutral: number }[];
  sentimentBreakdown: { name: string; value: number; fill: string }[];
  topThemes: { theme: string; count: number }[];
}

export default function AnalyticsCharts({
  volumeOverTime,
  sentimentBreakdown,
  topThemes,
}: AnalyticsChartsProps) {
  const hasVolumeData = volumeOverTime.some((d) => d.count > 0);
  const hasSentimentData = sentimentBreakdown.some((s) => s.value > 0);
  const hasThemeData = topThemes.length > 0;

  const lightSentimentData = sentimentBreakdown.map((s) => ({
    ...s,
    fill: s.name === "Positive" ? "#10B981" : s.name === "Negative" ? "#EF4444" : "#64748B",
  }));

  return (
    <div className="space-y-8">
      {/* Chart 1: Feedback Volume Over Time */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LineIcon className="w-5 h-5 text-indigo-600" />
              <span>Feedback Volume Over Time (Last 14 Days)</span>
            </h3>
            <p className="text-xs text-slate-500">Daily incoming customer feedback volume trajectory</p>
          </div>
        </div>

        {!hasVolumeData ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl space-y-2">
            <LineIcon className="w-8 h-8 text-slate-300" />
            <p className="text-xs">No feedback records found in the selected date range.</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCountGlass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(226, 232, 240, 0.9)",
                    borderRadius: "12px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCountGlass)"
                  name="Feedback Volume"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Grid: Chart 2 & Chart 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 2: Sentiment Distribution Donut */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              <span>Sentiment Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Proportion of Positive, Neutral, and Negative customer sentiment</p>
          </div>

          {!hasSentimentData ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl space-y-2">
              <PieIcon className="w-8 h-8 text-slate-300" />
              <p className="text-xs">No sentiment data available yet.</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lightSentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {lightSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      borderColor: "rgba(226, 232, 240, 0.9)",
                      borderRadius: "12px",
                      color: "#0f172a",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-slate-700 text-xs font-semibold">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 3: Top Channels & Themes Bar Chart */}
        <div className="glass-card p-6 space-y-4">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Feedback by Ingestion Channel</span>
            </h3>
            <p className="text-xs text-slate-500">Volume breakdown across support, app store, NPS, and sales feeds</p>
          </div>

          {!hasThemeData ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl space-y-2">
              <BarChart3 className="w-8 h-8 text-slate-300" />
              <p className="text-xs">No theme channels found.</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topThemes} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="theme" type="category" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      borderColor: "rgba(226, 232, 240, 0.9)",
                      borderRadius: "12px",
                      color: "#0f172a",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} name="Feedback Items" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
