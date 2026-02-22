import { getSkillResult, GitHubRepository } from "@/packages/server-core/domain/skillResult";

export type SkillSummary = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
};

export async function skillsUseCases(): Promise<SkillSummary[]> {
  const apiResponse = await getSkillResult();
  const repos = apiResponse.data.user.repositories.nodes;

  return repos.map((repo: GitHubRepository): SkillSummary => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    primaryLanguage: repo.primaryLanguage?.name ?? null,
  }));
}
