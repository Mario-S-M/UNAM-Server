import React from "react";
import type { FC } from "react";
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
          <p className="text-default-500 text-lg">
            Edit and download your English grammar lessons
          </p>
        </div>
          <MilkdownEditorClient
            defaultValue={markdown}
            downloadFileName="verb-to-be-english.md"
          />
      </div>
    </div>
  );
};

export default ContentPage;
