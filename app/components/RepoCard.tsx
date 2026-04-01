import { RepoSkillSummary } from '@/packages/server-core/domain/skillResult';
import { PieChart } from './PieChart';

export function RepoCard({ repo }: { repo: RepoSkillSummary }) {
  return (
    <li className="p-4 border rounded-lg">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-blue-600 hover:underline"
      >
        {repo.name}
      </a>
      {repo.primaryLanguage && (
        <span className="ml-2 text-sm text-gray-500">({repo.primaryLanguage})</span>
      )}
      {repo.description && <p className="text-gray-600 mt-1">{repo.description}</p>}
      {repo.languages.length > 0 && (
        <div className="mt-3 flex items-center gap-4">
          <PieChart data={repo.languages} size={100} strokeWidth={24} />
          <ul className="text-sm text-gray-600">
            {repo.languages.map((lang) => (
              <li key={lang.name}>
                {lang.name}: {lang.percentage}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
