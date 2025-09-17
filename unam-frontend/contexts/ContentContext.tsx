'use client';

import React, { createContext, useContext } from 'react';

interface ContentContextType {
  contentId: string;
  contentName: string;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ 
  children, 
  contentId, 
  contentName 
}: { 
  children: React.ReactNode;
  contentId: string;
  contentName: string;
}) {
  return (
    <ContentContext.Provider value={{ contentId, contentName }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}