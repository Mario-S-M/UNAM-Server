import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconManagerProps {
  id: string;
  label: string;
  value: string[];
  onChange: (icons: string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
  maxIcons?: number;
  allowDuplicates?: boolean;
}

export function IconManager({
  id,
  label,
  value = [],
  onChange,
  placeholder = 'URL del icono...',
  required = false,
  disabled = false,
  error,
  description,
  className,
  maxIcons = 10,
  allowDuplicates = false
}: IconManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addIcon = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) {
      setInputError('La URL del icono es requerida');
      return;
    }

    if (!validateUrl(trimmedValue)) {
      setInputError('Por favor ingresa una URL válida');
      return;
    }

    if (!allowDuplicates && value.includes(trimmedValue)) {
      setInputError('Este icono ya ha sido agregado');
      return;
    }

    if (value.length >= maxIcons) {
      setInputError(`Máximo ${maxIcons} iconos permitidos`);
      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue('');
    setInputError('');
  };

  const removeIcon = (index: number) => {
    const newIcons = value.filter((_, i) => i !== index);
    onChange(newIcons);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (inputError) {
      setInputError('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addIcon();
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
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

      {/* Input para agregar iconos */}
      <div className="flex space-x-2">
        <Input
          id={id}
          type="url"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || value.length >= maxIcons}
          className={cn(
            'flex-1',
            (error || inputError) && 'border-red-500 focus:border-red-500'
          )}
        />
        <Button
          type="button"
          onClick={addIcon}
          disabled={disabled || !inputValue.trim() || value.length >= maxIcons}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Error del input */}
      {inputError && (
        <p className="text-xs text-red-500">{inputError}</p>
      )}

      {/* Lista de iconos */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Iconos agregados ({value.length}/{maxIcons})
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {value.map((icon, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={icon}
                    alt={`Icono ${index + 1}`}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.fallback-icon');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'block';
                        }
                      }
                    }}
                  />
                  <ImageIcon 
                    className="w-6 h-6 text-gray-400 fallback-icon" 
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate" title={icon}>
                    {icon}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIcon(index)}
                  disabled={disabled}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {value.length === 0 ? 'No hay iconos agregados' : `${value.length} icono${value.length !== 1 ? 's' : ''} agregado${value.length !== 1 ? 's' : ''}`}
        </span>
        {maxIcons > 0 && (
          <span>
            {maxIcons - value.length} restante{maxIcons - value.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export default IconManager;