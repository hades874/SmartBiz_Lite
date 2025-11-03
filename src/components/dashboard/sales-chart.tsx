
"use client"
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useLanguage, strings } from '@/context/language-context';
import { SalesRecord } from '@/types';
import { format, subMonths, getMonth, getYear, parseISO } from 'date-fns';

interface SalesChartProps {
    salesData: SalesRecord[];
}

const chartConfig = {
    total: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  }

export function SalesChart({ salesData }: SalesChartProps) {
  const { language } = useLanguage();
  const t = strings[language];
  
  const getMonthName = (monthIndex: number) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[monthIndex];
  }

  const monthlySalesData = React.useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};

    // Initialize last 12 months with 0 sales
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(currentDate, i);
        const month = getMonth(d);
        const year = getYear(d);
        const key = `${year}-${month}`;
        monthlyTotals[key] = 0;
    }

    salesData.forEach(sale => {
        try {
            const saleDate = parseISO(sale.date);
            const month = getMonth(saleDate);
            const year = getYear(saleDate);
            const key = `${year}-${month}`;
            if (key in monthlyTotals) {
                monthlyTotals[key] += sale.totalAmount;
            }
        } catch (e) {
            console.error(`Invalid date format for sale ID ${sale.id}: ${sale.date}`);
        }
    });

    return Object.keys(monthlyTotals).map(key => {
        const [year, monthIndex] = key.split('-').map(Number);
        return {
            month: getMonthName(monthIndex),
            year: year,
            total: monthlyTotals[key]
        }
    });
  }, [salesData]);
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>{t.salesOverview}</CardTitle>
            <CardDescription>{t.salesOverviewDescription}</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
