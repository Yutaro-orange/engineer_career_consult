import * as fs from "fs";
import * as path from "path";
import { decrypt } from "@/packages/server-core/utilities/encryption";

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

const GITHUB_GRAPHQL_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100) {
        nodes {
          name
          description
          url
          primaryLanguage {
            name
          }
          languages(first: 1) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

function decryptToken(): string | null {
  const encrypted = process.env.GITHUB_TOKEN_ENCRYPTED;
  if (!encrypted) {
    return null;
  }

  const keyFilePath = path.resolve(process.cwd(), ".env.key");
  if (!fs.existsSync(keyFilePath)) {
    console.error(".env.key file not found");
    return null;
  }

  const key = fs.readFileSync(keyFilePath, "utf8").trim();
  return decrypt(encrypted, key);
}

export async function getSkillResult(): Promise<GitHubUserRepositories> {
  const username = process.env.GITHUB_USERNAME ?? "Yutaro-orange";

  let token: string | null = null;
  try {
    token = decryptToken();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to decrypt GITHUB_TOKEN:", error.message);
    }
  }

  if (!token) {
    console.error("GITHUB_TOKEN is not available (encrypted token missing or decryption failed)");
    return {
      data: { user: { repositories: { nodes: [] } } },
    };
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_GRAPHQL_QUERY,
        variables: { login: username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch from GitHub API:", error.message);
    }
    return {
      data: { user: { repositories: { nodes: [] } } },
    };
  }
}
