'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Mail, Hash, Type, AlignLeft, CheckSquare, List, Star, ToggleLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import type { CreateFormFormData, QuestionType } from '@/types';

interface FormPreviewProps {
  formData: CreateFormFormData;
  onSubmit?: (data: any) => void;
  isReadOnly?: boolean;
}

const getQuestionIcon = (type: QuestionType) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch (type) {
    case 'TEXT':
      return <Type {...iconProps} />;
    case 'TEXTAREA':
      return <AlignLeft {...iconProps} />;
    case 'open_text':
      return <AlignLeft {...iconProps} />;
    case 'MULTIPLE_CHOICE':
      return <List {...iconProps} />;
    case 'CHECKBOX':
      return <CheckSquare {...iconProps} />;
    case 'RATING_SCALE':
      return <Star {...iconProps} />;
    case 'NUMBER':
      return <Hash {...iconProps} />;
    case 'EMAIL':
      return <Mail {...iconProps} />;
    case 'DATE':
      return <Calendar {...iconProps} />;
    case 'TIME':
      return <Clock {...iconProps} />;
    case 'BOOLEAN':
      return <ToggleLeft {...iconProps} />;
    default:
      return <Type {...iconProps} />;
  }
};

export function FormPreview({ formData, onSubmit, isReadOnly = false }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [checkboxValues, setCheckboxValues] = useState<Record<string, string[]>>({});

  // Crear esquema de validación dinámico basado en las preguntas
  const createValidationSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    formData.questions.forEach((question, index) => {
      const fieldName = `question_${index}`;
      
      if (question.isRequired) {
        switch (question.questionType) {
          case 'TEXT':
          case 'TEXTAREA':
          case 'EMAIL':
            schemaFields[fieldName] = z.string().min(1, 'Este campo es obligatorio');
            break;
          case 'NUMBER':
            schemaFields[fieldName] = z.number({ message: 'Este campo es obligatorio' });
            break;
          case 'MULTIPLE_CHOICE':
            schemaFields[fieldName] = z.string().min(1, 'Debe seleccionar una opción');
            break;
          case 'CHECKBOX':
            schemaFields[fieldName] = z.array(z.string()).min(1, 'Debe seleccionar al menos una opción');
            break;
          case 'RATING_SCALE':
            schemaFields[fieldName] = z.number().min(1, 'Debe proporcionar una calificación');
            break;
          case 'BOOLEAN':
            schemaFields[fieldName] = z.boolean();
            break;
          case 'DATE':
          case 'TIME':
            schemaFields[fieldName] = z.string().min(1, 'Este campo es obligatorio');
            break;
        }
      } else {
        // Campos opcionales
        switch (question.questionType) {
          case 'TEXT':
          case 'TEXTAREA':
          case 'EMAIL':
          case 'DATE':
          case 'TIME':
            schemaFields[fieldName] = z.string().optional();
            break;
          case 'NUMBER':
          case 'RATING_SCALE':
            schemaFields[fieldName] = z.number().optional();
            break;
          case 'MULTIPLE_CHOICE':
            schemaFields[fieldName] = z.string().optional();
            break;
          case 'CHECKBOX':
            schemaFields[fieldName] = z.array(z.string()).optional();
            break;
          case 'BOOLEAN':
            schemaFields[fieldName] = z.boolean().optional();
            break;
        }
      }
    });
    
    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(createValidationSchema()),
    defaultValues: {}
  });

  const handleSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
    }
  };

  const handleRatingClick = (questionIndex: number, value: number) => {
    const fieldName = `question_${questionIndex}`;
    setRatingValues(prev => ({ ...prev, [fieldName]: value }));
    form.setValue(fieldName, value);
  };

  const handleCheckboxChange = (questionIndex: number, optionValue: string, checked: boolean) => {
    const fieldName = `question_${questionIndex}`;
    const currentValues = checkboxValues[fieldName] || [];
    
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }
    
    setCheckboxValues(prev => ({ ...prev, [fieldName]: newValues }));
    form.setValue(fieldName, newValues);
  };

  const renderQuestion = (question: any, index: number) => {
    const fieldName = `question_${index}`;
    const error = form.formState.errors[fieldName];

    return (
      <Card key={index} className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getQuestionIcon(question.questionType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-medium">
                    {question.questionText}
                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
                
                {question.description && (
                  <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                )}
                
                {question.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={question.imageUrl} 
                      alt="Question image" 
                      className="max-w-full h-auto rounded-lg border"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Question Input */}
            <div className="ml-7">
              {renderQuestionInput(question, index, fieldName)}
              
              {error && (
                <p className="text-sm text-red-500 mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQuestionInput = (question: any, questionIndex: number, fieldName: string) => {
    switch (question.questionType) {
      case 'TEXT':
        return (
          <Input
            placeholder={question.placeholder || 'Ingresa tu respuesta...'}
            maxLength={question.maxLength}
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'TEXTAREA':
        return (
          <Textarea
            placeholder={question.placeholder || 'Ingresa tu respuesta...'}
            maxLength={question.maxLength}
            rows={4}
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'open_text':
        return (
          <Textarea
            placeholder={question.placeholder || 'Escribe tu respuesta detallada...'}
            maxLength={question.maxLength}
            rows={6}
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'EMAIL':
        return (
          <Input
            type="email"
            placeholder={question.placeholder || 'correo@ejemplo.com'}
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            placeholder={question.placeholder || 'Ingresa un número...'}
            min={question.minValue}
            max={question.maxValue}
            disabled={isReadOnly}
            {...form.register(fieldName, { valueAsNumber: true })}
          />
        );

      case 'DATE':
        return (
          <Input
            type="date"
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'TIME':
        return (
          <Input
            type="time"
            disabled={isReadOnly}
            {...form.register(fieldName)}
          />
        );

      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            disabled={isReadOnly}
            onValueChange={(value) => form.setValue(fieldName, value)}
          >
            <div className="space-y-2">
              {question.options?.map((option: any, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.optionValue} id={`${fieldName}_${optionIndex}`} />
                  <Label htmlFor={`${fieldName}_${optionIndex}`} className="font-normal">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {question.options?.map((option: any, optionIndex: number) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldName}_${optionIndex}`}
                  disabled={isReadOnly}
                  checked={(checkboxValues[fieldName] || []).includes(option.optionValue)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(questionIndex, option.optionValue, checked as boolean)
                  }
                />
                <Label htmlFor={`${fieldName}_${optionIndex}`} className="font-normal">
                  {option.optionText}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'RATING_SCALE':
        const minValue = question.minValue || 1;
        const maxValue = question.maxValue || 5;
        const currentRating = ratingValues[fieldName] || 0;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: maxValue - minValue + 1 }, (_, i) => {
                const value = minValue + i;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant={currentRating === value ? "default" : "outline"}
                    size="sm"
                    disabled={isReadOnly}
                    onClick={() => handleRatingClick(questionIndex, value)}
                    className="w-10 h-10"
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{minValue}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        );

      case 'BOOLEAN':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              disabled={isReadOnly}
              onCheckedChange={(checked) => form.setValue(fieldName, checked)}
            />
            <Label className="font-normal">Sí / No</Label>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            Tipo de pregunta no soportado: {question.questionType}
          </div>
        );
    }
  };

  const customStyles = {
    backgroundColor: formData.backgroundColor || '#ffffff',
    fontFamily: formData.fontFamily || 'Inter',
    '--primary-color': formData.primaryColor || '#3b82f6'
  } as React.CSSProperties;

  return (
    <div className="max-w-4xl mx-auto" style={customStyles}>
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{formData.title}</CardTitle>
          {formData.description && (
            <p className="text-gray-600 mt-2">{formData.description}</p>
          )}
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline">
              {formData.questions.length} pregunta{formData.questions.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant={formData.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {formData.status === 'DRAFT' ? 'Borrador' : 
               formData.status === 'PUBLISHED' ? 'Publicado' :
               formData.status === 'CLOSED' ? 'Cerrado' : 'Archivado'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {formData.questions.map((question, index) => renderQuestion(question, index))}
        
        {!isReadOnly && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar respuestas'}
                </Button>
              </div>
              
              {formData.successMessage && (
                <div className="mt-4 text-center">
                  <Separator className="mb-4" />
                  <p className="text-sm text-gray-600">
                    <strong>Mensaje de éxito:</strong> {formData.successMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}