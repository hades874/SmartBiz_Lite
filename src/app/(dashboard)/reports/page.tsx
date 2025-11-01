import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Automated Reports</CardTitle>
                <CardDescription>Generate and download weekly or monthly business performance reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Automated reports feature will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
