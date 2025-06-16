"use client";
import React from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-theme.css";

interface MilkdownEditorClientProps {
  defaultValue: string;
  downloadFileName?: string;
}

const MilkdownEditorClient: FC<MilkdownEditorClientProps> = ({
  defaultValue,
  downloadFileName = "content.md",
}) => {
  const [editor, setEditor] = React.useState<Crepe | null>(null);

  useEditor(
    (root) => {
      const crepe = new Crepe({
        root,
        defaultValue,
      });
      setEditor(crepe);
      return crepe;
    },
    [defaultValue]
  );

  const handleDownload = () => {
    if (editor) {
      const markdownContent = editor.getMarkdown();
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <>
        <Milkdown />
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          📥 Download Markdown
        </button>
      </div>
    </>
  );
};

export default MilkdownEditorClient;
