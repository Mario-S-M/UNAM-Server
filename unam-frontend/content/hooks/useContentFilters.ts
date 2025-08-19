import { useState, useMemo } from 'react';
import { Content, Skill, ContentColumnVisibility } from '../../types';

type FilterStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface UseContentFiltersProps {
  contents: Content[];
  skills: Skill[];
}

interface UseContentFiltersReturn {
  // Filter state
  search: string;
  activeFilter: FilterStatus;
  columnVisibility: ContentColumnVisibility;
  
  // Filtered data
  filteredContents: Content[];
  
  // Actions
  setSearch: (search: string) => void;
  setActiveFilter: (filter: FilterStatus) => void;
  toggleColumnVisibility: (column: keyof ContentColumnVisibility) => void;
  handleSearchChange: (value: string) => void;
  resetFilters: () => void;
}

const initialColumnVisibility: ContentColumnVisibility = {
  name: true,
  description: true,
  level: true,
  skill: true,
  status: true,
  teachers: true,
  createdAt: false,
  updatedAt: false,
  actions: true
};

export function useContentFilters({ 
  contents, 
  skills 
}: UseContentFiltersProps): UseContentFiltersReturn {
  
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [columnVisibility, setColumnVisibility] = useState<ContentColumnVisibility>(initialColumnVisibility);

  const filteredContents = useMemo(() => {
    return contents.filter(content => {
      // Buscar el skill por ID para obtener el nombre
      const skill = skills.find(s => s.id === content.skillId);
      const skillName = skill?.name || '';
      
      const matchesSearch = content.name.toLowerCase().includes(search.toLowerCase()) ||
        content.description.toLowerCase().includes(search.toLowerCase()) ||
        skillName.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || content.validationStatus === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [contents, skills, search, activeFilter]);

  const toggleColumnVisibility = (column: keyof ContentColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const resetFilters = () => {
    setSearch('');
    setActiveFilter('all');
    setColumnVisibility(initialColumnVisibility);
  };

  return {
    // Filter state
    search,
    activeFilter,
    columnVisibility,
    
    // Filtered data
    filteredContents,
    
    // Actions
    setSearch,
    setActiveFilter,
    toggleColumnVisibility,
    handleSearchChange,
    resetFilters
  };
}

export default useContentFilters;