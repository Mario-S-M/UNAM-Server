"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { AccessibleWordSearchGame } from '@/components/AccessibleWordSearchGame';

interface WordSearchGameProps {
  words: string[];
  gridSize?: number;
  onWordsFound?: (foundWords: string[]) => void;
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
];

export function WordSearchGame({
  words,
  gridSize = 15,
  onWordsFound,
  disabled = false,
  showValidation = false,
  error
}: WordSearchGameProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPlacements, setWordPlacements] = useState<WordPlacement[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAccessibleMode, setIsAccessibleMode] = useState(false);

  // Generar letras aleatorias
  const getRandomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  // Verificar si una posición está dentro de los límites
  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
  };

  // Verificar si se puede colocar una palabra en una posición
  const canPlaceWord = (word: string, start: Position, direction: { row: number; col: number }, grid: string[][]) => {
    for (let i = 0; i < word.length; i++) {
      const row = start.row + direction.row * i;
      const col = start.col + direction.col * i;
      
      if (!isValidPosition(row, col)) return false;
      if (grid[row][col] !== '' && grid[row][col] !== word[i]) return false;
    }
    return true;
  };

  // Colocar una palabra en el grid
  const placeWord = (word: string, start: Position, direction: { row: number; col: number }, grid: string[][]) => {
    const newGrid = grid.map(row => [...row]);
    const end = {
      row: start.row + direction.row * (word.length - 1),
      col: start.col + direction.col * (word.length - 1)
    };

    for (let i = 0; i < word.length; i++) {
      const row = start.row + direction.row * i;
      const col = start.col + direction.col * i;
      newGrid[row][col] = word[i];
    }

    return { newGrid, end };
  };

  // Generar el grid con las palabras
  const generateGrid = useCallback(() => {
    // Crear grid vacío
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placements: WordPlacement[] = [];
    const wordsToPlace = [...words].sort((a, b) => b.length - a.length); // Palabras más largas primero

    // Intentar colocar cada palabra
    for (const word of wordsToPlace) {
      const upperWord = word.toUpperCase();
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const start = {
          row: Math.floor(Math.random() * gridSize),
          col: Math.floor(Math.random() * gridSize)
        };

        if (canPlaceWord(upperWord, start, direction, newGrid)) {
          const { newGrid: updatedGrid, end } = placeWord(upperWord, start, direction, newGrid);
          Object.assign(newGrid, updatedGrid.map(row => [...row]));
          
          placements.push({
            word: upperWord,
            start,
            end,
            direction: direction.row === 0 ? 'horizontal' : 
                      direction.col === 0 ? 'vertical' : 'diagonal'
          });
          placed = true;
        }
        attempts++;
      }
    }

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
  }, [words, gridSize]);

  // Obtener celdas en una línea entre dos puntos
  const getCellsInLine = (start: Position, end: Position): Position[] => {
    const cells: Position[] = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    if (steps === 0) return [start];
    
    const rowStep = rowDiff / steps;
    const colStep = colDiff / steps;
    
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: Math.round(start.row + rowStep * i),
        col: Math.round(start.col + colStep * i)
      });
    }
    
    return cells;
  };

  // Verificar si la selección forma una palabra válida
  const checkSelection = (cells: Position[]) => {
    if (cells.length < 2) return null;
    
    const selectedText = cells.map(pos => grid[pos.row][pos.col]).join('');
    const reversedText = selectedText.split('').reverse().join('');
    
    for (const placement of wordPlacements) {
      if (placement.word === selectedText || placement.word === reversedText) {
        return placement.word;
      }
    }
    
    return null;
  };

  // Manejar inicio de selección
  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setCurrentSelection([{ row, col }]);
  };

  // Manejar movimiento durante selección
  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
    
    const cells = getCellsInLine(selectionStart, { row, col });
    setCurrentSelection(cells);
  };

  // Manejar fin de selección
  const handleMouseUp = () => {
    if (!isSelecting || currentSelection.length === 0) {
      setIsSelecting(false);
      setSelectionStart(null);
      setCurrentSelection([]);
      return;
    }
    
    const foundWord = checkSelection(currentSelection);
    if (foundWord && !foundWords.has(foundWord)) {
      const newFoundWords = new Set([...foundWords, foundWord]);
      setFoundWords(newFoundWords);
      
      // Marcar celdas como encontradas permanentemente
      const cellKeys = currentSelection.map(pos => `${pos.row}-${pos.col}`);
      setSelectedCells(prev => new Set([...prev, ...cellKeys]));
      
      onWordsFound?.(Array.from(newFoundWords));
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
  };

  // Reiniciar juego
  const resetGame = () => {
    setFoundWords(new Set());
    setSelectedCells(new Set());
    setIsInitialized(false); // Permitir regenerar el grid
    generateGrid();
    setIsInitialized(true);
  };

  // Generar grid al montar el componente (solo una vez)
  useEffect(() => {
    if (words.length > 0 && !isInitialized) {
      generateGrid();
      setIsInitialized(true);
    }
  }, [words, isInitialized]);

  // Obtener clase CSS para una celda
  const getCellClass = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isFound = selectedCells.has(cellKey);
    const isCurrentlySelected = currentSelection.some(pos => pos.row === row && pos.col === col);
    
    return cn(
      'w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono cursor-pointer select-none transition-colors',
      {
        'bg-green-200 text-green-800': isFound,
        'bg-blue-200 text-blue-800': isCurrentlySelected && !isFound,
        'hover:bg-gray-100': !isFound && !disabled,
        'cursor-not-allowed opacity-50': disabled
      }
    );
  };



  // Generar grid por defecto cuando no hay palabras
  const generateDefaultGrid = useCallback(() => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('')
    );
    
    // Colocar el mensaje "TRABAJA EN ESO" en el centro
    const message = "TRABAJAENESO";
    const startRow = Math.floor(gridSize / 2);
    const startCol = Math.floor((gridSize - message.length) / 2);
    
    // Colocar mensaje horizontalmente
    for (let i = 0; i < message.length; i++) {
      if (startCol + i < gridSize) {
        newGrid[startRow][startCol + i] = message[i];
      }
    }
    
    // Llenar celdas vacías con letras aleatorias
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === '') {
          newGrid[row][col] = getRandomLetter();
        }
      }
    }
    
    setGrid(newGrid);
  }, [gridSize]);

  if (words.length === 0) {
    // Generar grid por defecto si no existe
    useEffect(() => {
      generateDefaultGrid();
    }, [generateDefaultGrid]);

    return (
      <Card className={cn(error && "border-red-500")}>
        <CardHeader>
          <CardTitle className="text-lg">Sopa de Letras</CardTitle>
          <p className="text-sm text-muted-foreground">
            Trabaja en eso
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grid de la sopa de letras */}
          <div className="inline-block border-2 border-gray-400 bg-white">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono select-none bg-gray-50"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              Trabaja en eso - Esta sopa de letras está esperando contenido.
            </p>
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
          words={words}
          onWordsFound={onWordsFound}
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
              {foundWords.size} / {words.length} palabras
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
        {/* Grid de la sopa de letras */}
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



        {/* Mensaje de progreso */}
        {foundWords.size === words.length && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">¡Felicidades! Has encontrado todas las palabras.</p>
          </div>
        )}

        {error && showValidation && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}