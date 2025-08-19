'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Target, Users, Clock, Star, Award, Calendar, Globe, Palette, Image } from 'lucide-react';

interface Language {
  id: string;
  name: string;
  eslogan_atractivo: string;
  descripcion_corta?: string;
  descripcion_completa?: string;
  nivel?: string;
  duracion_total_horas?: number;
  color_tema?: string;
  icono_curso?: string;
  imagen_hero?: string;
  badge_destacado?: string;

  idioma_origen?: string;
  idioma_destino?: string;
  certificado_digital: boolean;
  puntuacion_promedio: number;
  featured: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  icons: string[];
  isActive: boolean;
}

const GET_LANGUAGE_BY_ID = gql`
  query GetLanguageById($id: ID!) {
    lenguage(id: $id) {
      id
      name
      eslogan_atractivo
      descripcion_corta
      descripcion_completa
      nivel
      duracion_total_horas
      color_tema
      icono_curso
      imagen_hero
      badge_destacado
  
      idioma_origen
      idioma_destino
      certificado_digital
      puntuacion_promedio
      featured
      fecha_creacion
      fecha_actualizacion
      icons
      isActive
    }
  }
`;

export default function LanguageDetailPage() {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_LANGUAGE_BY_ID, {
    variables: { id: params.id },
    skip: !params.id,
  });

  const language = data?.lenguage;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando idioma...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error al cargar el idioma</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Idioma no encontrado</p>
      </div>
    );
  }

  const getDifficultyColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico':
        return 'bg-green-100 text-green-800';
      case 'Básico-Intermedio':
        return 'bg-blue-100 text-blue-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Intermedio-Avanzado':
        return 'bg-orange-100 text-orange-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (nivel: string) => {
    return nivel || 'No especificado';
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
        {/* Background Image or Gradient */}
        {language.imagen_hero ? (
          <>
            <img 
              src={language.imagen_hero} 
              alt={language.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 if (e.currentTarget.parentElement) {
                   e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${language.color_tema || '#3B82F6'}, ${language.color_tema ? language.color_tema + '80' : '#1E40AF'})`;
                 }
               }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{ 
              background: `linear-gradient(135deg, ${language.color_tema || '#3B82F6'}, ${language.color_tema ? language.color_tema + '80' : '#1E40AF'})` 
            }}
          />
        )}
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="p-8 text-white w-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-5xl drop-shadow-lg">
                {(language.icono_curso && language.icono_curso.trim()) || (language.icons && language.icons.length > 0 ? language.icons[0] : '🌍')}
              </div>
              {language.badge_destacado && (
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  <Award className="h-4 w-4 mr-2" />
                  {language.badge_destacado}
                </Badge>
              )}
            </div>
            <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{language.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">{language.eslogan_atractivo}</p>
          </div>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-yellow-50 rounded-full">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Puntuación</p>
                <p className="text-3xl font-bold text-gray-900">{language.puntuacion_promedio.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Nivel</p>
                <Badge className={getDifficultyColor(language.nivel)} variant="secondary">
                  {getDifficultyLabel(language.nivel)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-green-50 rounded-full">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Duración</p>
                <p className="text-3xl font-bold text-gray-900">{language.duracion_total_horas}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Información del Curso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Descripción</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-3">{language.descripcion_corta}</p>
              {language.descripcion_completa && (
                <p className="text-gray-600 leading-relaxed">{language.descripcion_completa}</p>
              )}
            </div>
          </div>
          
          {/* Course Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Language Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center border-b pb-2">
                <Globe className="h-4 w-4 mr-2" />
                Información del Idioma
              </h4>
              <div className="space-y-3">
                {language.idioma_origen && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Idioma origen</span>
                    <span className="text-sm font-semibold text-gray-800">{language.idioma_origen}</span>
                  </div>
                )}
                {language.idioma_destino && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Idioma destino</span>
                    <span className="text-sm font-semibold text-gray-800">{language.idioma_destino}</span>
                  </div>
                )}

              </div>
            </div>
            
            {/* Certification and Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center border-b pb-2">
                <Award className="h-4 w-4 mr-2" />
                Certificación y Estado
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-600">Certificado digital</span>
                  <Badge variant={language.certificado_digital ? "default" : "secondary"}>
                    {language.certificado_digital ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-600">Curso destacado</span>
                  <Badge variant={language.featured ? "default" : "secondary"}>
                    {language.featured ? "Sí" : "No"}
                  </Badge>
                </div>
                {language.badge_destacado && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Badge</span>
                    <Badge variant="outline">{language.badge_destacado}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Dates Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center border-b pb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Información de Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {language.fecha_creacion && (
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-600">Fecha de creación</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {language.fecha_creacion ? new Date(parseInt(language.fecha_creacion)).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No disponible'}
                  </span>
                </div>
              )}
              {language.fecha_actualizacion && (
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-600">Última actualización</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {language.fecha_actualizacion ? new Date(parseInt(language.fecha_actualizacion)).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No disponible'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Icons - Hidden per user request */}
      {/* {language.icons && language.icons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Iconos del Curso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {language.icons.map((icon: string, index: number) => (
                <div key={index} className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                  <span className="text-2xl">{icon}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}