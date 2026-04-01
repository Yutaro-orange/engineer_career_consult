import { GitHubRepository, SkillFetchResult } from '../domain/skillResult';

const GITHUB_GRAPHQL_QUERY = `
  query {
    viewer {
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

type GitHubViewerRepositories = {
  data: {
    viewer: {
      repositories: {
        nodes: GitHubRepository[];
      };
    };
  };
};

export async function fetchGitHubRepositories(accessToken: string): Promise<SkillFetchResult> {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_GRAPHQL_QUERY,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const json: GitHubViewerRepositories = await response.json();
    return {
      repositories: json.data.viewer.repositories.nodes,
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to fetch from GitHub API:', error.message);
    }
    return { repositories: [], success: false };
  }
}
