"use client";
import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "@heroui/react";
import { Text } from "lucide-react";

const GlobalFontSizeChanger: React.FC = () => {
  type FontSizeOption = 'sm' | 'base' | 'lg';
  
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>('base');

  useEffect(() => {
    // Retrieve saved font size from localStorage
    const savedFontSize = localStorage.getItem('globalFontSize') as FontSizeOption;
    
    // Ensure we have a valid font size
    const validFontSizes: FontSizeOption[] = ['sm', 'base', 'lg'];
    const initialFontSize = validFontSizes.includes(savedFontSize) 
      ? savedFontSize 
      : 'base';
    
    setFontSize(initialFontSize);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only apply styles after mounting to prevent SSR issues
    if (!mounted) return;

    const fontSizeMap = {
      sm: '16px',
      base: '20px',
      lg: '24px'
    };

    // Directly modify document root style
    document.documentElement.style.setProperty('font-size', fontSizeMap[fontSize], 'important');

    // Save to localStorage
    localStorage.setItem('globalFontSize', fontSize);
  }, [fontSize, mounted]);

  // Prevent rendering before mounting to avoid hydration mismatches
  if (!mounted) {
    return null;
  }

  const handleFontSizeChange = (key: string) => {
    const newFontSize = key as FontSizeOption;
    setFontSize(newFontSize);
  };

  return (
    <Tabs 
      aria-label="Tamaño de Letra" 
      color="primary" 
      variant="bordered" 
      selectedKey={fontSize}
      onSelectionChange={(key) => handleFontSizeChange(key.toString())}
    >
      <Tab
        key="sm"
        title={
          <div className="flex items-center space-x-2 hover:!text-inherit">
            <Text size={16} />
            <span>Pequeño</span>
          </div>
        }
      />
      <Tab
        key="base"
        title={
          <div className="flex items-center space-x-2 hover:!text-inherit">
            <Text size={20} />
            <span>Normal</span>
          </div>
        }
      />
      <Tab
        key="lg"
        title={
          <div className="flex items-center space-x-2 hover:!text-inherit">
            <Text size={24} />
            <span>Grande</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default GlobalFontSizeChanger;