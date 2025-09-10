'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { UserProgress } from '@/lib/hooks/useUserProgress';

interface UserProgressCardProps {
  progress: UserProgress;
  showDetails?: boolean;
}

export function UserProgressCard({ progress, showDetails = true }: UserProgressCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Progreso del Contenido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">
              {progress.progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={progress.progressPercentage} className="h-2" />
        </div>

        {showDetails && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Completadas</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {progress.completedActivities}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {progress.totalActivities}
                </p>
              </div>
            </div>

            {progress.lastActivityDate && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Última actividad: {formatDate(progress.lastActivityDate)}
                </span>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <Badge variant={progress.progressPercentage === 100 ? 'default' : 'secondary'}>
                {progress.progressPercentage === 100 ? 'Completado' : 'En Progreso'}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}