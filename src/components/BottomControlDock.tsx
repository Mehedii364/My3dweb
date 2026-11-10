/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CameraPreset, SceneQuality } from '../types/portfolio';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Monitor,
  Globe,
  User,
  Eye,
  Sliders,
} from 'lucide-react';

interface BottomControlDockProps {
  cameraPreset: CameraPreset;
  quality: SceneQuality;
  onPresetChange: (preset: CameraPreset) => void;
  onQualityChange: (quality: SceneQuality) => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  cameraPreset,
  quality,
  onPresetChange,
  onQualityChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Keyboard shortcut 'H' to toggle bottom dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const presets: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'workstation', label: 'Workstation', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code Terminal', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'globe', label: 'Digital Globe', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'portrait', label: 'Desk Portrait', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'overview', label: 'Wide Overview', icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  const qualities: { id: SceneQuality; label: string }[] = [
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Med' },
    { id: 'low', label: 'Low' },
  ];

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out select-none ${
        collapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
      style={{ maxWidth: 'min(940px, 94vw)', width: '100%' }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#AAB7D4] bg-[#070B18]/90 hover:text-white hover:bg-[#0B1430] border border-[#1B254B] rounded-full shadow-lg transition-colors"
          title="Toggle Dock (Press H)"
        >
          {collapsed ? (
            <>
              <ChevronUp className="w-3 h-3 text-[#16BFFF]" />
              <span>Show 3D Controls (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 text-[#16BFFF]" />
              <span>Hide Controls (H)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="bg-[#0B1430]/95 backdrop-blur-md border border-[#1B254B] rounded-2xl p-2.5 shadow-2xl shadow-[#070B18]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Camera Views Segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <div className="flex items-center gap-1 text-[#AAB7D4] text-[11px] font-semibold uppercase tracking-wider px-2 shrink-0">
            <Camera className="w-3.5 h-3.5 text-[#16BFFF]" />
            <span className="hidden sm:inline">Camera:</span>
          </div>
          {presets.map((item) => (
            <button
              key={item.id}
              onClick={() => onPresetChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                cameraPreset === item.id
                  ? 'bg-gradient-to-r from-[#16BFFF]/20 to-[#8B45FF]/20 text-[#00E5FF] border border-[#16BFFF]/50'
                  : 'text-[#AAB7D4] hover:text-white hover:bg-[#111C44]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Quality & Particle Indicator */}
        <div className="flex items-center gap-3 shrink-0 ml-auto border-t sm:border-t-0 sm:border-l border-[#1B254B] pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span className="text-[#AAB7D4] text-[11px] font-semibold uppercase tracking-wider">
              Graphics:
            </span>
            <div className="flex items-center p-0.5 bg-[#070B18] rounded-md border border-[#1B254B]">
              {qualities.map((q) => (
                <button
                  key={q.id}
                  onClick={() => onQualityChange(q.id)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                    quality === q.id
                      ? 'bg-[#16BFFF] text-[#070B18] font-semibold'
                      : 'text-[#AAB7D4] hover:text-white'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[#00E5FF] text-[11px] font-mono">
            <Sparkles className="w-3 h-3" />
            <span>Cursor Reactive Particles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
