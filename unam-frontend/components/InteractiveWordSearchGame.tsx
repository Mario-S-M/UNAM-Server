"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Play } from 'lucide-react';
import { AccessibleWordSearchGame } from '@/components/AccessibleWordSearchGame';

interface InteractiveWordSearchGameProps {
  targetWord: string;
  onWordFound?: (found: boolean) => void;
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
  isTarget?: boolean;
}

const DIRECTIONS = [
  { row: 0, col: 1 },   // horizontal
  { row: 1, col: 0 },   // vertical
  { row: 1, col: 1 },   // diagonal down-right
  { row: 1, col: -1 },  // diagonal down-left
];

export function InteractiveWordSearchGame({
  targetWord,
  onWordFound,
  disabled = false,
  showValidation = false,
  error
}: InteractiveWordSearchGameProps) {
  const [inputPhrase, setInputPhrase] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPlacements, setWordPlacements] = useState<WordPlacement[]>([]);
  const [foundTargetWord, setFoundTargetWord] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const [gameGenerated, setGameGenerated] = useState(false);
  const [gridSize] = useState(15);
  const [showDefaultGame, setShowDefaultGame] = useState(true);


  // Generar juego automáticamente al montar el componente
  useEffect(() => {
    if (showDefaultGame && targetWord && !gameGenerated) {
      generateDefaultGame();
    }
  }, [targetWord, showDefaultGame, gameGenerated]);

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

  // Extraer palabras de la frase ingresada
  const extractWordsFromPhrase = (phrase: string): string[] => {
    return phrase
      .split(/\s+/)
      .filter(word => word.length > 2) // Solo palabras de más de 2 caracteres
      .map(word => word.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').toUpperCase())
      .filter(word => word.length > 0);
  };

  // Generar el grid con las palabras de la frase
  const generateGrid = useCallback(() => {
    if (!inputPhrase.trim()) return;

    // Crear grid vacío
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placements: WordPlacement[] = [];
    
    // Extraer palabras de la frase
    const phraseWords = extractWordsFromPhrase(inputPhrase);
    const targetWordUpper = targetWord.toUpperCase();
    
    // Asegurar que la palabra objetivo esté incluida
    const allWords = [...new Set([targetWordUpper, ...phraseWords])];
    const wordsToPlace = allWords.sort((a, b) => b.length - a.length); // Palabras más largas primero

    // Intentar colocar cada palabra
    for (const word of wordsToPlace) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      const isTarget = word === targetWordUpper;

      while (!placed && attempts < maxAttempts) {
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const start = {
          row: Math.floor(Math.random() * gridSize),
          col: Math.floor(Math.random() * gridSize)
        };

        if (canPlaceWord(word, start, direction, newGrid)) {
          const { newGrid: updatedGrid, end } = placeWord(word, start, direction, newGrid);
          Object.assign(newGrid, updatedGrid.map(row => [...row]));
          
          placements.push({
            word,
            start,
            end,
            direction: direction.row === 0 ? 'horizontal' : 
                      direction.col === 0 ? 'vertical' : 'diagonal',
            isTarget
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
    setGameGenerated(true);
  }, [inputPhrase, targetWord, gridSize]);

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

  // Verificar si la selección forma la palabra objetivo
  const checkSelection = (cells: Position[]) => {
    if (cells.length < 2) return null;
    
    const selectedText = cells.map(pos => grid[pos.row][pos.col]).join('');
    const reversedText = selectedText.split('').reverse().join('');
    const targetWordUpper = targetWord.toUpperCase();
    
    if (selectedText === targetWordUpper || reversedText === targetWordUpper) {
      return targetWordUpper;
    }
    
    return null;
  };

  // Manejar inicio de selección
  const handleMouseDown = (row: number, col: number) => {
    if (disabled || !gameGenerated) return;
    
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
    if (foundWord && !foundTargetWord) {
      setFoundTargetWord(true);
      
      // Marcar celdas como encontradas permanentemente
      const cellKeys = currentSelection.map(pos => `${pos.row}-${pos.col}`);
      setSelectedCells(new Set(cellKeys));
      
      onWordFound?.(true);
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection([]);
  };

  // Reiniciar juego
  const resetGame = () => {
    setFoundTargetWord(false);
    setSelectedCells(new Set());
    setGameGenerated(false);
    setGrid([]);
    setWordPlacements([]);
    setInputPhrase('');
    setShowDefaultGame(true);
  };

  // Generar juego por defecto
  const generateDefaultGame = () => {
    const defaultPhrase = `Trabaja en eso ${targetWord}`;
    setInputPhrase(defaultPhrase);
    
    // Crear grid vacío
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('')
    );
    
    const newWordPlacements: WordPlacement[] = [];
    
    // Colocar la palabra objetivo en el centro del grid
    const startRow = Math.floor(gridSize / 2);
    const startCol = Math.floor((gridSize - targetWord.length) / 2);
    
    // Colocar palabra horizontalmente
    for (let i = 0; i < targetWord.length; i++) {
      newGrid[startRow][startCol + i] = targetWord[i].toUpperCase();
    }
    
    // Agregar la palabra objetivo a los placements
    newWordPlacements.push({
      word: targetWord.toUpperCase(),
      start: { row: startRow, col: startCol },
      end: { row: startRow, col: startCol + targetWord.length - 1 },
      direction: 'horizontal',
      isTarget: true
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
    setWordPlacements(newWordPlacements);
    setGameGenerated(true);
    setShowDefaultGame(false);
  };

  // Generar juego
  const handleGenerateGame = () => {
    if (inputPhrase.trim()) {
      setShowDefaultGame(false);
      generateGrid();
    }
  };

  // Obtener clase CSS para una celda
  const getCellClass = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isFound = selectedCells.has(cellKey);
    const isCurrentlySelected = currentSelection.some(pos => pos.row === row && pos.col === col);
    
    // Verificar si esta celda es parte de la palabra objetivo
    const isTargetCell = wordPlacements.some(placement => {
      if (!placement.isTarget) return false;
      
      const { start, end } = placement;
      const cells = getCellsInLine(start, end);
      return cells.some(cell => cell.row === row && cell.col === col);
    });
    
    return cn(
      'w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono cursor-pointer select-none transition-colors',
      {
        'bg-green-200 text-green-800 border-green-400': isFound,
        'bg-blue-200 text-blue-800': isCurrentlySelected && !isFound,
        'bg-yellow-100 border-yellow-300': isTargetCell && foundTargetWord && !isFound,
        'hover:bg-gray-100': !isFound && !disabled && gameGenerated,
        'cursor-not-allowed opacity-50': disabled || !gameGenerated
      }
    );
  };

  // Usar siempre el modo accesible
  return (
    <AccessibleWordSearchGame
      targetWord={targetWord}
      onWordFound={onWordFound}
      disabled={disabled}
      showValidation={showValidation}
      error={error}
    />
  );
}