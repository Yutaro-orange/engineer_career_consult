export type GitHubLanguage = {
  name: string;
};

/** 言語エッジ（名前+バイト数） */
export type GitHubLanguageEdge = {
  size: number;
  node: {
    name: string;
  };
};

export type GitHubRepository = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: GitHubLanguage | null;
  languages: {
    totalSize: number;
    edges: GitHubLanguageEdge[];
  };
};

/** 取得結果（成功/失敗を判別可能） */
export type SkillFetchResult = {
  repositories: GitHubRepository[];
  success: boolean;
};

export type LanguageStat = {
  name: string;       // 言語名（「その他」を含む）
  percentage: number;  // 四捨五入済みパーセンテージ（整数）
  bytes: number;       // 元のバイト数
};

/** リポジトリ別スキルサマリー */
export type RepoSkillSummary = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: string | null;
  languages: LanguageStat[];  // 降順、1%未満は「その他」に集約済み
};


export type SkillPageData = {
  success: boolean;
  repos: RepoSkillSummary[];
  overallLanguages: LanguageStat[];  // 全リポジトリ横断、降順
  strengthLanguage: string | null;    // 最大の強み言語（null=データなし）
};