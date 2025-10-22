import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  disabled = false,
}: NumberStepperProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        data-testid="button-decrease-responses"
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>

      <div className="flex-1 flex items-center justify-center">
        <span className="text-3xl font-bold text-foreground" data-testid="text-response-count">
          {value}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        data-testid="button-increase-responses"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
}
