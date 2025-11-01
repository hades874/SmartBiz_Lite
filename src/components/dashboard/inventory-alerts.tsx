import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockInventory } from "@/lib/data"
import { cn } from "@/lib/utils"

export function InventoryAlerts() {
    const alerts = mockInventory.filter(item => item.status !== 'ok');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Items that need your attention.</CardDescription>
            </CardHeader>
            <CardContent>
                {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All inventory levels are looking good!</p>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Stock: {item.currentStock} {item.unit} (Reorder: {item.reorderLevel})
                                    </p>
                                </div>
                                <Badge variant={item.status === 'low' ? 'destructive' : 'secondary'} className={cn(
                                    item.status === 'overstock' && 'bg-amber-500 text-white'
                                )}>
                                    {item.status === 'low' ? 'Low Stock' : 'Overstock'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
