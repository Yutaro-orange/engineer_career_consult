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

export type GitHubUserRepositories = {
  data: {
    user: {
      repositories: {
        nodes: GitHubRepository[];
      };
    };
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