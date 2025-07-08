"use client";

import { useActiveLenguages } from "@/app/hooks/use-lenguages";

export default function LanguageTest() {
  const { data: languages, isLoading, error } = useActiveLenguages(false);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Language Test Component</h3>
      <p>Loading: {isLoading ? "Yes" : "No"}</p>
      <p>Error: {error ? error.message : "None"}</p>
      <p>Languages count: {languages?.length || 0}</p>
      <ul>
        {languages?.map((lang: any) => (
          <li key={lang.id}>
            {lang.name} - {lang.isActive ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  );
}
