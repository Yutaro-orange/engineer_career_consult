import { LanguageStat } from "@/packages/server-core/domain/skillResult";
import { PieChart } from "./PieChart";

export function OverallLanguageChart({ languages }: { languages: LanguageStat[] }) {
  if (languages.length === 0) return null;

  return (
    <div>
      <PieChart data={languages} />
      <ul>
        {languages.map((lang) => (
          <li key={lang.name}>
            {lang.name}: {lang.percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
}