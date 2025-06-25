import React from "react";
import { Select, SelectProps } from "@heroui/react";

export interface GlobalSelectProps extends Omit<SelectProps, "error"> {
  errorMessage?: string;
}

const GlobalSelect = React.forwardRef<HTMLSelectElement, GlobalSelectProps>(
  ({ errorMessage, className, classNames, ...props }, ref) => {
    return (
      <Select
        ref={ref}
        {...props}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        className={`w-full ${className || ""} text-foreground`}
        variant="bordered"
        classNames={{
          trigger: "border-default-200 hover:border-default-300",
          value: "text-default-700",
          label: "text-default-600",
          selectorIcon: "text-default-600", // Fuerza el color del icono
          ...classNames, // Permite override si se pasan classNames específicos
        }}
      />
    );
  }
);

GlobalSelect.displayName = "GlobalSelect";

export default GlobalSelect;
