"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { FormQuestionData, QuestionType, QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/schemas/form-forms';
import { z } from 'zod';

interface FormBuilderProps {
  initialQuestions?: FormQuestionData[];
  onQuestionsChange: (questions: FormQuestionData[]) => void;
  disabled?: boolean;
}

interface QuestionOption {
  id: string;
  optionText: string;
  optionValue: string;
  orderIndex: number;
  isCorrect: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultQuestion = (type: QuestionType, orderIndex: number): FormQuestionData => {
  const baseQuestion: FormQuestionData = {
    id: generateId(),
    questionText: '',
    questionType: type,
    orderIndex,
    isRequired: true,
    allowMultiline: false,
    options: []
  };

  // Configuración específica por tipo de pregunta
  switch (type) {
    case 'MULTIPLE_CHOICE':
    case 'CHECKBOX':
      return {
        ...baseQuestion,
        options: [
          { id: generateId(), optionText: '', optionValue: '', orderIndex: 0, isCorrect: false },
          { id: generateId(), optionText: '', optionValue: '', orderIndex: 1, isCorrect: false }
        ]
      };
    case 'RATING_SCALE':
      return {
        ...baseQuestion,
        minValue: 1,
        maxValue: 5
      };
    case 'BOOLEAN':
      return {
        ...baseQuestion,
        options: [
          { id: generateId(), optionText: 'Sí', optionValue: 'true', orderIndex: 0, isCorrect: false },
          { id: generateId(), optionText: 'No', optionValue: 'false', orderIndex: 1, isCorrect: false }
        ]
      };
    case 'TEXTAREA':
      return {
        ...baseQuestion,
        allowMultiline: true,
        maxLength: 500
      };
    case 'TEXT':
    case 'open_text':
      return {
        ...baseQuestion,
        maxLength: 255
      };
    default:
      return baseQuestion;
  }
};

export function FormBuilder({ initialQuestions = [], onQuestionsChange, disabled = false }: FormBuilderProps) {
  const [questions, setQuestions] = useState<FormQuestionData[]>(initialQuestions);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const updateQuestions = useCallback((newQuestions: FormQuestionData[]) => {
    setQuestions(newQuestions);
    onQuestionsChange(newQuestions);
  }, [onQuestionsChange]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion = createDefaultQuestion(type, questions.length);
    const newQuestions = [...questions, newQuestion];
    updateQuestions(newQuestions);
    toast.success(`Pregunta de tipo "${QUESTION_TYPE_LABELS[type]}" agregada`);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, orderIndex: i }));
    updateQuestions(newQuestions);
    toast.success('Pregunta eliminada');
  };

  const updateQuestion = (index: number, updates: Partial<FormQuestionData>) => {
    const newQuestions = questions.map((q, i) => 
      i === index ? { ...q, ...updates } : q
    );
    updateQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const newOption: QuestionOption = {
      id: generateId(),
      optionText: '',
      optionValue: '',
      orderIndex: question.options.length,
      isCorrect: false
    };
    
    updateQuestion(questionIndex, {
      options: [...question.options, newOption]
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
      .map((opt, i) => ({ ...opt, orderIndex: i }));
    
    updateQuestion(questionIndex, { options: newOptions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuestionOption>) => {
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const newOptions = question.options.map((opt, i) => 
      i === optionIndex ? { ...opt, ...updates } : opt
    );
    
    updateQuestion(questionIndex, { options: newOptions });
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    
    // Actualizar orderIndex
    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, orderIndex: i }));
    updateQuestions(reorderedQuestions);
  };

  const renderQuestionEditor = (question: FormQuestionData, index: number) => {
    const needsOptions = ['MULTIPLE_CHOICE', 'CHECKBOX', 'BOOLEAN'].includes(question.questionType);
    const needsRange = question.questionType === 'RATING_SCALE';
    const needsLength = ['TEXT', 'TEXTAREA', 'open_text'].includes(question.questionType);

    return (
      <Card key={question.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Badge variant="outline">{QUESTION_TYPE_LABELS[question.questionType]}</Badge>
              <span className="text-sm text-muted-foreground">Pregunta {index + 1}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(index)}
              disabled={disabled}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Texto de la pregunta */}
          <div className="space-y-2">
            <Label htmlFor={`question-text-${index}`}>Texto de la pregunta *</Label>
            <Textarea
              id={`question-text-${index}`}
              placeholder="Escribe tu pregunta aquí..."
              value={question.questionText}
              onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
              disabled={disabled}
              rows={2}
            />
          </div>

          {/* Descripción opcional */}
          <div className="space-y-2">
            <Label htmlFor={`question-desc-${index}`}>Descripción (opcional)</Label>
            <Input
              id={`question-desc-${index}`}
              placeholder="Descripción adicional para la pregunta"
              value={question.description || ''}
              onChange={(e) => updateQuestion(index, { description: e.target.value })}
              disabled={disabled}
            />
          </div>

          {/* Configuraciones específicas por tipo */}
          {needsLength && (
            <div className="space-y-2">
              <Label htmlFor={`max-length-${index}`}>Longitud máxima</Label>
              <Input
                id={`max-length-${index}`}
                type="number"
                min="1"
                max="5000"
                value={question.maxLength || ''}
                onChange={(e) => updateQuestion(index, { maxLength: parseInt(e.target.value) || undefined })}
                disabled={disabled}
              />
            </div>
          )}

          {needsRange && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`min-value-${index}`}>Valor mínimo</Label>
                <Input
                  id={`min-value-${index}`}
                  type="number"
                  min="1"
                  max="10"
                  value={question.minValue || ''}
                  onChange={(e) => updateQuestion(index, { minValue: parseInt(e.target.value) || undefined })}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`max-value-${index}`}>Valor máximo</Label>
                <Input
                  id={`max-value-${index}`}
                  type="number"
                  min="1"
                  max="10"
                  value={question.maxValue || ''}
                  onChange={(e) => updateQuestion(index, { maxValue: parseInt(e.target.value) || undefined })}
                  disabled={disabled}
                />
              </div>
            </div>
          )}

          {/* Opciones para preguntas de selección */}
          {needsOptions && question.options && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Opciones de respuesta</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(index)}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar opción
                </Button>
              </div>
              
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => updateOption(index, optionIndex, { isCorrect: checked as boolean })}
                    disabled={disabled}
                  />
                  <Input
                    placeholder="Texto de la opción"
                    value={option.optionText}
                    onChange={(e) => updateOption(index, optionIndex, { optionText: e.target.value })}
                    disabled={disabled}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={disabled || question.options!.length <= 2}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Respuesta correcta para preguntas abiertas */}
          {['TEXT', 'TEXTAREA', 'open_text'].includes(question.questionType) && (
            <div className="space-y-2">
              <Label htmlFor={`correct-answer-${index}`}>Respuesta correcta (opcional)</Label>
              <Input
                id={`correct-answer-${index}`}
                placeholder="Respuesta esperada para evaluación automática"
                value={question.correctAnswer || ''}
                onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                disabled={disabled}
              />
            </div>
          )}

          {/* Configuraciones adicionales */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${index}`}
                checked={question.isRequired}
                onCheckedChange={(checked) => updateQuestion(index, { isRequired: checked as boolean })}
                disabled={disabled}
              />
              <Label htmlFor={`required-${index}`}>Pregunta obligatoria</Label>
            </div>
            
            {['TEXT', 'TEXTAREA', 'open_text'].includes(question.questionType) && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`multiline-${index}`}
                  checked={question.allowMultiline}
                  onCheckedChange={(checked) => updateQuestion(index, { allowMultiline: checked as boolean })}
                  disabled={disabled}
                />
                <Label htmlFor={`multiline-${index}`}>Permitir múltiples líneas</Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Constructor de Formulario</h3>
          <p className="text-sm text-muted-foreground">
            Agrega y configura las preguntas de tu formulario
          </p>
        </div>
        <Badge variant="secondary">
          {questions.length} pregunta{questions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Botones para agregar preguntas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar Pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {QUESTION_TYPES.map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addQuestion(type)}
                disabled={disabled}
                className="justify-start"
              >
                <Plus className="h-4 w-4 mr-1" />
                {QUESTION_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de preguntas */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question, index) => renderQuestionEditor(question, index))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay preguntas en este formulario</p>
              <p className="text-sm">Usa los botones de arriba para agregar preguntas</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default FormBuilder;