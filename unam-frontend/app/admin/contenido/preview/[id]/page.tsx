'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, FileText, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CommentOnlyMarkdownEditor from '@/components/admin/CommentOnlyMarkdownEditor';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
};

interface Content {
  id: string;
  name: string;
  description: string;
  validationStatus: string;
  level?: {
    id: string;
    name: string;
  };
  skill?: {
    id: string;
    name: string;
  };
  language?: {
    id: string;
    name: string;
  };
}

interface Activity {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;
  validationStatus?: string;
  form?: {
    id: string;
    title: string;
    description: string;
    questions: Question[];
  };
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  description?: string;
  placeholder?: string;
  orderIndex: number;
  options?: QuestionOption[];
}

interface QuestionOption {
  id: string;
  optionText: string;
  optionValue: string;
  orderIndex: number;
}

export default function ContentPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [content, setContent] = useState<Content | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const contentId = params.id as string;

  useEffect(() => {
    if (contentId && token) {
      fetchContentData();
    }
  }, [contentId, token]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      
      // Fetch content basic info
      const contentQuery = `
        query GetContent($id: ID!) {
          content(id: $id) {
            id
            name
            description
            validationStatus
            level {
              id
              name
            }
            skill {
              id
              name
            }
            language {
              id
              name
            }
          }
        }
      `;

      const contentResult = await fetchGraphQL(contentQuery, { id: contentId }, token ?? undefined);
      setContent(contentResult.content);

      // Fetch markdown content (using admin query to bypass validation)
      const markdownQuery = `
        query GetContentMarkdown($contentId: ID!) {
          contentMarkdown(contentId: $contentId)
        }
      `;

      try {
        const markdownResult = await fetchGraphQL(markdownQuery, { 
          contentId
        }, token ?? undefined);
        setMarkdownContent(markdownResult.contentMarkdown ?? '');
      } catch (error) {
        console.warn('Could not fetch markdown content:', error);
        setMarkdownContent('*Contenido markdown no disponible*');
      }

      // Fetch activities
      const activitiesQuery = `
        query GetActivitiesByContent($contentId: ID!) {
          activitiesByContent(contentId: $contentId) {
            id
            name
            description
            indication
            example
            validationStatus
            form {
              id
              title
              description
              questions {
                id
                questionText
                questionType
                isRequired
                description
                placeholder
                orderIndex
                options {
                  id
                  optionText
                  optionValue
                  orderIndex
                }
              }
            }
          }
        }
      `;

      const activitiesResult = await fetchGraphQL(activitiesQuery, { contentId }, token ?? undefined);
      setActivities(activitiesResult.activitiesByContent ?? []);

    } catch (error) {
      console.error('Error fetching content data:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const getValidationStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default">Aprobado</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rechazado</Badge>;
      case 'sin validar':
      case 'PENDING':
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const renderQuestion = (question: Question) => {
    const baseClasses = "w-full px-3 py-2 border border-input bg-background text-sm rounded-md";
    
    switch (question.questionType) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={question.placeholder ?? 'Escribe tu respuesta...'}
            className={baseClasses}
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={question.placeholder ?? 'Escribe tu respuesta...'}
            className={`${baseClasses} min-h-[100px] resize-none`}
            disabled
          />
        );
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option value="">Selecciona una opción...</option>
            {question.options?.sort((a, b) => a.orderIndex - b.orderIndex).map((option) => (
              <option key={option.id} value={option.optionValue}>
                {option.optionText}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.sort((a, b) => a.orderIndex - b.orderIndex).map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}-${option.id}`}
                  name={question.id}
                  value={option.optionValue}
                  className="h-4 w-4"
                  disabled
                />
                <label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.optionText}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.sort((a, b) => a.orderIndex - b.orderIndex).map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${question.id}-${option.id}`}
                  value={option.optionValue}
                  className="h-4 w-4"
                  disabled
                />
                <label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.optionText}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            placeholder="Tipo de pregunta no soportado"
            className={baseClasses}
            disabled
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Contenido no encontrado</p>
          <Button onClick={() => router.push('/admin/contenido')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              router.push('/admin/contenido');
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <h1 className="text-2xl font-bold">Vista Previa del Contenido</h1>
          </div>
        </div>
        {getValidationStatusBadge(content.validationStatus)}
      </div>

      {/* Content Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {content.name}
          </CardTitle>
          <CardDescription>{content.description}</CardDescription>
          <div className="flex gap-2 mt-2">
            {content.language && (
              <Badge variant="outline">{content.language.name}</Badge>
            )}
            {content.level && (
              <Badge variant="outline">{content.level.name}</Badge>
            )}
            {content.skill && (
              <Badge variant="outline">{content.skill.name}</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Markdown Content */}
      {markdownContent && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentOnlyMarkdownEditor
                content={markdownContent}
                contentId={Array.isArray(params.id) ? params.id[0] ?? '' : params.id ?? ''}
                readOnly={false}
              />
          </CardContent>
        </Card>
      )}

      {/* Activities */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividades ({activities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {index + 1}. {activity.name}
                    </h3>
                    <p className="text-muted-foreground mb-2">{activity.description}</p>
                    {activity.indication && (
                      <div className="mb-2">
                        <strong>Instrucciones:</strong> {activity.indication}
                      </div>
                    )}
                    {activity.example && (
                      <div className="mb-2">
                        <strong>Ejemplo:</strong> {activity.example}
                      </div>
                    )}
                  </div>
                  {activity.validationStatus && getValidationStatusBadge(activity.validationStatus)}
                </div>

                {/* Form Questions */}
                {activity.form && activity.form.questions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-3">Preguntas:</h4>
                    <div className="space-y-4">
                      {activity.form.questions
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((question) => (
                          <div key={question.id} className="border-l-2 border-muted pl-4">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                {question.orderIndex}.
                              </span>
                              <div className="flex-1">
                                <p className="font-medium mb-1">
                                  {question.questionText}
                                  {question.isRequired && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </p>
                                {question.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {question.description}
                                  </p>
                                )}
                                {renderQuestion(question)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay actividades disponibles para este contenido.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}