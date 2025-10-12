"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface SeriesPoint {
  time: string;
  value: number;
}

interface MarketChartsProps {
  title?: string;
  data: Array<{ name: string; series: SeriesPoint[]; color?: string }>;
}

export function MarketCharts({ title = "Market Performance", data }: MarketChartsProps) {
  // Normalize to a combined dataset by index for simple multi-series rendering
  const maxLen = Math.max(...data.map((d) => d.series.length));
  const combined = Array.from({ length: maxLen }).map((_, i) => {
    const point: any = { time: data[0]?.series[i]?.time || `${i}` };
    data.forEach((d) => {
      point[d.name] = d.series[i]?.value ?? null;
    });
    return point;
  });

  const colors = data.map((d, i) => d.color || ["#0B1F3B", "#3B82F6", "#10B981", "#9333EA"][i % 4]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-[#0B1F3B] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip />
          {data.map((d, i) => (
            <Line key={d.name} type="monotone" dataKey={d.name} stroke={colors[i]} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


