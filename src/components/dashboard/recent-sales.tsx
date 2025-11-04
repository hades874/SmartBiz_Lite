
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
import { useLanguage, strings } from "@/context/language-context";
import { SalesRecord } from "@/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { formatCurrency } from "@/lib/utils";

interface RecentSalesProps {
    sales: SalesRecord[];
}

export function RecentSales({ sales }: RecentSalesProps) {
    const { language } = useLanguage();
    const t = strings[language];

    const getAvatar = (name?: string) => {
        if (!name) return "";
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const avatarId = (hash % 5) + 1;
        return PlaceHolderImages.find(p => p.id === `avatar-${avatarId}`)?.imageUrl || "";
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.recentSales}</CardTitle>
                <CardDescription>{t.recentSalesDescription(sales.length)}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {sales.map((sale) => (
                        <div className="flex items-center" key={sale.id}>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={getAvatar(sale.customerName)} alt="Avatar" />
                                <AvatarFallback>{sale.customerName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                                <p className="text-sm text-muted-foreground">{sale.productName}</p>
                            </div>
                            <div className="ml-auto font-medium">+{formatCurrency(sale.totalAmount, language)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
