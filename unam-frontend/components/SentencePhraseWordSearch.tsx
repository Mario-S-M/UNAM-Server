'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibleWordSearchGame } from '@/components/AccessibleWordSearchGame';

interface SentencePhraseWordSearchProps {
  sentences: string[];
  phrases: string[];
  gridSize?: number;
  onPhrasesFound?: (foundPhrases: string[]) => void;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
}

interface Position {
  row: number;
  col: number;
}

interface WordPlacement {
  word: string;
  start: Position;
  end: Position;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

const DIRECTIONS = [
  { row: 0, col: 1 },   // horizontal
  { row: 1, col: 0 },   // vertical
  { row: 1, col: 1 },   // diagonal down-right
  { row: 1, col: -1 },  // diagonal down-left
  { row: 0, col: -1 },  // horizontal reverse
  { row: -1, col: 0 },  // vertical reverse
  { row: -1, col: -1 }, // diagonal up-left
  { row: -1, col: 1 }   // diagonal up-right
];

export function SentencePhraseWordSearch({
  sentences,
  phrases,
  gridSize = 12,
  onPhrasesFound,
  disabled = false,
  showValidation = false,
  error
}: SentencePhraseWordSearchProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundPhrases, setFoundPhrases] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const [wordPlacements, setWordPlacements] = useState<WordPlacement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAccessibleMode, setIsAccessibleMode] = useState(false);

  const getRandomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
  };

  const canPlaceWord = (word: string, startRow: number, startCol: number, direction: { row: number; col: number }) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = startRow + direction.row * i;
      const newCol = startCol + direction.col * i;
      if (!isValidPosition(newRow, newCol)) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, startRow: number, startCol: number, direction: { row: number; col: number }) => {
    const placement: WordPlacement = {
      word: word.toUpperCase(),
      start: { row: startRow, col: startCol },
      end: { 
        row: startRow + direction.row * (word.length - 1), 
        col: startCol + direction.col * (word.length - 1) 
      },
      direction: direction.row === 0 ? 'horizontal' : direction.col === 0 ? 'vertical' : 'diagonal'
    };

    for (let i = 0; i < word.length; i++) {
      const newRow = startRow + direction.row * i;
      const newCol = startCol + direction.col * i;
      grid[newRow][newCol] = word[i].toUpperCase();
    }

    return placement;
  };

  const generateGrid = useCallback(() => {
    if (phrases.length === 0) {
      const emptyGrid = Array(gridSize).fill(null).map(() => 
        Array(gridSize).fill(null).map(() => getRandomLetter())
      );
      setGrid(emptyGrid);
      setWordPlacements([]);
      return;
    }

    const newGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => '')
    );
    const placements: WordPlacement[] = [];

    // Colocar cada frase en el grid
    phrases.forEach((phrase) => {
      if (!phrase.trim()) return;
      
      const cleanPhrase = phrase.replace(/\s+/g, '').toUpperCase();
      let placed = false;
      let attempts = 0;
      const maxAttempts = 50;

      while (!placed && attempts < maxAttempts) {
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(cleanPhrase, startRow, startCol, direction)) {
          const placement = placeWord(newGrid, cleanPhrase, startRow, startCol, direction);
          placements.push(placement);
          placed = true;
        }
        attempts++;
      }
    });

    // Llenar celdas vacías con letras aleatorias
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === '') {
          newGrid[row][col] = getRandomLetter();
        }
      }
    }

    setGrid(newGrid);
    setWordPlacements(placements);
  }, [phrases, gridSize]);

  useEffect(() => {
    if (!isInitialized) {
      generateGrid();
      setIsInitialized(true);
    }
  }, [phrases, gridSize, isInitialized, generateGrid]);

  const getPositionsInLine = (start: Position, end: Position): Position[] => {
    const positions: Position[] = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    if (steps === 0) {
      return [start];
    }
    
    const rowStep = rowDiff / steps;
    const colStep = colDiff / steps;
    
    for (let i = 0; i <= steps; i++) {
      positions.push({
        row: Math.round(start.row + rowStep * i),
        col: Math.round(start.col + colStep * i)
      });
    }
    
    return positions;
  };

  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
    setCurrentSelection([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart || disabled) return;
    
    const newEnd = { row, col };
    setSelectionEnd(newEnd);
    setCurrentSelection(getPositionsInLine(selectionStart, newEnd));
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionStart || !selectionEnd || disabled) {
      setIsSelecting(false);
      setCurrentSelection([]);
      return;
    }

    const selectedPositions = getPositionsInLine(selectionStart, selectionEnd);
    const selectedText = selectedPositions.map(pos => grid[pos.row][pos.col]).join('');
    
    // Verificar si el texto seleccionado coincide con alguna frase
    const matchedPhrase = phrases.find(phrase => {
      const cleanPhrase = phrase.replace(/\s+/g, '').toUpperCase();
      return cleanPhrase === selectedText || cleanPhrase === selectedText.split('').reverse().join('');
    });

    if (matchedPhrase && !foundPhrases.has(matchedPhrase)) {
      const newFoundPhrases = new Set(foundPhrases);
      newFoundPhrases.add(matchedPhrase);
      setFoundPhrases(newFoundPhrases);
      
      if (onPhrasesFound) {
        onPhrasesFound(Array.from(newFoundPhrases));
      }
    }

    setIsSelecting(false);
    setCurrentSelection([]);
  };

  const resetGame = () => {
    setFoundPhrases(new Set());
    setIsInitialized(false);
    setIsSelecting(false);
    setCurrentSelection([]);
    setSelectionStart(null);
    setSelectionEnd(null);
    if (onPhrasesFound) {
      onPhrasesFound([]);
    }
  };

  const getCellClass = (row: number, col: number) => {
    const isInCurrentSelection = currentSelection.some(pos => pos.row === row && pos.col === col);
    const isInFoundWord = wordPlacements.some(placement => {
      const positions = getPositionsInLine(placement.start, placement.end);
      return positions.some(pos => pos.row === row && pos.col === col) && 
             foundPhrases.has(phrases.find(p => p.replace(/\s+/g, '').toUpperCase() === placement.word) || '');
    });

    return cn(
      "w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono select-none cursor-pointer transition-colors",
      isInCurrentSelection && "bg-blue-200",
      isInFoundWord && "bg-green-200 text-green-800",
      !disabled && "hover:bg-gray-100"
    );
  };

  if (phrases.length === 0) {
    return (
      <Card className={cn(error && "border-red-500")}>
        <CardHeader>
          <CardTitle className="text-lg">Sopa de Letras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 font-medium">
              Configura las preguntas y respuestas para generar la sopa de letras.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Debug info:</p>
              <p>Sentences: {JSON.stringify(sentences)}</p>
              <p>Phrases: {JSON.stringify(phrases)}</p>
            </div>
          </div>
          {error && showValidation && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Renderizar modo accesible si está activado
  if (isAccessibleMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAccessibleMode(false)}
            disabled={disabled}
          >
            <Eye className="h-4 w-4 mr-1" />
            Modo Visual
          </Button>
        </div>
        <AccessibleWordSearchGame
          sentences={sentences}
          phrases={phrases}
          onPhrasesFound={onPhrasesFound}
          disabled={disabled}
          showValidation={showValidation}
          error={error}
        />
      </div>
    );
  }

  return (
    <Card className={cn(error && "border-red-500")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sopa de Letras</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {foundPhrases.size} / {phrases.length} palabras
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAccessibleMode(true)}
              disabled={disabled}
              title="Cambiar a modo accesible para personas con discapacidad visual"
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Modo Accesible
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sopa de letras - Lado izquierdo */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Busca las palabras en la sopa de letras:</h4>
            <div 
              className="inline-block border-2 border-gray-400 bg-white"
              onMouseLeave={() => {
                if (isSelecting) {
                  handleMouseUp();
                }
              }}
            >
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClass(rowIndex, colIndex)}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>


          </div>

          {/* Preguntas - Lado derecho */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Preguntas de ayuda:</h4>
            <div className="space-y-3">
              {sentences.length > 0 ? (
                sentences.map((question, index) => {
                  const correspondingPhrase = phrases[index];
                  return (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <p className="text-base font-medium text-blue-900">{question}</p>
                        {correspondingPhrase && (
                          <div className="bg-white p-2 rounded border border-blue-300">
                            <p className="text-sm text-blue-700 font-semibold">
                              Palabra a buscar: <span className="text-blue-900 font-bold">{correspondingPhrase}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium">No hay preguntas configuradas</p>
                  <p className="text-xs text-yellow-600 mt-1">Sentences: {JSON.stringify(sentences)}</p>
                  <p className="text-xs text-yellow-600">Phrases: {JSON.stringify(phrases)}</p>
                </div>
              )}
            </div>
            
            {foundPhrases.size > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Palabras encontradas:</h4>
                <div className="space-y-1">
                  {Array.from(foundPhrases).map((phrase, index) => (
                    <div key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && showValidation && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}