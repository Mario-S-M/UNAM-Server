import React from "react";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { Plus, Search } from "lucide-react";

interface ContentFiltersProps {
  filteredLanguages: any[];
  selectedLanguage: string;
  setSelectedLanguage: (id: string) => void;
  languagesLoading: boolean;
  levels: any;
  selectedLevel: string;
  setSelectedLevel: (id: string) => void;
  levelsLoading: boolean;
  skills: any;
  selectedSkill: string;
  setSelectedSkill: (id: string) => void;
  skillsLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCreateContent: () => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  filteredLanguages,
  selectedLanguage,
  setSelectedLanguage,
  languagesLoading,
  levels,
  selectedLevel,
  setSelectedLevel,
  levelsLoading,
  skills,
  selectedSkill,
  setSelectedSkill,
  skillsLoading,
  searchTerm,
  setSearchTerm,
  onCreateContent,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
    <Select
      label="Seleccionar Idioma"
      placeholder="Elige un idioma"
      selectedKeys={selectedLanguage ? new Set([selectedLanguage]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setSelectedLanguage(selected || "");
        setSelectedLevel("");
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
        <SelectItem key={lang.id}>{lang.name}</SelectItem>
      ))}
    </Select>

    <Select
      label="Seleccionar Nivel"
      placeholder="Elige un nivel"
      selectedKeys={selectedLevel ? new Set([selectedLevel]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setSelectedLevel(selected || "");
      }}
      isLoading={levelsLoading}
      isDisabled={!selectedLanguage}
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
      {(levels?.data || []).map((level: any) => (
        <SelectItem key={level.id}>{level.name}</SelectItem>
      ))}
    </Select>

    <Select
      label="Seleccionar Skill"
      placeholder="Elige una skill"
      selectedKeys={selectedSkill ? new Set([selectedSkill]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setSelectedSkill(selected || "");
      }}
      isLoading={skillsLoading}
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
      {(skills?.data || []).map((skill: any) => (
        <SelectItem key={skill.id} textValue={skill.name}>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            {skill.name}
          </div>
        </SelectItem>
      ))}
    </Select>

    <Input
      label="Buscar"
      placeholder="Buscar contenidos..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      startContent={<Search className="h-4 w-4" />}
    />

    <Button
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
      onPress={onCreateContent}
      isDisabled={!selectedLevel}
      className="h-14"
    >
      Crear Contenido
    </Button>
  </div>
);

export default ContentFilters;
