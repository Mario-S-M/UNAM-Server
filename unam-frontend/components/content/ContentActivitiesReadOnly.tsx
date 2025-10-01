'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Eye } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;
  contentId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const GET_ACTIVITIES_BY_CONTENT = gql`
  query ActivitiesByContent($contentId: ID!) {
    activitiesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      createdAt
      updatedAt
      userId
    }
  }
`;

interface ContentActivitiesReadOnlyProps {
  contentId: string;
}

export function ContentActivitiesReadOnly({ contentId }: ContentActivitiesReadOnlyProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error } = useQuery<{ activitiesByContent: Activity[] }>(
    GET_ACTIVITIES_BY_CONTENT,
    {
      variables: { contentId },
      errorPolicy: 'all',
    }
  );

  const activities = data?.activitiesByContent || [];
  
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Ejercicios</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-xs text-muted-foreground">Cargando ejercicios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Ejercicios</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">Error al cargar los ejercicios</p>
          <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Ejercicios</h3>
          <Badge variant="outline" className="text-xs">
            {activities.length} disponibles
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Ejercicios y ejercicios relacionados con este contenido
        </p>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            placeholder="Buscar ejercicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div className="flex-1 overflow-auto p-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchTerm 
                ? 'No se encontraron ejercicios que coincidan con la búsqueda' 
                : 'No hay ejercicios disponibles para este contenido'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => (
              <Card key={activity.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {/* Título y número */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          #{index + 1}
                        </Badge>
                        <h4 className="font-medium text-sm">{activity.name}</h4>
                      </div>
                    </div>
                    
                    {/* Descripción */}
                    {activity.description && (
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    )}
                    
                    {/* Indicaciones */}
                    {activity.indication && (
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <span className="font-medium text-muted-foreground">Indicaciones:</span>
                        <p className="mt-1">{activity.indication}</p>
                      </div>
                    )}
                    
                    {/* Ejemplo */}
                    {activity.example && (
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <span className="font-medium text-blue-700">Ejemplo:</span>
                        <p className="mt-1 text-blue-600">{activity.example}</p>
                      </div>
                    )}
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        Creado: {new Date(activity.createdAt).toLocaleDateString()}
                      </Badge>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Solo lectura
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}