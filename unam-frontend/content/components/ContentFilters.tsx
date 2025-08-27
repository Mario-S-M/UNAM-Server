import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';

interface ContentFiltersProps {
  selectedLanguageId: string;
  onLanguageFilterChange: (value: string) => void;
  selectedSkillId: string;
  onSkillFilterChange: (value: string) => void;
  selectedLevelId: string;
  onLevelFilterChange: (value: string) => void;
  languages: { id: string; name: string }[];
  skills: { id: string; name: string }[];
  levels: { id: string; name: string }[];
}

export function ContentFilters({
  selectedLanguageId,
  onLanguageFilterChange,
  selectedSkillId,
  onSkillFilterChange,
  selectedLevelId,
  onLevelFilterChange,
  languages,
  skills,
  levels,
}: ContentFiltersProps) {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedLanguageId !== 'all') count++;
    if (selectedSkillId !== 'all') count++;
    if (selectedLevelId !== 'all') count++;
    return count;
  };

  const getSelectedLanguageName = () => {
    if (selectedLanguageId === 'all') return 'Todos';
    return languages.find(lang => lang.id === selectedLanguageId)?.name || 'Todos';
  };

  const getSelectedSkillName = () => {
    if (selectedSkillId === 'all') return 'Todas';
    return skills.find(skill => skill.id === selectedSkillId)?.name || 'Todas';
  };

  const getSelectedLevelName = () => {
    if (selectedLevelId === 'all') return 'Todos';
    return levels.find(level => level.id === selectedLevelId)?.name || 'Todos';
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Idioma</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onLanguageFilterChange('all')}
          className={selectedLanguageId === 'all' ? 'bg-accent' : ''}
        >
          Todos los idiomas
        </DropdownMenuItem>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => onLanguageFilterChange(language.id)}
            className={selectedLanguageId === language.id ? 'bg-accent' : ''}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Habilidad</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onSkillFilterChange('all')}
          className={selectedSkillId === 'all' ? 'bg-accent' : ''}
        >
          Todas las habilidades
        </DropdownMenuItem>
        {skills.map((skill) => (
          <DropdownMenuItem
            key={skill.id}
            onClick={() => onSkillFilterChange(skill.id)}
            className={selectedSkillId === skill.id ? 'bg-accent' : ''}
          >
            {skill.name}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Nivel</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onLevelFilterChange('all')}
          className={selectedLevelId === 'all' ? 'bg-accent' : ''}
        >
          Todos los niveles
        </DropdownMenuItem>
        {levels.map((level) => (
          <DropdownMenuItem
            key={level.id}
            onClick={() => onLevelFilterChange(level.id)}
            className={selectedLevelId === level.id ? 'bg-accent' : ''}
          >
            {level.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}