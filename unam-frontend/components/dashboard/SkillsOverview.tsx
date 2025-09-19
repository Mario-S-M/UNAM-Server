'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Target, BookOpen, ChevronRight } from 'lucide-react';
import { GET_SKILLS_ACTIVE_PUBLIC } from '@/lib/graphql/dashboardQueries';
import { useDashboard } from '@/contexts/DashboardContext';

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
  isActive: boolean;
  levelId: string;
  lenguageId: string;
  level?: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
  };
  lenguage?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

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

interface SkillsQueryResponse {
  skillsActivePublic: Skill[];
}

export function SkillsOverview() {
  const { setSelectedSkill, setIsLoadingSkill } = useDashboard();
  const { data, loading, error } = useQuery<SkillsQueryResponse>(GET_SKILLS_ACTIVE_PUBLIC, {
    errorPolicy: 'all'
  });

  const handleSkillSelect = (skill: Skill) => {
    setIsLoadingSkill(true);
    setSelectedSkill(skill);
    setIsLoadingSkill(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-red-600">Error al cargar las habilidades</p>
          <p className="text-sm text-muted-foreground">Por favor, intenta recargar la página</p>
        </div>
      </div>
    );
  }

  const skills = data?.skillsActivePublic || [];

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium">No hay habilidades disponibles</p>
          <p className="text-sm text-muted-foreground">Las habilidades aparecerán aquí cuando estén disponibles</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'principiante':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explora las Habilidades</h1>
        <p className="text-lg text-muted-foreground">
          Descubre y domina nuevas habilidades a través de contenido estructurado y actividades prácticas
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card 
            key={skill.id} 
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => handleSkillSelect(skill)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {skill.name}
                    </CardTitle>
                    {skill.level && (
                      <Badge variant="outline" className="text-xs">
                        {skill.level.name}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                    {skill.description}
                  </CardDescription>
                </div>
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: skill.color || '#6366f1' }}
                >
                  {skill.icon || skill.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(skill.difficulty)}>
                  {skill.difficulty}
                </Badge>
                {skill.calculatedTotalTime && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(skill.calculatedTotalTime)}
                  </Badge>
                )}
              </div>

              {/* Objectives Preview */}
              {skill.objectives && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Objetivos:
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {skill.objectives}
                  </p>
                </div>
              )}

              {/* Tags */}
              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {skill.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs px-2 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {skill.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      +{skill.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                Explorar Contenido
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}