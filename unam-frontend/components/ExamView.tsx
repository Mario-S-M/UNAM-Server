"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, BookOpen, FileText, Loader2, XCircle, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ValidationErrorDialog } from "@/components/ValidationErrorDialog";
import { UserProgressCard } from "@/components/UserProgressCard";
import { UserActivityHistoryComponent } from "@/components/UserActivityHistory";
import { UserOverallProgressCard } from "@/components/UserOverallProgressCard";
import { useUserProgress, useUserActivityHistory, useUserOverallProgress } from "@/lib/hooks/useUserProgress";

interface ActivityOption {
  id: string;
  optionText: string;
  optionValue?: string;
  orderIndex: number;
  isCorrect: boolean;
}

interface ActivityQuestion {
  id: string;
  questionText: string;
  questionType: string;
  orderIndex: number;
  isRequired: boolean;
  correctAnswer?: string;
  explanation?: string;
  incorrectFeedback?: string;
  points?: number;
  maxLength?: number;
  options: ActivityOption[];
}

interface ActivityForm {
  id: string;
  title: string;
  questions: ActivityQuestion[];
}

interface ActivityExercise {
  id: string;
  name: string;
  description: string;
  indication: string;
  example: string;
  contentId: string;
  form?: ActivityForm;
  createdAt: string;
  updatedAt: string;
}

interface ActivityAnswer {
  questionId: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
}

const TEST_SIMPLE_QUERY = gql`
  query TestSimple {
    __typename
  }
`;

const GET_EXERCISES_BY_CONTENT = gql`
  query ExercisesByContent($contentId: ID!) {
    exercisesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          correctAnswer
          explanation
          incorrectFeedback
          points
          options {
            id
            optionText
            optionValue
            orderIndex
            isCorrect
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const SUBMIT_FORM_RESPONSE = gql`
  mutation SubmitFormResponse($createFormResponseInput: CreateFormResponseInput!) {
    submitFormResponse(createFormResponseInput: $createFormResponseInput) {
      id
      respondentName
      respondentEmail
      status
      completedAt
      answers {
        id
        questionId
        textAnswer
        selectedOptionIds
      }
    }
  }
`;

const GET_EXERCISES_BY_CONTENT_FULL = gql`
  query ExercisesByContent($contentId: ID!) {
    exercisesByContent(contentId: $contentId) {
      id
      name
      description
      indication
      example
      contentId
      form {
        id
        title
        questions {
          id
          questionText
          questionType
          orderIndex
          isRequired
          correctAnswer
          explanation
          incorrectFeedback
          points
          options {
            id
            optionText
            optionValue
            orderIndex
            isCorrect
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

interface ActivityViewProps {
  contentId: string;
}

// Componente auxiliar para manejar el progreso del usuario
function UserProgressSection({ contentId }: { contentId: string }) {
  const { progress, loading: progressLoading } = useUserProgress(contentId);
  const { activities, loading: activitiesLoading } = useUserActivityHistory();
  const { overallProgress, loading: overallLoading } = useUserOverallProgress();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {progress && <UserProgressCard progress={progress} />}
      {overallProgress && <UserOverallProgressCard overallProgress={overallProgress} loading={overallLoading} />}
      {activities && <UserActivityHistoryComponent activities={activities} loading={activitiesLoading} />}
    </div>
  );
}

export function ExamView({ contentId }: ActivityViewProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ActivityAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);
  const [authError, setAuthError] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showActivityCompletion, setShowActivityCompletion] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<ActivityQuestion[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Record<string, ActivityOption[]>>({});
  const [validationDialog, setValidationDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
  }>({ open: false, title: '', message: '' });

  // Detectar automáticamente el modo basado en si el usuario está logueado
  const isAnonymousMode = !user;

  // Función para aleatorizar arrays
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Función para evaluar respuestas de texto de manera flexible
  const evaluateTextAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    // Validación de entrada
    if (!userAnswer || !correctAnswer) {
      console.log('❌ evaluateTextAnswer: Respuesta vacía o nula');
      return false;
    }

    const userText = userAnswer.toLowerCase().trim();
    const correctText = correctAnswer.toLowerCase().trim();
    
    console.log('🔍 evaluateTextAnswer: Comparando:', {
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      userText: userText,
      correctText: correctText
    });

    // 1. Coincidencia exacta
    if (userText === correctText) {
      console.log('✅ evaluateTextAnswer: Coincidencia exacta');
      return true;
    }

    // 2. Normalización de caracteres especiales y acentos
    const normalizeText = (text: string) => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s]/gi, '') // Remover caracteres especiales
        .trim();
    };
    
    const normalizedUser = normalizeText(userText);
    const normalizedCorrect = normalizeText(correctText);
    
    console.log('🔄 evaluateTextAnswer: Texto normalizado:', {
      normalizedUser,
      normalizedCorrect
    });
    
    if (normalizedUser === normalizedCorrect) {
      console.log('✅ evaluateTextAnswer: Coincidencia después de normalización');
      return true;
    }

    // 3. Verificar si la respuesta del usuario está incluida en la respuesta correcta
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 0) {
      console.log('✅ evaluateTextAnswer: Respuesta del usuario incluida en correcta');
      return true;
    }

    // 4. Verificar si la respuesta correcta está incluida en la respuesta del usuario
    if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length > 0) {
      console.log('✅ evaluateTextAnswer: Respuesta correcta incluida en usuario');
      return true;
    }

    // 5. Coincidencia de palabras clave (al menos 70% de las palabras)
    const userWords = normalizedUser.split(/\s+/).filter(word => word.length > 1);
    const correctWords = normalizedCorrect.split(/\s+/).filter(word => word.length > 1);
    
    if (userWords.length > 0 && correctWords.length > 0) {
      const matchingWords = userWords.filter(word => 
        correctWords.some(correctWord => 
          correctWord.includes(word) || word.includes(correctWord)
        )
      );
      const matchPercentage = matchingWords.length / Math.max(userWords.length, correctWords.length);
      console.log('📊 evaluateTextAnswer: Análisis de palabras:', {
        userWords,
        correctWords,
        matchingWords,
        matchPercentage
      });
      
      if (matchPercentage >= 0.7) {
        console.log('✅ evaluateTextAnswer: Coincidencia por palabras clave');
        return true;
      }
    }

    // 6. Verificación numérica especial
    const userNumber = parseFloat(userText.replace(/[^0-9.-]/g, ''));
    const correctNumber = parseFloat(correctText.replace(/[^0-9.-]/g, ''));
    
    if (!isNaN(userNumber) && !isNaN(correctNumber)) {
      const isEqual = userNumber === correctNumber;
      console.log('🔢 evaluateTextAnswer: Comparación numérica:', {
        userNumber,
        correctNumber,
        isEqual
      });
      if (isEqual) {
        console.log('✅ evaluateTextAnswer: Coincidencia numérica');
        return true;
      }
    }

    // 7. Verificación de rangos numéricos en texto
    if (correctText.includes('menor') || correctText.includes('mayor')) {
      if (!isNaN(userNumber)) {
        if (correctText.includes('menor de') || correctText.includes('menos de')) {
          const threshold = parseFloat(correctText.replace(/[^0-9.-]/g, ''));
          if (!isNaN(threshold)) {
            const result = userNumber < threshold;
            console.log('📏 evaluateTextAnswer: Verificación menor que:', { userNumber, threshold, result });
            return result;
          }
        }
        if (correctText.includes('mayor de') || correctText.includes('más de')) {
          const threshold = parseFloat(correctText.replace(/[^0-9.-]/g, ''));
          if (!isNaN(threshold)) {
            const result = userNumber > threshold;
            console.log('📏 evaluateTextAnswer: Verificación mayor que:', { userNumber, threshold, result });
            return result;
          }
        }
      }
    }

    console.log('❌ evaluateTextAnswer: No se encontró coincidencia');
    return false;
  };

  console.log('ExamView: Starting with contentId:', contentId);
  console.log('ExamView: Component mounted/re-rendered');
  console.log('🚀 About to execute useQuery with contentId:', contentId);
  console.log('🔧 Variables being passed:', { contentId });
  console.log('🔧 Skip condition:', !contentId);
  
  const { data, loading, error } = useQuery<{ exercisesByContent: ActivityExercise[] }>(
    GET_EXERCISES_BY_CONTENT,
    {
      variables: { contentId },
      skip: !contentId,
      onCompleted: (data) => {
        console.log('ExamView: ✅ Query completed successfully!');
        console.log('ExamView: Query data received:', JSON.stringify(data, null, 2));
      },
      onError: (error) => {
        console.error('ExamView: ❌ Query failed:', error);
      }
    }
  );
  
  console.log('🔧 useQuery declared with skip:', !contentId);
  
  console.log('📊 useQuery hook result:', { loading, error: error?.message, hasData: !!data });

  console.log('ExamView: 🔄 Query state - loading:', loading, 'error:', error?.message, 'hasData:', !!data);
  
  // Debug adicional
  if (data?.exercisesByContent) {
    console.log('Exercises found:', data.exercisesByContent.length);
    console.log('Exercises data:', data.exercisesByContent);
  } else {
    console.log('No exercises data found');
  }
  if (data) {
    console.log('ExamView: 📊 Data details:', {
      exercisesCount: data.exercisesByContent?.length || 0,
      exercises: data.exercisesByContent
    });
  }

  const exercises = data?.exercisesByContent || [];
  const currentActivity = exercises[currentActivityIndex];
  
  // Usar useMemo para evitar recalcular originalQuestions en cada render
  const originalQuestions = useMemo(() => {
    const questions = currentActivity?.form?.questions || [];
    console.log('🔍 originalQuestions memoized:', questions.length, 'for activity:', currentActivityIndex);
    return questions;
  }, [currentActivity?.form?.questions, currentActivityIndex]);
  
  // Usar preguntas aleatorizadas si están disponibles, sino las originales
  // IMPORTANTE: Siempre usar originalQuestions si shuffledQuestions está vacío
  const currentActivityQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : originalQuestions;
  const displayQuestions = currentActivityQuestions; // Para mostrar las preguntas (aleatorizadas o no)
  const currentQuestion = displayQuestions[currentQuestionIndex];
  // CORREGIDO: Usar originalQuestions.length para totalQuestions para evitar mostrar "sin preguntas"
  const totalQuestions = originalQuestions.length;
  const totalActivities = exercises.length;
  const allQuestions = exercises.flatMap(exercise => exercise.form?.questions || []);
  
  // Aleatorizar preguntas y opciones cuando cambie la actividad
  useEffect(() => {
    console.log('🔄 useEffect triggered - randomizing questions for activity:', currentActivityIndex, 'questions:', originalQuestions.length);
    console.log('🔄 useEffect states:', { showFeedback, showActivityCompletion, examStarted });
    
    // Aleatorizar si hay preguntas (siempre que cambie la actividad o al inicio)
    if (originalQuestions.length > 0) {
      console.log('🔄 Randomizing questions and options...');
      const randomizedQuestions = shuffleArray(originalQuestions);
      setShuffledQuestions(randomizedQuestions);
      
      // Aleatorizar opciones para cada pregunta
      const randomizedOptions: Record<string, ActivityOption[]> = {};
      randomizedQuestions.forEach(question => {
        if (question.options && question.options.length > 0) {
          randomizedOptions[question.id] = shuffleArray(question.options);
        }
      });
      setShuffledOptions(randomizedOptions);
      console.log('🔄 Questions and options randomized successfully');
    } else {
      console.log('🔄 Skipping randomization - no questions available');
      // Limpiar shuffledQuestions si no hay preguntas originales
      setShuffledQuestions([]);
      setShuffledOptions({});
    }
  }, [currentActivityIndex, originalQuestions.length]);
  
  // Debug de variables calculadas
  console.log('🔍 === RENDER DEBUG ===');
  console.log('🔍 All states:', { showFeedback, showActivityCompletion, examStarted, currentActivityIndex, showResults });
  console.log('Exercises calculated:', exercises.length);
  console.log('Current activity index:', currentActivityIndex);
  console.log('Current activity:', currentActivity);
  console.log('Current activity questions:', displayQuestions.length);
  console.log('Total questions:', totalQuestions);
  console.log('🔍 === END RENDER DEBUG ===');
  
  // Generar ID único para usuario anónimo (siempre el mismo)
  const anonymousUserId = 'anonymous-user-001';
  const anonymousUserName = 'Usuario Anónimo';
  const anonymousUserEmail = 'anonimo@sistema.local';
  
  console.log('Current question index:', currentQuestionIndex);
  console.log('Total questions:', totalQuestions);
  console.log('Current question:', currentQuestion);
  console.log('All questions:', allQuestions);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < displayQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleContinueToNextActivity = () => {
    console.log('🔄 handleContinueToNextActivity called');
    console.log('🔄 Current states before reset:', { showFeedback, showActivityCompletion, examStarted, currentActivityIndex });
    
    // Obtener la actividad actual para redirigir al formulario de edición
    const currentActivity = exercises[currentActivityIndex];
    if (currentActivity) {
      console.log('🔄 Redirecting to activity edit form:', currentActivity.id);
      toast.info('Redirigiendo al formulario de edición de la actividad...');
      router.push(`/admin/actividades/${currentActivity.id}`);
      return;
    }
    
    if (currentActivityIndex < totalActivities - 1) {
      // Ir a la siguiente actividad
      const newActivityIndex = currentActivityIndex + 1;
      console.log('🔄 Setting new activity index to:', newActivityIndex);
      
      // IMPORTANTE: Usar React.startTransition para asegurar que todos los resets se apliquen juntos
      React.startTransition(() => {
        console.log('🔄 Starting transition - Resetting all states');
        setShowFeedback(false);
        setShowActivityCompletion(false);
        setExamStarted(false);
        setCurrentActivityIndex(newActivityIndex);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setExamSubmitted(false);
        setShuffledQuestions([]);
        setShuffledOptions({});
        setTimeElapsed(0);
        console.log('🔄 Transition completed - All states should be reset');
      });
      
      console.log('🔄 All states reset for activity:', newActivityIndex);
      console.log('🔄 States after reset:', { 
        showFeedback: false, 
        showActivityCompletion: false, 
        examStarted: false, 
        currentActivityIndex: newActivityIndex 
      });
      
      toast.info(`Iniciando actividad ${newActivityIndex + 1} de ${totalActivities}`);
    } else {
      // Todas las actividades completadas
      setAllActivitiesCompleted(true);
      setShowActivityCompletion(false);
      setShowResults(true);
      toast.success('¡Felicidades! Has completado todas las actividades.');
    }
  };

  const handleShowFeedback = () => {
    console.log('📝 handleShowFeedback called - Setting showFeedback to TRUE');
    setShowActivityCompletion(false);
    setShowFeedback(true);
  };

  const handleContinueFromFeedback = () => {
    setShowFeedback(false);
    handleContinueToNextActivity();
  };

  const handleViewResults = () => {
    setShowActivityCompletion(false);
    setShowResults(true);
  };

  const [submitFormResponse, { loading: submitLoading }] = useMutation(SUBMIT_FORM_RESPONSE, {
    onCompleted: (data) => {
      console.log('✅ Respuestas enviadas exitosamente:', data);
      setExamSubmitted(true);
      setExamResults(data.submitFormResponse);
      // Mostrar retroalimentación después de completar la actividad
      setShowFeedback(true);
      // Solo mostrar resultados finales si es la última actividad
      const isLastActivity = currentActivityIndex >= exercises.length - 1;
      if (isLastActivity) {
        setShowResults(true);
      }
      if (user) {
        toast.success('Actividad completada y progreso guardado');
      } else {
        toast.success('Actividad completada');
      }
    },
    onError: (error) => {
      console.error('❌ Error al enviar respuestas:', error);
      toast.error('Error al guardar las respuestas. Inténtalo de nuevo.');
    }
  });

  const handleSubmitExam = async () => {
    // Validar preguntas obligatorias
    const requiredQuestions = displayQuestions.filter(q => q.isRequired);
    const answeredQuestionIds = answers.map(a => a.questionId);
    
    const unansweredRequired = requiredQuestions.filter(q => !answeredQuestionIds.includes(q.id));
    
    if (unansweredRequired.length > 0) {
      const questionText = unansweredRequired[0].questionText;
      setValidationDialog({
        open: true,
        title: 'Pregunta obligatoria',
        message: `La pregunta "${questionText}" es obligatoria y debe ser respondida antes de continuar.`,
        confirmText: 'Entendido'
      });
      return;
    }

    // Validar preguntas opcionales sin responder
    if (answers.length < totalQuestions) {
      const unanswered = totalQuestions - answers.length;
      setValidationDialog({
        open: true,
        title: 'Preguntas sin responder',
        message: `Tienes ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder. ¿Deseas completar la actividad?`,
        confirmText: 'Completar actividad',
        showCancel: true,
        onConfirm: () => submitExam()
      });
      return;
    }

    await submitExam();
  };

  const submitExam = async () => {
    try {
      // Preparar las respuestas para enviar
      const formAnswers = answers.map(answer => ({
        questionId: answer.questionId,
        selectedOptionIds: answer.selectedOptionIds || (answer.selectedOptionId ? [answer.selectedOptionId] : []),
        textAnswer: answer.textAnswer || (answer.selectedOptionId ? currentActivityQuestions.find(q => q.id === answer.questionId)?.options.find(opt => opt.id === answer.selectedOptionId)?.optionText : null) || null
      }));

      // Usar información del usuario autenticado si está disponible, sino usar datos anónimos
      const formResponseInput = {
        formId: currentActivity?.form?.id || contentId,
        respondentName: user ? user.fullName : anonymousUserName,
        respondentEmail: user ? user.email : anonymousUserEmail,
        isAnonymous: !user,
        answers: formAnswers
      };

      console.log('📤 Enviando respuestas de actividad:', formResponseInput);
      await submitFormResponse({
        variables: {
          createFormResponseInput: formResponseInput
        }
      });

      // Marcar actividad como completada
      const activityId = currentActivity?.id || '';
      setCompletedActivities(prev => [...prev, activityId]);
      setExamSubmitted(true);
      
      // Mostrar pantalla de completación de actividad (no avanzar automáticamente)
      setShowActivityCompletion(true);
      toast.success(`Actividad "${currentActivity?.name}" completada con éxito.`);
      
    } catch (error) {
      console.error('Error al procesar envío:', error);
      toast.error('Error al guardar las respuestas. Inténtalo de nuevo.');
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalAnswered = 0;
    
    allQuestions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      if (userAnswer) {
        totalAnswered++;
        
        if (question.questionType === 'multiple_choice') {
          // Para preguntas de selección múltiple, verificar si todas las opciones correctas están seleccionadas
          const correctOptions = question.options.filter(opt => opt.isCorrect);
          const selectedOptions = userAnswer.selectedOptionIds || [];
          const correctSelectedOptions = selectedOptions.filter(id => 
            question.options.find(opt => opt.id === id)?.isCorrect
          );
          
          // Respuesta correcta si seleccionó todas las correctas y ninguna incorrecta
          if (correctSelectedOptions.length === correctOptions.length && 
              selectedOptions.length === correctOptions.length) {
            correctAnswers++;
          }
        } else if (question.questionType === 'single_choice') {
          // Para preguntas de selección única
          const selectedOption = question.options.find(opt => opt.id === userAnswer.selectedOptionId);
          if (selectedOption?.isCorrect) {
            correctAnswers++;
          }
        } else if ((question.questionType === 'TEXT' || question.questionType === 'OPEN_TEXT' || question.questionType === 'open_text' || question.questionType === 'TEXTAREA') && userAnswer.textAnswer && question.correctAnswer) {
          // Para preguntas de texto
          const userText = userAnswer.textAnswer.toLowerCase().trim();
          const correctText = question.correctAnswer.toLowerCase().trim();
          if (userText === correctText) {
            correctAnswers++;
          }
          console.log('🔍 CALCULATE SCORE DEBUG:', {
            questionId: question.id,
            questionType: question.questionType,
            userAnswer: userAnswer.textAnswer,
            correctAnswer: question.correctAnswer,
            userText,
            correctText,
            isCorrect: userText === correctText
          });
        }
      }
    });
    
    return totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (!currentQuestion) return;
    console.log('Selecting answer:', { questionId, optionId });
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, selectedOptionId: optionId };
        console.log('Updated answers:', updated);
        return updated;
      }
      const newAnswers = [...prev, { questionId, selectedOptionId: optionId }];
      console.log('New answers:', newAnswers);
      return newAnswers;
    });
  };

  const handleMultipleAnswerSelect = (questionId: string, optionId: string, checked: boolean) => {
    if (!currentQuestion) return;
    console.log('Selecting multiple answer:', { questionId, optionId, checked });
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const currentSelectedIds = updated[existingIndex].selectedOptionIds || [];
        if (checked) {
          // Agregar opción si no está ya seleccionada
          if (!currentSelectedIds.includes(optionId)) {
            updated[existingIndex] = { 
              questionId, 
              selectedOptionIds: [...currentSelectedIds, optionId] 
            };
          }
        } else {
          // Remover opción
          updated[existingIndex] = { 
            questionId, 
            selectedOptionIds: currentSelectedIds.filter(id => id !== optionId) 
          };
        }
        console.log('Updated multiple answers:', updated);
        return updated;
      }
      // Crear nueva respuesta si no existe
      if (checked) {
        const newAnswers = [...prev, { questionId, selectedOptionIds: [optionId] }];
        console.log('New multiple answers:', newAnswers);
        return newAnswers;
      }
      return prev;
    });
  };

  const handleTextAnswerChange = (questionId: string, textValue: string) => {
    if (!currentQuestion) return;
    console.log('Text answer change:', { questionId, textValue });
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        // Preservar las propiedades existentes y solo actualizar textAnswer
        updated[existingIndex] = { ...updated[existingIndex], textAnswer: textValue };
        console.log('Updated text answers:', updated);
        return updated;
      }
      const newAnswers = [...prev, { questionId, textAnswer: textValue }];
      console.log('New text answers:', newAnswers);
      return newAnswers;
    });
  };

  const getSelectedAnswer = (questionId: string) => {
    const selectedAnswer = answers.find(a => a.questionId === questionId)?.selectedOptionId;
    console.log('Getting selected answer for question:', questionId, 'Answer:', selectedAnswer);
    console.log('All answers:', answers);
    return selectedAnswer;
  };

  const getSelectedAnswers = (questionId: string) => {
    const selectedAnswers = answers.find(a => a.questionId === questionId)?.selectedOptionIds || [];
    console.log('Getting selected answers for question:', questionId, 'Answers:', selectedAnswers);
    return selectedAnswers;
  };

  const isOptionSelected = (questionId: string, optionId: string) => {
    const selectedAnswers = getSelectedAnswers(questionId);
    return selectedAnswers.includes(optionId);
  };

  const getTextAnswer = (questionId: string) => {
    const textAnswer = answers.find(a => a.questionId === questionId)?.textAnswer;
    console.log('Getting text answer for question:', questionId, 'Answer:', textAnswer);
    return textAnswer || '';
  };

  const handleNextQuestion = () => {
    console.log('Next question clicked. Current index:', currentQuestionIndex, 'Total:', totalQuestions);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => {
        console.log('Moving to next question:', prev + 1);
        return prev + 1;
      });
    }
  };

  const handlePreviousQuestion = () => {
    console.log('Previous question clicked. Current index:', currentQuestionIndex);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => {
        console.log('Moving to previous question:', prev - 1);
        return prev - 1;
      });
    }
  };

  const handleFinishActivity = () => {
    console.log('🏁 handleFinishActivity called');
    if (answers.length < totalQuestions) {
      const unanswered = totalQuestions - answers.length;
      if (!confirm(`Tienes ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder. ¿Deseas finalizar la actividad?`)) {
        return;
      }
    }
    console.log('🏁 Setting showFeedback to TRUE from handleFinishActivity');
    setShowFeedback(true);
    toast.success('Actividad finalizada - Revisando respuestas');
  };

  const calculateResults = () => {
    let correct = 0;
    let total = 0;

    // Solo usar las preguntas de la actividad actual completada
    const currentActivityQuestions = exercises[currentActivityIndex]?.form?.questions || [];
    
    currentActivityQuestions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      if (userAnswer) {
        total++;
        // Para preguntas de selección múltiple
        if (question.questionType === 'multiple_choice' && userAnswer.selectedOptionIds) {
          const correctOptions = question.options.filter(opt => opt.isCorrect);
          const selectedOptions = userAnswer.selectedOptionIds;
          const correctSelectedOptions = selectedOptions.filter(id => 
            question.options.find(opt => opt.id === id)?.isCorrect
          );
          
          // Respuesta correcta si seleccionó todas las correctas y ninguna incorrecta
          if (correctSelectedOptions.length === correctOptions.length && 
              selectedOptions.length === correctOptions.length) {
            correct++;
          }
        }
        // Para preguntas de selección única (single_choice)
        else if (question.questionType === 'single_choice' && userAnswer.selectedOptionId) {
          const selectedOption = question.options.find(opt => opt.id === userAnswer.selectedOptionId);
          if (selectedOption?.isCorrect) {
            correct++;
          }
        }
        // Para preguntas de texto, comparar con la respuesta correcta
        else if ((question.questionType === 'TEXT' || question.questionType === 'OPEN_TEXT' || question.questionType === 'open_text' || question.questionType === 'TEXTAREA') && userAnswer.textAnswer && question.correctAnswer) {
          // Comparación simple (se puede mejorar con lógica más sofisticada)
          const userText = userAnswer.textAnswer.toLowerCase().trim();
          const correctText = question.correctAnswer.toLowerCase().trim();
          if (userText === correctText) {
            correct++;
          }
          console.log('🔍 CALCULATE RESULTS DEBUG:', {
            questionId: question.id,
            questionType: question.questionType,
            userAnswer: userAnswer.textAnswer,
            correctAnswer: question.correctAnswer,
            userText,
            correctText,
            isCorrect: userText === correctText
          });
        }
      }
    });

    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  const startActivity = () => {
    setExamStarted(true);
    setTimeElapsed(0);
    toast.success('Actividad iniciada. ¡Buena suerte!');
  };

  const resetActivity = () => {
    console.log('🔄 resetActivity called - Cleaning all interfaces and states');
    
    // Limpiar todos los estados de la interfaz
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setShowActivityCompletion(false);
    setShowFeedback(false);
    setTimeElapsed(0);
    setExamStarted(false);
    setExamSubmitted(false);
    setShuffledQuestions([]);
    setShuffledOptions({});
    
    console.log('🔄 All states cleaned - Ready to restart activity');
    toast.info('Actividad reiniciada. ¡Puedes comenzar de nuevo!');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando actividades...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Error al cargar las actividades</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verificar si hay ejercicios disponibles
  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
          <CardDescription>No hay actividades disponibles para este contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Este contenido aún no tiene actividades configuradas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verificar si la actividad actual tiene preguntas
  if (totalQuestions === 0 && currentActivity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentActivity.form?.title || currentActivity.name}</CardTitle>
          <CardDescription>Esta actividad no tiene preguntas configuradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Esta actividad aún no tiene preguntas configuradas.</p>
            {currentActivityIndex < exercises.length - 1 && (
              <Button 
                onClick={() => {
                  setCurrentActivityIndex(prev => prev + 1);
                  setCurrentQuestionIndex(0);
                  toast.info('Pasando a la siguiente actividad');
                }} 
                className="mt-4"
              >
                Ir a la siguiente actividad
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getQuestionResult = (question: ActivityQuestion) => {
    const userAnswer = answers.find(a => a.questionId === question.id);
    const selectedOption = userAnswer?.selectedOptionId ? question.options.find(opt => opt.id === userAnswer.selectedOptionId) : null;
    const selectedOptions = userAnswer?.selectedOptionIds ? question.options.filter(opt => userAnswer.selectedOptionIds!.includes(opt.id)) : [];
    const correctOptions = question.options.filter(opt => opt.isCorrect);
    
    console.log('🔍 getQuestionResult DEBUG - Inicio:', {
      questionId: question.id,
      questionType: question.questionType,
      questionText: question.questionText,
      userAnswer: userAnswer,
      correctAnswer: question.correctAnswer,
      hasOptions: question.options.length > 0,
      correctOptions: correctOptions.map(opt => ({ id: opt.id, text: opt.optionText, isCorrect: opt.isCorrect }))
    });
    
    let isCorrect = false;
    if (userAnswer) {
      // Para preguntas de selección múltiple con opciones
      if (question.questionType === 'multiple_choice' && userAnswer.selectedOptionIds && question.options.length > 0) {
        const correctSelectedOptions = userAnswer.selectedOptionIds.filter(id => 
          question.options.find(opt => opt.id === id)?.isCorrect
        );
        // Respuesta correcta si seleccionó todas las correctas y ninguna incorrecta
        isCorrect = correctSelectedOptions.length === correctOptions.length && 
                   userAnswer.selectedOptionIds.length === correctOptions.length;
        
        console.log('🔍 MULTIPLE CHOICE DEBUG:', {
          selectedOptionIds: userAnswer.selectedOptionIds,
          correctSelectedOptions,
          correctOptionsLength: correctOptions.length,
          selectedLength: userAnswer.selectedOptionIds.length,
          isCorrect
        });
      }
      // Para preguntas de selección única con opciones
      else if (question.questionType === 'single_choice' && userAnswer.selectedOptionId && question.options.length > 0) {
        isCorrect = selectedOption?.isCorrect || false;
        
        console.log('🔍 SINGLE CHOICE DEBUG:', {
          selectedOptionId: userAnswer.selectedOptionId,
          selectedOption: selectedOption,
          selectedOptionIsCorrect: selectedOption?.isCorrect,
          isCorrect
        });
      }
      // Para preguntas MULTIPLE_CHOICE (mayúsculas) con selección única
      else if (question.questionType === 'MULTIPLE_CHOICE' && userAnswer.selectedOptionId && question.options.length > 0) {
        isCorrect = selectedOption?.isCorrect || false;
        
        console.log('🔍 MULTIPLE_CHOICE (SINGLE SELECTION) DEBUG:', {
          selectedOptionId: userAnswer.selectedOptionId,
          selectedOption: selectedOption,
          selectedOptionIsCorrect: selectedOption?.isCorrect,
          isCorrect
        });
      }
      // Para preguntas de texto con respuesta correcta definida
      else if ((question.questionType === 'TEXT' || question.questionType === 'OPEN_TEXT' || question.questionType === 'open_text' || question.questionType === 'TEXTAREA') && userAnswer.textAnswer && question.correctAnswer) {
        isCorrect = evaluateTextAnswer(userAnswer.textAnswer, question.correctAnswer);
        console.log('🔍 TEXT ANSWER DEBUG:', {
          questionId: question.id,
          questionType: question.questionType,
          userAnswer: userAnswer.textAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect
        });
      }
      // Para preguntas mal configuradas: MULTIPLE_CHOICE sin opciones pero con textAnswer y correctAnswer
       else if ((question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'multiple_choice') && 
                question.options.length === 0 && 
                userAnswer.textAnswer && 
                question.correctAnswer) {
         isCorrect = evaluateTextAnswer(userAnswer.textAnswer, question.correctAnswer);
         console.log('🔍 MULTIPLE_CHOICE AS TEXT DEBUG:', {
           questionId: question.id,
           questionType: question.questionType,
           userAnswer: userAnswer.textAnswer,
           correctAnswer: question.correctAnswer,
           isCorrect,
           note: 'Pregunta configurada como MULTIPLE_CHOICE pero funcionando como TEXT'
         });
       }
       // Caso específico para MULTIPLE_CHOICE con correctAnswer vacío pero textAnswer presente
       else if ((question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'multiple_choice') && 
                question.options.length === 0 && 
                userAnswer.textAnswer && 
                (!question.correctAnswer || question.correctAnswer === '')) {
         // Si no hay respuesta correcta definida, consideramos que cualquier respuesta es válida
         isCorrect = true;
         console.log('🔍 MULTIPLE_CHOICE WITHOUT CORRECT ANSWER DEBUG:', {
           questionId: question.id,
           questionType: question.questionType,
           userAnswer: userAnswer.textAnswer,
           correctAnswer: question.correctAnswer,
           isCorrect: true,
           note: 'MULTIPLE_CHOICE sin opciones y sin correctAnswer - marcando como correcto'
         });
       }
      // Para preguntas de texto sin respuesta correcta definida
      else if (question.options.length === 0 && userAnswer.textAnswer && !question.correctAnswer) {
        // Si no hay respuesta correcta definida, consideramos que cualquier respuesta es válida
        isCorrect = true;
        console.log('🔍 TEXT WITHOUT CORRECT ANSWER DEBUG:', {
          questionType: question.questionType,
          userAnswer: userAnswer.textAnswer,
          isCorrect: true
        });
      }
      else {
        console.log('🔍 UNHANDLED QUESTION TYPE DEBUG:', {
          questionType: question.questionType,
          hasSelectedOptionId: !!userAnswer.selectedOptionId,
          hasSelectedOptionIds: !!userAnswer.selectedOptionIds,
          hasTextAnswer: !!userAnswer.textAnswer,
          textAnswerValue: userAnswer.textAnswer,
          hasCorrectAnswer: !!question.correctAnswer,
          correctAnswerValue: question.correctAnswer,
          correctAnswerType: typeof question.correctAnswer,
          correctAnswerLength: question.correctAnswer?.length,
          optionsLength: question.options.length,
          conditionChecks: {
            isMultipleChoice: (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'multiple_choice'),
            hasNoOptions: question.options.length === 0,
            hasTextAnswer: !!userAnswer.textAnswer,
            hasCorrectAnswer: !!question.correctAnswer,
            correctAnswerNotEmpty: question.correctAnswer !== '',
            allConditionsForMCAsText: (
              (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'multiple_choice') && 
              question.options.length === 0 && 
              userAnswer.textAnswer && 
              question.correctAnswer
            )
          }
        });
      }
    } else {
      console.log('🔍 NO USER ANSWER DEBUG:', {
        questionId: question.id,
        questionType: question.questionType
      });
    }
    
    const result = {
      userAnswer,
      selectedOption,
      selectedOptions,
      correctOptions,
      isCorrect,
      wasAnswered: !!userAnswer,
      textAnswer: userAnswer?.textAnswer
    };
    
    console.log('🔍 getQuestionResult DEBUG - Resultado final:', result);
    
    return result;
  };

  // Debug de estados de renderizado
  console.log('🎯 Render states:', { showResults, showFeedback, showActivityCompletion, examStarted });
  
  if (showResults) {
    console.log('🎯 Rendering: showResults');
    const results = calculateResults();

    return (
      <div className="space-y-6">
        {/* Resumen de resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Resultados del Examen
            </CardTitle>
            {authError && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Examen completado en modo anónimo. No se guardó el progreso.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {results.percentage}%
              </div>
              <p className="text-muted-foreground">
                {results.correct} de {results.total} respuestas correctas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-green-600">{results.correct}</div>
                    <p className="text-sm text-muted-foreground">Correctas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-red-600">{results.total - results.correct}</div>
                    <p className="text-sm text-muted-foreground">Incorrectas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-blue-600">{formatTime(timeElapsed)}</div>
                    <p className="text-sm text-muted-foreground">Tiempo total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={resetActivity} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reintentar Actividad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Retroalimentación detallada por pregunta */}
        <Card>
          <CardHeader>
            <CardTitle>Retroalimentación Detallada</CardTitle>
            <CardDescription>
              Revisa tus respuestas y aprende de los errores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Solo mostrar preguntas de la actividad actual completada */}
            {(exercises[currentActivityIndex]?.form?.questions || []).map((question, index) => {
              const result = getQuestionResult(question);
              console.log('🔍 FEEDBACK SECTION DEBUG:', {
                questionId: question.id,
                questionType: question.questionType,
                questionText: question.questionText,
                correctAnswer: question.correctAnswer,
                result: {
                  isCorrect: result.isCorrect,
                  wasAnswered: result.wasAnswered,
                  textAnswer: result.textAnswer
                }
              });
              return (
                <Card key={question.id} className={`border-l-4 ${
                  !result.wasAnswered ? 'border-l-gray-400' :
                  result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {!result.wasAnswered ? (
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">?</span>
                            </div>
                          ) : result.isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">
                            Pregunta {index + 1}: {question.questionText}
                          </h4>
                          
                          {!result.wasAnswered ? (
                            <p className="text-gray-600 text-sm mb-2">
                              <strong>No respondida</strong>
                            </p>
                          ) : (
                            <p className="text-sm mb-2">
                            <strong>Tu respuesta:</strong> {
                              result.textAnswer || 
                              (result.selectedOptions.length > 0 ? 
                                result.selectedOptions.map(opt => opt.optionText).join(', ') : 
                                result.selectedOption?.optionText)
                            }
                          </p>
                          )}
                          
                          <p className="text-sm mb-2">
                            <strong>Respuesta correcta:</strong> {
                              question.correctAnswer || 
                              (result.correctOptions.length > 0 ? 
                                result.correctOptions.map(opt => opt.optionText).join(', ') : 
                                'No definida')
                            }
                          </p>
                          
                          {result.wasAnswered ? (
                            result.isCorrect ? (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 text-sm">
                                  <strong>¡Correcto!</strong> {question.explanation || 'Excelente trabajo.'}
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">
                                  <strong>Incorrecto.</strong> {question.incorrectFeedback || question.explanation || 'Revisa el material de estudio para esta pregunta.'}
                                </p>
                              </div>
                            )
                          ) : (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-gray-800 text-sm">
                                <strong>No respondida.</strong> Esta pregunta no fue contestada.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex justify-center gap-4 mt-6">
              {currentActivityIndex < exercises.length - 1 ? (
                <Button onClick={handleContinueFromFeedback} size="lg">
                  Continuar con la siguiente actividad
                </Button>
              ) : (
                <Button onClick={handleViewResults} size="lg">
                  Ver resultados finales
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  // Vista de completación de actividad
  if (showActivityCompletion) {
    console.log('🎯 Rendering: showActivityCompletion');
    const completedActivity = exercises[currentActivityIndex];
    const nextActivity = exercises[currentActivityIndex + 1];
    const hasNextActivity = currentActivityIndex < exercises.length - 1;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Actividad Completada
          </CardTitle>
          <CardDescription>
            Has completado exitosamente la actividad {currentActivityIndex + 1} de {exercises.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 mb-2">
                ¡Excelente trabajo!
              </h3>
              <p className="text-green-700">
                Has completado: {completedActivity?.form?.title || completedActivity?.name}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <Progress 
                  value={(completedActivities.length / exercises.length) * 100} 
                  className="w-full max-w-md" 
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Progreso: {completedActivities.length} de {exercises.length} actividades completadas
              </p>
            </div>
          </div>

          {hasNextActivity && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium mb-2">Siguiente actividad:</h4>
              <p className="text-sm text-muted-foreground mb-1">
                {nextActivity?.form?.title || nextActivity?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {nextActivity?.description}
              </p>
              <Badge variant="outline" className="mt-2">
                {nextActivity?.form?.questions?.length || 0} pregunta{(nextActivity?.form?.questions?.length || 0) > 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={handleShowFeedback} variant="outline" size="lg">
              Ver retroalimentación
            </Button>
            {hasNextActivity ? (
              <Button onClick={handleContinueToNextActivity} size="lg">
                Continuar con la siguiente actividad
              </Button>
            ) : (
              <Button onClick={handleViewResults} size="lg">
                Ver resultados finales
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // IMPORTANTE: Esta condición debe ir ANTES que showFeedback
  if (!examStarted) {
    console.log('🎯 Rendering: !examStarted (new activity form)');
    console.log('🎯 Current states in !examStarted:', { showFeedback, showActivityCompletion, examStarted, currentActivityIndex });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
          <CardDescription>
            Prepárate para responder {totalQuestions} pregunta{totalQuestions > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold mb-2">¿Listo para comenzar?</h3>
            <p className="text-muted-foreground mb-6">
              Esta actividad contiene {totalQuestions} pregunta{totalQuestions > 1 ? 's' : ''} de opción múltiple.
              Tómate tu tiempo y lee cada pregunta cuidadosamente.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-semibold">{totalQuestions}</div>
                    <p className="text-sm text-muted-foreground">Pregunta{totalQuestions > 1 ? 's' : ''}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-semibold">Sin límite</div>
                    <p className="text-sm text-muted-foreground">Tiempo</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-semibold">{exercises.length}</div>
                    <p className="text-sm text-muted-foreground">Actividad{exercises.length > 1 ? 'es' : ''}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
             <Button onClick={startActivity} size="lg" className="flex items-center gap-2">
               <BookOpen className="h-4 w-4" />
               Comenzar Actividad
             </Button>
           </div>
        </CardContent>
      </Card>
    );
  }

  // Vista de retroalimentación
  if (showFeedback) {
    console.log('🎯 Rendering: showFeedback');
    console.log('🎯 Current states in showFeedback:', { showFeedback, showActivityCompletion, examStarted, currentActivityIndex });
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Retroalimentación Detallada</CardTitle>
            <CardDescription>
              Revisa tus respuestas y aprende de los errores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Solo mostrar preguntas de la actividad actual completada */}
            {(exercises[currentActivityIndex]?.form?.questions || []).map((question, index) => {
              const result = getQuestionResult(question);
              return (
                <Card key={question.id} className={`border-l-4 ${
                  !result.wasAnswered ? 'border-l-gray-400' :
                  result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {!result.wasAnswered ? (
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">?</span>
                            </div>
                          ) : result.isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">
                            Pregunta {index + 1}: {question.questionText}
                          </h4>
                          
                          {!result.wasAnswered ? (
                            <p className="text-gray-600 text-sm mb-2">
                              <strong>No respondida</strong>
                            </p>
                          ) : (
                            <p className="text-sm mb-2">
                            <strong>Tu respuesta:</strong> {
                              result.textAnswer || 
                              (result.selectedOptions.length > 0 ? 
                                result.selectedOptions.map(opt => opt.optionText).join(', ') : 
                                result.selectedOption?.optionText)
                            }
                          </p>
                          )}
                          
                          <p className="text-sm mb-2">
                            <strong>Respuesta correcta:</strong> {
                              question.correctAnswer || 
                              (result.correctOptions.length > 0 ? 
                                result.correctOptions.map(opt => opt.optionText).join(', ') : 
                                'No definida')
                            }
                          </p>
                          
                          {result.isCorrect ? (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-sm">
                                <strong>¡Correcto!</strong> {question.explanation || 'Excelente trabajo.'}
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-800 text-sm">
                                <strong>Incorrecto.</strong> {question.incorrectFeedback || question.explanation || 'Revisa el material de estudio para esta pregunta.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex justify-center gap-4 mt-6">
              {currentActivityIndex < exercises.length - 1 ? (
                <Button onClick={handleContinueFromFeedback} size="lg">
                  Continuar con la siguiente actividad
                </Button>
              ) : (
                <Button onClick={handleViewResults} size="lg">
                  Ver resultados finales
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulario de la actividad actual
  console.log('🎯 Rendering: main exam form');

  return (
    <>
    {/* Componentes de progreso del usuario */}
    {user && (user.roles.includes('mortal') || user.roles.includes('alumno')) && (
      <UserProgressSection contentId={contentId} />
    )}
    
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentActivity?.form?.title || currentActivity?.name}</CardTitle>
            <CardDescription>
              Actividad {currentActivityIndex + 1} de {exercises.length} • Pregunta {currentQuestionIndex + 1} de {displayQuestions.length}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <Badge variant="outline">
              {answers.length}/{displayQuestions.length} respondidas
            </Badge>
          </div>
        </div>
        <Progress value={(currentQuestionIndex + 1) / displayQuestions.length * 100} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </h3>
              
              {/* Renderizado condicional según el tipo de pregunta */}
              {(currentQuestion.questionType === 'TEXT' || currentQuestion.questionType === 'OPEN_TEXT' || currentQuestion.questionType === 'open_text') && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Ingresa tu respuesta..."
                    value={getTextAnswer(currentQuestion.id)}
                    onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
                    maxLength={currentQuestion.maxLength || 1000}
                    rows={6}
                    disabled={examSubmitted}
                    className="w-full resize-none"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {getTextAnswer(currentQuestion.id).length}/{currentQuestion.maxLength || 1000} caracteres
                  </div>
                </div>
              )}
              
              {currentQuestion.questionType === 'TEXTAREA' && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Ingresa tu respuesta..."
                    value={getTextAnswer(currentQuestion.id)}
                    onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
                    maxLength={currentQuestion.maxLength || 500}
                    rows={4}
                    disabled={examSubmitted}
                    className="w-full"
                  />
                </div>
              )}
              
              {/* Preguntas de selección múltiple */}
              {currentQuestion.questionType === 'multiple_choice' && (
                <div className="space-y-3">
                  {(shuffledOptions[currentQuestion.id] || currentQuestion.options).map((option) => {
                    console.log('Rendering multiple choice option:', option);
                    return (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={option.id}
                          checked={isOptionSelected(currentQuestion.id, option.id)}
                          onCheckedChange={(checked) => handleMultipleAnswerSelect(currentQuestion.id, option.id, checked as boolean)}
                          disabled={examSubmitted}
                        />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.optionText}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Preguntas de selección única */}
              {(currentQuestion.questionType === 'single_choice' || (!['TEXT', 'TEXTAREA', 'OPEN_TEXT', 'multiple_choice'].includes(currentQuestion.questionType))) && (
                <RadioGroup
                  value={getSelectedAnswer(currentQuestion.id) || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {(shuffledOptions[currentQuestion.id] || currentQuestion.options).map((option) => {
                    console.log('Rendering single choice option:', option);
                    return (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value={option.id} id={option.id} disabled={examSubmitted} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.optionText}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>

            {/* Navegación de preguntas con paginación */}
            {totalQuestions > 1 && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Ir a pregunta:</span>
                  <div className="flex gap-1 flex-wrap">
                    {(() => {
                      const maxVisible = 10;
                      const current = currentQuestionIndex;
                      const total = totalQuestions;
                      
                      if (total <= maxVisible) {
                        // Mostrar todas las preguntas si son pocas
                        return Array.from({ length: total }, (_, index) => (
                          <Button
                            key={index}
                            variant={index === current ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => goToQuestion(index)}
                          >
                            {index + 1}
                          </Button>
                        ));
                      } else {
                        // Paginación inteligente para muchas preguntas
                        const buttons = [];
                        const start = Math.max(0, current - 4);
                        const end = Math.min(total - 1, start + maxVisible - 1);
                        
                        // Botón primera pregunta si no está visible
                        if (start > 0) {
                          buttons.push(
                            <Button
                              key={0}
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => goToQuestion(0)}
                            >
                              1
                            </Button>
                          );
                          if (start > 1) {
                            buttons.push(
                              <span key="ellipsis-start" className="text-sm text-muted-foreground px-1">...</span>
                            );
                          }
                        }
                        
                        // Botones del rango visible
                        for (let i = start; i <= end; i++) {
                          buttons.push(
                            <Button
                              key={i}
                              variant={i === current ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => goToQuestion(i)}
                            >
                              {i + 1}
                            </Button>
                          );
                        }
                        
                        // Botón última pregunta si no está visible
                        if (end < total - 1) {
                          if (end < total - 2) {
                            buttons.push(
                              <span key="ellipsis-end" className="text-sm text-muted-foreground px-1">...</span>
                            );
                          }
                          buttons.push(
                            <Button
                              key={total - 1}
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => goToQuestion(total - 1)}
                            >
                              {total}
                            </Button>
                          );
                        }
                        
                        return buttons;
                      }
                    })()
                    }
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || examSubmitted}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {currentQuestionIndex + 1} / {displayQuestions.length}
              </div>
              
              {currentQuestionIndex === displayQuestions.length - 1 ? (
                !examSubmitted ? (
                  <Button onClick={handleSubmitExam} disabled={submitLoading}>
                    {submitLoading ? 'Enviando...' : 'Completar Actividad'}
                  </Button>
                ) : (
                  <div className="text-green-600 font-medium">
                    ✅ Actividad Completada
                  </div>
                )
              ) : (
                <Button onClick={handleNextQuestion} disabled={examSubmitted}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

          </>
        )}
      </CardContent>
    </Card>
    
    <ValidationErrorDialog
      open={validationDialog.open}
      onOpenChange={(open) => setValidationDialog(prev => ({ ...prev, open }))}
      title={validationDialog.title}
      message={validationDialog.message}
      onConfirm={validationDialog.onConfirm}
      confirmText={validationDialog.confirmText}
      showCancel={validationDialog.showCancel}
    />
     </>
  );
}