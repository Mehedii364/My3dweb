/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileData } from '../types/portfolio';
import { ShieldCheck, Heart, Github, ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: ProfileData;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#05070E] border-t border-[#1B254B] py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1B254B]">
          {/* Brand & Motto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-gradient-to-tr from-[#16BFFF] to-[#8B45FF] flex items-center justify-center text-[10px] font-mono font-black text-[#070B18]">
                M
              </span>
              <span className="text-base font-bold text-white tracking-wider">
                {profile.brand}
              </span>
              <span className="text-xs text-[#AAB7D4] font-mono">
                · {profile.ecosystem}
              </span>
            </div>
            <p className="text-xs text-[#AAB7D4] font-mono">
              &ldquo;{profile.quoteEnglish}&rdquo;
            </p>
          </div>

          {/* Nav links & actions */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#AAB7D4]">
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#github" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#16BFFF] hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#AAB7D4]">
          <div>
            © {new Date().getFullYear()} Md. Mehedi Hasan (@Mehedii364). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Mehedii364"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>github.com/Mehedii364</span>
            </a>

            <span>·</span>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#AAB7D4] hover:text-[#16BFFF] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#16BFFF]" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
