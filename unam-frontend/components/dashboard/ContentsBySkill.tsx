'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, FileText, Play, Users } from 'lucide-react';
import { GET_VALIDATED_CONTENTS_BY_SKILL } from '@/lib/graphql/dashboardQueries';
import { useDashboard } from '@/contexts/DashboardContext';
import { useState } from 'react';

interface Content {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  validationStatus: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  userId: string;
  markdownPath: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
    color: string;
  };
  assignedTeachers: {
    id: string;
    fullName: string;
    email: string;
  }[];
}

interface ContentsQueryResponse {
  contentsBySkillPublic: Content[];
}

interface ContentsBySkillProps {
  onContentSelect: (content: Content) => void;
  onBackToSkills?: () => void;
}

export function ContentsBySkill({ onContentSelect, onBackToSkills }: ContentsBySkillProps) {
  const { selectedSkill, setSelectedSkill } = useDashboard();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const { data, loading, error } = useQuery<ContentsQueryResponse>(
    GET_VALIDATED_CONTENTS_BY_SKILL,
    {
      variables: { skillId: selectedSkill?.id },
      skip: !selectedSkill?.id,
      errorPolicy: 'all'
    }
  );

  const handleBackToSkills = () => {
    if (onBackToSkills) {
      onBackToSkills();
    } else {
      setSelectedSkill(null);
    }
    setSelectedContent(null);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    onContentSelect(content);
  };

  if (!selectedSkill) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
        
        {/* Content Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToSkills}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Habilidades
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-red-600">Error al cargar el contenido</p>
            <p className="text-sm text-muted-foreground">Por favor, intenta recargar la página</p>
          </div>
        </div>
      </div>
    );
  }

  const contents = data?.contentsBySkillPublic || [];

  const getStatusBadge = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completado
        </Badge>
      );
    }
    
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-800">Disponible</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">No Disponible</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToSkills}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Habilidades
          </Button>
        </div>
        
        <div className="flex items-start gap-4">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: selectedSkill.color || '#6366f1' }}
          >
            {selectedSkill.icon || selectedSkill.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{selectedSkill.name}</h1>
            <p className="text-lg text-muted-foreground">
              {selectedSkill.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {contents.length} contenido{contents.length !== 1 ? 's' : ''}
              </span>
              {selectedSkill.estimatedHours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedSkill.estimatedHours} horas estimadas
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {contents.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium">No hay contenido disponible</p>
            <p className="text-sm text-muted-foreground">
              El contenido para esta habilidad estará disponible pronto
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contenido del Curso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contents.map((content: Content, index: number) => (
              <Card 
                key={content.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleContentClick(content)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {content.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {content.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Play className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Status and Metadata */}
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(content.validationStatus, content.isCompleted)}
                    {content.publishedAt && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(content.publishedAt)}
                      </Badge>
                    )}
                  </div>

                  {/* Teachers */}
                  {content.assignedTeachers && content.assignedTeachers.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Instructores:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {content.assignedTeachers.slice(0, 2).map((teacher: { id: string; fullName: string; email: string }) => (
                          <Badge 
                            key={teacher.id}
                            variant="secondary" 
                            className="text-xs px-2 py-1"
                          >
                            {teacher.fullName}
                          </Badge>
                        ))}
                        {content.assignedTeachers.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            +{content.assignedTeachers.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                    disabled={content.validationStatus !== 'APPROVED'}
                  >
                    {content.isCompleted ? 'Revisar' : 'Comenzar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}