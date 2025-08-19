'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, BookOpen, Target, Users, Clock, Star, Award, Calendar, Globe, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GET_SKILLS_BY_LEVEL, GET_SKILL_BY_ID } from '@/lib/graphql/queries';
import { useRouter } from 'next/navigation';

interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  isCompleted: boolean;
  percentaje: number;
  qualification: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lenguageId: string;
  lenguage?: {
    id: string;
    name: string;
  };
}

interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  difficulty: string;
  estimatedHours?: number;
  objectives?: string;
  prerequisites?: string;
  tags: string[];
  isActive: boolean;
}

const GET_LEVEL_BY_ID = gql`
  query GetLevelById($id: ID!) {
    level(id: $id) {
      id
      name
      description
      difficulty
      isCompleted
      percentaje
      qualification
      createdAt
      updatedAt
      isActive
      lenguageId
      lenguage {
        id
        name
      }
    }
  }
`;

export default function LevelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_LEVEL_BY_ID, {
    variables: { id: params.id },
    skip: !params.id,
  });

  const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery(GET_SKILLS_BY_LEVEL, {
    variables: { levelId: params.id },
    skip: !params.id,
  });

  const level = data?.level;
  const skills = skillsData?.skillsByLevelPublic || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando nivel...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error al cargar el nivel</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Nivel no encontrado</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
      case 'Principiante':
        return 'bg-green-100 text-green-800';
      case 'Básico-Intermedio':
        return 'bg-blue-100 text-blue-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Intermedio-Avanzado':
        return 'bg-orange-100 text-orange-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Sin fecha';
    }
    
    try {
      // Handle both ISO string and timestamp formats
      let date;
      
      // If it's a numeric string (timestamp), convert to number first
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Sin fecha';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header del nivel */}
      <div className="rounded-lg p-8 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📚</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{level.name}</h1>
              <Badge className={getDifficultyColor(level.difficulty)}>
                {level.difficulty}
              </Badge>
            </div>
          </div>
          {level.lenguage && (
            <Badge variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {level.lenguage.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Estadísticas del nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Progreso</p>
                <p className="font-semibold">{level.percentaje}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Calificación</p>
                <p className="font-semibold">{level.qualification}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso del usuario */}
      {level.percentaje > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completado</span>
                <span>{level.percentaje}%</span>
              </div>
              <Progress value={level.percentaje} className="h-2" />
              {level.qualification > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Calificación actual</span>
                  <span className="font-semibold">{level.qualification}/100</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Descripción */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Descripción del Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{level.description}</p>
        </CardContent>
      </Card>

      {/* Skills del Nivel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Skills de este Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {skillsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando skills...</span>
            </div>
          ) : skillsError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Error al cargar las skills</p>
              <p className="text-sm text-gray-600">{skillsError.message}</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay skills disponibles para este nivel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill: Skill) => (
                <Card 
                  key={skill.id} 
                  className="cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50"
                  onClick={() => {
                    router.push(`/dashboard/skill/${skill.id}`);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {skill.name}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {skill.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium"
                      >
                        {skill.difficulty}
                      </Badge>
                      {skill.estimatedHours && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {skill.estimatedHours}h
                        </Badge>
                      )}
                    </div>
                    
                    {skill.objectives && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Objetivos:
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{skill.objectives}</p>
                      </div>
                    )}
                    
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skill.tags.slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {skill.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                            +{skill.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Skill
                        </span>
                        <span className="group-hover:text-primary transition-colors">
                          Ver detalles →
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Fecha de creación:</span>
              <p className="font-medium">{formatDate(level.createdAt)}</p>
            </div>
            <div>
              <span className="text-gray-600">Última actualización:</span>
              <p className="font-medium">{formatDate(level.updatedAt)}</p>
            </div>
            <div>
              <span className="text-gray-600">Estado:</span>
              <Badge variant={level.isActive ? 'default' : 'secondary'} className="ml-2">
                {level.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">Completado:</span>
              <Badge variant={level.isCompleted ? 'default' : 'outline'} className="ml-2">
                {level.isCompleted ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de acción */}
      <div className="mt-6 flex justify-center">
        <Button size="lg" className="px-8">
          {level.isCompleted ? 'Revisar Contenido' : 'Comenzar Nivel'}
        </Button>
      </div>
    </div>
  );
}