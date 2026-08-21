import React, { useState } from 'react';
import type { Semester, Course } from '../types/syllabus';
import { ChevronDown, ChevronRight, LayoutDashboard, Search, GraduationCap } from 'lucide-react';

interface SidebarProps {
  semesters: Semester[];
  selectedCourseCode: string | null;
  onSelectCourse: (courseCode: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onGoToDashboard: () => void;
  onFocusSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  semesters,
  selectedCourseCode,
  onSelectCourse,
  isOpenMobile,
  onCloseMobile,
  onGoToDashboard,
  onFocusSearch
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'sem7': true,
    'sem8': true,
    'sem7-Elective III': true,
    'sem7-Elective IV': true,
    'sem8-Elective V': true,
    'sem8-Elective VI': true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCourseClick = (code: string) => {
    onSelectCourse(code);
    onCloseMobile();
  };

  const renderSemesterContent = (sem: Semester) => {
    const compulsory = sem.courses.filter(c => c.type === 'compulsory');
    const electiveGroups: Record<string, Course[]> = {};

    sem.courses.filter(c => c.type === 'elective').forEach(c => {
      const groupName = c.electiveGroup || 'Elective';
      if (!electiveGroups[groupName]) electiveGroups[groupName] = [];
      electiveGroups[groupName].push(c);
    });

    const isSemOpen = openGroups[sem.id] !== false;

    return (
      <div key={sem.id} className="mb-5">
        {/* Semester Category Label */}
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {sem.name}
        </div>

        {isSemOpen && (
          <div className="mt-1 space-y-0.5">
            {/* Compulsory Courses */}
            {compulsory.map(course => {
              const isSelected = selectedCourseCode === course.code;
              return (
                <button
                  key={course.code}
                  onClick={() => handleCourseClick(course.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{course.code} {course.name}</span>
                </button>
              );
            })}

            {/* Elective Groups Dropdowns */}
            {Object.entries(electiveGroups).map(([groupName, elCourses]) => {
              const groupKey = `${sem.id}-${groupName}`;
              const isElGroupOpen = openGroups[groupKey] !== false;
              const hasSelectedInGroup = elCourses.some(c => c.code === selectedCourseCode);

              return (
                <div key={groupName} className="mt-1">
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      hasSelectedInGroup
                        ? 'text-blue-400 font-semibold bg-slate-800/40'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{groupName}</span>
                    {isElGroupOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    )}
                  </button>

                  {isElGroupOpen && (
                    <div className="mt-0.5 space-y-0.5 pl-3">
                      {elCourses.map(course => {
                        const isSelected = selectedCourseCode === course.code;
                        return (
                          <button
                            key={course.code}
                            onClick={() => handleCourseClick(course.code)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate pr-1">{course.name}</span>
                            <span className="text-[9px] font-mono opacity-75">({course.code})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-4 px-3 overflow-y-auto bg-[#0b0e14] text-slate-200">
      <div>
        {/* Brand Header */}
        <div className="px-3 pb-4 mb-3 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-tight">
              SPPU AI&DS
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Study Hub
            </p>
          </div>
        </div>

        {/* Quick Top Navigation Links */}
        <div className="space-y-1 mb-5">
          <button
            onClick={() => {
              onGoToDashboard();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCourseCode === null
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              onFocusSearch();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search</span>
          </button>
        </div>

        {/* Semesters & Courses Navigation */}
        <nav className="space-y-1">
          {semesters.map(renderSemesterContent)}
        </nav>
      </div>

      {/* Bottom Information Card (as in reference UI) */}
      <div className="mt-6 pt-3 px-3">
        <div className="bg-[#131926] border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1 shadow-inner">
          <p className="font-bold text-slate-200">SPPU AI&DS • 2020 Course</p>
          <p className="text-slate-400 leading-relaxed">
            Fourth Year • With effect from A.Y. 2023–24
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Dark Sidebar */}
      <aside className="hidden lg:block w-72 bg-[#0b0e14] border-r border-slate-800 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] bg-[#0b0e14] h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
