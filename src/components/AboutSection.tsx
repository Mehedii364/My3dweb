/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileData, ProfileImage } from '../types/portfolio';
import {
  Brain,
  Quote,
  Sparkles,
  Layers,
  Compass,
  ArrowUpRight,
  Shield,
  Code2,
} from 'lucide-react';

interface AboutSectionProps {
  profile: ProfileData;
  images: ProfileImage[];
  onOpenImageZoom: (image: ProfileImage) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  images,
  onOpenImageZoom,
}) => {
  // Find quote card image or secondary portraits
  const quoteCardImg = images.find((img) => img.category === 'quote');
  const previewPhotos = images.filter((img) => img.isVisible && img.category !== 'quote').slice(0, 4);

  const steps = [
    { num: '01', title: 'Think', desc: 'Isolate root requirements, audit real-world constraints, and establish user intent.' },
    { num: '02', title: 'Learn', desc: 'Synthesize documentation, dissect existing ecosystems, and review API contracts.' },
    { num: '03', title: 'Design', desc: 'Structure relational schemas, clean UI components, and state boundaries.' },
    { num: '04', title: 'Build', desc: 'Implement typed, modular logic in React, Three.js, Kotlin, or PHP 8.2.' },
    { num: '05', title: 'Test', desc: 'Verify boundary cases, simulate memory pressure, and validate responsiveness.' },
    { num: '06', title: 'Improve', desc: 'Eliminate render lag, optimize query plans, and refine user feedback.' },
    { num: '07', title: 'Transform', desc: 'Deliver an authentic, resilient digital solution that empowers the user.' },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <span>Personal Identity</span>
            <span aria-hidden="true">·</span>
            <span>Architect &amp; Programmer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Md. Mehedi Hasan
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-3xl">
            Passionate software craftsman, web engineer, and creator of the Wafa Zone digital ecosystem.
            Committed to building accessible, high-performance technology grounded in transparent logic and authentic human values.
          </p>
        </div>

        {/* Identity & Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Biography & Vision (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="p-6 bg-[#0B1430] border border-[#1B254B] rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#16BFFF]" />
                <span>The Story &amp; Technical Journey</span>
              </h3>
              <p className="text-[#AAB7D4] text-sm sm:text-base leading-relaxed">
                As a software engineer and programmer based in Bangladesh, I approach technology with an
                intense focus on practicality. I created <strong className="text-white">Wafa Zone</strong> to
                solve real, day-to-day challenges faced by people in our communities—ranging from precise
                spiritual companion tools like <em>Wafa Deen</em> to specialized camera processing utilities
                like <em>Wafa Camera Pro</em> and intelligent AI helpers.
              </p>
              <p className="text-[#AAB7D4] text-sm sm:text-base leading-relaxed">
                My technical philosophy emphasizes building reliable systems that work flawlessly even on
                accessible shared environments. Rather than depending on bloated cloud runtimes, I specialize
                in fine-tuning high-speed static React frontends, Three.js 3D spatial scenes, robust PHP 8.2 APIs,
                and indexed MySQL 5.7 architectures that run efficiently on hosts like ProFreeHost.
              </p>
            </div>

            {/* Core Values Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#16BFFF]/10 border border-[#16BFFF]/30 flex items-center justify-center text-[#16BFFF]">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Wafa Zone Ecosystem</h4>
                <p className="text-xs text-[#AAB7D4] leading-relaxed">
                  Interconnected suite of mobile and web applications built under the motto:{' '}
                  <span className="text-[#00E5FF] font-mono">DREAM • DEVELOP • DELIVER</span>.
                </p>
              </div>

              <div className="p-5 bg-[#0B1430] border border-[#1B254B] rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#8B45FF]/10 border border-[#8B45FF]/30 flex items-center justify-center text-[#8B45FF]">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Defensive Architecture</h4>
                <p className="text-xs text-[#AAB7D4] leading-relaxed">
                  Strict PDO prepared queries, server-side MIME verification, and zero tolerance for fragile cloud dependencies.
                </p>
              </div>
            </div>
          </div>

          {/* Official Creator Quote Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#0B1430] via-[#0D183B] to-[#070B18] border border-[#1B254B] rounded-2xl shadow-xl overflow-hidden text-left">
              <Quote className="w-10 h-10 text-[#16BFFF]/20 absolute top-4 right-4" />

              <div className="space-y-4 relative z-10">
                <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  Foundational Principle
                </div>

                {/* English Quote */}
                <blockquote className="text-lg sm:text-xl font-bold text-white leading-snug">
                  &ldquo;{profile.quoteEnglish}&rdquo;
                </blockquote>

                {/* Bengali Quote */}
                <div className="text-base sm:text-lg text-[#F4F7FF]/90 font-medium leading-relaxed border-t border-[#1B254B] pt-4">
                  &ldquo;{profile.quoteBengali}&rdquo;
                </div>

                {/* Attribution */}
                <div className="pt-4 border-t border-[#1B254B]/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{profile.name}</div>
                    <div className="text-[#AAB7D4] font-mono text-[11px]">{profile.ecosystem}</div>
                  </div>
                  <span className="text-[#16BFFF] font-mono text-[11px]">
                    {profile.ecosystemTagline}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Link to Creator Card Image */}
            {quoteCardImg && (
              <button
                onClick={() => onOpenImageZoom(quoteCardImg)}
                className="w-full flex items-center justify-between p-3.5 bg-[#0B1430] hover:bg-[#111C44] border border-[#1B254B] rounded-xl text-xs text-[#AAB7D4] hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B45FF]" />
                  <span>View Original Graphic Creator Card</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#16BFFF]" />
              </button>
            )}
          </div>
        </div>

        {/* Development Philosophy Loop: THINK → LEARN → DESIGN → BUILD → TEST → IMPROVE → TRANSFORM */}
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#16BFFF]" />
            <h3 className="text-xl font-bold text-white">The Continuous Engineering Loop</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 bg-[#0B1430] border border-[#1B254B] rounded-xl flex flex-col justify-between hover:border-[#16BFFF]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-[#16BFFF]">{step.num}</div>
                  <div className="text-base font-bold text-white uppercase tracking-wide">
                    {step.title}
                  </div>
                  <p className="text-xs text-[#AAB7D4] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Personal Photographs Strip */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#8B45FF]" />
              <h3 className="text-xl font-bold text-white">Personal Identity Gallery</h3>
            </div>
            <a href="#gallery" className="text-xs text-[#16BFFF] hover:underline">
              Explore Full Gallery ({images.length} Photos) &rarr;
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previewPhotos.map((img) => (
              <div
                key={img.id}
                onClick={() => onOpenImageZoom(img)}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in bg-[#0B1430] border border-[#1B254B]"
              >
                <img
                  src={img.url}
                  alt={img.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-medium text-white truncate">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
