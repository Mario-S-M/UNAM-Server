'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Calendar, Mail, Hash, Type, CheckSquare, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { FormQuestionData, QuestionType, FormAnswerData } from '@/types';
import { useSubmitFormResponse } from '@/lib/hooks/useForms';

interface FormRendererProps {
  formId: string;
  title: string;
  description?: string;
  questions: FormQuestionData[];
  onSubmit?: (answers: FormAnswerData[]) => void;
  className?: string;
}

interface FormAnswers {
  [questionId: string]: string | string[] | number | boolean;
}

const getQuestionIcon = (type: QuestionType) => {
  switch (type) {
    case 'TEXT':
      return <Type className="h-4 w-4" />;
    case 'TEXTAREA':
      return <Type className="h-4 w-4" />;
    case 'open_text':
      return <Type className="h-4 w-4" />;
    case 'EMAIL':
      return <Mail className="h-4 w-4" />;
    case 'NUMBER':
      return <Hash className="h-4 w-4" />;
    case 'DATE':
      return <Calendar className="h-4 w-4" />;
    case 'TIME':
      return <Clock className="h-4 w-4" />;
    case 'MULTIPLE_CHOICE':
      return <Circle className="h-4 w-4" />;
    case 'CHECKBOX':
      return <CheckSquare className="h-4 w-4" />;
    case 'RATING_SCALE':
      return <Star className="h-4 w-4" />;
    case 'BOOLEAN':
      return <CheckSquare className="h-4 w-4" />;
    default:
      return <Type className="h-4 w-4" />;
  }
};

export function FormRenderer({
  formId,
  title,
  description,
  questions,
  onSubmit,
  className
}: FormRendererProps) {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [checkboxValues, setCheckboxValues] = useState<{ [key: string]: string[] }>({});
  
  const { submitResponse, loading } = useSubmitFormResponse();

  // Create dynamic validation schema
  const createValidationSchema = () => {
    const schemaFields: { [key: string]: z.ZodTypeAny } = {};
    
    questions.forEach((question) => {
      const fieldName = `question_${question.id}`;
      
      switch (question.questionType) {
        case 'TEXT':
        case 'TEXTAREA':
          schemaFields[fieldName] = question.isRequired 
            ? z.string().min(1, 'Este campo es obligatorio')
            : z.string().optional();
          break;
        case 'EMAIL':
          schemaFields[fieldName] = question.isRequired
            ? z.string().email('Email inválido').min(1, 'Este campo es obligatorio')
            : z.string().email('Email inválido').optional().or(z.literal(''));
          break;
        case 'NUMBER':
          schemaFields[fieldName] = question.isRequired
            ? z.number({ message: 'Este campo es obligatorio' })
            : z.number().optional();
          break;
        case 'DATE':
        case 'TIME':
          schemaFields[fieldName] = question.isRequired
            ? z.string().min(1, 'Este campo es obligatorio')
            : z.string().optional();
          break;
        case 'MULTIPLE_CHOICE':
          schemaFields[fieldName] = question.isRequired
            ? z.string().min(1, 'Debes seleccionar una opción')
            : z.string().optional();
          break;
        case 'CHECKBOX':
          schemaFields[fieldName] = question.isRequired
            ? z.array(z.string()).min(1, 'Debes seleccionar al menos una opción')
            : z.array(z.string()).optional();
          break;
        case 'RATING_SCALE':
          schemaFields[fieldName] = question.isRequired
            ? z.number().min(1, 'Debes dar una calificación').max(5)
            : z.number().min(0).max(5).optional();
          break;
        case 'BOOLEAN':
          schemaFields[fieldName] = question.isRequired
            ? z.boolean({ message: 'Este campo es obligatorio' })
            : z.boolean().optional();
          break;
      }
    });
    
    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(createValidationSchema()) as any,
    defaultValues: questions.reduce((acc, question) => {
      const fieldName = `question_${question.id}`;
      if (question.questionType === 'CHECKBOX') {
        acc[fieldName] = [];
      } else if (question.questionType === 'RATING_SCALE') {
        acc[fieldName] = 0;
      } else if (question.questionType === 'BOOLEAN') {
        acc[fieldName] = false;
      } else {
        acc[fieldName] = '';
      }
      return acc;
    }, {} as FormAnswers)
  });

  const handleRatingChange = (questionId: string, rating: number) => {
    const fieldName = `question_${questionId}`;
    setRatings(prev => ({ ...prev, [questionId]: rating }));
    form.setValue(fieldName, rating);
  };

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    const fieldName = `question_${questionId}`;
    const currentValues = checkboxValues[questionId] || [];
    
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(value => value !== optionValue);
    }
    
    setCheckboxValues(prev => ({ ...prev, [questionId]: newValues }));
    form.setValue(fieldName, newValues);
  };

  const onFormSubmit = async (data: FormAnswers) => {
    try {
      const answers: FormAnswerData[] = questions.map(question => {
        const fieldName = `question_${question.id}`;
        const value = data[fieldName];
        
        return {
          questionId: question.id!,
          answerText: Array.isArray(value) ? value.join(', ') : String(value || ''),
          answerNumber: question.questionType === 'NUMBER' || question.questionType === 'RATING_SCALE' 
            ? Number(value) || null 
            : null,
          answerBoolean: question.questionType === 'BOOLEAN' ? Boolean(value) : null,
          selectedOptions: question.questionType === 'CHECKBOX' && Array.isArray(value) 
            ? value 
            : question.questionType === 'MULTIPLE_CHOICE' && typeof value === 'string'
            ? [value]
            : []
        };
      });

      if (onSubmit) {
        onSubmit(answers);
      } else {
        await submitResponse({
          formId,
          isAnonymous: true,
          answers
        });
        toast.success('Respuestas enviadas correctamente');
        form.reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error al enviar las respuestas');
    }
  };

  const renderQuestion = (question: FormQuestionData) => {
    const fieldName = `question_${question.id}`;
    const error = form.formState.errors[fieldName];

    return (
      <Card key={question.id} className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-500">
              {getQuestionIcon(question.questionType)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {question.questionText}
                {question.isRequired && (
                  <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                )}
              </CardTitle>
              {question.description && (
                <CardDescription className="mt-2">
                  {question.description}
                </CardDescription>
              )}
            </div>
          </div>
          {question.imageUrl && (
            <div className="mt-4">
              <img 
                src={question.imageUrl} 
                alt="Question image" 
                className="max-w-full h-auto rounded-md border"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {question.questionType === 'TEXT' && (
            <Input
              placeholder="Tu respuesta..."
              {...form.register(fieldName)}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'TEXTAREA' && (
            <Textarea
              placeholder="Tu respuesta..."
              rows={4}
              {...form.register(fieldName)}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'EMAIL' && (
            <Input
              type="email"
              placeholder="tu@email.com"
              {...form.register(fieldName)}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'NUMBER' && (
            <Input
              type="number"
              placeholder="0"
              {...form.register(fieldName, { valueAsNumber: true })}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'DATE' && (
            <Input
              type="date"
              {...form.register(fieldName)}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'TIME' && (
            <Input
              type="time"
              {...form.register(fieldName)}
              className={cn(error && "border-red-500")}
            />
          )}
          
          {question.questionType === 'MULTIPLE_CHOICE' && question.options && (
            <RadioGroup
              value={form.watch(fieldName) as string}
              onValueChange={(value) => form.setValue(fieldName, value)}
              className={cn(error && "border border-red-500 rounded-md p-3")}
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.optionValue} id={`${fieldName}-${option.id}`} />
                  <Label htmlFor={`${fieldName}-${option.id}`} className="cursor-pointer">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.questionType === 'CHECKBOX' && question.options && (
            <div className={cn("space-y-3", error && "border border-red-500 rounded-md p-3")}>
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldName}-${option.id}`}
                    checked={(checkboxValues[question.id!] || []).includes(option.optionValue)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(question.id!, option.optionValue, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${fieldName}-${option.id}`} className="cursor-pointer">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          {question.questionType === 'RATING_SCALE' && (
            <div className={cn("flex items-center gap-2", error && "border border-red-500 rounded-md p-3")}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRatingChange(question.id!, rating)}
                  className={cn(
                    "p-1 h-8 w-8",
                    ratings[question.id!] >= rating
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-300 hover:text-gray-400"
                  )}
                >
                  <Star className={cn(
                    "h-5 w-5",
                    ratings[question.id!] >= rating ? "fill-current" : ""
                  )} />
                </Button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {ratings[question.id!] || 0}/5
              </span>
            </div>
          )}
          
          {question.questionType === 'BOOLEAN' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldName}
                checked={form.watch(fieldName) as boolean}
                onCheckedChange={(checked) => form.setValue(fieldName, checked as boolean)}
                className={cn(error && "border-red-500")}
              />
              <Label htmlFor={fieldName} className="cursor-pointer">
                Sí, acepto / Verdadero
              </Label>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error.message as string}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-gray-600 text-lg">{description}</p>
        )}
        <Separator className="mt-4" />
      </div>
      
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {questions.map(renderQuestion)}
        
        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-32"
          >
            {loading ? 'Enviando...' : 'Enviar Respuestas'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormRenderer;