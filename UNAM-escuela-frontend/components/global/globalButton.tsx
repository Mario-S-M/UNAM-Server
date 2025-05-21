import { Button } from "@heroui/react";

interface GlobalButtonProps {
  onPress?: () => void;
  text?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default"|"primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "ghost";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isIconOnly?: boolean;
  type?: "submit" | "button" | "reset";
  children?: React.ReactNode;
  onClick?: () => void; // Añadimos onClick como prop opcional
}

const GlobalButton = ({
  onPress,
  text,
  isDisabled = false,
  isLoading = false,
  size = "lg",
  color = "primary",
  variant = "solid",
  startContent = "",
  endContent = "",
  isIconOnly = false,
  type = "button",
  children,
  onClick,
}: GlobalButtonProps) => {
  return (
    <Button
      type={type}
      isDisabled={isDisabled}
      size={size}
      radius="lg"
      color={color}
      variant={variant}
      isLoading={isLoading}
      endContent={endContent}
      startContent={startContent}
      isIconOnly={isIconOnly}
      onPress={onPress}
      onClick={onClick}
    >
      {children || text}
    </Button>
  );
};

export default GlobalButton;
