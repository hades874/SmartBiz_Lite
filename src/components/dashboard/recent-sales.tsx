
'use client';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { mockSales } from "@/lib/data"
import { useLanguage, strings } from "@/context/language-context";

export function RecentSales() {
    const { language } = useLanguage();
    const t = strings[language];
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.recentSales}</CardTitle>
                <CardDescription>{t.recentSalesDescription(mockSales.length)}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {mockSales.map((sale) => (
                        <div className="flex items-center" key={sale.id}>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={sale.customerAvatarUrl} alt="Avatar" />
                                <AvatarFallback>{sale.customerName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                                <p className="text-sm text-muted-foreground">{sale.productName}</p>
                            </div>
                            <div className="ml-auto font-medium">+৳{sale.totalAmount.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
