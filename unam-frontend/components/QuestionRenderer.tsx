"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormQuestionData, FormQuestionOptionData } from '@/schemas/form-forms';
import { WordSearchGame } from '@/components/WordSearchGame';
import { InteractiveWordSearchGame } from '@/components/InteractiveWordSearchGame';
import { SentencePhraseWordSearch } from '@/components/SentencePhraseWordSearch';
import { CrosswordGame } from '@/components/CrosswordGame';

interface QuestionRendererProps {
  question: FormQuestionData;
  value?: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
  showValidation = false,
  error
}: QuestionRendererProps) {
  const renderQuestion = () => {
    switch (question.questionType) {
      case 'TEXT':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Ingresa tu respuesta..."
            maxLength={question.maxLength}
            className={cn(error && "border-red-500")}
          />
        );

      case 'TEXTAREA':
      case 'open_text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Ingresa tu respuesta..."
            maxLength={question.maxLength}
            rows={question.allowMultiline ? 4 : 2}
            className={cn(error && "border-red-500")}
          />
        );

      case 'EMAIL':
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="correo@ejemplo.com"
            className={cn(error && "border-red-500")}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            placeholder="Ingresa un número..."
            min={question.minValue}
            max={question.maxValue}
            className={cn(error && "border-red-500")}
          />
        );

      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            {question.options?.map((option: FormQuestionOptionData) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id || ''} id={`option-${option.id}`} />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.optionText}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {question.options?.map((option: FormQuestionOptionData) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option.id}`}
                  checked={Array.isArray(value) ? value.includes(option.id) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValues, option.id]);
                    } else {
                      onChange(currentValues.filter((id: string) => id !== option.id));
                    }
                  }}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.optionText}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'BOOLEAN':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true-option" />
              <Label htmlFor="true-option" className="text-sm font-normal cursor-pointer">
                Verdadero
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false-option" />
              <Label htmlFor="false-option" className="text-sm font-normal cursor-pointer">
                Falso
              </Label>
            </div>
          </RadioGroup>
        );

      case 'RATING_SCALE':
        const minValue = question.minValue || 1;
        const maxValue = question.maxValue || 5;
        const currentValue = value || minValue;
        
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{minValue}</span>
              <span>{maxValue}</span>
            </div>
            <input
              type="range"
              value={currentValue}
              onChange={(e) => onChange(Number(e.target.value))}
              min={minValue}
              max={maxValue}
              step={1}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center text-sm font-medium">
              Valor seleccionado: {currentValue}
            </div>
          </div>
        );



      case 'DATE':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(error && "border-red-500")}
          />
        );

      case 'TIME':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(error && "border-red-500")}
          />
        );

      case 'WORD_SEARCH':
        try {
          console.log('WORD_SEARCH - correctAnswer:', question.correctAnswer);
          const wordSearchData = question.correctAnswer ? JSON.parse(question.correctAnswer) : {};
          console.log('WORD_SEARCH - parsed data:', wordSearchData);
          
          // Si tiene pares pregunta-respuesta, usar el nuevo componente
          if (wordSearchData.questionAnswerPairs) {
            console.log('Using SentencePhraseWordSearch with question-answer pairs');
            const sentences = wordSearchData.questionAnswerPairs.map((pair: any) => pair.question).filter((q: string) => q.trim() !== '');
            const phrases = wordSearchData.questionAnswerPairs.map((pair: any) => pair.answer).filter((a: string) => a.trim() !== '');
            return (
              <SentencePhraseWordSearch
                sentences={sentences}
                phrases={phrases}
                gridSize={wordSearchData.gridSize || 12}
                onPhrasesFound={(foundPhrases) => onChange(foundPhrases.join(', '))}
                disabled={disabled}
                showValidation={showValidation}
                error={error}
              />
            );
          }
          
          // Si tiene oraciones y frases (formato anterior), usar el nuevo componente
          if (wordSearchData.sentences && wordSearchData.phrases) {
            console.log('Using SentencePhraseWordSearch with sentences and phrases');
            return (
              <SentencePhraseWordSearch
                sentences={wordSearchData.sentences || []}
                phrases={wordSearchData.phrases || []}
                gridSize={wordSearchData.gridSize || 12}
                onPhrasesFound={(foundPhrases) => onChange(foundPhrases.join(', '))}
                disabled={disabled}
                showValidation={showValidation}
                error={error}
              />
            );
          }
          
          // Si tiene targetWord, usar el componente interactivo
          if (wordSearchData.targetWord) {
            console.log('Using InteractiveWordSearchGame with targetWord:', wordSearchData.targetWord);
            return (
              <InteractiveWordSearchGame
                targetWord={wordSearchData.targetWord}
                onWordFound={(found) => onChange(found ? wordSearchData.targetWord : '')}
                disabled={disabled}
                showValidation={showValidation}
                error={error}
              />
            );
          }
          
          // Si no, usar el componente tradicional con lista de palabras
          console.log('Using traditional WordSearchGame');
          const wordsData = Array.isArray(wordSearchData) ? wordSearchData : (wordSearchData.words || []);
          return (
            <WordSearchGame
              words={wordsData}
              onWordsFound={onChange}
              disabled={disabled}
              showValidation={showValidation}
              error={error}
            />
          );
        } catch (parseError) {
          console.error('Error parsing WORD_SEARCH data:', parseError);
          return (
            <div className="p-4 border border-red-300 rounded bg-red-50">
              <p className="text-red-600 text-sm">
                Error al cargar la configuración de la sopa de letras. 
                Verifica que el formato JSON sea correcto.
              </p>
            </div>
          );
        }

      case 'CROSSWORD':
        try {
          const crosswordData = question.correctAnswer ? JSON.parse(question.correctAnswer) : { across: {}, down: {} };
          return (
            <CrosswordGame
              crosswordData={crosswordData}
              onAnswersChange={onChange}
              disabled={disabled}
              showValidation={showValidation}
              error={error}
            />
          );
        } catch (e) {
          return (
            <div className="text-red-500 text-sm">
              Error: Formato de crucigrama inválido
            </div>
          );
        }

      default:
        return (
          <div className="text-gray-500 italic">
            Tipo de pregunta no soportado: {question.questionType}
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium">
                {question.questionText}
                {question.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              {question.description && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                  <p className="text-sm text-blue-800">
                    <strong>Instrucciones:</strong> {question.description}
                  </p>
                </div>
              )}
              
              {question.audioUrl && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Audio de la pregunta:</span>
                  </div>
                  <audio 
                    controls 
                    className="w-full" 
                    preload="metadata"
                  >
                    <source src={question.audioUrl} type="audio/mpeg" />
                    <source src={question.audioUrl} type="audio/wav" />
                    <source src={question.audioUrl} type="audio/ogg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              )}
            </div>
            {showValidation && question.points && (
              <div className="text-sm text-gray-500">
                {question.points} pts
              </div>
            )}
          </div>
          
          <div className="mt-4">
            {renderQuestion()}
          </div>
          
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
          
          {showValidation && question.explanation && (
            <div className="text-sm text-blue-600 mt-2 p-3 bg-blue-50 rounded">
              <strong>Explicación:</strong> {question.explanation}
            </div>
          )}
          
          {question.maxLength && ['TEXT', 'TEXTAREA', 'open_text'].includes(question.questionType) && (
            <div className="text-xs text-gray-500">
              Máximo {question.maxLength} caracteres
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestionRenderer;