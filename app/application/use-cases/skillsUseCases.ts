import { fetchGitHubRepositories } from "@/packages/server-core/infrastracture/githubClient";
import { GitHubLanguageEdge, GitHubRepository, LanguageStat } from "@/packages/server-core/domain/skillResult";

export type SkillSummary = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
};

export async function skillsUseCases(): Promise<SkillSummary[]> {
  const result = await fetchGitHubRepositories();
  const repos = result.repositories;

  if (!result.success || !Array.isArray(repos)) {
    return [];
  }

  return repos.map((repo: GitHubRepository): SkillSummary => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    primaryLanguage: repo.primaryLanguage?.name ?? null,
  }));
}

/** 言語バイト数から割合を計算し、1%未満を「その他」に集約 */
export function aggregateLanguages(edges: GitHubLanguageEdge[], totalSize: number
){
  const languages:LanguageStat[] = [];
  edges.forEach((edge) => {
    const sizePercentage = (edge.size / totalSize) * 100;
    if(sizePercentage < 1) {
      const otherLang = languages.find((lang) => lang.name === "その他")
      if(otherLang){
        otherLang.percentage += sizePercentage;
        otherLang.bytes += edge.size;
      } else{
          languages.push({
          name: "その他",
          percentage: sizePercentage,
          bytes: edge.size,
          });
      }
    } else {
      const lang = languages.find((lang) => lang.name === edge.node.name;
      if (lang) {
        lang.percentage += sizePercentage;
        lang.bytes += edge.size;
      } else{
          languages.push({
          name: edge.node.name,
          percentage: sizePercentage,
          bytes: edge.size,
          });
      }
    }
  });



}