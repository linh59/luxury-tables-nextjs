'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date';
import { OrderDataType } from '@/constants/order-type';
import { useTranslations } from 'next-intl';



export default function OrdersTable({ orders, isLoading }: { orders: OrderDataType[]; isLoading: boolean }) {
    const t = useTranslations();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                   
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

                {!isLoading && orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">
                            <div>
                                <div>{formatDate(order.created_at)}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{order.amount}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline"> {t(`order.${order.status}`)}</Badge>
                        </TableCell>
                        
                    </TableRow>
                ))}

                {!isLoading && orders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No orders found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
