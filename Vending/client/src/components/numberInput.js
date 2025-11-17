import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

const NumberInput = React.forwardRef(function CustomNumberInput({ min = 1, max = 999, onChange, ...props }, ref) {
  const [value, setValue] = React.useState(min);

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(null, newValue);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(null, newValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setValue(clampedValue);
    onChange?.(null, clampedValue);
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        <Minus size={16} />
      </button>
      
      <input
        ref={ref}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        className="w-16 h-8 text-center text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
      
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        <Plus size={16} />
      </button>
    </div>
  );
});

export default NumberInput;