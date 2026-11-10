/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectItem } from '../types/portfolio';
import { INITIAL_PROJECTS } from '../data/initialData';

const GITHUB_USERNAME = 'Mehedii364';
const CACHE_KEY_USER = 'mehedi3d_gh_user_cache';
const CACHE_KEY_REPOS = 'mehedi3d_gh_repos_cache';
const CACHE_KEY_TIME = 'mehedi3d_gh_cache_time';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubSyncStatus {
  lastSynced: string | null;
  rateLimitRemaining: number | null;
  rateLimitTotal: number | null;
  rateLimitReset: string | null;
  source: 'live' | 'cache' | 'fallback';
  error?: string;
}

export async function fetchGitHubUser(forceRefresh = false): Promise<{
  user: GitHubUserProfile | null;
  status: GitHubSyncStatus;
}> {
  const cachedData = localStorage.getItem(CACHE_KEY_USER);
  const cacheTime = localStorage.getItem(CACHE_KEY_TIME);
  const now = Date.now();

  if (!forceRefresh && cachedData && cacheTime && now - parseInt(cacheTime, 10) < CACHE_TTL_MS) {
    try {
      const user = JSON.parse(cachedData);
      return {
        user,
        status: {
          lastSynced: new Date(parseInt(cacheTime, 10)).toLocaleString(),
          rateLimitRemaining: null,
          rateLimitTotal: 60,
          rateLimitReset: null,
          source: 'cache',
        },
      };
    } catch {
      // parse error, continue to fetch
    }
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const rateRemaining = res.headers.get('x-ratelimit-remaining');
    const rateTotal = res.headers.get('x-ratelimit-limit');
    const rateReset = res.headers.get('x-ratelimit-reset');

    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        // Rate limited
        if (cachedData) {
          return {
            user: JSON.parse(cachedData),
            status: {
              lastSynced: cacheTime ? new Date(parseInt(cacheTime, 10)).toLocaleString() : null,
              rateLimitRemaining: 0,
              rateLimitTotal: 60,
              rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : null,
              source: 'cache',
              error: 'GitHub API rate limit reached. Showing cached account information.',
            },
          };
        }
        return {
          user: null,
          status: {
            lastSynced: null,
            rateLimitRemaining: 0,
            rateLimitTotal: 60,
            rateLimitReset: null,
            source: 'fallback',
            error: 'GitHub API rate limit reached. Displaying verified local profile.',
          },
        };
      }
      throw new Error(`GitHub API error: ${res.statusText}`);
    }

    const user: GitHubUserProfile = await res.json();
    localStorage.setItem(CACHE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(CACHE_KEY_TIME, now.toString());

    return {
      user,
      status: {
        lastSynced: new Date(now).toLocaleString(),
        rateLimitRemaining: rateRemaining ? parseInt(rateRemaining, 10) : 60,
        rateLimitTotal: rateTotal ? parseInt(rateTotal, 10) : 60,
        rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : null,
        source: 'live',
      },
    };
  } catch (err: unknown) {
    if (cachedData) {
      return {
        user: JSON.parse(cachedData),
        status: {
          lastSynced: cacheTime ? new Date(parseInt(cacheTime, 10)).toLocaleString() : null,
          rateLimitRemaining: null,
          rateLimitTotal: null,
          rateLimitReset: null,
          source: 'cache',
          error: (err as Error).message,
        },
      };
    }
    return {
      user: null,
      status: {
        lastSynced: null,
        rateLimitRemaining: null,
        rateLimitTotal: null,
        rateLimitReset: null,
        source: 'fallback',
        error: (err as Error).message,
      },
    };
  }
}

export async function fetchGitHubRepos(forceRefresh = false): Promise<{
  projects: ProjectItem[];
  status: GitHubSyncStatus;
}> {
  const cachedRepos = localStorage.getItem(CACHE_KEY_REPOS);
  const cacheTime = localStorage.getItem(CACHE_KEY_TIME);
  const now = Date.now();

  if (!forceRefresh && cachedRepos && cacheTime && now - parseInt(cacheTime, 10) < CACHE_TTL_MS) {
    try {
      const projects = JSON.parse(cachedRepos);
      return {
        projects,
        status: {
          lastSynced: new Date(parseInt(cacheTime, 10)).toLocaleString(),
          rateLimitRemaining: null,
          rateLimitTotal: 60,
          rateLimitReset: null,
          source: 'cache',
        },
      };
    } catch {
      // Continue to fetch
    }
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const rateRemaining = res.headers.get('x-ratelimit-remaining');
    const rateTotal = res.headers.get('x-ratelimit-limit');
    const rateReset = res.headers.get('x-ratelimit-reset');

    if (!res.ok) {
      if (cachedRepos) {
        return {
          projects: JSON.parse(cachedRepos),
          status: {
            lastSynced: cacheTime ? new Date(parseInt(cacheTime, 10)).toLocaleString() : null,
            rateLimitRemaining: 0,
            rateLimitTotal: 60,
            rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : null,
            source: 'cache',
            error: 'GitHub API rate limit reached. Serving cached repositories.',
          },
        };
      }
      return {
        projects: INITIAL_PROJECTS,
        status: {
          lastSynced: 'Pre-indexed dataset',
          rateLimitRemaining: 0,
          rateLimitTotal: 60,
          rateLimitReset: null,
          source: 'fallback',
          error: 'GitHub rate limited. Displaying curated repository catalog.',
        },
      };
    }

    interface RawGitHubRepo {
      id: number;
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
      html_url: string;
      homepage: string | null;
      fork: boolean;
      archived: boolean;
      topics?: string[];
    }

    const rawRepos: RawGitHubRepo[] = await res.json();

    // Map fetched repositories and cross-reference with initial project catalog
    const mappedProjects: ProjectItem[] = rawRepos.map((repo) => {
      const existing = INITIAL_PROJECTS.find(
        (p) => p.repoName.toLowerCase() === repo.name.toLowerCase()
      );

      const category = ((): 'wafa' | 'android' | 'web' | 'tools' | 'other' => {
        const lower = repo.name.toLowerCase();
        if (lower.startsWith('wafa')) return 'wafa';
        if (repo.language?.toLowerCase() === 'kotlin' || repo.language?.toLowerCase() === 'java') return 'android';
        if (repo.language?.toLowerCase() === 'php' || repo.language?.toLowerCase() === 'javascript' || repo.language?.toLowerCase() === 'typescript') return 'web';
        return 'tools';
      })();

      return {
        id: existing?.id || `repo-${repo.id}`,
        name: existing?.name || repo.name.replace(/[-_]/g, ' '),
        repoName: repo.name,
        description: existing?.description || repo.description || 'Public open-source repository by Md. Mehedi Hasan.',
        category: existing?.category || category,
        language: repo.language || existing?.language || 'Code',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updatedAt: repo.updated_at ? repo.updated_at.split('T')[0] : 'Recent',
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || existing?.liveUrl,
        featured: existing?.featured ?? (repo.stargazers_count > 0),
        isFork: repo.fork,
        archived: repo.archived,
        tags: existing?.tags || [repo.language || 'Software', 'Open Source', 'GitHub'],
        readmeContent: existing?.readmeContent,
      };
    });

    // Make sure all curated initial projects are also preserved if not yet in public GitHub fetch
    for (const initP of INITIAL_PROJECTS) {
      if (!mappedProjects.some((mp) => mp.repoName.toLowerCase() === initP.repoName.toLowerCase())) {
        mappedProjects.push(initP);
      }
    }

    localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify(mappedProjects));
    localStorage.setItem(CACHE_KEY_TIME, now.toString());

    return {
      projects: mappedProjects,
      status: {
        lastSynced: new Date(now).toLocaleString(),
        rateLimitRemaining: rateRemaining ? parseInt(rateRemaining, 10) : 60,
        rateLimitTotal: rateTotal ? parseInt(rateTotal, 10) : 60,
        rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : null,
        source: 'live',
      },
    };
  } catch (err: unknown) {
    if (cachedRepos) {
      return {
        projects: JSON.parse(cachedRepos),
        status: {
          lastSynced: cacheTime ? new Date(parseInt(cacheTime, 10)).toLocaleString() : null,
          rateLimitRemaining: null,
          rateLimitTotal: null,
          rateLimitReset: null,
          source: 'cache',
          error: (err as Error).message,
        },
      };
    }
    return {
      projects: INITIAL_PROJECTS,
      status: {
        lastSynced: 'Pre-indexed dataset',
        rateLimitRemaining: null,
        rateLimitTotal: null,
        rateLimitReset: null,
        source: 'fallback',
        error: (err as Error).message,
      },
    };
  }
}
