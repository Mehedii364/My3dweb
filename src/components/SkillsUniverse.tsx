/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SkillItem } from '../types/portfolio';
import {
  Globe,
  Smartphone,
  Palette,
  Server,
  Database,
  Cpu,
  Sparkles,
  Cloud,
  ShieldCheck,
  Layers,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';

interface SkillsUniverseProps {
  skills: SkillItem[];
}

export const SkillsUniverse: React.FC<SkillsUniverseProps> = ({ skills }) => {
  const [selectedId, setSelectedId] = useState<string>(skills[0]?.id || '');
  const activeSkill = skills.find((s) => s.id === selectedId) || skills[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Cloud': return <Cloud className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <span>Technical Capabilities</span>
            <span aria-hidden="true">·</span>
            <span>Zero Hallucinated Metrics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills Universe
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-3xl">
            Real architectural expertise verified across production codebases. Categorized by functional
            systems, active tooling, and real projects.
          </p>
        </div>

        {/* 2-Column Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Skill Selector List (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {skills.map((skill) => {
              const isSelected = skill.id === activeSkill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedId(skill.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0B1430] to-[#111C44] border-[#16BFFF] shadow-lg shadow-[#16BFFF]/10'
                      : 'bg-[#0B1430]/70 border-[#1B254B] hover:border-[#16BFFF]/40 hover:bg-[#0B1430]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-[#16BFFF]/20 border-[#16BFFF] text-[#00E5FF]'
                          : 'bg-[#070B18] border-[#1B254B] text-[#AAB7D4]'
                      }`}
                    >
                      {getIcon(skill.iconName)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{skill.name}</div>
                      <div className="text-xs text-[#AAB7D4] font-mono">{skill.category}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#16BFFF]/20 text-[#16BFFF] border border-[#16BFFF]/40'
                        : 'bg-[#070B18] text-[#AAB7D4]'
                    }`}
                  >
                    {skill.level}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Skill Focus Panel (7 cols) */}
          <div className="lg:col-span-7 sticky top-24 p-6 sm:p-8 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-[#1B254B] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#16BFFF]/10 border border-[#16BFFF]/40 rounded-xl text-[#00E5FF]">
                  {getIcon(activeSkill.iconName)}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{activeSkill.name}</h3>
                  <div className="text-xs font-mono text-[#16BFFF] uppercase tracking-wider">
                    {activeSkill.category}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#16BFFF]/10 border border-[#16BFFF]/30 text-[#00E5FF] text-xs font-mono font-medium rounded-full">
                {activeSkill.level}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                Domain Overview
              </h4>
              <p className="text-sm sm:text-base text-[#F4F7FF] leading-relaxed">
                {activeSkill.description}
              </p>
            </div>

            {/* Technologies Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                Technologies &amp; Protocols
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSkill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#070B18] border border-[#1B254B] rounded-lg text-xs font-mono text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16BFFF]" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Related Projects */}
            <div className="space-y-3 border-t border-[#1B254B] pt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAB7D4]">
                Related Repositories &amp; Deployments
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSkill.relatedProjects.map((p) => (
                  <a
                    key={p}
                    href="#projects"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C44] hover:bg-[#16BFFF]/20 border border-[#1B254B] hover:border-[#16BFFF]/50 rounded-lg text-xs font-medium text-[#00E5FF] transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
