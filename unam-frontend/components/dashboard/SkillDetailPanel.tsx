'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, Clock, BookOpen, Award, Calendar, Globe } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

const formatObjectives = (objectives: string) => {
  // Si los objetivos están separados por saltos de línea, convertirlos en lista
  const lines = objectives.split('\n').filter(line => line.trim() !== '');
  if (lines.length > 1) {
    return lines;
  }
  // Si no hay saltos de línea, intentar separar por puntos o comas
  const items = objectives.split(/[.;]/).filter(item => item.trim() !== '');
  if (items.length > 1) {
    return items.map(item => item.trim());
  }
  // Si no se puede dividir, devolver como un solo elemento
  return [objectives];
};

const formatPrerequisites = (prerequisites: string) => {
  // Si los prerequisitos están separados por saltos de línea, convertirlos en lista
  const lines = prerequisites.split('\n').filter(line => line.trim() !== '');
  if (lines.length > 1) {
    return lines;
  }
  // Si no hay saltos de línea, intentar separar por puntos o comas
  const items = prerequisites.split(/[.;]/).filter(item => item.trim() !== '');
  if (items.length > 1) {
    return items.map(item => item.trim());
  }
  // Si no se puede dividir, devolver como un solo elemento
  return [prerequisites];
};

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return "Fecha no disponible";
    }
    
    try {
      // Si es un timestamp en milisegundos (string de números), convertirlo a número
      const timestamp = /^\d+$/.test(dateString) ? parseInt(dateString, 10) : dateString;
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Fecha no disponible";
    }
  };

export default function SkillDetailPanel() {
  const { selectedSkill, isLoadingSkill } = useDashboard();

  if (isLoadingSkill) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-700">Cargando detalles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedSkill) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">¡Bienvenido al Dashboard!</h2>
            <p className="text-lg mb-4">
              Selecciona una habilidad del panel lateral para ver los detalles aquí.
            </p>
            <p className="text-sm text-gray-400">
              Navega por los idiomas → niveles → habilidades
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-3xl mb-3 text-gray-900">{selectedSkill.name}</CardTitle>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">
                {selectedSkill.difficulty}
              </Badge>
              {selectedSkill.estimatedHours && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedSkill.estimatedHours}h
                </Badge>
              )}
              {selectedSkill.level && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {selectedSkill.level.name}
                </Badge>
              )}
              {selectedSkill.lenguage && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {selectedSkill.lenguage.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">{selectedSkill.description}</p>
        </div>

        {selectedSkill.objectives && (
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <Target className="h-5 w-5 mr-2" />
              Objetivos de Aprendizaje
            </h3>
            <div className="border p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2">
                {formatObjectives(selectedSkill.objectives).map((objective, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed">
                    {objective.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedSkill.prerequisites && (
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <BookOpen className="h-5 w-5 mr-2" />
              Prerrequisitos
            </h3>
            <div className="border p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2">
                {formatPrerequisites(selectedSkill.prerequisites).map((prerequisite, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed">
                    {prerequisite.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedSkill.tags && selectedSkill.tags.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkill.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Creado:</span>
              <span className="ml-1">{formatDate(selectedSkill.createdAt)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Award className="h-4 w-4 mr-2" />
              <span className="font-medium">Estado:</span>
              <span className="ml-1">{selectedSkill.isActive ? 'Activo' : 'Inactivo'}</span>
            </div>
            {selectedSkill.level && (
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="font-medium">Nivel:</span>
                <span className="ml-1">{selectedSkill.level.name} ({selectedSkill.level.difficulty})</span>
              </div>
            )}
            {selectedSkill.lenguage && (
              <div className="flex items-center text-gray-600">
                <Globe className="h-4 w-4 mr-2" />
                <span className="font-medium">Idioma:</span>
                <span className="ml-1">{selectedSkill.lenguage.name}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}