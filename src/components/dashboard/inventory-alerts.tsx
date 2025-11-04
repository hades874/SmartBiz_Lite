
'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatNumber } from "@/lib/utils"
import { useLanguage, strings } from "@/context/language-context";
import { InventoryItem } from "@/types";

interface InventoryAlertsProps {
    inventory: InventoryItem[];
}

export function InventoryAlerts({ inventory }: InventoryAlertsProps) {
    const { language } = useLanguage();
    const t = strings[language];
    const alerts = inventory.filter(item => item.status !== 'ok');

    const getStatusText = (status: 'low' | 'overstock') => {
        if (status === 'low') return t.lowStock;
        if (status === 'overstock') return t.overstock;
        return status;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.inventoryAlerts}</CardTitle>
                <CardDescription>{t.inventoryAlertsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t.inventoryAlertsEmpty}</p>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Stock: {formatNumber(item.currentStock, language)} {item.unit} (Reorder: {formatNumber(item.reorderLevel, language)})
                                    </p>
                                </div>
                                <Badge variant={item.status === 'low' ? 'destructive' : 'secondary'} className={cn(
                                    item.status === 'overstock' && 'bg-amber-500 text-white'
                                )}>
                                    {getStatusText(item.status as 'low' | 'overstock')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
