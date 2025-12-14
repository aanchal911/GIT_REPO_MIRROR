import { GitHubRepoData } from "../types";

export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const cleanUrl = url.replace(/\/$/, ""); // remove trailing slash
    const parts = cleanUrl.split("/");
    const repoIndex = parts.indexOf("github.com");
    
    if (repoIndex !== -1 && parts.length >= repoIndex + 3) {
      return {
        owner: parts[repoIndex + 1],
        repo: parts[repoIndex + 2],
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const fetchRepoDetails = async (owner: string, repo: string): Promise<GitHubRepoData> => {
  const baseUrl = "https://api.github.com/repos";
  
  // 1. Fetch Basic Metadata
  const metaRes = await fetch(`${baseUrl}/${owner}/${repo}`);
  if (!metaRes.ok) throw new Error("Repository not found or private.");
  const metaData = await metaRes.json();

  // 2. Fetch README
  let readmeContent = "";
  try {
    const readmeRes = await fetch(`${baseUrl}/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw" }
    });
    if (readmeRes.ok) {
      readmeContent = await readmeRes.text();
    }
  } catch (e) {
    console.warn("Could not fetch README");
  }

  // 3. Fetch File Tree (Truncated)
  let fileTree: string[] = [];
  try {
    const branchRes = await fetch(`${baseUrl}/${owner}/${repo}/commits/HEAD`);
    if (branchRes.ok) {
        const branchData = await branchRes.json();
        const treeSha = branchData.commit.tree.sha;
        
        const treeRes = await fetch(`${baseUrl}/${owner}/${repo}/git/trees/${treeSha}?recursive=1`);
        if (treeRes.ok) {
            const treeData = await treeRes.json();
            fileTree = treeData.tree.slice(0, 150).map((item: any) => item.path);
        }
    }
  } catch (e) {
    console.warn("Could not fetch file tree");
  }

  // 4. Fetch Recent Commits
  let recentCommits: { message: string; date: string }[] = [];
  try {
    const commitsRes = await fetch(`${baseUrl}/${owner}/${repo}/commits?per_page=10`);
    if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        recentCommits = commitsData.map((c: any) => ({
            message: c.commit.message,
            date: c.commit.author.date
        }));
    }
  } catch (e) {
      console.warn("Could not fetch commits");
  }

  return {
    owner,
    repo,
    description: metaData.description,
    stars: metaData.stargazers_count,
    language: metaData.language,
    readmeContent: readmeContent.slice(0, 10000), // Cap readme size
    fileTree,
    recentCommits
  };
};
