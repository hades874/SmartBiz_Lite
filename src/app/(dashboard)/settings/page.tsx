import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account and application preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Settings page will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
