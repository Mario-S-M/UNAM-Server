'use client';

import React, { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Trash2, Plus, X, Image } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { QUESTION_TYPE_LABELS } from '@/schemas/form-forms';
import type { CreateFormFormData, QuestionType } from '@/types';

interface QuestionEditorProps {
  questionIndex: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
}

export function QuestionEditor({ questionIndex, form, onRemove }: QuestionEditorProps) {
  const questionData = form.watch(`questions.${questionIndex}`);
  const questionType = questionData?.questionType;

  const addOption = useCallback(() => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption = {
      optionText: `Opción ${currentOptions.length + 1}`,
      optionValue: `option${currentOptions.length + 1}`,
      orderIndex: currentOptions.length,
      isCorrect: false
    };
    
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption]);
  }, [form, questionIndex]);

  const removeOption = useCallback((optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.filter((_: any, index: number) => index !== optionIndex)
      .map((option: any, index: number) => ({ ...option, orderIndex: index }));
    
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  }, [form, questionIndex]);

  const renderQuestionTypeSpecificFields = () => {
    switch (questionType) {
      case 'MULTIPLE_CHOICE':
      case 'CHECKBOX':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Opciones</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar opción
              </Button>
            </div>
            
            <div className="space-y-2">
              {(questionData?.options || []).map((option: any, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    placeholder={`Opción ${optionIndex + 1}`}
                    value={option.optionText}
                    onChange={(e) => {
                      form.setValue(
                        `questions.${questionIndex}.options.${optionIndex}.optionText`,
                        e.target.value
                      );
                    }}
                  />
                  <Input
                    placeholder="Valor"
                    value={option.optionValue}
                    onChange={(e) => {
                      form.setValue(
                        `questions.${questionIndex}.options.${optionIndex}.optionValue`,
                        e.target.value
                      );
                    }}
                    className="w-32"
                  />
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={option.isCorrect || false}
                      onCheckedChange={(checked) => {
                        if (checked && questionType === 'MULTIPLE_CHOICE') {
                          // Para preguntas de opción múltiple, solo una puede ser correcta
                          const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
                          const updatedOptions = currentOptions.map((opt: any, idx: number) => ({
                            ...opt,
                            isCorrect: idx === optionIndex
                          }));
                          form.setValue(`questions.${questionIndex}.options`, updatedOptions);
                        } else {
                          // Para checkbox, permite múltiples respuestas correctas
                          form.setValue(
                            `questions.${questionIndex}.options.${optionIndex}.isCorrect`,
                            checked
                          );
                        }
                      }}
                    />
                    <Label className="text-xs text-gray-600">Correcta</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(optionIndex)}
                    disabled={(questionData?.options || []).length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'RATING_SCALE':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`minValue-${questionIndex}`}>Valor mínimo</Label>
              <Input
                id={`minValue-${questionIndex}`}
                type="number"
                min="1"
                max="10"
                {...form.register(`questions.${questionIndex}.minValue`, { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxValue-${questionIndex}`}>Valor máximo</Label>
              <Input
                id={`maxValue-${questionIndex}`}
                type="number"
                min="2"
                max="10"
                {...form.register(`questions.${questionIndex}.maxValue`, { valueAsNumber: true })}
              />
            </div>
          </div>
        );

      case 'TEXT':
      case 'TEXTAREA':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`placeholder-${questionIndex}`}>Texto de ayuda</Label>
              <Input
                id={`placeholder-${questionIndex}`}
                placeholder="Ej: Ingresa tu respuesta aquí..."
                {...form.register(`questions.${questionIndex}.placeholder`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxLength-${questionIndex}`}>Longitud máxima (caracteres)</Label>
              <Input
                id={`maxLength-${questionIndex}`}
                type="number"
                min="1"
                max="5000"
                {...form.register(`questions.${questionIndex}.maxLength`, { valueAsNumber: true })}
              />
            </div>
          </div>
        );

      case 'NUMBER':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`minValue-${questionIndex}`}>Valor mínimo</Label>
              <Input
                id={`minValue-${questionIndex}`}
                type="number"
                {...form.register(`questions.${questionIndex}.minValue`, { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxValue-${questionIndex}`}>Valor máximo</Label>
              <Input
                id={`maxValue-${questionIndex}`}
                type="number"
                {...form.register(`questions.${questionIndex}.maxValue`, { valueAsNumber: true })}
              />
            </div>
          </div>
        );

      case 'DATE':
      case 'TIME':
      case 'EMAIL':
        return (
          <div className="space-y-2">
            <Label htmlFor={`placeholder-${questionIndex}`}>Texto de ayuda</Label>
            <Input
              id={`placeholder-${questionIndex}`}
              placeholder="Ej: Selecciona una fecha..."
              {...form.register(`questions.${questionIndex}.placeholder`)}
            />
          </div>
        );

      case 'BOOLEAN':
        return (
          <div className="space-y-2">
            <Label>Configuración de pregunta Sí/No</Label>
            <p className="text-sm text-gray-500">Esta pregunta se mostrará como un interruptor Sí/No</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Pregunta {questionIndex + 1}
          </Badge>
          <Badge variant="outline">
            {QUESTION_TYPE_LABELS[questionType as QuestionType]}
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <Label htmlFor={`questionText-${questionIndex}`}>Texto de la pregunta *</Label>
        <Input
          id={`questionText-${questionIndex}`}
          placeholder="Escribe tu pregunta aquí..."
          {...form.register(`questions.${questionIndex}.questionText`)}
        />
        {(form.formState.errors.questions as any)?.[questionIndex]?.questionText && (
          <p className="text-sm text-red-500">
            {(form.formState.errors.questions as any)?.[questionIndex]?.questionText?.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor={`description-${questionIndex}`}>Descripción (opcional)</Label>
        <Textarea
          id={`description-${questionIndex}`}
          placeholder="Proporciona más contexto sobre esta pregunta..."
          rows={2}
          {...form.register(`questions.${questionIndex}.description`)}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor={`imageUrl-${questionIndex}`}>URL de imagen (opcional)</Label>
        <div className="flex gap-2">
          <Input
            id={`imageUrl-${questionIndex}`}
            placeholder="https://ejemplo.com/imagen.jpg"
            {...form.register(`questions.${questionIndex}.imageUrl`)}
          />
          <Button type="button" variant="outline" size="sm">
            <Image className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Type-specific fields */}
      {renderQuestionTypeSpecificFields()}

      <Separator />

      {/* Question Settings */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Pregunta obligatoria</Label>
          <p className="text-sm text-gray-500">Los usuarios deben responder esta pregunta</p>
        </div>
        <Switch
          checked={questionData?.isRequired || false}
            onCheckedChange={(checked) => {
              form.setValue(`questions.${questionIndex}.isRequired`, checked);
          }}
        />
      </div>
    </div>
  );
}