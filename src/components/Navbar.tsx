/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SceneQuality } from '../types/portfolio';
import { Box, Layers, ShieldCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  quality: SceneQuality;
  onQualityChange: (quality: SceneQuality) => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  quality,
  onQualityChange,
  onOpenAdmin,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Work', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Skills', href: '#skills' },
    { label: 'GitHub', href: '#github' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B18]/85 backdrop-blur-md border-b border-[#1B254B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#16BFFF] to-[#8B45FF] flex items-center justify-center text-xs font-mono font-black text-[#070B18] shadow-md shadow-[#16BFFF]/20">
            M
          </span>
          <span className="tracking-wider">MEHEDI 3D</span>
        </a>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#AAB7D4]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                  isActive ? 'text-[#16BFFF] font-semibold' : ''
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Group (3D / 2D Switch & Owner Login) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 3D vs 2D Mode Switcher */}
          <div className="flex items-center p-0.5 bg-[#0B1430] border border-[#1B254B] rounded-lg">
            <button
              onClick={() => onQualityChange(quality === '2d' ? 'high' : '2d')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                quality !== '2d'
                  ? 'bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] font-semibold shadow-sm'
                  : 'text-[#AAB7D4] hover:text-white'
              }`}
              title="Toggle Live 3D Workstation Scene"
            >
              <Box className="w-3.5 h-3.5" />
              <span>{quality !== '2d' ? 'Live 3D' : 'Enable 3D'}</span>
            </button>
            <button
              onClick={() => onQualityChange('2d')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                quality === '2d'
                  ? 'bg-[#1B254B] text-white font-semibold'
                  : 'text-[#AAB7D4] hover:text-white'
              }`}
              title="Switch to Classic 2D Portfolio"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Classic</span>
            </button>
          </div>

          {/* Owner Admin Access Button */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#AAB7D4] hover:text-white hover:border-[#16BFFF]/50 border border-[#1B254B] bg-[#0B1430] rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Owner Management Portal (Md. Mehedi Hasan)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#16BFFF]" />
            <span>Owner Portal</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#AAB7D4] hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#0B1430] border-b border-[#1B254B] space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#AAB7D4] hover:text-white hover:bg-[#111C44]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#1B254B] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-xs text-[#16BFFF] py-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Owner Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
