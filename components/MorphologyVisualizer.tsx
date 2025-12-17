import React from 'react';
import { TermPart, TermPartType } from '../types';

interface MorphologyVisualizerProps {
  parts: TermPart[];
}

const getColorClass = (type: TermPartType): string => {
  switch (type) {
    case 'prefix': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'root': return 'text-green-400 border-green-500/30 bg-green-500/10';
    case 'suffix': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    case 'combining_vowel': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    default: return 'text-slate-300 border-slate-600/30 bg-slate-700/30';
  }
};

const getLabel = (type: TermPartType): string => {
  switch (type) {
    case 'prefix': return 'Prefix (بادئة)';
    case 'root': return 'Root (جذر)';
    case 'suffix': return 'Suffix (لاحقة)';
    case 'combining_vowel': return 'Vowel';
    default: return 'Part';
  }
};

export const MorphologyVisualizer: React.FC<MorphologyVisualizerProps> = ({ parts }) => {
  return (
    <div className="w-full">
      {/* Visual Word Construction */}
      <div className="flex flex-wrap justify-center items-center gap-1 mb-6 text-2xl md:text-4xl font-mono font-bold tracking-wide">
        {parts.map((part, idx) => {
          let color = 'text-white';
          if (part.type === 'prefix') color = 'text-blue-400';
          if (part.type === 'root') color = 'text-green-400';
          if (part.type === 'suffix') color = 'text-orange-400';
          if (part.type === 'combining_vowel') color = 'text-gray-500';

          return (
            <span key={idx} className={`${color} transition-all duration-300 hover:scale-110 cursor-default`}>
              {part.text}
              {idx < parts.length - 1 && <span className="text-slate-700 mx-[1px]">|</span>}
            </span>
          );
        })}
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-tajawal" dir="rtl">
        {parts.map((part, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col p-4 rounded-xl border ${getColorClass(part.type)} transition-all hover:bg-opacity-20`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold font-mono text-lg ltr">{part.text}</span>
              <span className="text-xs uppercase tracking-wider opacity-70">{getLabel(part.type)}</span>
            </div>
            <p className="text-sm md:text-base font-medium">{part.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};