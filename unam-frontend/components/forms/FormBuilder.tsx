'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, GripVertical, Trash2, Eye, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CreateFormSchema, QUESTION_TYPES, QUESTION_TYPE_LABELS, FORM_STATUSES, FORM_STATUS_LABELS } from '@/schemas/form-forms';
import { useForms } from '@/lib/hooks/useForms';
import type { CreateFormFormData, QuestionType, FormStatus } from '@/types';

import { QuestionEditor } from './QuestionEditor';
import { FormPreview } from './FormPreview';

interface FormBuilderProps {
  contentId: string;
  onFormCreated?: (formId: string) => void;
  onCancel?: () => void;
}

export function FormBuilder({ contentId, onFormCreated, onCancel }: FormBuilderProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { createForm, loading } = useForms();

  const form = useForm({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      title: '',
      description: '',
      contentId,
      status: 'DRAFT' as const,
      allowAnonymous: true,
      allowMultipleResponses: false,
      successMessage: '¡Gracias por tu respuesta!',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      questions: []
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'questions'
  });

  const addQuestion = useCallback((type: QuestionType) => {
    const newQuestion = {
      questionText: '',
      questionType: type,
      orderIndex: fields.length,
      isRequired: false,
      allowMultiline: false,
      description: '',
      placeholder: '',
      imageUrl: '',
      options: ['MULTIPLE_CHOICE', 'CHECKBOX'].includes(type) ? [
        { optionText: 'Opción 1', optionValue: 'option1', orderIndex: 0, isCorrect: false },
        { optionText: 'Opción 2', optionValue: 'option2', orderIndex: 1, isCorrect: false }
      ] : undefined,
      minValue: type === 'RATING_SCALE' ? 1 : undefined,
      maxValue: type === 'RATING_SCALE' ? 5 : undefined,
      maxLength: ['TEXT', 'TEXTAREA', 'open_text'].includes(type) ? 255 : undefined
    };
    
    append(newQuestion);
  }, [append, fields.length]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      move(sourceIndex, destinationIndex);
      
      // Actualizar orderIndex de todas las preguntas
      const updatedQuestions = form.getValues('questions');
      updatedQuestions.forEach((_, index) => {
        form.setValue(`questions.${index}.orderIndex`, index);
      });
    }
  }, [move, form]);

  const handleSubmit = useCallback(async (data: CreateFormFormData) => {
    try {
      const result = await createForm(data);
      if (result?.id) {
        toast.success('Formulario creado exitosamente');
        onFormCreated?.(result.id);
      }
    } catch (error) {
      console.error('Error al crear formulario:', error);
      toast.error('Error al crear el formulario');
    }
  }, [createForm, onFormCreated]);

  const formData = form.watch() as CreateFormFormData;

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Vista previa del formulario</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Volver al editor
            </Button>
            <Button onClick={form.handleSubmit(handleSubmit)} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar formulario'}
            </Button>
          </div>
        </div>
        <FormPreview formData={formData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Constructor de formularios</h2>
        <div className="flex gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuración del formulario</DialogTitle>
              </DialogHeader>
              <FormSettings form={form} />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPreviewMode(true)}
            disabled={fields.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            Vista previa
          </Button>
          
          <Button 
            onClick={form.handleSubmit(handleSubmit)} 
            disabled={loading || fields.length === 0}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
          
          {onCancel && (
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Form Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del formulario *</Label>
              <Input
                id="title"
                placeholder="Ingresa el título del formulario"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={form.watch('status')} 
                onValueChange={(value: FormStatus) => form.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  {FORM_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {FORM_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe el propósito del formulario (opcional)"
              {...form.register('description')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Preguntas
            <QuestionTypeSelector onAddQuestion={addQuestion} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay preguntas aún. Agrega una pregunta para comenzar.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg p-4 bg-white ${
                              snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <div className="flex-1">
                                <QuestionEditor
                                  questionIndex={index}
                                  form={form}
                                  onRemove={() => remove(index)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para seleccionar tipo de pregunta
function QuestionTypeSelector({ onAddQuestion }: { onAddQuestion: (type: QuestionType) => void }) {
  return (
    <Select onValueChange={(value: QuestionType) => onAddQuestion(value)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Agregar pregunta" />
      </SelectTrigger>
      <SelectContent>
        {QUESTION_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {QUESTION_TYPE_LABELS[type]}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Componente para configuración avanzada del formulario
function FormSettings({ form }: { form: any }) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Apariencia</TabsTrigger>
        <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="successMessage">Mensaje de éxito</Label>
          <Textarea
            id="successMessage"
            placeholder="Mensaje que se mostrará después de enviar el formulario"
            {...form.register('successMessage')}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Color principal</Label>
            <Input
              id="primaryColor"
              type="color"
              {...form.register('primaryColor')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Color de fondo</Label>
            <Input
              id="backgroundColor"
              type="color"
              {...form.register('backgroundColor')}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Fuente</Label>
          <Select 
            value={form.watch('fontFamily')} 
            onValueChange={(value) => form.setValue('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value="behavior" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir respuestas anónimas</Label>
            <p className="text-sm text-gray-500">Los usuarios pueden responder sin identificarse</p>
          </div>
          <Switch
            checked={form.watch('allowAnonymous')}
            onCheckedChange={(checked) => form.setValue('allowAnonymous', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir múltiples respuestas</Label>
            <p className="text-sm text-gray-500">Los usuarios pueden responder más de una vez</p>
          </div>
          <Switch
            checked={form.watch('allowMultipleResponses')}
            onCheckedChange={(checked) => form.setValue('allowMultipleResponses', checked)}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}