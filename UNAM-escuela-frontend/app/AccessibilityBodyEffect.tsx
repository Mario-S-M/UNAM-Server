"use client";
import { useAccessibility } from "@/app/providers";
import React from "react";

export default function AccessibilityBodyEffect() {
  const { fontSize, letterSpacing, lineSpacing } = useAccessibility();
  React.useEffect(() => {
    const fontSizeClass =
      fontSize === "sm"
        ? "text-[16px]"
        : fontSize === "lg"
        ? "text-[24px]"
        : "text-[20px]";
    const letterSpacingClass =
      letterSpacing === "wide"
        ? "tracking-wide"
        : letterSpacing === "wider"
        ? "tracking-wider"
        : "tracking-normal";
    const lineSpacingClass =
      lineSpacing === "relaxed"
        ? "leading-relaxed"
        : lineSpacing === "loose"
        ? "leading-loose"
        : "leading-normal";
    document.body.classList.remove(
      "text-[16px]",
      "text-[20px]",
      "text-[24px]",
      "tracking-normal",
      "tracking-wide",
      "tracking-wider",
      "leading-normal",
      "leading-relaxed",
      "leading-loose"
    );
    document.body.classList.add(
      fontSizeClass,
      letterSpacingClass,
      lineSpacingClass
    );
    return () => {
      document.body.classList.remove(
        fontSizeClass,
        letterSpacingClass,
        lineSpacingClass
      );
    };
  }, [fontSize, letterSpacing, lineSpacing]);
  return null;
}
