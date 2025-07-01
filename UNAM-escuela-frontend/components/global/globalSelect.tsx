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
        color="default"
        classNames={{
          trigger:
            "border-default-200 hover:border-default-300 !border-default-200",
          value: "text-default-700 !text-default-700",
          label: "text-default-600 !text-default-600",
          selectorIcon: "text-default-600 !text-default-600",
          listbox: "bg-content1",
          popoverContent: "bg-content1",
          ...classNames, // Permite override si se pasan classNames específicos
        }}
      />
    );
  }
);

GlobalSelect.displayName = "GlobalSelect";

export default GlobalSelect;
