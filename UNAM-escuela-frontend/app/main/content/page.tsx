import React from "react";
import type { FC } from "react";
import Link from "next/link";
import MilkdownEditorClient from "../../../components/global/milkdown-editor-client";

// Server component that provides the markdown content
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
3. *"She is* the best student in class."

> Remember: The verb "to be" is one of the most important verbs in English.
> It helps us express who we are and describe the world around us.

---
*Practice makes perfect! Keep learning and growing.* 🌱`;

// Server Component
const ContentPage: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            English Grammar Content Editor
          </h1>
          <p className="text-default-500 text-lg mb-6">
            Edit and download your English grammar lessons
          </p>

          {/* Navigation cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">
                🔄 Editor con Auto-Guardado
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Prueba el nuevo editor con guardado automático cada 5 segundos
              </p>
              <Link
                href="/main/content/auto-save-demo"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Demo →
              </Link>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                📝 Editor Estándar
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Editor tradicional con descarga manual de contenido
              </p>
              <div className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg">
                Actual →
              </div>
            </div>
          </div>
        </div>

        {/* Editor estándar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Editor Estándar</h2>
          <MilkdownEditorClient
            defaultValue={markdown}
            downloadFileName="verb-to-be-english.md"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
