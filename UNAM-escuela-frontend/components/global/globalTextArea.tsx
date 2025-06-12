import React from "react";
import { Textarea, TextAreaProps } from "@heroui/react";

export interface GlobalTextAreaProps extends Omit<TextAreaProps, "error"> {
  errorMessage?: string;
}

const GlobalTextArea = React.forwardRef<
  HTMLTextAreaElement,
  GlobalTextAreaProps
>(({ errorMessage, className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      {...props}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      className={`w-full ${className || ""} text-foreground`}
      variant="bordered"
    />
  );
});

GlobalTextArea.displayName = "GlobalTextArea";

export default GlobalTextArea;
