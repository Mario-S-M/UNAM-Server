'use client';

import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { loadLanguagesWithLevels } from './dataLoader';
import { SidebarLanguage } from './types';
import { LanguageItem } from './LanguageItem';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

export default function LearningContent() {
  const router = useRouter();
  const [languages, setLanguages] = useState<SidebarLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar qué idiomas están expandidos
  const [expandedLanguages, setExpandedLanguages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        
        const data = await loadLanguagesWithLevels();
        setLanguages(data);
      } catch (err) {
        console.error('❌ LearningContent: Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleLanguage = (languageId: string) => {
    setExpandedLanguages(prev => {
      const newSet = new Set<string>();
      // Si el idioma ya está expandido, lo colapsamos (set vacío)
      // Si no está expandido, solo expandimos este idioma
      if (!prev.has(languageId)) {
        newSet.add(languageId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Cargando contenido...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">No hay idiomas disponibles</p>
        <p className="text-xs text-gray-400 mt-2">Debug: Component mounted, loading completed</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {languages.map((language) => (
        <LanguageItem
          key={language.id}
          language={language}
          isExpanded={expandedLanguages.has(language.id)}
          onToggle={() => toggleLanguage(language.id)}
        />
      ))}
    </div>
  );
}