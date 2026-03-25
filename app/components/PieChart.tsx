import { LanguageStat } from "@/packages/server-core/domain/skillResult";

type PieChartProps = {
  data: LanguageStat[];
  size?: number;
  strokeWidth?: number;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  その他: "#cccccc",
};

function getColor(name: string, index: number): string {
  if (LANGUAGE_COLORS[name]) return LANGUAGE_COLORS[name];
  const fallback = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];
  return fallback[index % fallback.length];
}

export function PieChart({ data, size = 160, strokeWidth = 32 }: PieChartProps) {
  if (data.length === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativeOffset = 0;

  const label = data.map((d) => `${d.name} ${d.percentage}%`).join(", ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`言語割合: ${label}`}
    >
      {data.map((lang, i) => {
        const dashLength = (lang.percentage / 100) * circumference;
        const dashOffset = -cumulativeOffset;
        cumulativeOffset += dashLength;

        return (
          <circle
            key={lang.name}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getColor(lang.name, i)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        );
      })}
    </svg>
  );
}
