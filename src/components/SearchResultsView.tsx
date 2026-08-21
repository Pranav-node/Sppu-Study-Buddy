import React from 'react';
import type { Semester, Topic } from '../types/syllabus';
import { Search, BookOpen, Play, CornerDownRight } from 'lucide-react';

interface SearchResultItem {
  type: 'topic' | 'unit' | 'course';
  topic?: Topic;
  unitName: string;
  courseCode: string;
  courseName: string;
  semesterName: string;
}

interface SearchResultsViewProps {
  query: string;
  semesters: Semester[];
  onSelectTopic: (topic: Topic, unitName: string, courseName: string, courseCode: string) => void;
  onSelectCourse: (courseCode: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  semesters,
  onSelectTopic,
  onSelectCourse
}) => {
  const q = query.trim().toLowerCase();

  const results: SearchResultItem[] = [];

  semesters.forEach(sem => {
    sem.courses.forEach(course => {
      const courseMatch = course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);

      course.units.forEach(unit => {
        const unitMatch = unit.name.toLowerCase().includes(q);

        unit.topics.forEach(topic => {
          const topicMatch = topic.name.toLowerCase().includes(q);

          if (topicMatch || unitMatch || courseMatch) {
            results.push({
              type: 'topic',
              topic,
              unitName: unit.name,
              courseCode: course.code,
              courseName: course.name,
              semesterName: sem.name
            });
          }
        });
      });
    });
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 transition-colors">
      <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Search Results for "{query}"
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Found {results.length} matching syllabus items across all courses
            </p>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">No matching syllabus topics found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try searching for keywords like "K-Means", "CNN", "PageRank", "Quantum", "Regression", or course codes like "417521".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((res, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {res.courseCode}
                  </span>
                  <button
                    onClick={() => onSelectCourse(res.courseCode)}
                    className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  >
                    {res.courseName}
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{res.semesterName}</span>
                </div>

                {res.topic && (
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {res.topic.name}
                  </h3>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>{res.unitName}</span>
                </div>
              </div>

              {res.topic && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectTopic(res.topic!, res.unitName, res.courseName, res.courseCode)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Topic</span>
                  </button>

                  {res.topic.videos && res.topic.videos[0] && (
                    <a
                      href={res.topic.videos[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF0033]/10 hover:bg-[#FF0033]/20 text-[#FF0033] dark:text-[#FF3355] border border-[#FF0033]/30 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current stroke-none" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
