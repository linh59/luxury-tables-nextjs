
import React from 'react';
import { Button } from '@/components/ui/button';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  onNumberClick: (number: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onNumberClick,
  onClear,
  onBackspace
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '00'];

  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
      {numbers.map((num) => (
        <Button
          key={num}
          variant="outline"
          size="lg"
          onClick={() => onNumberClick(num)}
          className="h-12 text-lg font-medium hover:bg-luxury-gold hover:text-luxury-gold-foreground"
        >
          {num}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="lg"
        onClick={onClear}
        className="h-12 text-sm font-medium col-span-2 hover:bg-destructive hover:text-destructive-foreground"
      >
        Clear
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={onBackspace}
        className="h-12 flex items-center justify-center hover:bg-muted"
      >
        <Delete className="h-5 w-5" />
      </Button>
    </div>
  );
};
