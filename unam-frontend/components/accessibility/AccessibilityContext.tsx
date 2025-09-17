'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para las configuraciones de accesibilidad
export type Theme = 'light' | 'dark' | 'high-contrast';
export type FontSize = 'sm' | 'md' | 'lg';
export type LetterSpacing = 'normal' | 'wide' | 'wider';
export type LineHeight = 'normal' | 'relaxed' | 'loose';

interface AccessibilitySettings {
  theme: Theme;
  fontSize: FontSize;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  hideImages: boolean;
  dyslexiaFont: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateTheme: (theme: Theme) => void;
  updateFontSize: (fontSize: FontSize) => void;
  updateLetterSpacing: (spacing: LetterSpacing) => void;
  updateLineHeight: (height: LineHeight) => void;
  toggleImages: () => void;
  toggleDyslexiaFont: () => void;
  resetSettings: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  theme: 'light',
  fontSize: 'md',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  hideImages: false,
  dyslexiaFont: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Función para aplicar las configuraciones al DOM
const applySettingsToDOM = (settings: AccessibilitySettings) => {
  const root = document.documentElement;
  
  // Aplicar tema
  root.classList.remove('light', 'dark', 'high-contrast');
  root.classList.add(settings.theme);
  
  // Aplicar tamaño de fuente
  root.classList.remove('font-sm', 'font-md', 'font-lg');
  root.classList.add(`font-${settings.fontSize}`);
  
  // Aplicar espaciado de letras
  root.classList.remove('letter-normal', 'letter-wide', 'letter-wider');
  root.classList.add(`letter-${settings.letterSpacing}`);
  
  // Aplicar interlineado
  root.classList.remove('line-normal', 'line-relaxed', 'line-loose');
  root.classList.add(`line-${settings.lineHeight}`);
  
  // Aplicar configuración de imágenes
  if (settings.hideImages) {
    root.classList.add('hide-images');
  } else {
    root.classList.remove('hide-images');
  }
  
  // Aplicar fuente para dislexia
  if (settings.dyslexiaFont) {
    root.classList.add('dyslexia-font');
  } else {
    root.classList.remove('dyslexia-font');
  }
};

// Función para cargar configuraciones desde localStorage
const loadSettingsFromStorage = (): AccessibilitySettings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem('accessibility-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Error loading accessibility settings:', error);
  }
  
  return defaultSettings;
};

// Función para guardar configuraciones en localStorage
const saveSettingsToStorage = (settings: AccessibilitySettings) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Error saving accessibility settings:', error);
  }
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    const loadedSettings = loadSettingsFromStorage();
    setSettings(loadedSettings);
    applySettingsToDOM(loadedSettings);
  }, []);

  // Aplicar configuraciones cuando cambien
  useEffect(() => {
    applySettingsToDOM(settings);
    saveSettingsToStorage(settings);
  }, [settings]);

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const updateFontSize = (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const updateLetterSpacing = (letterSpacing: LetterSpacing) => {
    setSettings(prev => ({ ...prev, letterSpacing }));
  };

  const updateLineHeight = (lineHeight: LineHeight) => {
    setSettings(prev => ({ ...prev, lineHeight }));
  };

  const toggleImages = () => {
    setSettings(prev => ({ ...prev, hideImages: !prev.hideImages }));
  };

  const toggleDyslexiaFont = () => {
    setSettings(prev => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateTheme,
        updateFontSize,
        updateLetterSpacing,
        updateLineHeight,
        toggleImages,
        toggleDyslexiaFont,
        resetSettings,
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};