'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, Target, Clock, BookOpen, CheckCircle, Users, Award, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GET_SKILL_BY_ID } from '@/lib/graphql/queries';

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
  switch (difficulty.toLowerCase()) {
    case 'básico':
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermedio':
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'avanzado':
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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
  const { data, loading, error } = useQuery(GET_SKILL_BY_ID, {
    variables: { id: params.id },
    skip: !params.id,
  });

  const skill = data?.skill;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando skill...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error al cargar la skill</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Skill no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Navegación de regreso */}
      <div className="mb-6">
        <Link href={skill.level ? `/dashboard/level/${skill.level.id}` : '/dashboard'}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al nivel
          </Button>
        </Link>
      </div>

      {/* Header de la skill */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              <h1 className="text-3xl font-bold text-gray-900">{skill.name}</h1>
            </div>
            {skill.level && (
              <p className="text-lg text-gray-600 mb-2">
                Nivel: <span className="font-medium">{skill.level.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Badges de información */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getDifficultyColor(skill.difficulty)}>
            {skill.difficulty}
          </Badge>
          {skill.estimatedHours && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {skill.estimatedHours} horas estimadas
            </Badge>
          )}
          <Badge variant="outline">
            Orden: {skill.order}
          </Badge>
          <Badge variant={skill.isActive ? "default" : "secondary"}>
            {skill.isActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>
      </div>

      {/* Descripción */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Descripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{skill.description}</p>
        </CardContent>
      </Card>

      {/* Objetivos */}
      {skill.objectives && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objetivos de Aprendizaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{skill.objectives}</p>
          </CardContent>
        </Card>
      )}

      {/* Prerrequisitos */}
      {skill.prerequisites && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Prerrequisitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{skill.prerequisites}</p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {skill.tags && skill.tags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Etiquetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Creado: {formatDate(skill.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Actualizado: {formatDate(skill.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Estado: {skill.isActive ? 'Activa' : 'Inactiva'}</span>
            </div>
            {skill.level && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Nivel: {skill.level.difficulty}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}