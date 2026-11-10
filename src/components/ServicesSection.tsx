/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ServiceItem } from '../types/portfolio';
import { Code2, Smartphone, Cpu, Server, Check } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-[#16BFFF]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#8B45FF]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#00E5FF]" />;
      default: return <Server className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1B254B] bg-[#070B18]">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16BFFF]">
            <span>Capabilities &amp; Solutions</span>
            <span aria-hidden="true">·</span>
            <span>Production Grade</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering Services
          </h2>
          <p className="text-base text-[#AAB7D4] max-w-2xl">
            Specialized engineering capabilities delivered with clean code, lean performance budgets, and comprehensive architecture.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#0B1430] border border-[#1B254B] rounded-2xl p-6 flex flex-col justify-between hover:border-[#16BFFF]/50 hover:shadow-xl hover:shadow-[#16BFFF]/5 transition-all space-y-6"
            >
              <div className="space-y-4">
                <div className="p-3 bg-[#070B18] border border-[#1B254B] rounded-xl w-fit">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-xs sm:text-sm text-[#AAB7D4] leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables List */}
              <div className="pt-4 border-t border-[#1B254B] space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#16BFFF]">
                  Deliverables
                </div>
                <ul className="space-y-1.5 text-xs text-[#F4F7FF]">
                  {service.deliverables.map((deliv) => (
                    <li key={deliv} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
