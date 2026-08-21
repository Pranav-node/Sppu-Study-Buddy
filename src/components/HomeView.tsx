import React from 'react';
import type { Semester } from '../types/syllabus';
import { Sparkles, CheckCircle2, Award, ArrowRight, Layers, CheckCircle } from 'lucide-react';

interface HomeViewProps {
  semesters: Semester[];
  completedTopics: Record<string, boolean>;
  onSelectSem: (semId: string) => void;
  onSelectCourse: (courseCode: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  semesters,
  completedTopics,
  onSelectSem,
  onSelectCourse
}) => {
  const sem7 = semesters.find(s => s.id === 'sem7');
  const sem8 = semesters.find(s => s.id === 'sem8');

  // Calculate total topic completion count
  let totalTopics = 0;
  let completedCount = 0;

  semesters.forEach(sem => {
    sem.courses.forEach(course => {
      course.units.forEach(unit => {
        unit.topics.forEach(topic => {
          totalTopics++;
          if (completedTopics[topic.id]) {
            completedCount++;
          }
        });
      });
    });
  });

  const totalProgressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 transition-colors">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Single Source of Truth — Official SPPU Syllabus
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          SPPU AI&DS Study Hub
        </h1>
        
        <p className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400">
          Fourth Year — 2020 Course
        </p>
        
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore the complete SPPU Artificial Intelligence and Data Science syllabus topic-by-topic. An interactive roadmap with student-level explanations, interactive checklists, and curated YouTube videos.
        </p>

        {/* Global Progress Bar Banner */}
        <div className="max-w-md mx-auto pt-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Overall Syllabus Progress
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">
                {completedCount} / {totalTopics} Topics ({totalProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Large Semester Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SEMESTER VII CARD */}
        {sem7 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                  Semester VII
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  10 Courses • 60 Units
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  SEMESTER VII
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Machine Learning, Data Modeling & Visualization, Quantum AI, Information Retrieval, and Electives.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Included Theory Courses
                </div>

                <div className="space-y-2">
                  {sem7.courses.map(course => (
                    <div 
                      key={course.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.code);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 cursor-pointer transition-all text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span className="truncate">{course.name}</span>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                        {course.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectSem('sem7')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <span>Explore Semester VII Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SEMESTER VIII CARD */}
        {sem8 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider">
                  Semester VIII
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  10 Courses • 60 Units
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  SEMESTER VIII
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Computational Intelligence, Distributed Computing, VR & Game Dev, Deep Learning, and Electives.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Included Theory Courses
                </div>

                <div className="space-y-2">
                  {sem8.courses.map(course => (
                    <div 
                      key={course.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.code);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 cursor-pointer transition-all text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                        <span className="truncate">{course.name}</span>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                        {course.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectSem('sem8')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <span>Explore Semester VIII Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Feature Highlights Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Interactive Checklist</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Track topic completion progress across all subjects with persisted study status.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">60 Units Roadmap</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Complete unit-by-unit expandable structure for compulsory subjects and Electives III–VI.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Explanations & Videos</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Student-level topic explanations accompanied by direct recommended YouTube video learning links.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
