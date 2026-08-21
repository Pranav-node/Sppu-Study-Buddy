import React, { useEffect, useRef } from 'react';
import { Search, Menu, X, GraduationCap, Sun, Moon, Info, Calendar } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  selectedSem: string | null;
  onSelectSem: (semId: string | null) => void;
  onHomeClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenInfoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  selectedSem,
  onSelectSem,
  onHomeClick,
  isDarkMode,
  onToggleDarkMode,
  onOpenInfoModal
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              onClick={onHomeClick} 
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-all group-hover:scale-105">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                    SPPU AI&DS
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Study Hub
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Search Bar with Cmd+K Shortcut */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, courses, units..."
                className="w-full pl-10 pr-16 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-900 shadow-2xs">
                    ⌘K
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Semester Pills, Theme Switcher, 2020 Badge, Info Icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Semester quick filter pills */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <button
                onClick={() => onSelectSem(null)}
                className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                  selectedSem === null
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectSem('sem7')}
                className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                  selectedSem === 'sem7'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sem VII
              </button>
              <button
                onClick={() => onSelectSem('sem8')}
                className={`px-2.5 py-1 font-semibold rounded-lg transition-all ${
                  selectedSem === 'sem8'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sem VIII
              </button>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* 2020 Course Badge Pill Button */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>2020 Course</span>
            </div>

            {/* Info Icon Button */}
            <button
              onClick={onOpenInfoModal}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
              title="Syllabus & App Info"
              aria-label="Information"
            >
              <Info className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
