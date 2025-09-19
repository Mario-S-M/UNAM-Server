"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface Question {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

interface OTPWordSearchGameProps {
  searchItems: string[];
  instruction?: string;
  questionTitle?: string;
  onComplete?: (results: { correct: number; total: number }) => void;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
}

export function OTPWordSearchGame({
  searchItems = [],
  instruction,
  questionTitle,
  onComplete,
  disabled = false,
  showValidation = false,
  error
}: OTPWordSearchGameProps) {
  // Detectar si es una pregunta del verbo "to be" para agrupar las respuestas
  const toBeParts = ['am', 'is', 'are', 'was', 'were', 'be', 'being', 'been'];
  const searchItemsLower = searchItems.map(item => item.toLowerCase());
  const isToBeVerb = toBeParts.some(part => searchItemsLower.includes(part));
  
  // Generar preguntas a partir de searchItems
  const questions: Question[] = isToBeVerb && questionTitle?.includes('verbo to be') 
    ? [{
        id: 'question-0',
        question: questionTitle,
        answer: searchItems.map(item => item.toUpperCase()).join(', '),
        hint: `Escribe las palabras separadas por comas: ${searchItems.join(', ')}`
      }]
    : searchItems.map((item, index) => ({
        id: `question-${index}`,
        question: questionTitle || `Encuentra la palabra: ${item}`,
        answer: item.toUpperCase(),
        hint: `Inicia con la letra: ${item.charAt(0).toUpperCase()}`
      }));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);



  // Manejar cambio en el input OTP
  const handleOTPChange = (questionId: string, value: string) => {
    // Solo permitir letras y limitar la longitud
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const cleanValue = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ]/g, '').slice(0, question.answer.length);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: cleanValue
    }));

    // Auto-verificar cuando se complete la respuesta
    if (cleanValue.length === question.answer.length) {
      setTimeout(() => checkAnswer(questionId), 100);
    }
  };

  // Manejar cambio en un slot individual
  const handleSlotChange = (questionId: string, slotIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const currentAnswer = answers[questionId] || '';
    const answerArray = currentAnswer.padEnd(question.answer.length, ' ').split('');
    
    // Solo permitir una letra por slot
    const cleanValue = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ]/g, '').slice(-1);
    answerArray[slotIndex] = cleanValue;
    
    const newAnswer = answerArray.join('').trimEnd();
    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }));

    // Comentado: Auto-verificación eliminada para permitir completar todo antes de verificar
    // const trimmedAnswer = newAnswer.trim();
    // if (trimmedAnswer.length === question.answer.length && trimmedAnswer.replace(/\s+/g, '').length === question.answer.length) {
    //   setTimeout(() => checkAnswer(questionId), 100);
    // }

    // Mover al siguiente campo automáticamente
    if (cleanValue && slotIndex < question.answer.length - 1) {
      const nextInput = document.getElementById(`otp-${questionId}-${slotIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  // Verificar respuesta
  const checkAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    const userAnswer = answers[questionId]?.trim();
    
    if (!question || !userAnswer) return;

    // Limpiar espacios en blanco de la respuesta del usuario
    const cleanUserAnswer = userAnswer.replace(/\s+/g, '').toUpperCase();
    const correctAnswer = question.answer.toUpperCase();
    
    console.log('Verificando respuesta:', {
      questionId,
      originalUserAnswer: userAnswer,
      cleanUserAnswer,
      originalCorrectAnswer: question.answer,
      correctAnswer,
      match: cleanUserAnswer === correctAnswer,
      lengths: {
        clean: cleanUserAnswer.length,
        correct: correctAnswer.length
      }
    });

    // Comparar sin importar mayúsculas/minúsculas y espacios
    if (cleanUserAnswer === correctAnswer) {
      if (!completedQuestions.has(questionId)) {
        const newCompletedQuestions = new Set([...completedQuestions, questionId]);
        setCompletedQuestions(newCompletedQuestions);
        
        const successMessage = 'Respuesta correcta';
        toast.success(successMessage);

        // Verificar si el juego está completo
        if (newCompletedQuestions.size === questions.length) {
          setGameCompleted(true);
          const completionMessage = 'Felicidades, has completado todos los ejercicios';
          toast.success(completionMessage);
          
          if (onComplete) {
            onComplete({ correct: newCompletedQuestions.size, total: questions.length });
          }
        }
      }
    } else {
      const errorMessage = 'Respuesta incorrecta';
      toast.error(errorMessage);
    }
  };

  // Verificar todas las respuestas al final
  const checkAllAnswers = () => {
    let correctCount = 0;
    const results: { questionId: string; questionNumber: number; isCorrect: boolean; userAnswer: string; correctAnswer: string; isAnswered: boolean }[] = [];
    
    console.log('Estado actual de respuestas:', answers);
    console.log('Preguntas:', questions);
    
    questions.forEach((question, index) => {
      const userAnswer = answers[question.id]?.trim() || '';
      const isAnswered = userAnswer.length > 0;
      
      let isCorrect = false;
      
      // Si es una pregunta del verbo "to be" (respuesta múltiple)
      if (question.answer.includes(', ')) {
        // Normalizar respuestas del usuario y correctas
        const userWords = userAnswer.toUpperCase().split(',').map(w => w.trim()).filter(w => w.length > 0).sort();
        const correctWords = question.answer.toUpperCase().split(', ').map(w => w.trim()).sort();
        
        console.log('Verificación múltiple:', {
          userWords,
          correctWords,
          match: JSON.stringify(userWords) === JSON.stringify(correctWords)
        });
        
        isCorrect = isAnswered && JSON.stringify(userWords) === JSON.stringify(correctWords);
      } else {
        // Verificación normal para respuestas individuales
        const cleanUserAnswer = userAnswer.replace(/\s+/g, '').toUpperCase();
        const correctAnswer = question.answer.toUpperCase();
        isCorrect = isAnswered && cleanUserAnswer === correctAnswer;
      }
      
      console.log(`Pregunta ${index + 1}:`, {
        questionId: question.id,
        userAnswer,
        isAnswered,
        correctAnswer: question.answer,
        isCorrect
      });
      
      if (isCorrect) {
        correctCount++;
      }
      
      // Formatear correctAnswer para evitar mostrar JSON
      let formattedCorrectAnswer = question.answer;
      try {
        const parsed = JSON.parse(question.answer);
        if (parsed.words && Array.isArray(parsed.words)) {
          formattedCorrectAnswer = parsed.words.join(', ').toUpperCase();
        }
      } catch (e) {
        // Si no es JSON, usar la respuesta tal como está
        formattedCorrectAnswer = question.answer;
      }
      
      results.push({
        questionId: question.id,
        questionNumber: index + 1,
        isCorrect,
        userAnswer,
        correctAnswer: formattedCorrectAnswer,
        isAnswered
      });
    });
    
    // Mostrar resultados
    results.forEach(result => {
      if (!result.isAnswered) {
        toast.error(`Pregunta ${result.questionNumber}: No respondida. Esta pregunta no fue contestada.`);
      } else if (result.isCorrect) {
        toast.success(`Pregunta ${result.questionNumber}: Respuesta correcta`);
      } else {
        toast.error(`Pregunta ${result.questionNumber}: Respuesta incorrecta. La respuesta correcta es: ${result.correctAnswer}`);
      }
    });
    
    // Marcar como completado
    setGameCompleted(true);
    
    if (onComplete) {
      onComplete({ correct: correctCount, total: questions.length });
    }
  };

  // Reiniciar juego
  const resetGame = () => {
    setAnswers({});
    setCompletedQuestions(new Set());
    setGameCompleted(false);
    const resetMessage = 'Juego reiniciado';
    toast.info(resetMessage);
  };





  return (
    <Card className={cn(error && "border-red-500")}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Ejercicio de Preguntas y Respuestas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Responde las preguntas escribiendo las letras en los campos correspondientes
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controles */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={checkAllAnswers}
            disabled={disabled || gameCompleted}
          >
            <Check className="h-4 w-4 mr-1" />
            Verificar Respuestas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            disabled={disabled}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reiniciar
          </Button>
        </div>

        {/* Progreso */}
        <div className="flex items-center justify-between">
          <Badge variant={gameCompleted ? "default" : "outline"} className="text-sm">
            {gameCompleted ? (
              <><Check className="h-3 w-3 mr-1" />Completado</>
            ) : (
              `${completedQuestions.size} / ${questions.length} completadas`
            )}
          </Badge>
        </div>

        {/* Preguntas */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isCompleted = completedQuestions.has(question.id);
            const currentAnswer = answers[question.id] || '';
            
            return (
              <div 
                key={question.id} 
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  isCompleted 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="space-y-4">
                  {/* Pregunta */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-gray-900">
                        {index + 1}. {question.question}
                      </Label>
                      {question.hint && (
                        <p className="text-sm text-gray-600 mt-1">
                          Pista: {question.hint}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Correcto
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Campo de respuesta */}
                  <div className="space-y-2">
                    {question.answer.includes(', ') ? (
                      // Campo de texto libre para respuestas múltiples
                      <>
                        <Label className="text-sm text-gray-700">
                          Respuesta (escribe las palabras separadas por comas):
                        </Label>
                        <Input
                          type="text"
                          value={currentAnswer}
                          onChange={(e) => {
                            setAnswers(prev => ({
                              ...prev,
                              [question.id]: e.target.value
                            }));
                          }}
                          placeholder="Ejemplo: am, are, is"
                          className={cn(
                            "text-lg",
                            isCompleted 
                              ? "border-green-500 bg-green-50" 
                              : "border-gray-300 focus:border-blue-500",
                            disabled && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={disabled || gameCompleted}
                        />
                      </>
                    ) : (
                      // Campo OTP para respuestas individuales
                      <>
                        <Label className="text-sm text-gray-700">
                          Respuesta ({question.answer.length} letras):
                        </Label>
                        <div className="flex gap-2 flex-wrap">
                          {Array.from({ length: question.answer.length }).map((_, slotIndex) => {
                            const slotValue = currentAnswer[slotIndex] || '';
                            return (
                              <Input
                                key={slotIndex}
                                id={`otp-${question.id}-${slotIndex}`}
                                type="text"
                                maxLength={1}
                                value={slotValue}
                                onChange={(e) => handleSlotChange(question.id, slotIndex, e.target.value)}
                                onKeyDown={(e) => {
                                  // Manejar backspace para ir al campo anterior
                                  if (e.key === 'Backspace' && !slotValue && slotIndex > 0) {
                                    const prevInput = document.getElementById(`otp-${question.id}-${slotIndex - 1}`);
                                    if (prevInput) {
                                      (prevInput as HTMLInputElement).focus();
                                    }
                                  }
                                }}
                                className={cn(
                                  "w-12 h-12 text-center text-lg font-medium",
                                  "border-2 rounded-md",
                                  isCompleted 
                                    ? "border-green-500 bg-green-50" 
                                    : "border-gray-300 focus:border-blue-500",
                                  disabled && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={disabled || gameCompleted}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500">
                          Escribe las letras de tu respuesta. Se verificará automáticamente al completar.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && showValidation && (
          <p className="text-red-500 text-sm" role="alert">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}