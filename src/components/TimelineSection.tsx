/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TimelineItem } from '../types/portfolio';
import { Calendar, Milestone, GraduationCap, Code2, Award } from 'lucide-react';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const getIcon = (cat: TimelineItem['category']) => {
    switch (cat) {
      case 'education': return <GraduationCap className="w-4 h-4 text-[#8B45FF]" />;
      case 'project': return <Code2 className="w-4 h-4 text-[#16BFFF]" />;
      case 'milestone': return <Milestone className="w-4 h-4 text-[#00E5FF]" />;
      default: return <Award className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <Calendar className="w-4 h-4" />
            <span>Development Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience &amp; Journey
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-2xl">
            Key developmental inflection points, open source contributions, and the formation of the Wafa Zone suite.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-[#1B254B] ml-4 md:ml-8 space-y-8 pl-6 md:pl-8">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Node Marker */}
              <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#070B18] border-2 border-[#16BFFF] flex items-center justify-center shadow-md shadow-[#16BFFF]/20">
                <div className="w-2 h-2 rounded-full bg-[#16BFFF]" />
              </div>

              {/* Card Container */}
              <div className="bg-[#0B1430] border border-[#1B254B] rounded-2xl p-6 hover:border-[#16BFFF]/50 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIcon(item.category)}
                    <span className="text-sm font-bold text-white">{item.title}</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 bg-[#070B18] border border-[#1B254B] text-[#00E5FF] rounded-lg">
                    {item.year}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#AAB7D4]">
                  Organization: <strong className="text-white">{item.organization}</strong>
                </div>

                <p className="text-xs sm:text-sm text-[#AAB7D4] leading-relaxed">
                  {item.description}
                </p>

                {/* Key Takeaways */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1B254B]">
                  {item.keyTakeaways.map((takeaway) => (
                    <span
                      key={takeaway}
                      className="text-[11px] font-mono text-[#AAB7D4] bg-[#070B18] px-2.5 py-1 rounded border border-[#1B254B]"
                    >
                      ✓ {takeaway}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
