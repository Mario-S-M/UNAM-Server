import React from "react";
import { Select, SelectProps } from "@heroui/react";

export interface GlobalSelectProps extends Omit<SelectProps, "error"> {
  errorMessage?: string;
}

const GlobalSelect = React.forwardRef<HTMLSelectElement, GlobalSelectProps>(
  ({ errorMessage, className, ...props }, ref) => {
    return (
      <Select
        ref={ref}
        {...props}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        className={`w-full ${className || ""} text-foreground`}
        variant="bordered"
      />
    );
  }
);

GlobalSelect.displayName = "GlobalSelect";

export default GlobalSelect;
