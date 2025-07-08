import React from "react";
import { Chip } from "@heroui/react";

interface ContentValidationChipProps {
  validationStatus: string;
}

const ContentValidationChip: React.FC<ContentValidationChipProps> = ({
  validationStatus,
}) => (
  <Chip
    size="sm"
    color={validationStatus === "validado" ? "success" : "danger"}
    variant="dot"
  >
    {validationStatus === "validado" ? "Validado" : "Sin validar"}
  </Chip>
);

export default ContentValidationChip;
