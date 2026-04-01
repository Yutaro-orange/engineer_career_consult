import { fetchGitHubRepositories } from "@/packages/server-core/infrastracture/githubClient";
import { GitHubLanguageEdge, GitHubRepository, LanguageStat, SkillPageData } from "@/packages/server-core/domain/skillResult";

export async function skillsUseCases(accessToken: string): Promise<SkillPageData> {
  const result = await fetchGitHubRepositories(accessToken);
  const repos = result.repositories;

  if (!result.success || !Array.isArray(repos)) {
    return { success: false, repos: [], overallLanguages: [], strengthLanguage: null };
  }

  const repoSummaries = repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    primaryLanguage: repo.primaryLanguage?.name ?? null,
    languages: aggregateLanguages(repo.languages.edges, repo.languages.totalSize),
  }));

  const overallLanguages = mergeLanguagesAcrossRepos(repos);
  const strengthLanguage = determineStrengthLanguage(overallLanguages);

  return { success: true, repos: repoSummaries, overallLanguages, strengthLanguage };
}

/** 言語バイト数から割合を計算し、1%未満を「その他」に集約 */
export function aggregateLanguages(edges: GitHubLanguageEdge[], totalSize: number): LanguageStat[] {
  if (totalSize === 0) return [];

  const languages: LanguageStat[] = [];
  edges.forEach((edge) => {
    const sizePercentage = (edge.size / totalSize) * 100;
    if (sizePercentage < 1) {
      const otherLang = languages.find((lang) => lang.name === "その他");
      if (otherLang) {
        otherLang.percentage += sizePercentage;
        otherLang.bytes += edge.size;
      } else {
        languages.push({
          name: "その他",
          percentage: sizePercentage,
          bytes: edge.size,
        });
      }
    } else {
      const lang = languages.find((lang) => lang.name === edge.node.name);
      if (lang) {
        lang.percentage += sizePercentage;
        lang.bytes += edge.size;
      } else {
        languages.push({
          name: edge.node.name,
          percentage: sizePercentage,
          bytes: edge.size,
        });
      }
    }
  });
  languages.forEach((language) => {
    language.percentage = Math.round(language.percentage);
  });
  languages.sort((a, b) => b.percentage - a.percentage);
  return languages;
}

/** 全リポジトリの言語バイト数を合算 */
export function mergeLanguagesAcrossRepos(repos: GitHubRepository[]): LanguageStat[] {
  const languages: LanguageStat[] = [];
  repos.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const lang = languages.find((lang) => lang.name === edge.node.name);
      if (lang) {
        lang.bytes += edge.size;
      } else {
        languages.push({
          name: edge.node.name,
          percentage: 0,
          bytes: edge.size,
        });
      }
    });
  });
  const edges: GitHubLanguageEdge[] = languages.map((lang) => ({
    size: lang.bytes,
    node: { name: lang.name },
  }));
  const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
  return aggregateLanguages(edges, totalBytes);
}

/** 最大の強み言語を特定（同率時Unicode昇順、入力は降順ソート済み前提） */
export function determineStrengthLanguage(languages: LanguageStat[]): string | null {
  if (!languages || languages.length === 0) {
    return null;
  }
  const maxPercentage = languages[0].percentage;
  const topLanguages = languages.filter((lang) => lang.percentage === maxPercentage);
  topLanguages.sort((a, b) => a.name.localeCompare(b.name));
  return topLanguages[0].name;
}
