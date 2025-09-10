'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Mail, 
  FileText, 
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useGetFormResponses } from '@/lib/hooks/useForms';
import type { QuestionType } from '@/types';

interface FormResponse {
  id: string;
  respondentName?: string;
  respondentEmail?: string;
  isAnonymous: boolean;
  submittedAt: string;
  answers: {
    id: string;
    questionId: string;
    textAnswer?: string;
    numericAnswer?: number;
    booleanAnswer?: boolean;
    selectedOptions?: {
      id: string;
      optionText: string;
      optionValue: string;
    }[];
    question: {
      id: string;
      questionText: string;
      questionType: QuestionType;
      options?: {
        id: string;
        optionText: string;
        optionValue: string;
      }[];
    };
  }[];
}

interface FormResponseManagerProps {
  formId: string;
  formTitle: string;
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function FormResponseManager({ 
  formId, 
  formTitle, 
  className 
}: FormResponseManagerProps) {
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const { data: responses, loading, error } = useGetFormResponses(formId);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando respuestas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <p className="text-red-600">Error al cargar las respuestas</p>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin respuestas</h3>
        <p className="text-gray-600">Aún no se han recibido respuestas para este formulario.</p>
      </div>
    );
  }

  const generateAnalytics = () => {
    const analytics: { [questionId: string]: any } = {};
    
    responses.forEach((response: FormResponse) => {
      response.answers.forEach((answer) => {
        const questionId = answer.questionId;
        const questionType = answer.question.questionType;
        
        if (!analytics[questionId]) {
          analytics[questionId] = {
            question: answer.question,
            responses: [],
            summary: {}
          };
        }
        
        analytics[questionId].responses.push(answer);
      });
    });
    
    // Generate summaries for each question
    Object.keys(analytics).forEach(questionId => {
      const questionData = analytics[questionId];
      const questionType = questionData.question.questionType;
      const answers = questionData.responses;
      
      switch (questionType) {
        case 'MULTIPLE_CHOICE':
        case 'CHECKBOX':
          const optionCounts: { [key: string]: number } = {};
          answers.forEach((answer: FormResponse['answers'][0]) => {
            if (answer.selectedOptions) {
              answer.selectedOptions.forEach((option: { id: string; optionText: string; optionValue: string }) => {
                optionCounts[option.optionText] = (optionCounts[option.optionText] || 0) + 1;
              });
            }
          });
          questionData.summary = {
            type: 'options',
            data: Object.entries(optionCounts).map(([name, value]) => ({ name, value }))
          };
          break;
          
        case 'RATING_SCALE':
          const ratings = answers
            .map((answer: FormResponse['answers'][0]) => answer.numericAnswer)
            .filter((rating: number | null | undefined): rating is number => rating !== null && rating !== undefined);
          const average = ratings.length > 0 
            ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
            : 0;
          const distribution: { [key: string]: number } = {};
          ratings.forEach((rating: number) => {
            distribution[rating] = (distribution[rating] || 0) + 1;
          });
          questionData.summary = {
            type: 'rating',
            average: Math.round(average * 10) / 10,
            distribution: Object.entries(distribution).map(([name, value]: [string, number]) => ({ 
              name: `${name} estrella${name === '1' ? '' : 's'}`, 
              value 
            }))
          };
          break;
          
        case 'NUMBER':
          const numbers = answers
            .map((answer: FormResponse['answers'][0]) => answer.numericAnswer)
            .filter((num: number | null | undefined): num is number => num !== null && num !== undefined);
          const numAverage = numbers.length > 0 
            ? numbers.reduce((sum: number, num: number) => sum + num, 0) / numbers.length 
            : 0;
          questionData.summary = {
            type: 'numeric',
            average: Math.round(numAverage * 100) / 100,
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            count: numbers.length
          };
          break;
          
        case 'BOOLEAN':
          const booleanCounts = { 'Sí': 0, 'No': 0 };
          answers.forEach((answer: FormResponse['answers'][0]) => {
            if (answer.booleanAnswer === true) booleanCounts['Sí']++;
            if (answer.booleanAnswer === false) booleanCounts['No']++;
          });
          questionData.summary = {
            type: 'boolean',
            data: Object.entries(booleanCounts).map(([name, value]) => ({ name, value }))
          };
          break;
          
        default:
          questionData.summary = {
            type: 'text',
            count: answers.length
          };
      }
    });
    
    return analytics;
  };

  const analytics = generateAnalytics();

  const exportResponses = () => {
    try {
      const csvContent = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${formTitle}_respuestas.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Respuestas exportadas exitosamente');
    } catch (error) {
      console.error('Error exporting responses:', error);
      toast.error('Error al exportar las respuestas');
    }
  };

  const generateCSV = () => {
    if (!responses || responses.length === 0) return '';
    
    const headers = ['ID Respuesta', 'Fecha', 'Respondiente', 'Email'];
    const questions = responses[0].answers.map((answer: FormResponse['answers'][0]) => answer.question.questionText);
    headers.push(...questions);
    
    const rows = responses.map((response: FormResponse) => {
      const row = [
        response.id,
        format(new Date(response.submittedAt), 'dd/MM/yyyy HH:mm', { locale: es }),
        response.isAnonymous ? 'Anónimo' : (response.respondentName || 'Sin nombre'),
        response.isAnonymous ? '' : (response.respondentEmail || '')
      ];
      
      response.answers.forEach((answer: FormResponse['answers'][0]) => {
        let value = '';
        if (answer.textAnswer) value = answer.textAnswer;
        else if (answer.numericAnswer !== null) value = String(answer.numericAnswer);
        else if (answer.booleanAnswer !== null) value = answer.booleanAnswer ? 'Sí' : 'No';
        else if (answer.selectedOptions) {
          value = answer.selectedOptions.map(opt => opt.optionText).join(', ');
        }
        row.push(value);
      });
      
      return row;
    });
    
    const csvContent = [headers, ...rows]
      .map(row => row.map((field: string | number) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    return csvContent;
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{formTitle}</h2>
          <p className="text-gray-600 mt-1">
            {responses.length} respuesta{responses.length !== 1 ? 's' : ''} recibida{responses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={exportResponses} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Respuestas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(analytics).map(([questionId, data]: [string, any]) => (
              <Card key={questionId}>
                <CardHeader>
                  <CardTitle className="text-lg">{data.question.questionText}</CardTitle>
                  <CardDescription>
                    Tipo: {data.question.questionType} • {data.responses.length} respuesta{data.responses.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.summary.type === 'options' && (
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.summary.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {data.summary.type === 'rating' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{data.summary.average}</div>
                        <div className="text-sm text-gray-600">Promedio de calificación</div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={data.summary.distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: any) => `${props.name}: ${props.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {data.summary.distribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {data.summary.type === 'numeric' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{data.summary.average}</div>
                        <div className="text-sm text-gray-600">Promedio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data.summary.min}</div>
                        <div className="text-sm text-gray-600">Mínimo</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{data.summary.max}</div>
                        <div className="text-sm text-gray-600">Máximo</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{data.summary.count}</div>
                        <div className="text-sm text-gray-600">Respuestas</div>
                      </div>
                    </div>
                  )}
                  
                  {data.summary.type === 'boolean' && (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.summary.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `${props.name}: ${props.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.summary.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  
                  {data.summary.type === 'text' && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{data.summary.count}</div>
                      <div className="text-sm text-gray-600">Respuestas de texto</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="grid gap-4">
            {responses.map((response: FormResponse) => (
              <Card key={response.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedResponse(response)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {response.isAnonymous ? 'Anónimo' : (response.respondentName || 'Sin nombre')}
                        </span>
                      </div>
                      {!response.isAnonymous && response.respondentEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {response.respondentEmail}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(response.submittedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {response.answers.length} respuesta{response.answers.length !== 1 ? 's' : ''}
                    </span>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedResponse(null)}>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detalle de Respuesta</CardTitle>
                  <CardDescription>
                    {selectedResponse.isAnonymous ? 'Respuesta anónima' : selectedResponse.respondentName}
                    {' • '}
                    {format(new Date(selectedResponse.submittedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="max-h-[60vh]">
              <CardContent className="space-y-6">
                {selectedResponse.answers.map((answer, index) => (
                  <div key={answer.id}>
                    <div className="space-y-2">
                      <h4 className="font-medium">{answer.question.questionText}</h4>
                      <div className="pl-4 border-l-2 border-gray-200">
                        {answer.textAnswer && (
                          <p className="text-gray-700">{answer.textAnswer}</p>
                        )}
                        {answer.numericAnswer !== null && answer.numericAnswer !== undefined && (
                          <p className="text-gray-700">{answer.numericAnswer}</p>
                        )}
                        {answer.booleanAnswer !== null && answer.booleanAnswer !== undefined && (
                          <Badge variant={answer.booleanAnswer ? "default" : "secondary"}>
                            {answer.booleanAnswer ? 'Sí' : 'No'}
                          </Badge>
                        )}
                        {answer.selectedOptions && answer.selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {answer.selectedOptions.map((option) => (
                              <Badge key={option.id} variant="outline">
                                {option.optionText}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < selectedResponse.answers.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FormResponseManager;