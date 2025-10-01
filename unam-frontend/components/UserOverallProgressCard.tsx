'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, TrendingUp, Trophy } from 'lucide-react';
import { UserOverallProgress } from '@/lib/hooks/useUserProgress';

interface UserOverallProgressCardProps {
  overallProgress: UserOverallProgress;
  loading?: boolean;
}

export function UserOverallProgressCard({ overallProgress, loading }: UserOverallProgressCardProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!overallProgress) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos de progreso disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5" />
          Progreso General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progreso General */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progreso Total</span>
            <span className="text-sm text-muted-foreground">
              {overallProgress.overallProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallProgress.overallProgressPercentage} className="h-3" />
        </div>

        {/* Estadísticas de Contenidos */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Contenidos
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completados</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {overallProgress.completedContents}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {overallProgress.totalContents}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas de Ejercicios */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ejercicios
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completadas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                  {overallProgress.completedActivities}
                </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                  {overallProgress.totalActivities}
                </p>
            </div>
          </div>
        </div>

        {/* Badge de Estado */}
        <div className="flex justify-center pt-4 border-t">
          <Badge 
            variant={overallProgress.overallProgressPercentage === 100 ? 'default' : 'secondary'}
            className="px-4 py-1"
          >
            {overallProgress.overallProgressPercentage === 100 
              ? '🎉 ¡Todo Completado!' 
              : `${overallProgress.overallProgressPercentage.toFixed(0)}% Completado`
            }
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}