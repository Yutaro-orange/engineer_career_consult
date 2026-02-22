import { execSync } from "child_process";
import path from "path";

export type GitHubLanguage = {
  name: string;
};

export type GitHubRepository = {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: GitHubLanguage | null;
  languages: {
    nodes: GitHubLanguage[];
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

export function getSkillResult(): GitHubUserRepositories {
  const cwd = process.cwd();
  const queryFilePath = path.join(cwd, "query.graphql");

  try {
    const command = `gh api graphql -F query=@"${queryFilePath}"`;
    const stdout = execSync(command, {
      cwd,
      encoding: "utf-8",
      timeout: 15000,
    });

    return JSON.parse(stdout);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to execute gh CLI:", error.message);
    }
    return {
      data: {
        user: {
          repositories: {
            nodes: [],
          },
        },
      },
    };
  }
}
