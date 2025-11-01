import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CustomersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Segment your customers and get retention insights.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Customer insights feature will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
