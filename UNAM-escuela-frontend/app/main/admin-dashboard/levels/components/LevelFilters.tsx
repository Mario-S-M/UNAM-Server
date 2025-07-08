import React from "react";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { Plus, Search } from "lucide-react";

interface LevelFiltersProps {
  filteredLanguages: any[];
  selectedLanguage: string;
  setSelectedLanguage: (id: string) => void;
  languagesLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCreateLevel: () => void;
}

const LevelFilters: React.FC<LevelFiltersProps> = ({
  filteredLanguages,
  selectedLanguage,
  setSelectedLanguage,
  languagesLoading,
  searchTerm,
  setSearchTerm,
  onCreateLevel,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Select
      label="Seleccionar Idioma"
      placeholder="Elige un idioma"
      selectedKeys={selectedLanguage ? new Set([selectedLanguage]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setSelectedLanguage(selected || "");
      }}
      isLoading={languagesLoading}
      color="default"
      classNames={{
        trigger: "border-default-200 hover:border-default-300 !bg-default-50",
        value: "text-default-700",
        label: "text-default-600",
        selectorIcon: "text-default-600 !text-default-600",
        listbox: "bg-content1",
        popoverContent: "bg-content1",
      }}
    >
      {filteredLanguages.map((lang: any) => (
        <SelectItem key={lang.id} textValue={lang.name}>
          {lang.name}
        </SelectItem>
      ))}
    </Select>
    <Input
      label="Buscar"
      placeholder="Buscar niveles..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      startContent={<Search className="h-4 w-4" />}
    />
    <Button
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
      onPress={onCreateLevel}
      isDisabled={!selectedLanguage}
      className="h-14"
    >
      Crear Nivel
    </Button>
  </div>
);

export default LevelFilters;
