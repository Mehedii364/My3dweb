/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProjectItem } from '../types/portfolio';
import { X, ExternalLink, BookOpen, Star, GitFork, Calendar, Code2 } from 'lucide-react';

interface ReadmeModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0B1430] border border-[#1B254B] rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-left">
        {/* Top bar */}
        <div className="p-4 sm:p-6 border-b border-[#1B254B] flex items-center justify-between bg-[#070B18]">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#16BFFF]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>README.md Inspector</span>
            </div>
            <h3 className="text-xl font-bold text-white">{project.name}</h3>
            <div className="text-xs font-mono text-[#AAB7D4]">repo: @{project.repoName}</div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#AAB7D4] hover:text-white bg-[#0B1430] hover:bg-[#111C44] rounded-lg border border-[#1B254B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Metrics Strip */}
        <div className="px-6 py-3 bg-[#070B18]/50 border-b border-[#1B254B] flex flex-wrap items-center gap-6 text-xs font-mono text-[#AAB7D4]">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#16BFFF]" />
            <span className="text-white">{project.language}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{project.stars} stars</span>
          </div>

          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-[#8B45FF]" />
            <span>{project.forks} forks</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Last updated: {project.updatedAt}</span>
          </div>
        </div>

        {/* Readme Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#F4F7FF] leading-relaxed">
          <div className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#16BFFF]">
              Repository Description
            </div>
            <p className="text-[#AAB7D4]">{project.description}</p>
          </div>

          {project.readmeContent ? (
            <div className="prose prose-invert max-w-none space-y-4 whitespace-pre-line font-mono text-xs bg-[#070B18] p-4 rounded-xl border border-[#1B254B]">
              {project.readmeContent}
            </div>
          ) : (
            <div className="p-6 bg-[#070B18] rounded-xl border border-[#1B254B] text-center space-y-2">
              <p className="text-[#AAB7D4]">
                Detailed markdown documentation available directly on GitHub.
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
              Architecture Tags &amp; Libraries
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#070B18] border border-[#1B254B] rounded-lg text-xs font-mono text-[#00E5FF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#1B254B] bg-[#070B18] flex items-center justify-between">
          <span className="text-xs font-mono text-[#AAB7D4]">Author: Md. Mehedi Hasan (@Mehedii364)</span>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#16BFFF] hover:bg-[#00E5FF] text-[#070B18] font-bold rounded-xl text-xs font-mono transition-colors"
          >
            <span>Open on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
