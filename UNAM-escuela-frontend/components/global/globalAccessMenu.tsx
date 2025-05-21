"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from "@heroui/react";
import { PersonStanding } from "lucide-react";
import { ToogleTheme } from "../ui/toggle-Theme";
import FontSizeChanger from "../ui/toggle-Font";
import { LetterSpacingToggle } from "../ui/letter-Spacing-Toggle";
import { HideImagesToggle } from "../ui/toggle-Images";
import { DyslexiaFontToggle } from "../ui/dyslexia-Font-Toggle";
import { LineSpacingToggle } from "../ui/line-Spacing-Toggle";

export default function GlobalAccessMenu() {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button isIconOnly radius="full" size="lg" className="text-background">
          <PersonStanding size={54} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 p-4">
          <ToogleTheme />
          <FontSizeChanger />
          <LetterSpacingToggle />
          <HideImagesToggle />
          <DyslexiaFontToggle />
          <LineSpacingToggle />
        </div>
      </PopoverContent>
    </Popover>
  );
}