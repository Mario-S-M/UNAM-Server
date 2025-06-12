import React from "react";
import { Input, InputProps } from "@heroui/react";

export interface GlobalInputProps extends Omit<InputProps, "error"> {
  errorMessage?: string;
}

const GlobalInput = React.forwardRef<HTMLInputElement, GlobalInputProps>(
  ({ errorMessage, className, ...props }, ref) => {
    return (
      <Input
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

GlobalInput.displayName = "GlobalInput";

export default GlobalInput;
