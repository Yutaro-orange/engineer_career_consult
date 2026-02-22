import { getSkillResult, GitHubRepository } from "@/packages/server-core/domain/skillResult";

export type SkillSummary = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
};

// APIから取得したスキル情報を加工して表示するためのユースケース
export function skillsUseCases(): SkillSummary[] {
  const apiResponse = getSkillResult();
  const repos = apiResponse.data.user.repositories.nodes;

  return repos.map((repo: GitHubRepository): SkillSummary => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    primaryLanguage: repo.primaryLanguage?.name ?? null,
  }));
}
