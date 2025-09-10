"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Copy, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { gql, useQuery, useMutation } from '@apollo/client';
import FormBuilder from '@/components/FormBuilder';
import { FormQuestionData } from '@/schemas/form-forms';

// GraphQL Queries
const GET_FORMS = gql`
  query GetForms {
    forms {
      id
      title
      description
      status
      allowAnonymous
      allowMultipleResponses
      createdAt
      updatedAt
      questions {
        id
        questionText
        questionType
        isRequired
      }
    }
  }
`;

const CREATE_FORM = gql`
  mutation CreateForm($input: CreateFormInput!) {
    createForm(input: $input) {
      id
      title
      description
      status
    }
  }
`;

const DELETE_FORM = gql`
  mutation DeleteForm($id: ID!) {
    deleteForm(id: $id)
  }
`;

interface FormListItem {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  allowAnonymous: boolean;
  allowMultipleResponses: boolean;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    questionText: string;
    questionType: string;
    isRequired: boolean;
  }>;
}

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-red-100 text-red-800',
  ARCHIVED: 'bg-yellow-100 text-yellow-800'
};

const STATUS_LABELS = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  CLOSED: 'Cerrado',
  ARCHIVED: 'Archivado'
};

export default function FormsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formQuestions, setFormQuestions] = useState<FormQuestionData[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Query para obtener formularios
  const { data: formsData, loading, error, refetch } = useQuery(GET_FORMS);

  // Mutación para crear formulario
  const [createForm, { loading: createLoading }] = useMutation(CREATE_FORM, {
    onCompleted: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setFormQuestions([]);
      setFormTitle('');
      setFormDescription('');
      toast.success('Formulario creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el formulario');
      console.error('Error creating form:', error);
    }
  });

  // Mutación para eliminar formulario
  const [deleteForm] = useMutation(DELETE_FORM, {
    onCompleted: () => {
      refetch();
      toast.success('Formulario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el formulario');
      console.error('Error deleting form:', error);
    }
  });

  const handleCreateForm = async () => {
    if (!formTitle.trim()) {
      toast.error('El título es requerido');
      return;
    }

    if (formQuestions.length === 0) {
      toast.error('El formulario debe tener al menos una pregunta');
      return;
    }

    try {
      await createForm({
        variables: {
          input: {
            title: formTitle,
            description: formDescription,
            status: 'DRAFT',
            allowAnonymous: true,
            allowMultipleResponses: false,
            contentId: 'default-content-id',
            questions: formQuestions.map((q, index) => ({
              questionText: q.questionText,
              questionType: q.questionType,
              orderIndex: index,
              isRequired: q.isRequired,
              allowMultiline: q.allowMultiline,
              description: q.description,
              placeholder: q.placeholder,
              imageUrl: q.imageUrl,
              minValue: q.minValue,
              maxValue: q.maxValue,
              maxLength: q.maxLength,
              correctAnswer: q.correctAnswer,
              correctOptionIds: q.correctOptionIds,
              explanation: q.explanation,
              incorrectFeedback: q.incorrectFeedback,
              points: q.points,
              options: q.options?.map((opt, optIndex) => ({
                optionText: opt.optionText,
                optionValue: opt.optionValue,
                orderIndex: optIndex,
                imageUrl: opt.imageUrl,
                color: opt.color,
                isCorrect: opt.isCorrect
              }))
            }))
          }
        }
      });
    } catch (error) {
      console.error('Error in handleCreateForm:', error);
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      await deleteForm({ variables: { id } });
    }
  };

  const handleQuestionsChange = (questions: FormQuestionData[]) => {
    setFormQuestions(questions);
  };

  const forms: FormListItem[] = formsData?.forms || [];
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error al cargar los formularios</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administración de Formularios</h1>
          <p className="text-gray-600 mt-1">Gestiona formularios dinámicos y sus respuestas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formulario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Formulario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Título del formulario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descripción del formulario (opcional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preguntas</label>
                <FormBuilder
                  initialQuestions={formQuestions}
                  onQuestionsChange={handleQuestionsChange}
                  disabled={createLoading}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateForm}
                  disabled={createLoading}
                >
                  {createLoading ? 'Creando...' : 'Crear Formulario'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar formularios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ALL">Todos los estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="CLOSED">Cerrado</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Formularios ({filteredForms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Cargando formularios...</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron formularios</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Preguntas</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form: FormListItem) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{form.title}</p>
                        {form.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {form.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[form.status]}>
                        {STATUS_LABELS[form.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{form.questions.length}</TableCell>
                    <TableCell>
                      {new Date(form.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Estadísticas
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteForm(form.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}