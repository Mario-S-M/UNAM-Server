import { addToast } from "@heroui/toast";
import GlobalButton from "./globalButton";

interface GlobalToastProps {
  // Propiedades del botón
  onPress?: () => void;
  text?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "ghost";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isIconOnly?: boolean;

  // Propiedades del toast
  toastTitle?: string;
  toastDescription?: string;
  toastColor?: "primary" | "secondary" | "success" | "warning" | "danger";
}

const GlobalToast = ({
  onPress,
  text = "Mostrar mensaje",
  isDisabled = false,
  isLoading = false,
  size = "lg",
  color = "primary",
  variant = "solid",
  startContent = "",
  endContent = "",
  isIconOnly = false,
  toastTitle = "Título",
  toastDescription = "",
  toastColor = "primary",
}: GlobalToastProps) => {
  const handlePress = () => {
    addToast({
      title: toastTitle,
      description: toastDescription,
      color: toastColor,
    });
  };

  return (
    <GlobalButton
      onPress={onPress || handlePress}
      text={text}
      isDisabled={isDisabled}
      isLoading={isLoading}
      size={size}
      color={color}
      variant={variant}
      startContent={startContent}
      endContent={endContent}
      isIconOnly={isIconOnly}
    />
  );
};

export default GlobalToast;
