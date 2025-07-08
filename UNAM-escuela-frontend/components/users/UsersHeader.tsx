import React from "react";
import { UsersHeaderProps } from "@/app/interfaces/users-interfaces";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

export const UsersHeader: React.FC<UsersHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="text-foreground"
        onPress={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        <p className="text-foreground/70">{subtitle}</p>
      </div>
    </div>
  </div>
);
