import { Lenguage } from "../schemas/languageSchema";
import LanguageCard from "./LanguageCard";

interface LanguageCardProps {
  language: Lenguage[];
}

export default function LanguageGrid({ language }: LanguageCardProps) {
  return (
    <>
      {language.map((lang) => (
        <LanguageCard key={lang.id} language={lang} />
      ))}
    </>
  );
}
