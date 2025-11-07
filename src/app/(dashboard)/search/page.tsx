
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSales, getInventory, getCustomers } from '@/lib/sheets';
import { SalesRecord, InventoryItem, Customer } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Package, Users, DollarSign, Search } from 'lucide-react';
import { useLanguage, strings } from '@/context/language-context';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type SearchResults = {
    sales: SalesRecord[];
    inventory: InventoryItem[];
    customers: Customer[];
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { language } = useLanguage();
    const t = strings[language];

    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            setResults({ sales: [], inventory: [], customers: [] });
            return;
        }

        const fetchAndFilterData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [salesData, inventoryData, customerData] = await Promise.all([
                    getSales(),
                    getInventory(),
                    getCustomers(),
                ]);

                const lowerCaseQuery = query.toLowerCase();

                const filteredSales = salesData.filter(sale =>
                    sale.productName.toLowerCase().includes(lowerCaseQuery) ||
                    sale.customerName?.toLowerCase().includes(lowerCaseQuery) ||
                    sale.id.toLowerCase().includes(lowerCaseQuery)
                );

                const filteredInventory = inventoryData.filter(item =>
                    item.productName.toLowerCase().includes(lowerCaseQuery) ||
                    item.id.toLowerCase().includes(lowerCaseQuery) ||
                    item.category?.toLowerCase().includes(lowerCaseQuery)
                );

                const filteredCustomers = customerData.filter(customer =>
                    customer.name.toLowerCase().includes(lowerCaseQuery) ||
                    customer.email?.toLowerCase().includes(lowerCaseQuery) ||
                    customer.id.toLowerCase().includes(lowerCaseQuery)
                );

                setResults({
                    sales: filteredSales,
                    inventory: filteredInventory,
                    customers: filteredCustomers,
                });

            } catch (err: any) {
                setError(err.message || 'Failed to fetch search results.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterData();
    }, [query]);

    const totalResults = useMemo(() => {
        if (!results) return 0;
        return results.sales.length + results.inventory.length + results.customers.length;
    }, [results]);
    
    const getSegmentVariant = (segment?: string) => {
        switch (segment) {
            case 'high-value': return 'default';
            case 'regular': return 'secondary';
            case 'at-risk': return 'destructive';
            case 'lost': return 'outline';
            default: return 'secondary';
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-160px)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Searching for "{query}"...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-destructive-foreground bg-destructive p-4 rounded-md">{error}</div>
    }

    if (!results || totalResults === 0) {
        return (
            <div className="text-center py-16">
                 <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No results found for "{query}"</h2>
                <p className="mt-2 text-muted-foreground">Try searching for something else.</p>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                    <CardDescription>Found {totalResults} results for "{query}"</CardDescription>
                </CardHeader>
            </Card>

            {results.customers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Customers ({results.customers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Segment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.customers.map(customer => (
                                    <TableRow key={customer.id}>
                                        <TableCell><Link href="/customers" className="text-primary hover:underline">{customer.name}</Link></TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{formatCurrency(customer.totalSpent, language)}</TableCell>
                                        <TableCell>
                                             {customer.segment ? (
                                                <Badge variant={getSegmentVariant(customer.segment)} className={cn(customer.segment === 'high-value' && 'bg-green-600 text-white', 'capitalize')}>
                                                    {customer.segment.replace('-', ' ')}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">N/A</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {results.inventory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package /> Inventory ({results.inventory.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead className="text-right">Selling Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.inventory.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell><Link href="/inventory" className="text-primary hover:underline">{item.productName}</Link></TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">{formatNumber(item.currentStock, language)} {item.unit}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.sellingPrice, language)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            
            {results.sales.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Sales ({results.sales.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.sales.map(sale => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{sale.productName}</TableCell>
                                        <TableCell><Link href="/customers" className="text-primary hover:underline">{sale.customerName}</Link></TableCell>
                                        <TableCell className="text-right">{formatCurrency(sale.totalAmount, language)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

