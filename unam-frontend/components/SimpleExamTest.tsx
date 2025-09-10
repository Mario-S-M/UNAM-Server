"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestAnswer {
  questionId: string;
  selectedOptionId: string;
}

const mockQuestions = [
  {
    id: "q1",
    questionText: "¿Cuál es la capital de Francia?",
    options: [
      { id: "opt1", optionText: "Madrid" },
      { id: "opt2", optionText: "París" },
      { id: "opt3", optionText: "Londres" },
      { id: "opt4", optionText: "Roma" }
    ]
  },
  {
    id: "q2",
    questionText: "¿Cuánto es 2 + 2?",
    options: [
      { id: "opt5", optionText: "3" },
      { id: "opt6", optionText: "4" },
      { id: "opt7", optionText: "5" },
      { id: "opt8", optionText: "6" }
    ]
  }
];

export function SimpleExamTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  
  const currentQuestion = mockQuestions[currentQuestionIndex];
  
  const handleAnswerSelect = (questionId: string, selectedOptionId: string) => {
    console.log('Answer selected:', { questionId, selectedOptionId });
    
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      let newAnswers;
      
      if (existingIndex >= 0) {
        newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, selectedOptionId };
      } else {
        newAnswers = [...prev, { questionId, selectedOptionId }];
      }
      
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  };
  
  const getSelectedAnswer = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId)?.selectedOptionId;
    console.log('Getting answer for:', questionId, 'Result:', answer);
    return answer;
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prueba Simple - Pregunta {currentQuestionIndex + 1} de {mockQuestions.length}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {currentQuestionIndex + 1}. {currentQuestion.questionText}
          </h3>
          
          <RadioGroup
            value={getSelectedAnswer(currentQuestion.id) || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.optionText}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentQuestionIndex === mockQuestions.length - 1}
          >
            Siguiente
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold">Debug Info:</h4>
          <p>Pregunta actual: {currentQuestion.id}</p>
          <p>Respuesta seleccionada: {getSelectedAnswer(currentQuestion.id) || 'Ninguna'}</p>
          <p>Total respuestas: {answers.length}</p>
          <pre className="text-xs mt-2">{JSON.stringify(answers, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
}