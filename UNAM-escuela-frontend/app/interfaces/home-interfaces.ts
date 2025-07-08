// Interfaces centralizadas para componentes de la página principal y de idiomas

// WelcomeSection
export interface WelcomeSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

// LanguageCard
import { Lenguage } from "./lenguage-interfaces";
export interface LanguageCardProps {
  language: Lenguage;
  globalIndex: number;
}

// LanguagesListError
export interface LanguagesListErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

// LanguagesListLoading (no props)

// LanguagesListEmpty (no props)
