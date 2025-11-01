import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ForecastPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Forecasting</CardTitle>
                <CardDescription>Predict future sales and identify trends.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Sales forecasting feature will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
