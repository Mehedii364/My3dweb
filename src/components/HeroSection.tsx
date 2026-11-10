/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileData, ProfileImage, SceneQuality } from '../types/portfolio';
import { ArrowRight, Download, User, Box, Code, Sparkles, Terminal } from 'lucide-react';

interface HeroSectionProps {
  profile: ProfileData;
  heroImage: ProfileImage | undefined;
  quality: SceneQuality;
  onOpenCv: () => void;
  onOpenImageZoom: (image: ProfileImage) => void;
  onExploreWorkstation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  heroImage,
  quality,
  onOpenCv,
  onOpenImageZoom,
  onExploreWorkstation,
}) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glow grids */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#16BFFF]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#8B45FF]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Authentic Developer Identity & Call to Action (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Static Meta Kicker (No pills, clean unboxed metadata) */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <span>{profile.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.ecosystem}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#AAB7D4]">PROFREEHOST EDITION</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <p className="text-lg sm:text-xl font-light text-[#AAB7D4]">Hello, I&apos;m</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              <span className="bg-gradient-to-r from-white via-[#F4F7FF] to-[#AAB7D4] bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
          </div>

          {/* Role & Core Titles */}
          <div className="inline-block text-lg sm:text-xl font-medium text-[#16BFFF] tracking-wide">
            {profile.headline}
          </div>

          {/* Subheadline Tagline */}
          <p className="text-base sm:text-lg text-[#AAB7D4] max-w-2xl leading-relaxed">
            &ldquo;{profile.subheadline}&rdquo; —{' '}
            <span className="text-white font-medium">Beyond a Portfolio. Enter My Digital World.</span>{' '}
            Architecting native Android applications, full-stack PHP &amp; MySQL engines, and interactive
            3D web platforms within the Wafa Zone ecosystem.
          </p>

          {/* Development Philosophy Bar */}
          <div className="p-3.5 bg-[#0B1430]/80 border border-[#1B254B] rounded-xl flex items-center gap-3">
            <Terminal className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <div className="text-xs font-mono text-[#AAB7D4] truncate">
              <span className="text-[#16BFFF] font-semibold">LOOP: </span>
              {profile.philosophy}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] shadow-lg shadow-[#16BFFF]/20 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#about"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-[#F4F7FF] bg-[#0B1430] hover:bg-[#111C44] border border-[#1B254B] hover:border-[#16BFFF]/40 transition-colors"
            >
              <User className="w-4 h-4 text-[#16BFFF]" />
              <span>About Me</span>
            </a>

            <button
              onClick={onOpenCv}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-[#AAB7D4] hover:text-white bg-transparent hover:bg-[#0B1430] border border-[#1B254B] transition-colors"
            >
              <Download className="w-4 h-4 text-[#8B45FF]" />
              <span>Download CV</span>
            </button>
          </div>

          {/* System Telemetry & 3D Mode Status */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#AAB7D4] border-t border-[#1B254B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16BFFF]" />
              <span>
                Mode:{' '}
                <strong className="text-white">
                  {quality !== '2d' ? 'Interactive 3D Workstation' : 'Classic 2D Portfolio'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>
                GitHub: <strong className="text-white">@{profile.githubUsername}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8B45FF]" />
              <span>
                Ecosystem: <strong className="text-white">{profile.ecosystem}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Official Portrait Display & 3D Interactive Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative group w-full max-w-sm sm:max-w-md">
            {/* Cyber glow borders */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#16BFFF] via-[#8B45FF] to-[#00E5FF] rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

            <div className="relative bg-[#0B1430] border border-[#1B254B] rounded-2xl overflow-hidden shadow-2xl">
              {/* Photo Frame */}
              <div
                onClick={() => heroImage && onOpenImageZoom(heroImage)}
                className="relative aspect-[3/4] overflow-hidden cursor-zoom-in bg-[#070B18]"
                title="Click to view full-resolution portrait"
              >
                {heroImage ? (
                  <img
                    src={heroImage.url}
                    alt={heroImage.altText}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#AAB7D4]">
                    Loading Portrait...
                  </div>
                )}

                {/* Subtle dark gradient scrim at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1430] via-transparent to-transparent opacity-80" />

                {/* Zoom badge indicator */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#070B18]/80 backdrop-blur-md border border-[#1B254B] rounded-md text-[11px] font-mono text-[#16BFFF]">
                  Official Portrait
                </div>

                {/* Caption over image */}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
                    Md. Mehedi Hasan
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Founder &amp; Lead Engineer, Wafa Zone
                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls on Portrait Card */}
              <div className="p-4 bg-[#0B1430] border-t border-[#1B254B] flex items-center justify-between text-xs">
                <span className="text-[#AAB7D4] font-mono">3D Scene Workstation</span>
                <button
                  onClick={onExploreWorkstation}
                  className="flex items-center gap-1.5 text-[#16BFFF] hover:text-white font-medium transition-colors"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Inspect in 3D</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
