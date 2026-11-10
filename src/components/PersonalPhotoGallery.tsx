/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProfileImage } from '../types/portfolio';
import { Camera, Eye, Download, Star, Check } from 'lucide-react';

interface PersonalPhotoGalleryProps {
  images: ProfileImage[];
  onOpenImageZoom: (image: ProfileImage) => void;
  onSetHero?: (id: string) => void;
  isOwner?: boolean;
}

export const PersonalPhotoGallery: React.FC<PersonalPhotoGalleryProps> = ({
  images,
  onOpenImageZoom,
  onSetHero,
  isOwner,
}) => {
  const [filter, setFilter] = useState<'all' | 'portrait' | 'studio' | 'lifestyle' | 'quote'>('all');

  const visibleImages = images.filter((img) => img.isVisible);
  const filtered = filter === 'all' ? visibleImages : visibleImages.filter((img) => img.category === filter);

  const filterTabs: { id: typeof filter; label: string; count: number }[] = [
    { id: 'all', label: 'All Photos', count: visibleImages.length },
    { id: 'portrait', label: 'Portraits', count: visibleImages.filter((i) => i.category === 'portrait').length },
    { id: 'studio', label: 'Studio B&W', count: visibleImages.filter((i) => i.category === 'studio').length },
    { id: 'lifestyle', label: 'Lifestyle', count: visibleImages.filter((i) => i.category === 'lifestyle').length },
    { id: 'quote', label: 'Cards & Philosophy', count: visibleImages.filter((i) => i.category === 'quote').length },
  ];

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
              <Camera className="w-4 h-4" />
              <span>Authentic Visual Identity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Personal Image Gallery
            </h2>
            <p className="text-base text-[#AAB7D4] max-w-2xl">
              Official photographs of Md. Mehedi Hasan across executive sessions, creative studio studies,
              and authentic moments. Preserving true identity with zero artificial fabrication.
            </p>
          </div>

          {/* Interactive Filter Tabs (Functional Buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0B1430] border border-[#1B254B] rounded-xl self-start md:self-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] font-bold shadow-sm'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#111C44]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 rounded ${filter === tab.id ? 'bg-[#070B18]/20' : 'bg-[#1B254B]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((image) => (
            <div
              key={image.id}
              className="group relative bg-[#0B1430] border border-[#1B254B] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#16BFFF]/50 hover:shadow-xl hover:shadow-[#16BFFF]/5 transition-all duration-300"
            >
              {/* Image Preview Container */}
              <div
                onClick={() => onOpenImageZoom(image)}
                className={`relative w-full overflow-hidden cursor-zoom-in bg-[#070B18] ${
                  image.category === 'quote' ? 'aspect-[16/9]' : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1430] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Hero / Avatar Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {image.isHero && (
                    <span className="px-2 py-0.5 bg-[#16BFFF] text-[#070B18] font-mono text-[10px] font-bold rounded">
                      HERO PORTRAIT
                    </span>
                  )}
                  {image.isAvatar && (
                    <span className="px-2 py-0.5 bg-[#8B45FF] text-white font-mono text-[10px] font-bold rounded">
                      AVATAR
                    </span>
                  )}
                </div>

                {/* Zoom hover button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#070B18]/90 text-white text-xs font-medium rounded-lg border border-[#16BFFF]">
                    <Eye className="w-3.5 h-3.5 text-[#16BFFF]" />
                    <span>View Full Size</span>
                  </span>
                </div>
              </div>

              {/* Information & Metadata Details */}
              <div className="p-4 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white truncate">{image.title}</h3>
                  <span className="text-[11px] font-mono text-[#AAB7D4]">{image.dateAdded}</span>
                </div>
                <p className="text-xs text-[#AAB7D4] line-clamp-2 leading-relaxed">
                  {image.description}
                </p>

                {/* Action Bar */}
                <div className="pt-2 border-t border-[#1B254B] flex items-center justify-between text-xs">
                  <a
                    href={image.url}
                    download={`Mehedi-Hasan-${image.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#AAB7D4] hover:text-[#16BFFF] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-3 h-3" />
                    <span>Original File</span>
                  </a>

                  {isOwner && onSetHero && !image.isHero && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetHero(image.id);
                      }}
                      className="flex items-center gap-1 text-[#00E5FF] hover:underline"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Hero</span>
                    </button>
                  )}
                  {image.isHero && (
                    <span className="flex items-center gap-1 text-[#16BFFF] text-[11px]">
                      <Check className="w-3 h-3" />
                      <span>Current Hero</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
