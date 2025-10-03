"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Range = "week" | "month" | "year";
type Txn = { amount: number; transaction_date: string; type: "income" | "expense" };
type DataPoint = { label: string; expense: number };

function getDateRange(range: Range): { from: Date; to: Date; bucket: "day" | "month" } {
  const now = new Date();
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "week") {
    const from = new Date(to);
    from.setDate(to.getDate() - 6);
    return { from, to, bucket: "day" };
  }
  if (range === "month") {
    const from = new Date(to.getFullYear(), to.getMonth(), 1);
    return { from, to, bucket: "day" };
  }
  const from = new Date(to.getFullYear(), 0, 1);
  return { from, to, bucket: "month" };
}

function keyFor(date: Date, bucket: "day" | "month"): string {
  if (bucket === "day") return date.toISOString().slice(0, 10);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function labelFor(key: string, bucket: "day" | "month"): string {
  if (bucket === "day") return new Date(key).toLocaleDateString();
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString(undefined, { month: "short", year: "numeric" });
}

const CustomLineChart = () => {
  const supabase = createClient();
  const [range, setRange] = useState<Range>("month");
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { from, to, bucket } = useMemo(() => getDateRange(range), [range]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("transactions")
        .select("amount, transaction_date, type")
        .eq("type", "expense")
        .gte("transaction_date", from.toISOString().slice(0, 10))
        .lte("transaction_date", to.toISOString().slice(0, 10));

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const map = new Map<string, number>();
      if (bucket === "day") {
        const cursor = new Date(from);
        while (cursor <= to) {
          map.set(keyFor(cursor, bucket), 0);
          cursor.setDate(cursor.getDate() + 1);
        }
      } else {
        for (let m = 0; m < 12; m++) {
          const dt = new Date(to.getFullYear(), m, 1);
          if (dt < from || dt > to) continue;
          map.set(keyFor(dt, bucket), 0);
        }
      }

      for (const row of (data as Txn[]) || []) {
        const d = new Date(row.transaction_date);
        const k = keyFor(d, bucket);
        map.set(k, (map.get(k) || 0) + Number(row.amount || 0));
      }

      const result: DataPoint[] = Array.from(map.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([k, total]) => ({ label: labelFor(k, bucket), expense: total }));

      setPoints(result);
      setLoading(false);
    };

    fetchData();
  }, [supabase, from, to, bucket]);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Range</span>
        <Select value={range} onValueChange={(v) => setRange(v as Range)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={points} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(expense) => `₹${(Number(expense) / 1000).toFixed(0)}k`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e2f", border: "1px solid #10b981", borderRadius: 8 }}
              labelStyle={{ color: "#fff", fontWeight: "bold" }}
              itemStyle={{ color: "#10b981" }}
              formatter={(value: number) => [`₹${Number(value).toLocaleString()}`, "Expense"]}
            />
            <Area type="monotone" dataKey="expense" stroke="#10b981" fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomLineChart;
