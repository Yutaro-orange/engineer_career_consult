import { RepoSkillSummary } from "@/packages/server-core/domain/skillResult";

export function RepoCard({ repo }: { repo: RepoSkillSummary }) {
    if (!repo) return null;
    return (
    <div className="repoSkillSummary">
        <a href={repo.url} target="_blank" rel="noopener noreferrer">
        {repo.name}
        </a>
        {repo.primaryLanguage && <span>{repo.primaryLanguage}</span>}
        {repo.description && <p>{repo.description}</p>}
    </div>
    );
}