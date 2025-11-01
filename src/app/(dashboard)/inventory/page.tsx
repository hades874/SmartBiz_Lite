import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Manage your stock levels and get reorder recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Inventory management feature will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
