
'use client';
import { DollarSign, Package, Users, CreditCard } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts'
import { useLanguage, strings } from '@/context/language-context';

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = strings[language];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title={t.totalRevenue}
                value="৳45,231.89"
                description={t.totalRevenueDescription}
                Icon={DollarSign}
            />
            <StatCard 
                title={t.activeCustomers}
                value="+2350"
                description={t.activeCustomersDescription}
                Icon={Users}
            />
            <StatCard 
                title={t.stockValue}
                value="৳1,234,567"
                description={t.stockValueDescription}
                Icon={Package}
            />
            <StatCard 
                title={t.pendingPayments}
                value="৳57,300"
                description={t.pendingPaymentsDescription}
                Icon={CreditCard}
            />
        </div>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
             <div className="xl:col-span-2">
                <SalesChart />
             </div>
             <div className="space-y-4 md:space-y-6">
                <RecentSales />
                <InventoryAlerts />
             </div>
        </div>
    </div>
  )
}
