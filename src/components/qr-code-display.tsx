
import React from 'react';

interface QRCodeDisplayProps {
  amount: number;
  tableNumber: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  amount,
  tableNumber
}) => {
  // Create a simple QR code-like display (in a real app, you'd use a QR code library)
  const qrData = `TABLE:${tableNumber}|AMOUNT:${amount.toFixed(2)}|TIME:${Date.now()}`;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-48 h-48 border-2 border-foreground bg-background p-4 flex items-center justify-center">
        <div className="grid grid-cols-8 grid-rows-8 gap-1 w-full h-full">
          {/* Generate a pattern based on the data */}
          {Array.from({ length: 64 }, (_, i) => {
            const char = qrData.charCodeAt(i % qrData.length);
            const isBlack = (char + i) % 3 === 0;
            return (
              <div
                key={i}
                className={`${isBlack ? 'bg-foreground' : 'bg-background'} rounded-sm`}
              />
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        QR Code for Payment Processing
      </p>
    </div>
  );
};
