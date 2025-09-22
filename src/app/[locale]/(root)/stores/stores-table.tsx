'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StoreType } from '@/lib/schema-validations/stores.schema';

function formatDate(d: string) {
    // BE trả ISO → hiện ngắn gọn, tuỳ bạn đổi theo locale
    try { return new Date(d).toLocaleString(); } catch { return d; }
}

export default function StoresTable({ stores, isLoading }: { stores: StoreType[]; isLoading: boolean }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                            Loading…
                        </TableCell>
                    </TableRow>
                )}

                {!isLoading && stores.map((store) => (
                    <TableRow key={store.id}>
                        <TableCell className="font-medium">
                            <div>
                                <div>{formatDate(store.create_date)}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{store.store_name}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{store.status}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{store.phone || '-'}</TableCell>
                    </TableRow>
                ))}

                {!isLoading && stores.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No stores found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
