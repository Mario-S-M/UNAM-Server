'use client';

import { Badge } from "@/components/ui/badge";
import { Target, Clock, Calendar, BookOpen, CheckCircle, Star, Zap } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SkillDetails() {
  const { selectedSkill, isLoadingSkill } = useDashboard();

  if (!selectedSkill && !isLoadingSkill) return null;

  if (isLoadingSkill || !selectedSkill) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-80" />
                <Skeleton className="h-5 w-60" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-18" />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex justify-between w-full">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }





  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border overflow-hidden">
        {/* Header */}
        <div className="border-b">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Badge variant="outline">
                     {selectedSkill.difficulty}
                   </Badge>
                   <Badge variant="outline" className="text-xs">
                     {selectedSkill.level?.name}
                   </Badge>
                 </div>
                <CardTitle className="text-3xl font-bold">
                   {selectedSkill.name}
                 </CardTitle>
                 <CardDescription className="text-lg">
                   {selectedSkill.lenguage?.name}
                 </CardDescription>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border">
                 <BookOpen className="h-8 w-8" />
               </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div>
                 <div className="flex items-center gap-2 mb-3">
                   <BookOpen className="h-5 w-5" />
                   <h3 className="text-lg font-semibold">Descripción</h3>
                 </div>
                 <p className="leading-relaxed">{selectedSkill.description}</p>
               </div>
              
              {selectedSkill.objectives && (
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <Target className="h-5 w-5" />
                     <h3 className="text-lg font-semibold">Objetivos</h3>
                   </div>
                   <p className="leading-relaxed">{selectedSkill.objectives}</p>
                 </div>
               )}
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              {selectedSkill.prerequisites && (
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <CheckCircle className="h-5 w-5" />
                     <h3 className="text-lg font-semibold">Prerrequisitos</h3>
                   </div>
                   <p className="leading-relaxed">{selectedSkill.prerequisites}</p>
                 </div>
               )}
              
              {selectedSkill.tags && selectedSkill.tags.length > 0 && (
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <Star className="h-5 w-5" />
                     <h3 className="text-lg font-semibold">Etiquetas</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {selectedSkill.tags.map((tag, index) => (
                       <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                         {tag}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </CardContent>

        <Separator />
        
        <CardFooter className="px-8 py-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
             <div className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               <span className="font-medium">
                 {selectedSkill.estimatedHours ? `${selectedSkill.estimatedHours} horas estimadas` : 'Tiempo no especificado'}
               </span>
             </div>
             <div className="flex items-center gap-2">
               <Calendar className="h-5 w-5" />
               <span className="font-medium">
                 Creado el {new Date(selectedSkill.createdAt).toLocaleDateString('es-ES', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </span>
             </div>
           </div>
         </CardFooter>
      </Card>
    </div>
  );
}