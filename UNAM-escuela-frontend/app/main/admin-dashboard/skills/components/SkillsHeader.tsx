import React from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { Plus, ArrowLeft, Search } from "lucide-react";

interface SkillsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onCreate: () => void;
}

const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onCreate,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Link href="/main/admin-dashboard">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold">Gestión de Skills</h1>
        <p className="text-default-600">
          Administra las habilidades del sistema
        </p>
      </div>
    </div>
    <Button
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
      onPress={onCreate}
    >
      Nueva Skill
    </Button>
    <div className="w-full sm:max-w-[44%] ml-4">
      <Input
        isClearable
        placeholder="Buscar skills..."
        startContent={<Search className="h-4 w-4" />}
        value={searchTerm}
        onClear={() => setSearchTerm("")}
        onValueChange={setSearchTerm}
      />
    </div>
  </div>
);

export default SkillsHeader;
