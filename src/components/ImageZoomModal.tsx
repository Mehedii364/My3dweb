/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ProfileImage } from '../types/portfolio';
import { X, Download, Star, Check } from 'lucide-react';

interface ImageZoomModalProps {
  image: ProfileImage | null;
  onClose: () => void;
  onSetHero?: (id: string) => void;
  isOwner?: boolean;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  image,
  onClose,
  onSetHero,
  isOwner,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#0B1430] border border-[#1B254B] rounded-2xl overflow-hidden shadow-2xl text-left"
      >
        {/* Top bar */}
        <div className="p-4 border-b border-[#1B254B] flex items-center justify-between bg-[#070B18]">
          <div className="space-y-0.5 pr-4">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{image.title}</h3>
            <div className="flex items-center gap-2 text-xs font-mono text-[#AAB7D4]">
              <span className="uppercase text-[#16BFFF]">{image.category}</span>
              <span aria-hidden="true">·</span>
              <span>Added: {image.dateAdded}</span>
              {image.dimensions && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{image.dimensions}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={image.url}
              download={`Mehedi-Hasan-${image.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1430] hover:bg-[#111C44] text-xs font-mono text-white border border-[#1B254B] rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </a>

            {isOwner && onSetHero && (
              <button
                onClick={() => onSetHero(image.id)}
                disabled={image.isHero}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16BFFF] disabled:bg-[#1B254B] text-[#070B18] disabled:text-[#AAB7D4] text-xs font-mono font-bold rounded-lg transition-colors"
              >
                {image.isHero ? <Check className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{image.isHero ? 'Current Hero' : 'Set As Hero'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#AAB7D4] hover:text-white bg-[#070B18] hover:bg-[#111C44] rounded-lg border border-[#1B254B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-res Image Canvas */}
        <div className="relative flex-1 bg-[#05070E] flex items-center justify-center p-2 sm:p-6 overflow-hidden max-h-[68vh]">
          <img
            src={image.url}
            alt={image.altText}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Caption & Metadata description footer */}
        <div className="p-4 bg-[#070B18] border-t border-[#1B254B] text-xs text-[#AAB7D4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="max-w-3xl leading-relaxed">{image.description}</p>
          <span className="font-mono text-[11px] text-[#00E5FF] shrink-0">Official Asset</span>
        </div>
      </div>
    </div>
  );
};
