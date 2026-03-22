import * as fs from "fs";
import * as path from "path";
import { decrypt } from "../utilities/encryption";
import {
  GitHubLanguageEdge,
  GitHubUserRepositories,
  SkillFetchResult,
} from "../domain/skillResult";

const GITHUB_GRAPHQL_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100, privacy: PUBLIC) {
        nodes {
          name
          description
          url
          primaryLanguage {
            name
          }
          languages(first: 20) {
            totalSize
            edges {
              size
              node {
                name
              }
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

// GitHub APIからリポジトリ情報を取得する関数

export async function fetchGitHubRepositories(): Promise<SkillFetchResult> {
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
    console.error(
      "GITHUB_TOKEN is not available (encrypted token missing or decryption failed)"
    );
    return { repositories: [], success: false };
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
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const json: GitHubUserRepositories = await response.json();
    return {
      repositories: json.data.user.repositories.nodes,
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch from GitHub API:", error.message);
    }
    return { repositories: [], success: false };
  }
}