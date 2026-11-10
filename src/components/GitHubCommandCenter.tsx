/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GitHubUserProfile, GitHubSyncStatus } from '../services/githubService';
import { ProjectItem } from '../types/portfolio';
import {
  GitBranch,
  RefreshCw,
  Star,
  Users,
  FolderGit2,
  ExternalLink,
  ShieldAlert,
  Clock,
  Terminal,
} from 'lucide-react';

interface GitHubCommandCenterProps {
  user: GitHubUserProfile | null;
  status: GitHubSyncStatus;
  projects: ProjectItem[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const GitHubCommandCenter: React.FC<GitHubCommandCenterProps> = ({
  user,
  status,
  projects,
  onRefresh,
  isLoading,
}) => {
  // Aggregate statistics
  const totalStars = projects.reduce((acc, p) => acc + p.stars, 0);
  const totalForks = projects.reduce((acc, p) => acc + p.forks, 0);

  // Language breakdown
  const languageCounts: Record<string, number> = {};
  projects.forEach((p) => {
    if (p.language) {
      languageCounts[p.language] = (languageCounts[p.language] || 0) + 1;
    }
  });

  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section id="github" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
              <Terminal className="w-4 h-4" />
              <span>Official GitHub REST API</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              GitHub Command Center
            </h2>
            <p className="text-base text-[#AAB7D4] max-w-2xl">
              Real-time telemetry and public repository distribution from @Mehedii364. Synchronized with
              intelligent caching and graceful rate limit adaptation.
            </p>
          </div>

          {/* Sync Trigger Action */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B1430] hover:bg-[#111C44] text-[#16BFFF] hover:text-white border border-[#1B254B] rounded-xl text-xs font-mono font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync GitHub API'}</span>
            </button>

            <a
              href="https://github.com/Mehedii364"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#16BFFF] hover:bg-[#00E5FF] text-[#070B18] font-semibold rounded-xl text-xs font-mono transition-colors shadow-md shadow-[#16BFFF]/20"
            >
              <span>View @Mehedii364</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Telemetry Warning / Status Bar if Rate Limited */}
        {status.error && (
          <div className="p-4 bg-[#0B1430] border border-amber-500/40 rounded-xl flex items-center gap-3 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <strong>Notice:</strong> {status.error}
            </div>
            {status.rateLimitReset && (
              <span className="font-mono text-[11px] text-[#AAB7D4]">
                Reset: {status.rateLimitReset}
              </span>
            )}
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAB7D4]">
              <span>Public Repos</span>
              <FolderGit2 className="w-4 h-4 text-[#16BFFF]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {user?.public_repos ?? projects.length}
            </div>
            <div className="text-[11px] font-mono text-[#16BFFF]">Active Open Source</div>
          </div>

          <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAB7D4]">
              <span>Total Stars</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {totalStars}
            </div>
            <div className="text-[11px] font-mono text-amber-400">Community Stars</div>
          </div>

          <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAB7D4]">
              <span>Total Forks</span>
              <GitBranch className="w-4 h-4 text-[#8B45FF]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {totalForks}
            </div>
            <div className="text-[11px] font-mono text-[#8B45FF]">Downstream Forks</div>
          </div>

          <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAB7D4]">
              <span>Followers</span>
              <Users className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {user?.followers ?? 8}
            </div>
            <div className="text-[11px] font-mono text-[#00E5FF]">GitHub Network</div>
          </div>
        </div>

        {/* Sync Metadata & Language Distribution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sync Health & Cache Inspector (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16BFFF]" />
              <span>Synchronization Protocol</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 bg-[#070B18] rounded-lg">
                <span className="text-[#AAB7D4]">Account Target:</span>
                <span className="text-white font-semibold">@Mehedii364</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#070B18] rounded-lg">
                <span className="text-[#AAB7D4]">Data Source:</span>
                <span className="text-[#00E5FF] uppercase font-semibold">{status.source}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#070B18] rounded-lg">
                <span className="text-[#AAB7D4]">Last Synchronized:</span>
                <span className="text-white">{status.lastSynced || 'Active'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#070B18] rounded-lg">
                <span className="text-[#AAB7D4]">Rate Limit Budget:</span>
                <span className="text-white">
                  {status.rateLimitRemaining !== null ? `${status.rateLimitRemaining}/60 req/hr` : 'Healthy'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#AAB7D4] leading-relaxed">
              * Client-side caching respects GitHub’s API quotas to prevent redundant queries on visitor page loads.
            </p>
          </div>

          {/* Language Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Primary Tech Stacks Across Repositories</span>
              <span className="text-xs font-mono text-[#AAB7D4]">{projects.length} Total Repos</span>
            </h3>

            {/* Language bars */}
            <div className="space-y-3">
              {sortedLanguages.map(([lang, count]) => {
                const percentage = Math.round((count / projects.length) * 100);
                return (
                  <div key={lang} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{lang}</span>
                      <span className="font-mono text-[#AAB7D4] tabular-nums">
                        {count} repos ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#070B18] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#16BFFF] to-[#8B45FF] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
