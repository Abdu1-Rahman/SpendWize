import { redirect } from "next/navigation";
import ExpenseByDateChartWrapper from "@/components/dashboard/Charts/ExpenseByDateChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { PieChart } from "@/components/dashboard/Charts/PieChart";

export default async function DashboardPage() {
  const supabase = createClient(); //
  return (
    <div className="flex gap-5 w-full">
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl h-30 p-8 bg-card border border-border">
          <h3 className="font-semibold text-card-foreground">Total Budget</h3>
        </div>

        <Card className="flex w-200">
          <CardHeader>
            <CardTitle>Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseByDateChartWrapper />
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <PieChart />
      </div>
    </div>
  );
}
