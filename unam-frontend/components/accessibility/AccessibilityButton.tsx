'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Accessibility } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { cn } from '@/lib/utils';

interface AccessibilityButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({ 
  className, 
  variant = 'floating' 
}) => {
  const { setIsMenuOpen } = useAccessibility();

  const handleClick = () => {
    setIsMenuOpen(true);
  };

  const buttonClasses = cn(
    variant === 'floating' && [
      'fixed bottom-6 right-6 z-50',
      'h-14 w-14 rounded-full shadow-lg',
      'bg-primary text-primary-foreground',
      'hover:bg-primary/90 hover:shadow-xl',
      'transition-all duration-200',
      'border-2 border-background',
    ],
    variant === 'inline' && [
      'h-10 w-10',
    ],
    className
  );

  const button = (
    <Button
      onClick={handleClick}
      className={buttonClasses}
      size={variant === 'floating' ? 'icon' : 'sm'}
      aria-label="Abrir menú de accesibilidad"
    >
      <Accessibility className={variant === 'floating' ? 'h-8 w-8' : 'h-4 w-4'} />
    </Button>
  );

  if (variant === 'floating') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Menú de Accesibilidad</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export { AccessibilityButton };
export default AccessibilityButton;