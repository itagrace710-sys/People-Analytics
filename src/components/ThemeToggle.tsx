import React, { useState, useRef, useEffect } from 'react';
import { useApp, BackgroundTheme } from '../context/AppContext';
import { Palette, Check, Sun, Moon, Sparkles, Monitor, Layers } from 'lucide-react';

interface ThemeOption {
  id: BackgroundTheme;
  name: string;
  badge: string;
  description: string;
  previewClass: string;
  icon: React.ElementType;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'white',
    name: 'White',
    badge: 'Light Mode',
    description: 'Clean, high-contrast crisp white background with modern slate text',
    previewClass: 'bg-white border-2 border-slate-300 shadow-sm',
    icon: Sun,
  },
  {
    id: 'grey',
    name: 'Grey',
    badge: 'Executive Slate',
    description: 'Sophisticated neutral cool grey backdrop with balanced matte contrast',
    previewClass: 'bg-slate-700 border-2 border-slate-500 shadow-sm',
    icon: Layers,
  },
  {
    id: 'multicolored',
    name: 'Multicolored',
    badge: 'Aurora Mesh',
    description: 'Vibrant iridescent gradient canvas with purple, cyan, fuchsia & glass cards',
    previewClass: 'bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 border-2 border-white/40 shadow-sm',
    icon: Sparkles,
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    badge: 'Classic Dark',
    description: 'Original deep slate-950 midnight contrast engineered for focused analytics',
    previewClass: 'bg-slate-950 border-2 border-slate-700 shadow-sm',
    icon: Moon,
  },
];

interface ThemeToggleProps {
  variant?: 'dropdown' | 'inline' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'dropdown' }) => {
  const { backgroundTheme, setBackgroundTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = THEME_OPTIONS.find((t) => t.id === backgroundTheme) || THEME_OPTIONS[2];

  // Inline buttons variant (great for Sidebar or Settings bars)
  if (variant === 'inline') {
    return (
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>App Background</span>
          </span>
          <span className="text-[10px] font-mono capitalize px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            {backgroundTheme}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = backgroundTheme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setBackgroundTheme(opt.id)}
                title={`${opt.name}: ${opt.description}`}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${opt.previewClass}`} />
                <span className="truncate max-w-full">
                  {opt.id === 'multicolored' ? 'Multi' : opt.id === 'dark' ? 'Dark' : opt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact icon-only pill switch variant
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = backgroundTheme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setBackgroundTheme(opt.id)}
              title={`${opt.name} Background: ${opt.description}`}
              className={`p-1.5 rounded-md transition-all relative ${
                isSelected
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className={`block w-3.5 h-3.5 rounded-full ${opt.previewClass}`} />
            </button>
          );
        })}
      </div>
    );
  }

  // Default Dropdown Pill Variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold border border-slate-700/90 transition-all shadow-sm hover:border-slate-600"
        title="Change App Background (White, Grey, Multicolored, Dark)"
      >
        {/* Animated preview dot */}
        <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-transform ${currentOption.previewClass}`} />
        <span className="hidden sm:inline font-medium">Background:</span>
        <span className="capitalize text-indigo-300 font-bold">
          {currentOption.id === 'multicolored' ? 'Multicolored' : currentOption.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-200 animate-in fade-in zoom-in-95 backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>App Background Canvas</span>
              </p>
              <p className="text-[11px] text-slate-400">Select your preferred visual atmosphere</p>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
              Instant
            </span>
          </div>

          <div className="p-1.5 space-y-1.5">
            {THEME_OPTIONS.map((option) => {
              const isSelected = backgroundTheme === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setBackgroundTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-slate-100 shadow-md'
                      : 'hover:bg-slate-800/70 border border-transparent text-slate-300'
                  }`}
                >
                  {/* Swatch circle preview */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${option.previewClass}`}>
                      <Icon className={`w-4 h-4 ${option.id === 'white' ? 'text-slate-800' : 'text-white'}`} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{option.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {option.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-snug">
                      {option.description}
                    </p>
                  </div>

                  {/* Active Checkmark indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Saved automatically to browser</span>
            <span className="font-mono text-indigo-400">PAS Theme v2</span>
          </div>
        </div>
      )}
    </div>
  );
};
