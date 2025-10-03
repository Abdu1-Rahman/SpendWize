"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart as RePieChart } from "recharts"
import { createClient } from "@/utils/supabase/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Category-wise expenses"

type PieRow = {
  category_id: string | null
  category_name: string | null
  sum_amount: number | null
}

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

export function PieChart() {
  const supabase = createClient()
  const [data, setData] = useState<{ browser: string; visitors: number; fill: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      // Fetch expense transactions and aggregate on the client
      const { data, error } = await supabase
        .from("transactions")
        .select("category_id, category_name, amount, type")
        .eq("type", "expense")

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Aggregate by category_id/category_name
      const totals = new Map<string, { name: string; total: number }>()
      for (const row of (data as any[]) || []) {
        const key = row.category_id ?? row.category_name ?? "uncategorized"
        const name = row.category_name ?? "Uncategorized"
        const prev = totals.get(key)?.total ?? 0
        totals.set(key, { name, total: prev + Number(row.amount || 0) })
      }

      const mapped = Array.from(totals.values()).map((entry, idx) => ({
        browser: entry.name,
        visitors: entry.total,
        fill: colors[idx % colors.length],
      }))

      setData(mapped)
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const chartConfig = {
    visitors: {
      label: "Amount",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Sum of expenses grouped by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RePieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="visitors" nameKey="browser" />
            </RePieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Category totals <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing your expense totals per category
        </div>
      </CardFooter>
    </Card>
  )
}
