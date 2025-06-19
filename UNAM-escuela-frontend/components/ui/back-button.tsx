"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function BackButton({
  label = "Volver",
  onClick,
  href,
  className = "mb-4",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      startContent={<ArrowLeft className="h-4 w-4" />}
      onPress={handleClick}
      className={className}
    >
      {label}
    </Button>
  );
}
