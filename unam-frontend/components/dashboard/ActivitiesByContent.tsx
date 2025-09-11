'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, CheckCircle, FileText, Play, Target, Zap } from 'lucide-react';
import { GET_ACTIVITIES_BY_CONTENT } from '@/lib/graphql/dashboardQueries';
import { useState } from 'react';

interface Activity {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;
  contentId: string;
  formId?: string;
  form?: {
    id: string;
    title: string;
    questions: {
      id: string;
      questionText: string;
      questionType: string;
      isRequired: boolean;
      options?: {
        id: string;
        optionText: string;
        optionValue: string;
      }[];
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

interface Content {
  id: string;
  name: string;
  description: string;
  skill: {
    id: string;
    name: string;
    color: string;
  };
}

interface ActivitiesQueryResponse {
  activitiesByContent: Activity[];
}

interface ActivitiesByContentProps {
  selectedContent: Content | null;
  onBackToContents: () => void;
}

export function ActivitiesByContent({ selectedContent, onBackToContents }: ActivitiesByContentProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const { data, loading, error } = useQuery<ActivitiesQueryResponse>(
    GET_ACTIVITIES_BY_CONTENT,
    {
      variables: { contentId: selectedContent?.id },
      skip: !selectedContent?.id,
      errorPolicy: 'all'
    }
  );

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    // Aquí podrías navegar a una página de actividad específica
    
  };

  if (!selectedContent) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
        
        {/* Activities Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
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
            onClick={onBackToContents}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Contenido
          </Button>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-red-600">Error al cargar las actividades</p>
            <p className="text-sm text-muted-foreground">Por favor, intenta recargar la página</p>
          </div>
        </div>
      </div>
    );
  }

  const activities = data?.activitiesByContent || [];

  const getActivityTypeIcon = (activity: Activity) => {
    if (activity.form) {
      const questionTypes = activity.form.questions.map(q => q.questionType);
      if (questionTypes.includes('multiple_choice')) {
        return <Target className="w-5 h-5" />;
      }
      if (questionTypes.includes('text')) {
        return <FileText className="w-5 h-5" />;
      }
    }
    return <Zap className="w-5 h-5" />;
  };

  const getActivityTypeBadge = (activity: Activity) => {
    if (activity.form) {
      const questionCount = activity.form.questions.length;
      return (
        <Badge variant="outline" className="text-xs">
          {questionCount} pregunta{questionCount !== 1 ? 's' : ''}
        </Badge>
      );
    }
    return <Badge variant="outline" className="text-xs">Actividad</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToContents}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Contenido
          </Button>
        </div>
        
        <div className="flex items-start gap-4">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: selectedContent.skill.color || '#6366f1' }}
          >
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{selectedContent.skill.name}</p>
              <h1 className="text-3xl font-bold tracking-tight">{selectedContent.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {selectedContent.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      {activities.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Target className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium">No hay actividades disponibles</p>
            <p className="text-sm text-muted-foreground">
              Las actividades para este contenido estarán disponibles pronto
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Actividades Prácticas</h2>
          
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card 
                key={activity.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleActivityClick(activity)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {activity.name}
                        </CardTitle>
                        {getActivityTypeBadge(activity)}
                      </div>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {activity.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                      {getActivityTypeIcon(activity)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Instructions */}
                  {activity.indication && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Instrucciones:</p>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {activity.indication}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {activity.example && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Ejemplo:</p>
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r">
                        <p className="text-sm text-green-800 leading-relaxed font-mono">
                          {activity.example}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Questions Preview */}
                  {activity.form && activity.form.questions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Vista previa de preguntas:</p>
                      <div className="space-y-2">
                        {activity.form.questions.slice(0, 2).map((question, qIndex) => (
                          <div key={question.id} className="bg-gray-50 p-3 rounded border">
                            <p className="text-sm font-medium">
                              {qIndex + 1}. {question.questionText}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {question.questionType}
                              </Badge>
                              {question.isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Requerida
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {activity.form.questions.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{activity.form.questions.length - 2} pregunta{activity.form.questions.length - 2 !== 1 ? 's' : ''} más
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Actividad
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