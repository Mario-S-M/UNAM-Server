"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import QuestionRenderer from './QuestionRenderer';
import { FormQuestionData, CreateFormResponseSchema, FormAnswerData } from '@/schemas/form-forms';
import { z } from 'zod';

interface FormData {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestionData[];
  allowAnonymous: boolean;
  allowMultipleResponses: boolean;
  successMessage?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
}

interface FormResponseProps {
  form: FormData;
  onSubmit: (response: z.infer<typeof CreateFormResponseSchema>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  contentId?: string;
}

export function FormResponse({
  form,
  onSubmit,
  onCancel,
  isSubmitting = false,
  contentId
}: FormResponseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitterInfo, setSubmitterInfo] = useState({
    name: '',
    email: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = form.questions[currentQuestionIndex];
  const totalQuestions = form.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Validar respuesta actual
  const validateCurrentAnswer = (): boolean => {
    if (!currentQuestion) return true;

    const answer = answers[currentQuestion.id || ''];
    const newErrors = { ...errors };
    delete newErrors[currentQuestion.id || ''];

    // Si la pregunta es requerida y no hay respuesta
    if (currentQuestion.isRequired && !answer) {
      newErrors[currentQuestion.id || ''] = 'Esta pregunta es requerida';
      setErrors(newErrors);
      return false;
    }

    // Validaciones específicas por tipo
    if (answer) {
      switch (currentQuestion.questionType) {
        case 'TEXT':
        case 'TEXTAREA':
        case 'open_text':
        case 'EMAIL':
          if (typeof answer !== 'string' || answer.trim().length === 0) {
            newErrors[currentQuestion.id || ''] = 'Respuesta inválida';
          } else if (currentQuestion.maxLength && answer.length > currentQuestion.maxLength) {
            newErrors[currentQuestion.id || ''] = `Máximo ${currentQuestion.maxLength} caracteres`;
          }
          break;

        case 'NUMBER':
          if (typeof answer !== 'number' || isNaN(answer)) {
            newErrors[currentQuestion.id || ''] = 'Debe ser un número válido';
          } else {
            if (currentQuestion.minValue && answer < currentQuestion.minValue) {
              newErrors[currentQuestion.id || ''] = `Valor mínimo: ${currentQuestion.minValue}`;
            }
            if (currentQuestion.maxValue && answer > currentQuestion.maxValue) {
              newErrors[currentQuestion.id || ''] = `Valor máximo: ${currentQuestion.maxValue}`;
            }
          }
          break;

        case 'MULTIPLE_CHOICE':
          if (!Array.isArray(answer) || answer.length === 0) {
            newErrors[currentQuestion.id || ''] = 'Selecciona al menos una opción';
          }
          break;

        case 'CHECKBOX':
        case 'BOOLEAN':
          if (!answer || answer.length === 0) {
            newErrors[currentQuestion.id || ''] = 'Selecciona una opción';
          }
          break;

        case 'RATING_SCALE':
          const minVal = currentQuestion.minValue || 1;
          const maxVal = currentQuestion.maxValue || 5;
          if (typeof answer !== 'number' || answer < minVal || answer > maxVal) {
            newErrors[currentQuestion.id || ''] = `Valor debe estar entre ${minVal} y ${maxVal}`;
          }
          break;

        case 'EMAIL':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(answer)) {
            newErrors[currentQuestion.id || ''] = 'Email inválido';
          }
          break;

        case 'DATE':
          if (!/^\d{4}-\d{2}-\d{2}$/.test(answer)) {
            newErrors[currentQuestion.id || ''] = 'Fecha inválida';
          }
          break;

        case 'TIME':
          if (!/^\d{2}:\d{2}$/.test(answer)) {
            newErrors[currentQuestion.id || ''] = 'Hora inválida';
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar a la siguiente pregunta
  const handleNext = () => {
    if (validateCurrentAnswer()) {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Última pregunta, mostrar resumen
        setIsCompleted(true);
      }
    }
  };

  // Navegar a la pregunta anterior
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Actualizar respuesta
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Limpiar error si existe
    if (errors[questionId]) {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    // Validar todas las respuestas
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    form.questions.forEach(question => {
      const answer = answers[question.id || ''];
      if (question.isRequired && !answer) {
        newErrors[question.id || ''] = 'Esta pregunta es requerida';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Por favor completa todas las preguntas requeridas');
      return;
    }

    // Preparar respuestas en el formato correcto
    const formattedAnswers: FormAnswerData[] = form.questions.map(question => {
      const answer = answers[question.id || ''];
      const baseAnswer = {
        questionId: question.id || '',
        questionType: question.questionType
      };

      switch (question.questionType) {
        case 'TEXT':
        case 'TEXTAREA':
        case 'open_text':
        case 'EMAIL':
          return { ...baseAnswer, textAnswer: answer || '' };
        
        case 'MULTIPLE_CHOICE':
          return { ...baseAnswer, selectedOptionIds: answer || [] };
        
        case 'CHECKBOX':
        case 'BOOLEAN':
          return { ...baseAnswer, selectedOptionIds: Array.isArray(answer) ? answer : [answer] };
        
        case 'NUMBER':
          return { ...baseAnswer, numericAnswer: answer?.toString() || '0' };
        
        case 'RATING_SCALE':
          return { ...baseAnswer, numericAnswer: answer?.toString() || '1' };
        
        case 'DATE':
          return { ...baseAnswer, textAnswer: answer || '' };
        
        case 'TIME':
          return { ...baseAnswer, textAnswer: answer || '' };
        
        default:
          return { ...baseAnswer, textAnswer: answer?.toString() || '' };
      }
    });

    const response = {
      formId: form.id,
      contentId,
      isAnonymous,
      answers: formattedAnswers,
      submitterName: isAnonymous ? undefined : submitterInfo.name,
      submitterEmail: isAnonymous ? undefined : submitterInfo.email
    };

    try {
      await onSubmit(response);
      toast.success(form.successMessage || 'Formulario enviado exitosamente');
    } catch (error) {
      toast.error('Error al enviar el formulario');
      console.error('Error submitting form:', error);
    }
  };

  // Renderizar resumen final
  const renderSummary = () => {
    const answeredQuestions = form.questions.filter(q => answers[q.id || '']);
    const requiredQuestions = form.questions.filter(q => q.isRequired);
    const answeredRequired = requiredQuestions.filter(q => answers[q.id || '']);

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Resumen de Respuestas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Preguntas respondidas:</span>
              <span className="ml-2">{answeredQuestions.length} de {totalQuestions}</span>
            </div>
            <div>
              <span className="font-medium">Preguntas requeridas:</span>
              <span className="ml-2">{answeredRequired.length} de {requiredQuestions.length}</span>
            </div>
          </div>

          {form.allowAnonymous && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Enviar respuesta de forma anónima</span>
              </label>
            </div>
          )}

          {!isAnonymous && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre (opcional)</label>
                <input
                  type="text"
                  value={submitterInfo.name}
                  onChange={(e) => setSubmitterInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email (opcional)</label>
                <input
                  type="email"
                  value={submitterInfo.email}
                  onChange={(e) => setSubmitterInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCompleted(false)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Revisar Respuestas
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredRequired.length < requiredQuestions.length}
              className="flex-1"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isCompleted) {
    return renderSummary();
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <QuestionRenderer
          question={currentQuestion}
          value={answers[currentQuestion.id || '']}
          onChange={(value) => handleAnswerChange(currentQuestion.id || '', value)}
          error={errors[currentQuestion.id || '']}
          disabled={isSubmitting}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor corrige los errores antes de continuar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default FormResponse;