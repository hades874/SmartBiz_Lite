"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockSalesDataForChart } from "@/lib/data"


const chartConfig = {
    total: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  }

export function SalesChart() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>An overview of your sales for the last year.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSalesDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickFormatter={(value) => `৳${value / 1000}k`} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                formatter={(value) => `৳${value.toLocaleString()}`}
                                indicator="dot"
                            />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
        </CardContent>
    </Card>
  )
}
