/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileData } from '../types/portfolio';
import { X, Download, Printer, ExternalLink, CheckCircle2 } from 'lucide-react';

interface CvModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B1430] border border-[#1B254B] rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-left">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-[#1B254B] flex items-center justify-between bg-[#070B18]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#16BFFF]/20 border border-[#16BFFF] flex items-center justify-center text-xs font-mono font-bold text-[#00E5FF]">
              CV
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Curriculum Vitae</h2>
              <p className="text-xs text-[#AAB7D4] font-mono">
                Verified Candidate Profile · Updated Q4 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1430] hover:bg-[#111C44] text-[#AAB7D4] hover:text-white border border-[#1B254B] rounded-lg text-xs font-mono transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#AAB7D4] hover:text-white hover:bg-[#111C44] rounded-lg border border-[#1B254B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#0B1430] text-[#F4F7FF]">
          {/* Header */}
          <div className="border-b border-[#1B254B] pb-6 space-y-2">
            <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
            <div className="text-base font-medium text-[#16BFFF]">{profile.headline}</div>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#AAB7D4] pt-2">
              <span>Location: Bangladesh</span>
              <span>·</span>
              <span>Email: {profile.socials.email}</span>
              <span>·</span>
              <span>GitHub: @{profile.githubUsername}</span>
              <span>·</span>
              <span>Ecosystem: {profile.ecosystem}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              01. Professional Summary
            </h3>
            <p className="text-sm text-[#AAB7D4] leading-relaxed">
              Software engineer and web developer with deep expertise across modern frontend ecosystems
              (React, TypeScript, Three.js), native mobile systems (Android SDK, Java, Kotlin), and resilient
              backend databases (PHP 8.2, MySQL 5.7). Creator of Wafa Zone, an open-source and utility ecosystem
              aimed at everyday productivity and developer tools.
            </p>
          </div>

          {/* Core Technical Stacks */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              02. Technical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="font-semibold text-white">Languages &amp; Runtimes</div>
                <div className="text-[#AAB7D4] font-mono">TypeScript, JavaScript, PHP 8.2, Java, Kotlin, SQL, HTML5/CSS3</div>
              </div>
              <div className="p-3 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="font-semibold text-white">Frameworks &amp; 3D Graphics</div>
                <div className="text-[#AAB7D4] font-mono">React 19, Three.js, Vite, Tailwind CSS, Android SDK (Camera2, Jetpack)</div>
              </div>
              <div className="p-3 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="font-semibold text-white">Databases &amp; Systems</div>
                <div className="text-[#AAB7D4] font-mono">MySQL 5.7/8.0 (PDO), SQLite, Apache .htaccess, ProFreeHost, Git</div>
              </div>
              <div className="p-3 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="font-semibold text-white">Security &amp; Architecture</div>
                <div className="text-[#AAB7D4] font-mono">OWASP, Prepared Statements, MIME Sniffing, CSRF, RESTful API Design</div>
              </div>
            </div>
          </div>

          {/* Key Engineering Projects */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              03. Selected Open-Source &amp; Production Projects
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Wafa Deen (Android Companion)</span>
                  <span className="font-mono text-[#16BFFF]">Kotlin / SQLite</span>
                </div>
                <p className="text-[#AAB7D4]">
                  Islamic companion app with precise offline prayer times, Qibla compass, and local database storage.
                </p>
              </div>

              <div className="p-3.5 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Wafa Camera Pro</span>
                  <span className="font-mono text-[#16BFFF]">Java / Camera2 API</span>
                </div>
                <p className="text-[#AAB7D4]">
                  Direct hardware camera controls including manual ISO, exposure bias, and RAW image processing.
                </p>
              </div>

              <div className="p-3.5 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">MEHEDI 3D Workstation</span>
                  <span className="font-mono text-[#16BFFF]">React / Three.js / PHP 8.2</span>
                </div>
                <p className="text-[#AAB7D4]">
                  Interactive 3D digital workspace featuring WebGL rendering, cursor-reactive particle physics, and shared-hosting deployment package.
                </p>
              </div>
            </div>
          </div>

          {/* Development Philosophy */}
          <div className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
              Core Engineering Philosophy
            </h3>
            <p className="text-xs font-mono text-[#AAB7D4]">
              {profile.philosophy}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#1B254B] bg-[#070B18] flex items-center justify-between">
          <a
            href="https://github.com/Mehedii364"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#16BFFF] hover:underline font-mono"
          >
            <span>Verify on GitHub (@Mehedii364)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#16BFFF] hover:bg-[#00E5FF] text-[#070B18] font-bold rounded-xl text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV (Printable PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
