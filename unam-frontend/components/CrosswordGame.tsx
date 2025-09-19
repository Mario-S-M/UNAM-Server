"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, ArrowRight, ArrowDown } from 'lucide-react';

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
}

interface CrosswordData {
  across: Record<string, { clue: string; answer: string; startRow: number; startCol: number }>;
  down: Record<string, { clue: string; answer: string; startRow: number; startCol: number }>;
}

interface CrosswordGameProps {
  crosswordData: CrosswordData;
  gridSize?: number;
  onAnswersChange?: (answers: Record<string, string>) => void;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
}

interface CellData {
  letter: string;
  number?: number;
  isBlocked: boolean;
  acrossClueNumber?: number;
  downClueNumber?: number;
}

export function CrosswordGame({
  crosswordData,
  gridSize = 15,
  onAnswersChange,
  disabled = false,
  showValidation = false,
  error
}: CrosswordGameProps) {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);

  // Generar el grid y las pistas del crucigrama
  const generateCrossword = useCallback(() => {
    // Crear grid vacío
    const newGrid: CellData[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        isBlocked: true
      }))
    );

    const allClues: CrosswordClue[] = [];
    let clueNumber = 1;
    const numberMap: Record<string, number> = {};

    // Procesar pistas horizontales (across)
    Object.entries(crosswordData.across).forEach(([key, data]) => {
      const positionKey = `${data.startRow}-${data.startCol}`;
      if (!numberMap[positionKey]) {
        numberMap[positionKey] = clueNumber++;
      }
      
      const clue: CrosswordClue = {
        number: numberMap[positionKey],
        clue: data.clue,
        answer: data.answer.toUpperCase(),
        startRow: data.startRow,
        startCol: data.startCol,
        direction: 'across'
      };
      
      allClues.push(clue);
      
      // Marcar celdas en el grid
      for (let i = 0; i < data.answer.length; i++) {
        const col = data.startCol + i;
        if (col < gridSize) {
          newGrid[data.startRow][col] = {
            letter: '',
            number: i === 0 ? numberMap[positionKey] : undefined,
            isBlocked: false,
            acrossClueNumber: numberMap[positionKey]
          };
        }
      }
    });

    // Procesar pistas verticales (down)
    Object.entries(crosswordData.down).forEach(([key, data]) => {
      const positionKey = `${data.startRow}-${data.startCol}`;
      if (!numberMap[positionKey]) {
        numberMap[positionKey] = clueNumber++;
      }
      
      const clue: CrosswordClue = {
        number: numberMap[positionKey],
        clue: data.clue,
        answer: data.answer.toUpperCase(),
        startRow: data.startRow,
        startCol: data.startCol,
        direction: 'down'
      };
      
      allClues.push(clue);
      
      // Marcar celdas en el grid
      for (let i = 0; i < data.answer.length; i++) {
        const row = data.startRow + i;
        if (row < gridSize) {
          const existingCell = newGrid[row][data.startCol];
          newGrid[row][data.startCol] = {
            ...existingCell,
            letter: existingCell.letter || '',
            number: i === 0 ? (existingCell.number || numberMap[positionKey]) : existingCell.number,
            isBlocked: false,
            downClueNumber: numberMap[positionKey]
          };
        }
      }
    });

    setGrid(newGrid);
    setClues(allClues.sort((a, b) => a.number - b.number));
  }, [crosswordData, gridSize]);

  // Manejar cambio en una celda
  const handleCellChange = (row: number, col: number, value: string) => {
    if (disabled || grid[row][col].isBlocked) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      letter: value.toUpperCase().slice(-1) // Solo la última letra
    };
    setGrid(newGrid);
    
    // Actualizar respuestas del usuario
    const newAnswers = { ...userAnswers };
    
    // Actualizar respuestas para todas las pistas que pasan por esta celda
    clues.forEach(clue => {
      const answer = getClueAnswer(clue, newGrid);
      newAnswers[`${clue.direction}-${clue.number}`] = answer;
    });
    
    setUserAnswers(newAnswers);
    onAnswersChange?.(newAnswers);
    
    // Mover al siguiente campo si se ingresó una letra
    if (value && selectedCell && selectedClue) {
      moveToNextCell(row, col);
    }
  };

  // Obtener la respuesta actual de una pista
  const getClueAnswer = (clue: CrosswordClue, currentGrid: CellData[][]) => {
    let answer = '';
    
    if (clue.direction === 'across') {
      for (let i = 0; i < clue.answer.length; i++) {
        const col = clue.startCol + i;
        if (col < gridSize) {
          answer += currentGrid[clue.startRow][col].letter || '';
        }
      }
    } else {
      for (let i = 0; i < clue.answer.length; i++) {
        const row = clue.startRow + i;
        if (row < gridSize) {
          answer += currentGrid[row][clue.startCol].letter || '';
        }
      }
    }
    
    return answer;
  };

  // Mover al siguiente campo
  const moveToNextCell = (currentRow: number, currentCol: number) => {
    if (!selectedClue) return;
    
    let nextRow = currentRow;
    let nextCol = currentCol;
    
    if (selectedClue.direction === 'across') {
      nextCol++;
      if (nextCol >= selectedClue.startCol + selectedClue.answer.length) {
        return; // Fin de la palabra
      }
    } else {
      nextRow++;
      if (nextRow >= selectedClue.startRow + selectedClue.answer.length) {
        return; // Fin de la palabra
      }
    }
    
    if (nextRow < gridSize && nextCol < gridSize && !grid[nextRow][nextCol].isBlocked) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  // Manejar clic en una celda
  const handleCellClick = (row: number, col: number) => {
    if (disabled || grid[row][col].isBlocked) return;
    
    setSelectedCell({ row, col });
    
    // Encontrar la pista correspondiente
    const cellData = grid[row][col];
    const availableDirections: ('across' | 'down')[] = [];
    
    if (cellData.acrossClueNumber) availableDirections.push('across');
    if (cellData.downClueNumber) availableDirections.push('down');
    
    if (availableDirections.length > 0) {
      // Si hay múltiples direcciones, alternar
      if (availableDirections.length > 1 && selectedCell?.row === row && selectedCell?.col === col) {
        setSelectedDirection(selectedDirection === 'across' ? 'down' : 'across');
      } else {
        setSelectedDirection(availableDirections[0]);
      }
      
      // Encontrar la pista seleccionada
      const clueNumber = selectedDirection === 'across' ? cellData.acrossClueNumber : cellData.downClueNumber;
      const clue = clues.find(c => c.number === clueNumber && c.direction === selectedDirection);
      setSelectedClue(clue || null);
    }
  };

  // Verificar si una pista está completa y correcta
  const isClueCorrect = (clue: CrosswordClue) => {
    const userAnswer = getClueAnswer(clue, grid);
    return userAnswer === clue.answer;
  };

  // Verificar si una pista está completa
  const isClueComplete = (clue: CrosswordClue) => {
    const userAnswer = getClueAnswer(clue, grid);
    return userAnswer.length === clue.answer.length && userAnswer.trim() !== '';
  };

  // Reiniciar crucigrama
  const resetCrossword = () => {
    const newGrid = grid.map(row => 
      row.map(cell => ({
        ...cell,
        letter: ''
      }))
    );
    setGrid(newGrid);
    setUserAnswers({});
    setSelectedCell(null);
    setSelectedClue(null);
    onAnswersChange?.({});
  };

  // Obtener clase CSS para una celda
  const getCellClass = (row: number, col: number) => {
    const cell = grid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInSelectedWord = selectedClue && isInClue(row, col, selectedClue);
    
    return cn(
      'w-8 h-8 border border-gray-400 flex items-center justify-center text-xs font-mono relative',
      {
        'bg-black': cell.isBlocked,
        'bg-white cursor-pointer': !cell.isBlocked,
        'bg-blue-200': isSelected && !cell.isBlocked,
        'bg-blue-100': isInSelectedWord && !isSelected && !cell.isBlocked,
        'cursor-not-allowed opacity-50': disabled
      }
    );
  };

  // Verificar si una celda está en una pista específica
  const isInClue = (row: number, col: number, clue: CrosswordClue) => {
    if (clue.direction === 'across') {
      return row === clue.startRow && col >= clue.startCol && col < clue.startCol + clue.answer.length;
    } else {
      return col === clue.startCol && row >= clue.startRow && row < clue.startRow + clue.answer.length;
    }
  };

  // Generar crucigrama al montar el componente
  useEffect(() => {
    if (crosswordData.across || crosswordData.down) {
      generateCrossword();
    }
  }, [generateCrossword, crosswordData]);

  const acrossClues = clues.filter(c => c.direction === 'across');
  const downClues = clues.filter(c => c.direction === 'down');
  const completedClues = clues.filter(isClueCorrect).length;

  if (!crosswordData.across && !crosswordData.down) {
    return (
      <Card className={cn(error && "border-red-500")}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No hay datos de crucigrama para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(error && "border-red-500")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Crucigrama</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {completedClues} / {clues.length} pistas
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCrossword}
              disabled={disabled}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reiniciar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid del crucigrama */}
          <div className="flex-shrink-0">
            <div className="inline-block border-2 border-gray-400 bg-white">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClass(rowIndex, colIndex)}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {!cell.isBlocked && (
                        <>
                          {cell.number && (
                            <span className="absolute top-0 left-0 text-[8px] leading-none font-bold text-gray-600">
                              {cell.number}
                            </span>
                          )}
                          <Input
                            value={cell.letter}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="w-full h-full border-none p-0 text-center text-xs font-mono bg-transparent focus:ring-0 focus:outline-none"
                            maxLength={1}
                            disabled={disabled}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Pistas */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="across" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="across" className="flex items-center gap-1">
                  <ArrowRight className="h-4 w-4" />
                  Horizontales ({acrossClues.length})
                </TabsTrigger>
                <TabsTrigger value="down" className="flex items-center gap-1">
                  <ArrowDown className="h-4 w-4" />
                  Verticales ({downClues.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="across" className="space-y-2 max-h-96 overflow-y-auto">
                {acrossClues.map((clue) => {
                  const isCorrect = isClueCorrect(clue);
                  const isComplete = isClueComplete(clue);
                  
                  return (
                    <div
                      key={`across-${clue.number}`}
                      className={cn(
                        "p-2 rounded border cursor-pointer transition-colors",
                        {
                          'bg-green-50 border-green-200': isCorrect,
                          'bg-yellow-50 border-yellow-200': isComplete && !isCorrect,
                          'bg-blue-50 border-blue-200': selectedClue?.number === clue.number && selectedClue?.direction === 'across',
                          'hover:bg-gray-50': !isCorrect
                        }
                      )}
                      onClick={() => {
                        setSelectedClue(clue);
                        setSelectedDirection('across');
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sm">{clue.number}.</span>
                        <span className="text-sm flex-1">{clue.clue}</span>
                        {isCorrect && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ({clue.answer.length} letras)
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="down" className="space-y-2 max-h-96 overflow-y-auto">
                {downClues.map((clue) => {
                  const isCorrect = isClueCorrect(clue);
                  const isComplete = isClueComplete(clue);
                  
                  return (
                    <div
                      key={`down-${clue.number}`}
                      className={cn(
                        "p-2 rounded border cursor-pointer transition-colors",
                        {
                          'bg-green-50 border-green-200': isCorrect,
                          'bg-yellow-50 border-yellow-200': isComplete && !isCorrect,
                          'bg-blue-50 border-blue-200': selectedClue?.number === clue.number && selectedClue?.direction === 'down',
                          'hover:bg-gray-50': !isCorrect
                        }
                      )}
                      onClick={() => {
                        setSelectedClue(clue);
                        setSelectedDirection('down');
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sm">{clue.number}.</span>
                        <span className="text-sm flex-1">{clue.clue}</span>
                        {isCorrect && <Check className="h-4 w-4 text-green-600 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ({clue.answer.length} letras)
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mensaje de progreso */}
        {completedClues === clues.length && clues.length > 0 && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">¡Felicidades! Has completado el crucigrama.</p>
          </div>
        )}

        {error && showValidation && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}