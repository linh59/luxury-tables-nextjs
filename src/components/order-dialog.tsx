
'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, QrCode, ArrowLeft, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Table } from '../../types';
import { NumericKeypad } from '@/components/numeric-keypad';
import { QRCodeDisplay } from '@/components/qr-code-display';

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table;
  onUpdateTable: (table: Table) => void;
  onCreateTransaction: (transaction: any) => void;
}

export const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onOpenChange,
  table,
  onUpdateTable,
  onCreateTransaction
}) => {
  const t = useTranslations();
  const [amount, setAmount] = useState(table.amount?.toString() || '');
  const [showQR, setShowQR] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({ open: false, title: '', description: '', action: () => {} });

  useEffect(() => {
    if (table.status === 'processing') {
      setShowQR(true);
    } else {
      setShowQR(false);
    }
  }, [table.status]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleNumberClick = (number: string) => {
    if (number === '.' && amount.includes('.')) return;
    if (number === '00' && amount === '') return;
    
    const newAmount = amount + number;
    if (parseFloat(newAmount) <= 9999.99) {
      setAmount(newAmount);
    }
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleStartOrder = () => {
    if (table.status === 'empty') {
      onUpdateTable({
        ...table,
        status: 'eating'
      });
    }
  };

  const handleGenerateQR = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    onUpdateTable({
      ...table,
      status: 'processing',
      amount: parseFloat(amount)
    });
    
    setShowQR(true);
  };

  const handlePaymentConfirmed = () => {
    onCreateTransaction({
      id: Date.now().toString(),
      storeId: table.storeId,
      storeName: table.storeId === 'store-1' ? 'Downtown Restaurant' : 'Uptown Bistro',
      tableNumber: table.number,
      amount: parseFloat(amount),
      timestamp: new Date(),
      employeeId: 'current-user-id'
    });

    onUpdateTable({
      ...table,
      status: 'paid',
      amount: parseFloat(amount)
    });

    setShowQR(false);
  };

  const handleCancelTable = () => {
    setConfirmDialog({
      open: true,
      title: t('order.cancelTable'),
      description: t('order.cancelTableConfirm'),
      action: () => {
        onUpdateTable({
          ...table,
          status: 'empty',
          amount: undefined
        });
        setAmount('');
        setShowQR(false);
        onOpenChange(false);
      }
    });
  };

  const handleRevertToEating = () => {
    setConfirmDialog({
      open: true,
      title: t('order.revertToEating'),
      description: t('order.revertToEatingConfirm'),
      action: () => {
        onUpdateTable({
          ...table,
          status: 'eating'
        });
        setShowQR(false);
      }
    });
  };

  const handleCloseDialog = () => {
    if (table.status === 'paid') {
      onUpdateTable({
        ...table,
        status: 'empty',
        amount: undefined
      });
      setAmount('');
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-luxury text-center">
              {t('order.title')} {table.number}
            </DialogTitle>
            <div className="text-center text-sm text-muted-foreground">
              {t('tables.status')}: {t(`tables.${table.status}`)}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {table.status === 'empty' && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">{t('order.tableAvailable')}</p>
                <Button onClick={handleStartOrder} className="w-full btn-luxury">
                  {t('order.startOrder')}
                </Button>
              </div>
            )}

            {(table.status === 'eating' || table.status === 'processing') && (
              <Tabs defaultValue="calculator" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calculator" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    {t('order.amount')}
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="gap-2" disabled={!showQR}>
                    <QrCode className="h-4 w-4" />
                    {t('order.qrCode')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calculator" className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('order.orderAmount')} ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="text-center text-xl font-semibold"
                      placeholder="0.00"
                    />
                  </div>

                  <NumericKeypad
                    onNumberClick={handleNumberClick}
                    onClear={handleClear}
                    onBackspace={handleBackspace}
                  />

                  <div className="space-y-2">
                    {table.status === 'eating' && (
                      <>
                        <Button 
                          onClick={handleGenerateQR}
                          disabled={!amount || parseFloat(amount) <= 0}
                          className="w-full btn-luxury"
                        >
                          {t('order.generateQR')}
                        </Button>
                        
                        <Button
                          onClick={handleCancelTable}
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t('order.cancelTable')}
                        </Button>
                      </>
                    )}

                    {table.status === 'processing' && (
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          onClick={handleRevertToEating}
                          variant="outline"
                          className="w-full"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          {t('order.revertToEating')}
                        </Button>
                        
                        <Button
                          onClick={handleCancelTable}
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t('order.cancelTable')}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="space-y-4">
                  {showQR && amount && (
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <QRCodeDisplay
                          amount={parseFloat(amount)}
                          tableNumber={table.number}
                        />
                        <div className="text-center space-y-2">
                          <p className="font-medium">{t('order.amount')}: ${parseFloat(amount).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('order.scanToPay')} {table.number}
                          </p>
                        </div>
                        
                        {table.status === 'processing' && (
                          <Button
                            onClick={handlePaymentConfirmed}
                            className="w-full btn-luxury"
                          >
                            {t('order.confirmPayment')}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {table.status === 'paid' && (
              <div className="text-center space-y-4">
                <div className="text-luxury-gold text-2xl font-semibold">
                  {t('order.paymentComplete')}!
                </div>
                <p className="text-muted-foreground">
                  {t('order.amount')}: ${table.amount?.toFixed(2)}
                </p>
                <Button onClick={handleCloseDialog} className="w-full btn-luxury">
                  {t('order.closeReset')}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.action}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
