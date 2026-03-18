/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface StockChartProps {
  data: any;
}

export function StockChart({ data }: StockChartProps) {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="qty"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
