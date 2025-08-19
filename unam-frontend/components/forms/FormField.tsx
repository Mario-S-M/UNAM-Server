import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'color';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  type: FieldType;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  options?: SelectOption[];
  selectPlaceholder?: string;
}

export function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  description,
  className,
  min,
  max,
  step,
  rows = 3,
  options = [],
  selectPlaceholder = 'Seleccionar...'
}: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={cn(
              error && 'border-red-500 focus:border-red-500',
              className
            )}
          />
        );

      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={(val) => onChange(val)}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger
              className={cn(
                error && 'border-red-500 focus:border-red-500',
                className
              )}
            >
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={value as boolean}
              onCheckedChange={(checked) => onChange(Boolean(checked))}
              disabled={disabled}
              className={cn(
                error && 'border-red-500',
                className
              )}
            />
            <Label
              htmlFor={id}
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                error && 'text-red-500'
              )}
            >
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <Input
            id={id}
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={cn(
              error && 'border-red-500 focus:border-red-500',
              className
            )}
          />
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={id}
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={cn(
                'w-16 h-10 p-1 border rounded cursor-pointer',
                error && 'border-red-500',
                className
              )}
            />
            <Input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || '#000000'}
              disabled={disabled}
              className={cn(
                'flex-1',
                error && 'border-red-500 focus:border-red-500'
              )}
            />
          </div>
        );

      default:
        return (
          <Input
            id={id}
            type={type}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(
              error && 'border-red-500 focus:border-red-500',
              className
            )}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderInput()}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          error && 'text-red-500',
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}
      >
        {label}
      </Label>
      {renderInput()}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export default FormField;