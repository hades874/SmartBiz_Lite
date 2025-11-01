import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CashflowPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cash Flow Analytics</CardTitle>
                <CardDescription>Track your income, expenses, and cash flow projections.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Cash flow analytics feature will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
