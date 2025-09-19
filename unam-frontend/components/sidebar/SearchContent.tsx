'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, FileText, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CONTENT_PUBLIC_FRAGMENT } from '@/lib/graphql/fragments';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  skill: {
    id: string;
    name: string;
    color: string;
  };
  level?: {
    id: string;
    name: string;
  };
  language?: {
    id: string;
    name: string;
  };
}

interface SearchContentProps {
  onClose?: () => void;
}

const SEARCH_CONTENTS_QUERY = `
  ${CONTENT_PUBLIC_FRAGMENT}
  
  query AllContentsPublic($languageId: ID, $levelId: ID, $skillId: ID) {
    allContentsPublic(languageId: $languageId, levelId: $levelId, skillId: $skillId) {
      ...ContentPublicFields
    }
  }
`;

const SearchContent: React.FC<SearchContentProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allContents, setAllContents] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  // Función para hacer consultas GraphQL públicas
  const queryGraphQLPublic = useCallback(async (query: string, variables: Record<string, unknown> = {}) => {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }
    
    return result.data;
  }, []);

  // Cargar todos los contenidos al montar el componente
  useEffect(() => {
    const loadAllContents = async () => {
      try {
        setLoading(true);
        const data = await queryGraphQLPublic(SEARCH_CONTENTS_QUERY);
        setAllContents(data.allContentsPublic || []);
      } catch (error) {
        console.error('Error loading contents:', error);
        toast.error('Error al cargar el contenido');
      } finally {
        setLoading(false);
      }
    };

    loadAllContents();
  }, [queryGraphQLPublic]);

  // Filtrar contenidos basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = allContents.filter(content =>
      content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filtered.slice(0, 10)); // Limitar a 10 resultados
    setSelectedIndex(-1); // Reset selection when results change
  }, [searchTerm, allContents]);

  const handleContentClick = (contentId: string) => {
    router.push(`/dashboard/content/${contentId}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedIndex(-1);
  };

  // Manejar navegación por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Tab':
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleContentClick(results[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Campo de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          aria-describedby="search-instructions"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {isOpen && searchTerm && (
        <Card className="absolute z-50 w-full mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Buscando...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground px-2 py-1">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((content, index) => (
                  <div
                    key={content.id}
                    onClick={() => handleContentClick(content.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-accent border-2 border-primary' 
                        : 'hover:bg-accent'
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{content.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {content.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: `${content.skill.color}20`, color: content.skill.color }}
                          >
                            {content.skill.name}
                          </Badge>
                          {content.level && (
                            <Badge variant="outline" className="text-xs">
                              {content.level.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
                <p className="text-xs text-muted-foreground mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instrucciones de accesibilidad */}
      <div id="search-instructions" className="sr-only">
        Usa las flechas arriba y abajo o Tab para navegar por los resultados. Presiona Enter para seleccionar o Escape para cerrar.
      </div>

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSelectedIndex(-1);
          }}
        />
      )}
    </div>
  );
};

export default SearchContent;