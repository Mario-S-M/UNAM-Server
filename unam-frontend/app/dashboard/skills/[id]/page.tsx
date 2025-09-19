'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import { Loader2, Target, Clock, BookOpen, CheckCircle, /*Users,*/ Award, Calendar, Globe } from 'lucide-react';
import { GET_SKILL_BY_ID } from '@/lib/graphql/queries';

// Función para formatear tiempo de minutos a horas y minutos
const formatDuration = (totalMinutes: number | null | undefined): string => {
  if (!totalMinutes || totalMinutes === 0) {
    return '0 min';
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${minutes} min`;
  }
};

interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  imageUrl?: string;
  icon?: string;
  objectives?: string;
  prerequisites?: string;
  difficulty: string;
  estimatedHours?: number;
  calculatedTotalTime?: number;
  tags: string[];
  order: number;
  isActive: boolean;
  levelId: string;
  level?: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
  };
  createdAt: string;
  updatedAt: string;
}



function getDifficultyColor(difficulty: string): string {
  return 'border';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;

  const { data, loading, error } = useQuery(GET_SKILL_BY_ID, {
    variables: { id: skillId },
    skip: !skillId
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando skill...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p>{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const skill = data?.skillPublic;

  if (!skill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Skill no encontrada</h2>
              <p>La skill que buscas no existe o no tienes permisos para verla.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{skill.name}</h1>
          <p>{skill.level?.name}</p>
        </div>
      </div>

      {/* Card principal de la skill */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {skill.difficulty}
                </Badge>
                {skill.level && (
                  <Badge variant="outline">
                    {skill.level.name}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{skill.name}</CardTitle>
            </div>
            <div className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl">
              {skill.icon || '📚'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Descripción</h3>
            </div>
            <p className="leading-relaxed">{skill.description}</p>
          </div>

          {/* Objetivos */}
          {skill.objectives && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Objetivos</h3>
              </div>
              <p className="leading-relaxed">{skill.objectives}</p>
            </div>
          )}

          {/* Prerrequisitos */}
          {skill.prerequisites && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Prerrequisitos</h3>
              </div>
              <p className="leading-relaxed">{skill.prerequisites}</p>
            </div>
          )}

          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Etiquetas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {skill.calculatedTotalTime && (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">
                  <strong>Tiempo estimado:</strong> {formatDuration(skill.calculatedTotalTime)}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">
                <strong>Creado:</strong> {formatDate(skill.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm text-gray-600">
                <strong>Estado:</strong> {skill.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">
                 <strong>Orden:</strong> {skill.order}
               </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}