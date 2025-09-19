'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';

import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/schemas/form-forms';
import type { FormQuestionData, QuestionType } from '@/schemas/form-forms';

interface ActivityQuestionBuilderProps {
  questions: FormQuestionData[];
  onQuestionsChange: (questions: FormQuestionData[]) => void;
}

export function ActivityQuestionBuilder({ questions, onQuestionsChange }: ActivityQuestionBuilderProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const addQuestion = useCallback((type: QuestionType) => {
    const newQuestion: FormQuestionData = {
      questionText: '',
      questionType: type,
      orderIndex: questions.length,
      isRequired: false,
      allowMultiline: false,
      description: '',
      placeholder: '',
      options: ['MULTIPLE_CHOICE', 'CHECKBOX'].includes(type) ? [
        { optionText: 'Opción 1', optionValue: 'option1', orderIndex: 0, isCorrect: false },
        { optionText: 'Opción 2', optionValue: 'option2', orderIndex: 1, isCorrect: false }
      ] : undefined,
      minValue: type === 'RATING_SCALE' ? 1 : undefined,
      maxValue: type === 'RATING_SCALE' ? 5 : undefined,
      maxLength: ['TEXT', 'TEXTAREA', 'open_text'].includes(type) ? 255 : undefined,
      // Campos específicos para sopa de letras
      sentences: type === 'WORD_SEARCH' ? [''] : undefined,
      phrases: type === 'WORD_SEARCH' ? [''] : undefined,
      gridSize: type === 'WORD_SEARCH' ? 8 : undefined
    };
    
    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange(updatedQuestions);
    
    // Expandir la nueva pregunta
    setExpandedQuestions(prev => new Set([...prev, updatedQuestions.length - 1]));
  }, [questions, onQuestionsChange]);

  const removeQuestion = useCallback((index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions);
    
    // Actualizar preguntas expandidas
    setExpandedQuestions(prev => {
      const newSet = new Set<number>();
      prev.forEach(i => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  }, [questions, onQuestionsChange]);

  const updateQuestion = useCallback((index: number, field: keyof FormQuestionData, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onQuestionsChange(updatedQuestions);
  }, [questions, onQuestionsChange]);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      const updatedQuestions = [...questions];
      const [removed] = updatedQuestions.splice(sourceIndex, 1);
      updatedQuestions.splice(destinationIndex, 0, removed);
      onQuestionsChange(updatedQuestions);
    }
  }, [questions, onQuestionsChange]);

  const toggleQuestionExpansion = useCallback((index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const addOption = useCallback((questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const newOption = {
      optionText: `Opción ${question.options.length + 1}`,
      optionValue: `option${question.options.length + 1}`,
      orderIndex: question.options.length,
      isCorrect: false
    };
    
    updateQuestion(questionIndex, 'options', [...question.options, newOption]);
  }, [questions, updateQuestion]);

  const removeOption = useCallback((questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, 'options', updatedOptions);
  }, [questions, updateQuestion]);

  const updateOption = useCallback((questionIndex: number, optionIndex: number, field: 'optionText' | 'optionValue' | 'isCorrect', value: string | boolean) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
    updateQuestion(questionIndex, 'options', updatedOptions);
  }, [questions, updateQuestion]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Preguntas de la Actividad</Label>
        <QuestionTypeSelector onAddQuestion={addQuestion} />
      </div>
      
      {questions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No hay preguntas agregadas. Agrega una pregunta para comenzar.
            </p>
            <QuestionTypeSelector onAddQuestion={addQuestion} />
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {questions.map((question, index) => (
                  <Draggable key={index} draggableId={`question-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            
                            <div className="flex-1">
                              <Collapsible
                                open={expandedQuestions.has(index)}
                                onOpenChange={() => toggleQuestionExpansion(index)}
                              >
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" className="p-0 h-auto font-medium text-left justify-start">
                                    {question.questionText || `Pregunta ${index + 1}`}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({QUESTION_TYPE_LABELS[question.questionType]})
                                    </span>
                                  </Button>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="mt-4 space-y-4">
                                  <QuestionEditor
                                    question={question}
                                    questionIndex={index}
                                    onUpdateQuestion={updateQuestion}
                                    onAddOption={addOption}
                                    onRemoveOption={removeOption}
                                    onUpdateOption={updateOption}
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

// Componente para configurar sopa de letras
interface WordSearchConfigProps {
  questionIndex: number;
  question: FormQuestionData;
  onUpdateQuestion: (index: number, field: keyof FormQuestionData, value: any) => void;
}

function WordSearchConfig({ questionIndex, question, onUpdateQuestion }: WordSearchConfigProps) {
  const [questionAnswerPairs, setQuestionAnswerPairs] = useState<{question: string, answer: string}[]>(() => {
    try {
      const data = question.correctAnswer ? JSON.parse(question.correctAnswer) : null;
      return data?.questionAnswerPairs || [{question: '', answer: ''}];
    } catch {
      return [{question: '', answer: ''}];
    }
  });
  
  const [gridSize, setGridSize] = useState<number>(() => {
    try {
      const data = question.correctAnswer ? JSON.parse(question.correctAnswer) : null;
      return data?.gridSize || 8;
    } catch {
      return 8;
    }
  });

  const updateWordSearchData = useCallback((newPairs: {question: string, answer: string}[], newGridSize: number) => {
    const wordSearchData = {
      questionAnswerPairs: newPairs.filter(pair => pair.question.trim() !== '' && pair.answer.trim() !== ''),
      gridSize: newGridSize
    };
    
    onUpdateQuestion(questionIndex, 'correctAnswer', JSON.stringify(wordSearchData));
  }, [questionIndex, onUpdateQuestion]);

  const addQuestionAnswerPair = () => {
    const newPairs = [...questionAnswerPairs, {question: '', answer: ''}];
    setQuestionAnswerPairs(newPairs);
  };

  const removeQuestionAnswerPair = (index: number) => {
    const newPairs = questionAnswerPairs.filter((_, i) => i !== index);
    setQuestionAnswerPairs(newPairs);
    updateWordSearchData(newPairs, gridSize);
  };

  const updateQuestionAnswerPair = (index: number, field: 'question' | 'answer', value: string) => {
    const newPairs = [...questionAnswerPairs];
    newPairs[index][field] = value;
    setQuestionAnswerPairs(newPairs);
    updateWordSearchData(newPairs, gridSize);
  };

  const updateGridSize = (size: number) => {
    setGridSize(size);
    updateWordSearchData(questionAnswerPairs, size);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <Label className="text-base font-medium">Configuración de Sopa de Letras</Label>
      
      <div>
        <Label htmlFor={`grid-size-${questionIndex}`}>Tamaño de la cuadrícula</Label>
        <Select value={gridSize.toString()} onValueChange={(value) => updateGridSize(parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6x6</SelectItem>
            <SelectItem value="8">8x8</SelectItem>
            <SelectItem value="10">10x10</SelectItem>
            <SelectItem value="12">12x12</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {/* Sección de Pares Pregunta-Respuesta */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Palabras a buscar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestionAnswerPair}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar palabra
            </Button>
          </div>
          
          {questionAnswerPairs.map((pair, index) => (
            <div key={`pair-${index}`} className="space-y-2 p-3 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Pregunta</Label>
                  <Input
                    value={pair.question}
                    onChange={(e) => updateQuestionAnswerPair(index, 'question', e.target.value)}
                    placeholder="¿Cuál es la capital de Francia?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Respuesta</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={pair.answer}
                      onChange={(e) => updateQuestionAnswerPair(index, 'answer', e.target.value)}
                      placeholder="París"
                      maxLength={gridSize}
                      className="flex-1"
                    />
                    {questionAnswerPairs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestionAnswerPair(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>• Las preguntas se mostrarán como ayuda al estudiante</p>
        <p>• Las respuestas se colocarán automáticamente en la sopa de letras</p>
        <p>• La longitud máxima de cada respuesta es {gridSize} caracteres</p>
        <p>• Se generará una cuadrícula de {gridSize}x{gridSize}</p>
      </div>
    </div>
  );
}

// Componente para configurar crucigrama
interface CrosswordConfigProps {
  questionIndex: number;
  question: FormQuestionData;
  onUpdateQuestion: (index: number, field: keyof FormQuestionData, value: any) => void;
}

function CrosswordConfig({ questionIndex, question, onUpdateQuestion }: CrosswordConfigProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <Label className="text-base font-medium">Configuración de Crucigrama</Label>
      <div className="text-sm text-gray-600">
        <p>La configuración de crucigrama estará disponible próximamente.</p>
      </div>
    </div>
  );
}

function QuestionTypeSelector({ onAddQuestion }: { onAddQuestion: (type: QuestionType) => void }) {
  return (
    <Select onValueChange={(value) => onAddQuestion(value as QuestionType)}>
      <SelectTrigger className="w-auto">
        <Plus className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Agregar pregunta" />
      </SelectTrigger>
      <SelectContent>
        {QUESTION_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {QUESTION_TYPE_LABELS[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface QuestionEditorProps {
  question: FormQuestionData;
  questionIndex: number;
  onUpdateQuestion: (index: number, field: keyof FormQuestionData, value: any) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, field: 'optionText' | 'optionValue' | 'isCorrect', value: string | boolean) => void;
}

function QuestionEditor({
  question,
  questionIndex,
  onUpdateQuestion,
  onAddOption,
  onRemoveOption,
  onUpdateOption
}: QuestionEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor={`question-text-${questionIndex}`}>Texto de la pregunta</Label>
          <Input
            id={`question-text-${questionIndex}`}
            value={question.questionText}
            onChange={(e) => onUpdateQuestion(questionIndex, 'questionText', e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
          />
        </div>
        
        <div>
          <Label htmlFor={`question-description-${questionIndex}`}>Descripción (opcional)</Label>
          <Textarea
            id={`question-description-${questionIndex}`}
            value={question.description || ''}
            onChange={(e) => onUpdateQuestion(questionIndex, 'description', e.target.value)}
            placeholder="Descripción adicional para la pregunta"
            className="min-h-[60px]"
          />
        </div>
        
        {['TEXT', 'TEXTAREA', 'open_text', 'EMAIL'].includes(question.questionType) && (
          <div>
            <Label htmlFor={`question-placeholder-${questionIndex}`}>Placeholder (opcional)</Label>
            <Input
              id={`question-placeholder-${questionIndex}`}
              value={question.placeholder || ''}
              onChange={(e) => onUpdateQuestion(questionIndex, 'placeholder', e.target.value)}
              placeholder="Texto de ayuda para el usuario"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`question-required-${questionIndex}`}
            checked={question.isRequired}
            onCheckedChange={(checked) => onUpdateQuestion(questionIndex, 'isRequired', checked)}
          />
          <Label htmlFor={`question-required-${questionIndex}`}>Pregunta obligatoria</Label>
        </div>
      </div>
      
      {/* Opciones para preguntas de opción múltiple */}
      {['MULTIPLE_CHOICE', 'CHECKBOX'].includes(question.questionType) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Opciones</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddOption(questionIndex)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar opción
            </Button>
          </div>
          
          {question.options?.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                value={option.optionText}
                onChange={(e) => onUpdateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                placeholder={`Opción ${optionIndex + 1}`}
              />
              <Input
                value={option.optionValue}
                onChange={(e) => onUpdateOption(questionIndex, optionIndex, 'optionValue', e.target.value)}
                placeholder="Valor"
                className="w-32"
              />
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={option.isCorrect || false}
                  onCheckedChange={(checked) => onUpdateOption(questionIndex, optionIndex, 'isCorrect', checked)}
                />
                <Label className="text-xs text-gray-600">Correcta</Label>
              </div>
              {question.options && question.options.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOption(questionIndex, optionIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Configuración para escala de calificación */}
      {question.questionType === 'RATING_SCALE' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`question-min-${questionIndex}`}>Valor mínimo</Label>
            <Input
              id={`question-min-${questionIndex}`}
              type="number"
              value={question.minValue || 1}
              onChange={(e) => onUpdateQuestion(questionIndex, 'minValue', parseInt(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor={`question-max-${questionIndex}`}>Valor máximo</Label>
            <Input
              id={`question-max-${questionIndex}`}
              type="number"
              value={question.maxValue || 5}
              onChange={(e) => onUpdateQuestion(questionIndex, 'maxValue', parseInt(e.target.value))}
              min={2}
              max={10}
            />
          </div>
        </div>
      )}
      
      {/* Longitud máxima para campos de texto */}
        {['TEXT', 'TEXTAREA', 'open_text'].includes(question.questionType) && (
        <div>
          <Label htmlFor={`question-maxlength-${questionIndex}`}>Longitud máxima (opcional)</Label>
          <Input
            id={`question-maxlength-${questionIndex}`}
            type="number"
            value={question.maxLength || ''}
            onChange={(e) => onUpdateQuestion(questionIndex, 'maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="255"
            min={1}
          />
        </div>
      )}
      
      {/* Configuración para sopa de letras */}
      {question.questionType === 'WORD_SEARCH' && (
        <WordSearchConfig
          questionIndex={questionIndex}
          question={question}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}
      
      {/* Configuración para crucigrama */}
      {question.questionType === 'CROSSWORD' && (
        <CrosswordConfig
          questionIndex={questionIndex}
          question={question}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}
      
      <Separator className="my-4" />
      
      {/* Sección de respuestas correctas y retroalimentación */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Configuración de Respuestas</Label>
        
        {/* Respuesta correcta para preguntas de texto */}
        {['TEXT', 'TEXTAREA', 'open_text', 'EMAIL'].includes(question.questionType) && (
          <div>
            <Label htmlFor={`question-correct-answer-${questionIndex}`}>Respuesta correcta (opcional)</Label>
            <Textarea
              id={`question-correct-answer-${questionIndex}`}
              value={question.correctAnswer || ''}
              onChange={(e) => onUpdateQuestion(questionIndex, 'correctAnswer', e.target.value)}
              placeholder="Escribe la respuesta correcta esperada"
              className="min-h-[60px]"
            />
          </div>
        )}
        
        {/* Opciones correctas para preguntas de opción múltiple */}
        {['MULTIPLE_CHOICE', 'CHECKBOX'].includes(question.questionType) && question.options && (
          <div>
            <Label>Opciones correctas</Label>
            <div className="space-y-2 mt-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Switch
                    id={`correct-option-${questionIndex}-${optionIndex}`}
                    checked={question.correctOptionIds?.includes(option.optionValue) || false}
                    onCheckedChange={(checked) => {
                      const currentCorrectIds = question.correctOptionIds || [];
                      let newCorrectIds;
                      if (checked) {
                        newCorrectIds = [...currentCorrectIds, option.optionValue];
                      } else {
                        newCorrectIds = currentCorrectIds.filter(id => id !== option.optionValue);
                      }
                      onUpdateQuestion(questionIndex, 'correctOptionIds', newCorrectIds);
                    }}
                  />
                  <Label htmlFor={`correct-option-${questionIndex}-${optionIndex}`}>
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Explicación */}
        <div>
          <Label htmlFor={`question-explanation-${questionIndex}`}>Explicación (opcional)</Label>
          <Textarea
            id={`question-explanation-${questionIndex}`}
            value={question.explanation || ''}
            onChange={(e) => onUpdateQuestion(questionIndex, 'explanation', e.target.value)}
            placeholder="Explica por qué esta es la respuesta correcta"
            className="min-h-[60px]"
          />
        </div>
        
        {/* Retroalimentación para respuestas incorrectas */}
        <div>
          <Label htmlFor={`question-incorrect-feedback-${questionIndex}`}>Retroalimentación para respuestas incorrectas (opcional)</Label>
          <Textarea
            id={`question-incorrect-feedback-${questionIndex}`}
            value={question.incorrectFeedback || ''}
            onChange={(e) => onUpdateQuestion(questionIndex, 'incorrectFeedback', e.target.value)}
            placeholder="Mensaje que se mostrará cuando la respuesta sea incorrecta"
            className="min-h-[60px]"
          />
        </div>
        
        {/* Puntos */}
        <div>
          <Label htmlFor={`question-points-${questionIndex}`}>Puntos (opcional)</Label>
          <Input
            id={`question-points-${questionIndex}`}
            type="number"
            value={question.points || ''}
            onChange={(e) => onUpdateQuestion(questionIndex, 'points', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0"
            min={0}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}