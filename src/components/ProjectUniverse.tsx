/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Search,
  BookOpen,
  Calendar,
  Layers,
  Code2,
} from 'lucide-react';

interface ProjectUniverseProps {
  projects: ProjectItem[];
  onOpenReadme: (project: ProjectItem) => void;
}

export const ProjectUniverse: React.FC<ProjectUniverseProps> = ({
  projects,
  onOpenReadme,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'featured' | 'wafa' | 'android' | 'web' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    // Category check
    if (categoryFilter === 'featured' && !project.featured) return false;
    if (categoryFilter === 'wafa' && project.category !== 'wafa') return false;
    if (categoryFilter === 'android' && project.category !== 'android') return false;
    if (categoryFilter === 'web' && project.category !== 'web') return false;
    if (categoryFilter === 'tools' && project.category !== 'tools') return false;

    // Search check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = project.name.toLowerCase().includes(q) || project.repoName.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchLang = project.language.toLowerCase().includes(q);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchLang || matchTags;
    }

    return true;
  });

  const categories: { id: typeof categoryFilter; label: string }[] = [
    { id: 'all', label: `All Repositories (${projects.length})` },
    { id: 'featured', label: `Featured (${projects.filter((p) => p.featured).length})` },
    { id: 'wafa', label: `Wafa Zone Suite (${projects.filter((p) => p.category === 'wafa').length})` },
    { id: 'android', label: `Android Apps (${projects.filter((p) => p.category === 'android').length})` },
    { id: 'web', label: `Web & PHP (${projects.filter((p) => p.category === 'web').length})` },
    { id: 'tools', label: `Developer Tools (${projects.filter((p) => p.category === 'tools').length})` },
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
              <FolderGit2 className="w-4 h-4" />
              <span>GitHub &amp; Wafa Zone Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Project Universe
            </h2>
            <p className="text-base text-[#AAB7D4] max-w-2xl">
              Authentic software repositories authored by Md. Mehedi Hasan. Sourced directly from GitHub
              (@Mehedii364) with verified descriptions, architecture notes, and code repositories.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#AAB7D4] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or stack..."
              className="w-full bg-[#0B1430] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl outline-none placeholder-[#AAB7D4]/60 transition-colors"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1B254B] pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] font-bold shadow-md shadow-[#16BFFF]/20'
                  : 'bg-[#0B1430] text-[#AAB7D4] hover:text-white hover:bg-[#111C44] border border-[#1B254B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-3">
            <p className="text-base text-white font-medium">No projects found matching your search.</p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#16BFFF] hover:underline"
            >
              Clear filters and view all repositories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-[#0B1430] border border-[#1B254B] rounded-2xl p-6 flex flex-col justify-between hover:border-[#16BFFF]/60 hover:shadow-xl hover:shadow-[#16BFFF]/5 transition-all duration-300 text-left"
              >
                <div className="space-y-4">
                  {/* Top Bar: Category badge & Metrics */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-[#00E5FF]">
                      <Layers className="w-3.5 h-3.5 text-[#16BFFF]" />
                      <span className="uppercase">{project.category}</span>
                    </span>

                    <div className="flex items-center gap-3 text-[#AAB7D4] tabular-nums">
                      <span className="flex items-center gap-1" title="Stars">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center gap-1" title="Forks">
                        <GitFork className="w-3.5 h-3.5 text-[#16BFFF]" />
                        <span>{project.forks}</span>
                      </span>
                    </div>
                  </div>

                  {/* Project Title & Repo Link */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#16BFFF] transition-colors flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      {project.featured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8B45FF]/20 text-[#8B45FF] border border-[#8B45FF]/40 rounded shrink-0 ml-2">
                          FEATURED
                        </span>
                      )}
                    </h3>
                    <div className="text-xs font-mono text-[#AAB7D4] mt-0.5 truncate">
                      @{project.repoName}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#AAB7D4] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#070B18] text-[#AAB7D4] border border-[#1B254B] rounded text-[11px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-5 mt-5 border-t border-[#1B254B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#AAB7D4] font-mono text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-[#16BFFF]" />
                    <span className="text-white">{project.language}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{project.updatedAt}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Readme Modal Trigger */}
                    <button
                      onClick={() => onOpenReadme(project)}
                      className="p-1.5 text-[#AAB7D4] hover:text-[#00E5FF] hover:bg-[#111C44] rounded-lg transition-colors"
                      title="Inspect README and Architecture"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>

                    {/* Live Demo Link (only if verified) */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-[#AAB7D4] hover:text-[#27C93F] hover:bg-[#111C44] rounded-lg transition-colors"
                        title="View Live App / Releases"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* GitHub Repo Link */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#111C44] hover:bg-[#16BFFF] hover:text-[#070B18] text-white rounded-lg transition-all font-mono text-[11px]"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
