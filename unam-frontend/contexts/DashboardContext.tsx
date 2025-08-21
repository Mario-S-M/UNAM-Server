'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  imageUrl?: string;
  icon?: string;
  objectives?: string;
  prerequisites?: string;
  difficulty: string;
  estimatedHours?: number;
  tags: string[];
  isActive: boolean;
  levelId: string;
  lenguageId: string;
  level?: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
  };
  lenguage?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DashboardContextType {
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
  isLoadingSkill: boolean;
  setIsLoadingSkill: (loading: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isLoadingSkill, setIsLoadingSkill] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        selectedSkill,
        setSelectedSkill,
        isLoadingSkill,
        setIsLoadingSkill,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}