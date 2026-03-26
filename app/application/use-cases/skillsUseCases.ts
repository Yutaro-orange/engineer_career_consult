import { fetchGitHubRepositories } from "@/packages/server-core/infrastracture/githubClient";
import { GitHubLanguageEdge, GitHubRepository, LanguageStat, SkillPageData } from "@/packages/server-core/domain/skillResult";

export type SkillSummary = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
};

export async function skillsUseCases(): Promise<SkillPageData> {
  const result = await fetchGitHubRepositories();
  const repos = result.repositories;


  if (!result.success || !Array.isArray(repos)) {
    return { success: false, repos: [], overallLanguages: [], strengthLanguage: null };
  }

  // 1. repos フィールド（既存の map + 言語統計を追加）
  const repoSummaries = repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    primaryLanguage: repo.primaryLanguage?.name ?? null,
    languages: aggregateLanguages(repo.languages.edges, repo.languages.totalSize),
  }));
  // 2. overallLanguages（全リポジトリ横断の集計）
  const overallLanguages = mergeLanguagesAcrossRepos(repos);

  // 3. strengthLanguage（強み言語の判定）
  const strengthLanguage = determineStrengthLanguage(overallLanguages);

  return { success: true, repos: repoSummaries, overallLanguages, strengthLanguage };
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
    language.percentage = Math.round(language.percentage)
  });
  languages.sort((a, b) => b.percentage - a.percentage);
  return languages;
}

// 全リポジトリの言語ごとのbyte数を算出
export function mergeLanguagesAcrossRepos(repos: GitHubRepository[]){
  const languages: LanguageStat[] = []
  repos.forEach(repo => {
    //const languages = aggregateLanguages(repo.languages, repo.ed);
    repo.languages.edges.forEach((edge) => {
      
      const lang = languages.find((lang) => lang.name === edge.node.name);
      if (lang) {
        lang.bytes += edge.size;
      } else {
          languages.push({
          name: edge.node.name,
          percentage: 0, 
          bytes: edge.size
          });
        }
    });
  });
  const edges: GitHubLanguageEdge[] = languages.map(lang => ({
    size: lang.bytes,
    node: { name: lang.name },
  }));
  const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
  return aggregateLanguages(edges, totalBytes);
}

export function determineStrengthLanguage(languages: LanguageStat[]){
  if(!languages || languages.length === 0){
    return null;
  } else {
    const maxPercentage = languages[0].percentage;
    const topLanguages = languages.filter(lang => lang.percentage === maxPercentage);
    topLanguages.sort((a, b) => a.name.localeCompare(b.name));
    return topLanguages[0].name;
  }
}