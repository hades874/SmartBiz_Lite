
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInventoryRecommendations, type InventoryRecommendationsOutput } from "@/ai/flows/inventory-recommendations";
import React from "react";
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/sheets";
import type { InventoryItem } from "@/types";
import { Loader2, BellRing, PackageCheck, PlusCircle, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, strings } from "@/context/language-context";

const formSchema = z.object({
    productName: z.string().min(2, "Product name is required"),
    currentStock: z.coerce.number().min(0),
    unit: z.string().min(1, "Unit is required"),
    reorderLevel: z.coerce.number().min(0),
    costPrice: z.coerce.number().min(0),
    sellingPrice: z.coerce.number().min(0),
    category: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof formSchema>;

export default function InventoryPage() {
    const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
    const [isInventoryLoading, setIsInventoryLoading] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<InventoryRecommendationsOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = strings[language];

    const form = useForm<InventoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            currentStock: 0,
            unit: "pcs",
            reorderLevel: 0,
            costPrice: 0,
            sellingPrice: 0,
            category: "",
        },
    });

    const fetchInventory = async () => {
        setIsInventoryLoading(true);
        try {
            const items = await getInventory();
            setInventory(items);
        } catch (err: any) {
            setError(err.message || 'Failed to load inventory.');
        } finally {
            setIsInventoryLoading(false);
        }
    };

    React.useEffect(() => {
        fetchInventory();
    }, []);

    React.useEffect(() => {
        if (editingItem) {
            form.reset({
                ...editingItem,
                category: editingItem.category || '',
            });
        } else {
            form.reset({
                productName: "",
                currentStock: 0,
                unit: "pcs",
                reorderLevel: 0,
                costPrice: 0,
                sellingPrice: 0,
                category: "",
            });
        }
    }, [editingItem, form]);


    const handleGetRecommendations = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await getInventoryRecommendations({ inventoryItems: inventory });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const getProductDetails = (productId: string) => {
        return inventory.find(item => item.id === productId);
    }

    const onSubmit = async (values: InventoryFormValues) => {
        setLoading(true);
        try {
            if (editingItem) {
                const updated = await updateInventoryItem({ ...editingItem, ...values });
                setInventory(prev => prev.map(item => item.id === editingItem.id ? updated : item));
                toast({ title: "Item Updated", description: `${values.productName} has been updated.` });
            } else {
                const added = await addInventoryItem(values);
                setInventory(prev => [added, ...prev]);
                toast({ title: "Item Added", description: `${values.productName} has been added to your inventory.` });
            }
            setIsFormOpen(false);
            setEditingItem(null);
            form.reset();
        } catch (err: any) {
             toast({ variant: 'destructive', title: "Operation Failed", description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (itemId: string) => {
        setLoading(true);
        try {
            await deleteInventoryItem(itemId);
            setInventory(prev => prev.filter(item => item.id !== itemId));
            toast({ title: "Item Deleted", description: "The inventory item has been removed." });
        } catch (err: any) {
            toast({ variant: 'destructive', title: "Delete Failed", description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setEditingItem(null);
            form.reset();
        }
        setIsFormOpen(open);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.inventoryTitle}</CardTitle>
                    <CardDescription>{t.inventoryDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button type="button"><PlusCircle className="mr-2"/> {t.addNewItem}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                                <DialogDescription>
                                    {editingItem ? 'Update the details for this inventory item.' : 'Fill in the details for the new inventory item.'}
                                </DialogDescription>
                            </DialogHeader>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                     <FormField
                                        control={form.control}
                                        name="productName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Premium Wireless Mouse" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                         <FormField
                                            control={form.control}
                                            name="currentStock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Stock</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. pcs, kg" {...field} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="reorderLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reorder Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                    <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="costPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cost Price (৳)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="sellingPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Selling Price (৳)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                     <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                     <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Electronics" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}{editingItem ? 'Save Changes' : 'Add Item'}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleGetRecommendations} disabled={loading || isInventoryLoading} type="button" variant="outline">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t.getAIRecommendations}
                    </Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t.currentInventory}</CardTitle>
                    <CardDescription>{t.currentInventoryDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isInventoryLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                     ) : (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead className="text-right">Reorder Level</TableHead>
                                    <TableHead className="text-right">Cost Price</TableHead>
                                    <TableHead className="text-right">Selling Price</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.productName}</TableCell>
                                        <TableCell className="text-right">{item.currentStock} {item.unit}</TableCell>
                                        <TableCell className="text-right">{item.reorderLevel} {item.unit}</TableCell>
                                        <TableCell className="text-right">৳{item.costPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">৳{item.sellingPrice.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     )}
                </CardContent>
            </Card>
            
            {(loading && !isInventoryLoading) && (
                 <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}

            {error && !isInventoryLoading && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PackageCheck /> {t.aiRecommendations}
                                </CardTitle>
                                <CardDescription>AI suggestions to optimize your stock levels.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                {result.recommendations.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Reorder Quantity</TableHead>
                                                <TableHead>Reason</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result.recommendations.map((rec) => {
                                                const product = getProductDetails(rec.productId || "");
                                                return (
                                                    <TableRow key={rec.productId}>
                                                        <TableCell className="font-medium">{product?.productName || rec.productId}</TableCell>
                                                        <TableCell>{rec.reorderQuantity} {product?.unit}</TableCell>
                                                        <TableCell>{rec.reason}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground">No reorder recommendations at this time. Stock levels are optimal.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                     <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BellRing /> {t.lowStock} Alerts
                                </CardTitle>
                                <CardDescription>Items that need immediate attention.</CardDescription>
                            </Header>
                            <CardContent>
                               {result.alerts.length > 0 ? (
                                    <ul className="space-y-2 list-disc list-inside text-sm text-destructive font-medium">
                                        {result.alerts.map((alert, index) => (
                                            <li key={index}>{alert}</li>
                                        ))}
                                    </ul>
                               ) : (
                                    <p className="text-muted-foreground">No critical low stock alerts.</p>
                               )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
