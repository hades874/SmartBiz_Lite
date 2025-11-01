import { DollarSign, Package, Users, CreditCard } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Revenue"
                value="৳45,231.89"
                description="+20.1% from last month"
                Icon={DollarSign}
            />
            <StatCard 
                title="Active Customers"
                value="+2350"
                description="+180.1% from last month"
                Icon={Users}
            />
            <StatCard 
                title="Stock Value"
                value="৳1,234,567"
                description="Total value of current inventory"
                Icon={Package}
            />
            <StatCard 
                title="Pending Payments"
                value="৳57,300"
                description="From 12 invoices"
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
