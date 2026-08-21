import React from 'react';
import type { Semester } from '../types/syllabus';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface HomeViewProps {
  semesters: Semester[];
  completedTopics: Record<string, boolean>;
  onSelectSem: (semId: string) => void;
  onSelectCourse: (courseCode: string) => void;
}

interface LastStudiedTopic {
  courseCode: string;
  courseName: string;
  unitName: string;
  topicName: string;
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
  let lastStudiedTopic: LastStudiedTopic | null = null;

  semesters.forEach(sem => {
    sem.courses.forEach(course => {
      course.units.forEach(unit => {
        unit.topics.forEach(topic => {
          totalTopics++;
          if (completedTopics[topic.id]) {
            completedCount++;
            lastStudiedTopic = {
              courseCode: course.code,
              courseName: course.name,
              unitName: unit.name,
              topicName: topic.name
            };
          }
        });
      });
    });
  });

  const totalProgressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 transition-colors">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Savitribai Phule Pune University • 2020 Course</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SPPU B.E. AI&DS Study Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Official Fourth Year Artificial Intelligence & Data Science syllabus, topic-by-topic interactive study checklist, and technical documentation notes.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-white dark:bg-[#0F1722] border border-slate-200 dark:border-[#263244] rounded-xl p-3.5 min-w-[280px] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Syllabus Completion
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">
              {completedCount} / {totalTopics} ({totalProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${totalProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue Learning Section if any topic completed */}
      {lastStudiedTopic && (
        <div className="bg-blue-50/60 dark:bg-[#0F1722] border border-blue-200 dark:border-[#263244] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider text-[10px]">
              Continue Learning
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {(lastStudiedTopic as LastStudiedTopic).courseCode} {(lastStudiedTopic as LastStudiedTopic).courseName}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {(lastStudiedTopic as LastStudiedTopic).unitName} • {(lastStudiedTopic as LastStudiedTopic).topicName}
            </p>
          </div>
          <button
            onClick={() => onSelectCourse((lastStudiedTopic as LastStudiedTopic).courseCode)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Open Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEMESTER VII SECTION */}
      {sem7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                SEMESTER VII CURRICULUM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fourth Year • Artificial Intelligence & Data Science
              </p>
            </div>
            <button
              onClick={() => onSelectSem('sem7')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All 10 Courses</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Clean Subject List/Table Hybrid */}
          <div className="bg-white dark:bg-[#0F1722] border border-slate-200 dark:border-[#263244] rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-[#263244]">
            {sem7.courses.map(course => {
              const courseTopicsCount = course.units.reduce((acc, u) => acc + u.topics.length, 0);
              const courseCompletedCount = course.units.reduce((acc, u) => acc + u.topics.filter(t => completedTopics[t.id]).length, 0);
              const isCompulsory = course.type === 'compulsory';
              const totalHours = course.units.reduce((acc, u) => acc + (typeof u.hours === 'number' ? u.hours : parseInt(String(u.hours || 0), 10)), 0) || 36;

              return (
                <div 
                  key={course.code}
                  onClick={() => onSelectCourse(course.code)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#151D2B] cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 rounded shrink-0">
                      {course.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.name}
                        </h3>
                        {!isCompulsory && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded">
                            {course.electiveGroup}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {course.units.length} Units • {totalHours} Allotted Hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {courseCompletedCount}/{courseTopicsCount} Topics
                      </span>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEMESTER VIII SECTION */}
      {sem8 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                SEMESTER VIII CURRICULUM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fourth Year • Artificial Intelligence & Data Science
              </p>
            </div>
            <button
              onClick={() => onSelectSem('sem8')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All 10 Courses</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Clean Subject List/Table Hybrid */}
          <div className="bg-white dark:bg-[#0F1722] border border-slate-200 dark:border-[#263244] rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-[#263244]">
            {sem8.courses.map(course => {
              const courseTopicsCount = course.units.reduce((acc, u) => acc + u.topics.length, 0);
              const courseCompletedCount = course.units.reduce((acc, u) => acc + u.topics.filter(t => completedTopics[t.id]).length, 0);
              const isCompulsory = course.type === 'compulsory';
              const totalHours = course.units.reduce((acc, u) => acc + (typeof u.hours === 'number' ? u.hours : parseInt(String(u.hours || 0), 10)), 0) || 36;

              return (
                <div 
                  key={course.code}
                  onClick={() => onSelectCourse(course.code)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#151D2B] cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 rounded shrink-0">
                      {course.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.name}
                        </h3>
                        {!isCompulsory && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded">
                            {course.electiveGroup}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {course.units.length} Units • {totalHours} Allotted Hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {courseCompletedCount}/{courseTopicsCount} Topics
                      </span>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
