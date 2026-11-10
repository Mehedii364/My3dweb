/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BlogPost } from '../types/portfolio';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <BookOpen className="w-4 h-4" />
            <span>Developer Journals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Articles &amp; Architecture Notes
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-2xl">
            Reflections on software philosophy, low-spec optimization, and building resilient digital platforms.
          </p>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-[#0B1430] border border-[#1B254B] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#16BFFF]/60 hover:shadow-xl hover:shadow-[#16BFFF]/5 transition-all cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#AAB7D4]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#16BFFF]" />
                    <span>{post.date}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8B45FF]" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#16BFFF] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-[#AAB7D4] leading-relaxed">
                  {post.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-[#070B18] text-[#00E5FF] border border-[#1B254B] rounded text-xs font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1B254B] flex items-center justify-between text-xs font-medium text-[#16BFFF] group-hover:text-white transition-colors">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0B1430] border border-[#1B254B] rounded-2xl shadow-2xl overflow-y-auto p-6 sm:p-8 text-left space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 text-[#AAB7D4] hover:text-white bg-[#070B18] rounded-lg border border-[#1B254B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono text-[#16BFFF]">
                <span>{selectedPost.date}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPost.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {selectedPost.title}
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#AAB7D4] space-y-4 whitespace-pre-line leading-relaxed border-t border-[#1B254B] pt-6 font-sans">
              {selectedPost.content}
            </div>

            <div className="pt-6 border-t border-[#1B254B] flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 bg-[#16BFFF] text-[#070B18] font-semibold text-xs rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
