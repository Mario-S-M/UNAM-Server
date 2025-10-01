'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAutoSave } from '@/lib/hooks/useAutoSave';

const GET_ACTIVITY = gql`
  query GetActivity($id: ID!) {
    activity(id: $id) {
      id
      name
      description
      indication
      example
      contentId
      form {
        id
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          description
          placeholder
          imageUrl
          minValue
          maxValue
          minLabel
          maxLabel
          maxLength
          allowMultiline
          correctAnswer
          explanation
          incorrectFeedback
          points
          options {            id            optionText            optionValue            orderIndex            imageUrl            color            isCorrect          }
        }
      }
    }
  }
`;

const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($updateActivityInput: UpdateActivityInput!) {
    updateActivity(updateActivityInput: $updateActivityInput) {
      id
      name
      description
      form {
        id
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          options {            id            optionText            optionValue            orderIndex            isCorrect          }
        }
      }
    }
  }
`;

interface QuestionOption {  id?: string;  optionText: string;  optionValue?: string;  orderIndex: number;  imageUrl?: string;  color?: string;  isCorrect?: boolean;}

interface Question {
  id?: string;
  questionText: string;
  questionType: string;
  orderIndex: number;
  isRequired: boolean;
  description?: string;
  placeholder?: string;
  imageUrl?: string;
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
  maxLength?: number;
  allowMultiline: boolean;
  correctAnswer?: string;
  explanation?: string;
  incorrectFeedback?: string;
  points?: number;
  options: QuestionOption[];
}

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Opción múltiple' },
  { value: 'SINGLE_CHOICE', label: 'Selección única' },
  { value: 'OPEN_TEXT', label: 'Texto abierto' },
  { value: 'CHECKBOX', label: 'Casillas de verificación' },
  { value: 'RATING_SCALE', label: 'Escala de valoración' },
  { value: 'YES_NO', label: 'Sí/No' },
  { value: 'WORD_SEARCH', label: 'Sopa de letras' },
  { value: 'CROSSWORD', label: 'Crucigrama' },
];

export default function ActivityQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.activityId as string;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activityName, setActivityName] = useState('');

  const { data: activityData, loading } = useQuery(GET_ACTIVITY, {
    variables: { id: activityId },
  });

  useEffect(() => {
    if (activityData?.activity) {
      
      
      setActivityName(activityData.activity.name);
      
      if (activityData.activity.form?.questions) {
  
        const processedQuestions = activityData.activity.form.questions.map((q: any) => {
  
          return {
            ...q,
            allowMultiline: q.allowMultiline || false,
            options: q.options || []
          };
        });
  
        setQuestions(processedQuestions);
      } else {
  
        setQuestions([]);
      }
      
  
    }
  }, [activityData]);

  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    refetchQueries: [{ query: GET_ACTIVITY, variables: { id: activityId } }],
    onCompleted: () => {
      // Solo mostrar toast para guardado manual, no automático
      // toast.success('Preguntas guardadas exitosamente');
    },
    onError: (error) => {
      console.error('Error updating activity:', error);
      toast.error('Error al guardar las preguntas');
    }
  });

  // Función para guardar las preguntas
  const saveQuestions = async (questionsToSave: Question[]) => {
    const questionsInput = questionsToSave.map((question, index) => ({
      questionText: question.questionText,
      questionType: question.questionType,
      orderIndex: index,
      isRequired: question.isRequired,
      description: question.description || '',
      placeholder: question.placeholder || '',
      imageUrl: question.imageUrl || '',
      minValue: question.minValue || 0,
      maxValue: question.maxValue || 0,
      minLabel: question.minLabel || '',
      maxLabel: question.maxLabel || '',
      maxLength: question.maxLength || 0,
      allowMultiline: question.allowMultiline,
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || '',
      incorrectFeedback: question.incorrectFeedback || '',
      points: question.points || 0,
      options: question.options.map((option, optionIndex) => ({
        optionText: option.optionText,
        optionValue: option.optionValue || '',
        orderIndex: optionIndex,
        imageUrl: option.imageUrl || '',
        color: option.color || '',
        isCorrect: option.isCorrect || false
      }))
    }));

    await updateActivity({
      variables: {
        updateActivityInput: {
          id: activityId,
          questions: questionsInput
        }
      }
    });
  };

  // Hook de guardado automático discreto
  const { forceSave } = useAutoSave({
    data: questions,
    onSave: saveQuestions,
    delay: 10000, // 10 segundos de delay para ser más discreto
    enabled: questions.length > 0 && !loading // Solo habilitar si hay preguntas y no está cargando
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'MULTIPLE_CHOICE',
      orderIndex: questions.length,
      isRequired: false,
      allowMultiline: false,
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const newOption: QuestionOption = {
      optionText: '',
      orderIndex: updatedQuestions[questionIndex].options.length,
      isCorrect: false
    };
    const updatedOptions = [...updatedQuestions[questionIndex].options, newOption];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const updatedOptions = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof QuestionOption, value: any) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value
    };
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    try {
      await forceSave();
      toast.success('Preguntas guardadas exitosamente');
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Error al guardar las preguntas');
    }
  };

  const needsOptions = (questionType: string) => {
    return ['MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'CHECKBOX'].includes(questionType);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando ejercicio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/teacher/activities')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Preguntas de Ejercicio</h1>
            <p className="text-muted-foreground">{activityName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={addQuestion} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Pregunta
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Preguntas
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No hay preguntas creadas</p>
              <Button onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera pregunta
              </Button>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, questionIndex) => (
            <Card key={questionIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Pregunta {questionIndex + 1}</Badge>
                    <Badge variant={question.isRequired ? 'default' : 'secondary'}>
                      {question.isRequired ? 'Obligatoria' : 'Opcional'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-text-${questionIndex}`}>Texto de la pregunta</Label>
                    <Textarea
                      id={`question-text-${questionIndex}`}
                      value={question.questionText}
                      onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                      placeholder="Escribe tu pregunta aquí..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`question-type-${questionIndex}`}>Tipo de pregunta</Label>
                    <Select
                      value={question.questionType}
                      onValueChange={(value) => updateQuestion(questionIndex, 'questionType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${questionIndex}`}
                    checked={question.isRequired}
                    onCheckedChange={(checked) => updateQuestion(questionIndex, 'isRequired', checked)}
                  />
                  <Label htmlFor={`required-${questionIndex}`}>Pregunta obligatoria</Label>
                </div>

                {question.questionType === 'OPEN_TEXT' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`placeholder-${questionIndex}`}>Texto de ayuda</Label>
                        <Input
                          id={`placeholder-${questionIndex}`}
                          value={question.placeholder || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'placeholder', e.target.value)}
                          placeholder="Texto de ayuda para el usuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`max-length-${questionIndex}`}>Longitud máxima</Label>
                        <Input
                          id={`max-length-${questionIndex}`}
                          type="number"
                          value={question.maxLength || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'maxLength', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`correct-answer-${questionIndex}`}>Respuesta correcta</Label>
                      <Textarea
                        id={`correct-answer-${questionIndex}`}
                        value={question.correctAnswer || ''}
                        onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                        placeholder="Escribe la respuesta correcta esperada"
                      />
                    </div>
                  </div>
                )}

                {question.questionType === 'RATING_SCALE' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`min-value-${questionIndex}`}>Valor mínimo</Label>
                        <Input
                          id={`min-value-${questionIndex}`}
                          type="number"
                          value={question.minValue || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'minValue', parseInt(e.target.value) || 0)}
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`max-value-${questionIndex}`}>Valor máximo</Label>
                        <Input
                          id={`max-value-${questionIndex}`}
                          type="number"
                          value={question.maxValue || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'maxValue', parseInt(e.target.value) || 0)}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`min-label-${questionIndex}`}>Etiqueta mínima</Label>
                        <Input
                          id={`min-label-${questionIndex}`}
                          value={question.minLabel || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'minLabel', e.target.value)}
                          placeholder="Muy malo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`max-label-${questionIndex}`}>Etiqueta máxima</Label>
                        <Input
                          id={`max-label-${questionIndex}`}
                          value={question.maxLabel || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'maxLabel', e.target.value)}
                          placeholder="Excelente"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`correct-answer-${questionIndex}`}>Valor correcto</Label>
                      <Input
                        id={`correct-answer-${questionIndex}`}
                        type="number"
                        value={question.correctAnswer || ''}
                        onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                        placeholder="Valor esperado como respuesta correcta"
                      />
                    </div>
                  </div>
                )}

                {/* Configuración para sopa de letras */}
                {question.questionType === 'WORD_SEARCH' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <Label className="text-base font-medium">Configuración de Sopa de Letras</Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`grid-rows-${questionIndex}`}>Filas de la cuadrícula</Label>
                        <Input
                          id={`grid-rows-${questionIndex}`}
                          type="number"
                          min="5"
                          max="20"
                          value={(() => {
                            try {
                              const data = question.correctAnswer ? JSON.parse(question.correctAnswer) : null;
                              return data?.gridSize || 8;
                            } catch {
                              return 8;
                            }
                          })()}
                          onChange={(e) => {
                            const size = parseInt(e.target.value) || 8;
                            try {
                              const currentData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { words: [''] };
                              const updatedData = { ...currentData, gridSize: size };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(updatedData));
                            } catch {
                              const newData = { words: [''], gridSize: size };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                            }
                          }}
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`grid-cols-${questionIndex}`}>Columnas de la cuadrícula</Label>
                        <Input
                          id={`grid-cols-${questionIndex}`}
                          type="number"
                          min="5"
                          max="20"
                          value={(() => {
                            try {
                              const data = question.correctAnswer ? JSON.parse(question.correctAnswer) : null;
                              return data?.gridSize || 8;
                            } catch {
                              return 8;
                            }
                          })()}
                          onChange={(e) => {
                            const size = parseInt(e.target.value) || 8;
                            try {
                              const currentData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { words: [''] };
                              const updatedData = { ...currentData, gridSize: size };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(updatedData));
                            } catch {
                              const newData = { words: [''], gridSize: size };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                            }
                          }}
                          placeholder="8"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Palabras a buscar</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            try {
                              const currentData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { words: [''], gridSize: 8 };
                              const newWords = [...(currentData.words || ['']), ''];
                              const updatedData = { ...currentData, words: newWords };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(updatedData));
                            } catch {
                              const newData = { words: ['', ''], gridSize: 8 };
                              updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar palabra
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {(() => {
                          try {
                            const data = question.correctAnswer ? JSON.parse(question.correctAnswer) : null;
                            const words = data?.words || [''];
                            return words.map((word: string, wordIndex: number) => (
                              <div key={wordIndex} className="flex items-center gap-2">
                                <Input
                                  value={word}
                                  onChange={(e) => {
                                    try {
                                      const currentData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { words: [''], gridSize: 8 };
                                      const newWords = [...(currentData.words || [])];
                                      newWords[wordIndex] = e.target.value;
                                      const updatedData = { ...currentData, words: newWords };
                                      updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(updatedData));
                                    } catch {
                                      const newWords = [''];
                                      newWords[wordIndex] = e.target.value;
                                      const newData = { words: newWords, gridSize: 8 };
                                      updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                                    }
                                  }}
                                  placeholder={`Palabra ${wordIndex + 1}`}
                                />
                                {words.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      try {
                                        const currentData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { words: [''], gridSize: 8 };
                                        const newWords = (currentData.words || ['']).filter((_: any, i: number) => i !== wordIndex);
                                        const updatedData = { ...currentData, words: newWords.length > 0 ? newWords : [''] };
                                        updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(updatedData));
                                      } catch {
                                        const newData = { words: [''], gridSize: 8 };
                                        updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ));
                          } catch {
                            return (
                              <div className="flex items-center gap-2">
                                <Input
                                  value=""
                                  onChange={(e) => {
                                    const newData = { words: [e.target.value], gridSize: 8 };
                                    updateQuestion(questionIndex, 'correctAnswer', JSON.stringify(newData));
                                  }}
                                  placeholder="Palabra 1"
                                />
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Configuración para crucigrama */}
                {question.questionType === 'CROSSWORD' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <Label className="text-base font-medium">Configuración de Crucigrama</Label>
                    <div className="text-sm text-gray-600">
                      <p>La configuración de crucigrama estará disponible próximamente.</p>
                    </div>
                  </div>
                )}

                {needsOptions(question.questionType) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Opciones de respuesta</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar opción
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {question.options && question.options.length > 0 ? (
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              value={option.optionText || ''}
                              onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                              placeholder={`Opción ${optionIndex + 1}`}
                            />
                            {(question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'SINGLE_CHOICE' || question.questionType === 'CHECKBOX') && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`correct-${questionIndex}-${optionIndex}`}
                                  checked={option.isCorrect || false}
                                  onCheckedChange={(checked) => {
                                    if (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'SINGLE_CHOICE') {
                                      // Para opción múltiple y selección única, solo una opción puede ser correcta
                                      const updatedOptions = question.options.map((opt, idx) => ({
                                        ...opt,
                                        isCorrect: idx === optionIndex ? checked : false
                                      }));
                                      updateQuestion(questionIndex, 'options', updatedOptions);
                                    } else {
                                      // Para checkbox, múltiples opciones pueden ser correctas
                                      updateOption(questionIndex, optionIndex, 'isCorrect', checked);
                                    }
                                  }}
                                />
                                <Label htmlFor={`correct-${questionIndex}-${optionIndex}`} className="text-sm">
                                  Correcta
                                </Label>
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(questionIndex, optionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
                          No hay opciones configuradas. Haz clic en "Agregar opción" para crear la primera opción.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`explanation-${questionIndex}`}>Explicación (opcional)</Label>
                    <Textarea
                      id={`explanation-${questionIndex}`}
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                      placeholder="Explicación de la respuesta correcta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`points-${questionIndex}`}>Puntos</Label>
                    <Input
                      id={`points-${questionIndex}`}
                      type="number"
                      step="0.1"
                      value={question.points || ''}
                      onChange={(e) => updateQuestion(questionIndex, 'points', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}