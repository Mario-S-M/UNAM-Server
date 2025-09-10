'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { SkillsOverview } from './SkillsOverview';
import { ContentsBySkill } from './ContentsBySkill';
import { ActivitiesByContent } from './ActivitiesByContent';

interface Content {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  validationStatus: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  userId: string;
  markdownPath: string;
  skillId: string;
  skill: {
    id: string;
    name: string;
    color: string;
  };
  assignedTeachers: {
    id: string;
    fullName: string;
    email: string;
  }[];
}

export function WelcomeDashboard() {
  const { selectedSkill } = useDashboard();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentView, setCurrentView] = useState<'skills' | 'contents' | 'activities'>('skills');

  const handleContentSelect = (content: Content) => {
    setSelectedContent(content);
    setCurrentView('activities');
  };

  const handleBackToContents = () => {
    setSelectedContent(null);
    setCurrentView('contents');
  };

  const handleBackToSkills = () => {
    setSelectedContent(null);
    setCurrentView('skills');
  };

  // Determinar qué vista mostrar basado en el estado
  const getViewToRender = () => {
    if (selectedContent && currentView === 'activities') {
      return (
        <ActivitiesByContent 
          selectedContent={selectedContent}
          onBackToContents={handleBackToContents}
        />
      );
    }
    
    if (selectedSkill && (currentView === 'contents' || currentView === 'activities')) {
      return (
        <ContentsBySkill 
          onContentSelect={handleContentSelect}
          onBackToSkills={handleBackToSkills}
        />
      );
    }
    
    return <SkillsOverview />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {getViewToRender()}
    </div>
  );
}