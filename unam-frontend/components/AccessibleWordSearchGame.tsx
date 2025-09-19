"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Volume2, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { OTPWordSearchGame } from '@/components/OTPWordSearchGame';

interface AccessibleWordSearchGameProps {
  words?: string[];
  targetWord?: string;
  sentences?: string[];
  phrases?: string[];
  onWordsFound?: (foundWords: string[]) => void;
  onWordFound?: (found: boolean) => void;
  onPhrasesFound?: (foundPhrases: string[]) => void;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
}

export function AccessibleWordSearchGame({
  words = [],
  targetWord,
  sentences = [],
  phrases = [],
  onWordsFound,
  onWordFound,
  onPhrasesFound,
  disabled = false,
  showValidation = false,
  error
}: AccessibleWordSearchGameProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [foundItems, setFoundItems] = useState<Set<string>>(new Set());
  const [currentHint, setCurrentHint] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Determinar qué tipo de juego es y obtener los elementos a buscar
  const searchItems = useMemo(() => {
    if (targetWord) return [targetWord];
    if (phrases.length > 0) return phrases;
    return words;
  }, [targetWord, phrases, words]);

  const gameType = useMemo(() => {
    if (targetWord) return 'target';
    if (phrases.length > 0) return 'phrases';
    return 'words';
  }, [targetWord, phrases]);

  // Generar pistas contextuales
  const generateHint = (item: string, index: number) => {
    const hints = [
      `La palabra ${index + 1} tiene ${item.length} letras`,
      `Comienza con la letra "${item.charAt(0).toUpperCase()}"`,
      `Termina con la letra "${item.charAt(item.length - 1).toUpperCase()}"`,
      `Las primeras tres letras son: "${item.substring(0, 3).toUpperCase()}"`,
      `La palabra completa es: "${item.toUpperCase()}"`
    ];
    return hints;
  };

  // Obtener pista actual
  const getCurrentHint = () => {
    const remainingItems = searchItems.filter(item => !foundItems.has(item.toUpperCase()));
    if (remainingItems.length === 0) return 'Todas las palabras han sido encontradas';
    
    const currentItem = remainingItems[0];
    const hints = generateHint(currentItem, 0);
    return hints[Math.min(hintIndex, hints.length - 1)];
  };



  // Manejar entrada de texto
  const handleInputChange = (value: string) => {
    setCurrentInput(value);
  };

  // Verificar respuesta
  const checkAnswer = () => {
    const input = currentInput.trim().toUpperCase();
    if (!input) return;

    const matchedItem = searchItems.find(item => 
      item.toUpperCase() === input
    );

    if (matchedItem && !foundItems.has(matchedItem.toUpperCase())) {
      const newFoundItems = new Set([...foundItems, matchedItem.toUpperCase()]);
      setFoundItems(newFoundItems);
      setCurrentInput('');
      setHintIndex(0);
      
      // Notificar éxito
      const successMessage = `¡Correcto! Encontraste: ${matchedItem}`;
      toast.success(successMessage);

      // Llamar callbacks apropiados
      if (gameType === 'target' && onWordFound) {
        onWordFound(true);
      } else if (gameType === 'phrases' && onPhrasesFound) {
        onPhrasesFound(Array.from(newFoundItems));
      } else if (gameType === 'words' && onWordsFound) {
        onWordsFound(Array.from(newFoundItems));
      }

      // Verificar si el juego está completo
      if (newFoundItems.size === searchItems.length) {
        setGameCompleted(true);
        const completionMessage = 'Felicidades, has completado el ejercicio';
        toast.success(completionMessage);
      }
    } else if (foundItems.has(input)) {
      const alreadyFoundMessage = 'Ya encontraste esa palabra';
      toast.info(alreadyFoundMessage);
    } else {
      const errorMessage = 'Palabra incorrecta, intenta de nuevo';
      toast.error(errorMessage);
      
      if (gameType === 'target' && onWordFound) {
        onWordFound(false);
      }
    }
  };



  // Reiniciar juego
  const resetGame = () => {
    setFoundItems(new Set());
    setCurrentInput('');
    setHintIndex(0);
    setGameCompleted(false);
    const resetMessage = 'Juego reiniciado';
    toast.info(resetMessage);
  };



  // Generar preguntas a partir de las palabras/frases
  const generateQuestions = () => {
    return searchItems.map((item, index) => {
      const hints = generateHint(item, index);
      // Crear múltiples oraciones que incluyan tanto la pregunta como la palabra a buscar
      const questionSentences = [
        `Pregunta ${index + 1}: Encuentra la palabra que ${hints[0].toLowerCase().replace(`la palabra ${index + 1} `, '')}.`,
        `Palabra a buscar en la sopa de letras: "${item}".`,
        `Pista adicional: ${hints[1].toLowerCase()}.`,
        `Ayuda: ${hints[2].toLowerCase()}.`
      ];
      
      return {
        id: `question-${index}`,
        question: questionSentences.join(' '),
        answer: item.toUpperCase(),
        hint: hints[3] // Usar la cuarta pista como hint adicional
      };
    });
  };

  const questions = generateQuestions();

  // Generar instrucción basada en el tipo de juego
  const instruction = useMemo(() => {
    if (gameType === 'target') {
      return `Escribe lo que corresponda a la palabra objetivo: ${targetWord}. Lee las pistas que se proporcionan para cada pregunta y escribe la respuesta correcta.`;
    } else if (gameType === 'phrases') {
      return `Escribe lo que corresponda a las frases solicitadas. Debes encontrar ${phrases.length} frases. Lee las pistas que se proporcionan para cada pregunta.`;
    } else {
      return `Escribe lo que corresponda a las palabras solicitadas. Debes encontrar ${words.length} palabras. Lee las pistas que se proporcionan para cada pregunta.`;
    }
  }, [gameType, targetWord, phrases.length, words.length]);

  // Generar título de pregunta basado en el contexto
  const questionTitle = useMemo(() => {
    // Detectar si las palabras son del verbo "to be"
    const toBeParts = ['am', 'is', 'are', 'was', 'were', 'be', 'being', 'been'];
    const searchItemsLower = searchItems.map(item => item.toLowerCase());
    const isToBeVerb = toBeParts.some(part => searchItemsLower.includes(part));
    
    if (isToBeVerb) {
      return 'Encuentra las palabras que correspondan al verbo to be';
    }
    
    // Aquí se pueden agregar más contextos específicos
    return undefined; // Usar el comportamiento por defecto
  }, [searchItems]);



  // Manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  // Manejar completación de preguntas
  const handleQuestionCompletion = (results: { correct: number; total: number }) => {
    // Llamar callbacks apropiados
    if (gameType === 'target' && onWordFound) {
      onWordFound(results.correct > 0);
    } else if (gameType === 'phrases' && onPhrasesFound) {
      // Para frases, simular que se encontraron todas las correctas
      const foundPhrases = searchItems.slice(0, results.correct);
      onPhrasesFound(foundPhrases);
    } else if (gameType === 'words' && onWordsFound) {
      // Para palabras, simular que se encontraron todas las correctas
      const foundWords = searchItems.slice(0, results.correct);
      onWordsFound(foundWords);
    }
  };

  return (
    <OTPWordSearchGame
      searchItems={searchItems}
      instruction={instruction}
      questionTitle={questionTitle}
      onComplete={handleQuestionCompletion}
    />
  );
}

// Hook personalizado para memoización
function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [state, setState] = React.useState<T>(factory);
  const depsRef = React.useRef(deps);
  
  React.useEffect(() => {
    const hasChanged = deps.some((dep, index) => dep !== depsRef.current[index]);
    if (hasChanged) {
      setState(factory());
      depsRef.current = deps;
    }
  }, deps);
  
  return state;
}