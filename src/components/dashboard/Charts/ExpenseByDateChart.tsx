"use client";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type DataPoint = {
  month: string;
  expense: number;
};

const data: DataPoint[] = [
  { month: "May", expense: 100000 },
  { month: "Jun", expense: 120000 },
  { month: "Jul", expense: 140000 },
  { month: "Aug", expense: 110000 },
  { month: "Sept", expense: 160000 },
  { month: "Oct", expense: 150000 },
  { month: "Nov", expense: 180000 },
  { month: "Dec", expense: 190000 },
  { month: "Jan", expense: 210000 },
];

const CustomLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(expense) => `₹${(expense / 1000).toFixed(0)}k`}
        />
        <CartesianGrid strokeDasharray="3 3" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1e1e2f",
            border: "1px solid #8884d8",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff", fontWeight: "bold" }}
          itemStyle={{ color: "#8884d8" }}
          formatter={(value: number) => [
            `₹${value.toLocaleString()}`,
            "Expense",
          ]}
          labelFormatter={(label: string) => `Month: ${label}`}
        />  

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#8884d8"
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
