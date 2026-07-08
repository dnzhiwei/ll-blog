import { useState, useEffect } from 'react';

interface ConfigInputProps {
  label: string;
  description: string;
  keyName: string;
  value: string | number;
  type: 'string' | 'number';
  onChange: (value: string | number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const ConfigInput = ({ label, description, keyName, value, type, onChange, min, max, step }: ConfigInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (type === 'number') {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        let clampedValue = numValue;

        if (min !== undefined && numValue < min) {
          clampedValue = min;
        }
        if (max !== undefined && numValue > max) {
          clampedValue = max;
        }

        if (step !== undefined) {
          const stepDecimal = step.toString().split('.')[1]?.length || 0;
          clampedValue = parseFloat(clampedValue.toFixed(stepDecimal));
        }

        onChange(clampedValue);
      } else if (newValue === '') {
        onChange('');
      }
    } else {
      onChange(newValue);
    }
  };

  const inputStep = step !== undefined ? step : (type === 'number' ? 'any' : undefined);

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-3">
        <label className="flex-1 text-sm text-pal-text">{label}</label>
        <span className="shrink-0 text-xs text-pal-text-muted truncate max-w-[40%]">{keyName}</span>
      </div>
      {description && <p className="text-xs text-pal-text-muted">{description}</p>}
      <input
        type={type === 'number' ? 'number' : 'text'}
        value={inputValue}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm bg-pal-surface border border-pal-border rounded text-pal-text placeholder-pal-text-muted"
        placeholder="请输入值"
        step={inputStep}
        min={min}
        max={max}
      />
    </div>
  );
};
