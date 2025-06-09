"use client";
import React from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const markdown = `# The Verb "To Be" in English 🌟

> Understanding the foundation of English grammar

## Present Simple Form

| Subject | Positive | Negative | Question |
|---------|----------|-----------|-----------|
| I       | am       | am not    | am I?     |
| You     | are      | are not   | are you?  |
| He/She/It| is      | is not    | is he/she/it? |
| We      | are      | are not   | are we?   |
| They    | are      | are not   | are they? |

## Common Uses ✨

* **Location**: Where *is* the library?
* **Description**: She *is* intelligent
* **Age**: I *am* 25 years old
* **Nationality**: They *are* Mexican
* **Profession**: He *is* a teacher

## Examples in Context 📚

1. *"I am* happy to learn English!"
2. *"You are* making great progress."
3. *"She is* the best student in class.

> Remember: The verb "to be" is one of the most important verbs in English.
> It helps us express who we are and describe the world around us.

---
*Practice makes perfect! Keep learning and growing.* 🌱`;

export const MilkdownEditor: FC = () => {
  const [editor, setEditor] = React.useState<Crepe | null>(null);

  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: markdown,
    });
    setEditor(crepe);
    return crepe;
  }, []);

  const handleDownload = () => {
    if (editor) {
      const markdownContent = editor.getMarkdown();
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "verb-to-be-english.md";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div>
      <Milkdown />
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Download Markdown
      </button>
    </div>
  );
};

export default MilkdownEditor;
