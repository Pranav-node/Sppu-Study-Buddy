import React, { useState, useMemo, useEffect } from 'react';
import type { Course, Topic, Unit } from '../types/syllabus';
import { 
  ChevronDown, ChevronRight, CheckCircle, Circle, ExternalLink, 
  Info, ArrowLeft, ArrowRight
} from 'lucide-react';

interface SubjectViewProps {
  course: Course;
  completedTopics: Record<string, boolean>;
  onToggleTopicCompletion: (topicId: string) => void;
  initialTopicId?: string | null;
}

export const SubjectView: React.FC<SubjectViewProps> = ({
  course,
  completedTopics,
  onToggleTopicCompletion,
  initialTopicId
}) => {
  // Track open state for units in left sub-sidebar
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (course.units.length > 0) {
      initial[course.units[0].id] = true;
    }
    return initial;
  });

  // Track active selected topic for reading view
  const [activeUnitId, setActiveUnitId] = useState<string>(() => {
    if (initialTopicId) {
      for (const u of course.units) {
        if (u.topics.some(t => t.id === initialTopicId)) return u.id;
      }
    }
    return course.units[0]?.id || '';
  });

  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    if (initialTopicId) return initialTopicId;
    return course.units[0]?.topics[0]?.id || '';
  });

  // Flat list of all topics in this course for prev/next navigation
  const allCourseTopics = useMemo(() => {
    const list: { topic: Topic; unit: Unit; unitIndex: number; topicIndex: number }[] = [];
    course.units.forEach((unit, uIdx) => {
      unit.topics.forEach((topic, tIdx) => {
        list.push({ topic, unit, unitIndex: uIdx, topicIndex: tIdx });
      });
    });
    return list;
  }, [course]);

  const currentTopicIndex = useMemo(() => {
    return allCourseTopics.findIndex(item => item.topic.id === activeTopicId);
  }, [allCourseTopics, activeTopicId]);

  const currentItem = useMemo(() => {
    if (currentTopicIndex >= 0) return allCourseTopics[currentTopicIndex];
    if (allCourseTopics.length > 0) return allCourseTopics[0];
    return null;
  }, [allCourseTopics, currentTopicIndex]);

  useEffect(() => {
    if (currentItem) {
      setActiveUnitId(currentItem.unit.id);
      setActiveTopicId(currentItem.topic.id);
    }
  }, [currentItem]);

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleSelectTopic = (unitId: string, topicId: string) => {
    setActiveUnitId(unitId);
    setActiveTopicId(topicId);
    setOpenUnits(prev => ({ ...prev, [unitId]: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      const prev = allCourseTopics[currentTopicIndex - 1];
      handleSelectTopic(prev.unit.id, prev.topic.id);
    }
  };

  const handleNextTopic = () => {
    if (currentTopicIndex < allCourseTopics.length - 1) {
      const next = allCourseTopics[currentTopicIndex + 1];
      handleSelectTopic(next.unit.id, next.topic.id);
    }
  };

  // Calculate course completion stats
  const totalTopicsInCourse = allCourseTopics.length;
  const completedTopicsInCourseCount = allCourseTopics.filter(item => completedTopics[item.topic.id]).length;
  const courseProgressPercent = totalTopicsInCourse > 0 
    ? Math.round((completedTopicsInCourseCount / totalTopicsInCourse) * 100) 
    : 0;

  const firstVideo = currentItem?.topic?.videos?.[0];

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Subject Header Banner */}
      <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold text-xs rounded shadow-2xs">
              {course.code}
            </span>
            <span className={`px-2 py-0.5 font-semibold text-xs rounded ${
              course.type === 'compulsory'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {course.type === 'compulsory' ? 'Compulsory Subject' : course.electiveGroup || 'Elective Subject'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              SPPU B.E. 2020 Course
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {course.name}
          </h1>
        </div>

        {/* Progress Tracker Widget */}
        <div className="bg-slate-50 dark:bg-[#151D2B] border border-slate-200 dark:border-[#263244] rounded-xl p-3.5 sm:min-w-[260px] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Syllabus Completion
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">
              {completedTopicsInCourseCount}/{totalTopicsInCourse} ({courseProgressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 3-Column Workspace (Documentation Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Sub-Sidebar (Units & Topic Navigation) - 3 Columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] overflow-hidden shadow-xs">
            
            {/* Units Accordion List */}
            <div className="divide-y divide-slate-100 dark:divide-[#263244]">
              {course.units.map((unit, index) => {
                const isOpen = openUnits[unit.id] ?? false;
                const isCurrentUnit = unit.id === activeUnitId;
                const unitCompletedCount = unit.topics.filter(t => completedTopics[t.id]).length;
                const isAllUnitCompleted = unit.topics.length > 0 && unitCompletedCount === unit.topics.length;

                return (
                  <div key={unit.id} className="transition-colors">
                    {/* Unit Accordion Header */}
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className={`w-full text-left px-3.5 py-3 flex items-center justify-between transition-colors group ${
                        isCurrentUnit
                          ? 'bg-blue-50/60 dark:bg-[#151D2B] text-blue-700 dark:text-blue-400 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-[#151D2B] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 pr-2 min-w-0">
                        {/* Blue Active Dot Indicator */}
                        <div className="shrink-0 flex items-center justify-center">
                          {isCurrentUnit ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                          ) : isAllUnitCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                          )}
                        </div>

                        <span className="font-semibold text-xs sm:text-sm truncate">
                          UNIT {index + 1}: {unit.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {unitCompletedCount}/{unit.topics.length}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Unit Topics Checklist Rows */}
                    {isOpen && (
                      <div className="bg-slate-50/50 dark:bg-[#090D14] py-1 border-t border-slate-100 dark:border-[#263244]">
                        {unit.topics.map((topic, tIdx) => {
                          const isSelectedTopic = topic.id === activeTopicId;
                          const isDone = Boolean(completedTopics[topic.id]);

                          return (
                            <div
                              key={topic.id}
                              className={`group px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                                isSelectedTopic
                                  ? 'bg-blue-100/60 dark:bg-[#151D2B] text-blue-700 dark:text-blue-400 font-semibold border-l-2 border-blue-600'
                                  : 'hover:bg-slate-100/70 dark:hover:bg-[#151D2B]/60 text-slate-700 dark:text-slate-300'
                              }`}
                              onClick={() => handleSelectTopic(unit.id, topic.id)}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {/* Checkbox input */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleTopicCompletion(topic.id);
                                  }}
                                  className="shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                  {isDone ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                  )}
                                </button>

                                <span className={`font-mono text-[10px] shrink-0 ${
                                  isSelectedTopic ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
                                }`}>
                                  {String(tIdx + 1).padStart(2, '0')}
                                </span>

                                <span className={`truncate text-xs ${
                                  isDone ? 'line-through opacity-70' : ''
                                }`}>
                                  {topic.name}
                                </span>
                              </div>

                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isSelectedTopic ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'text-slate-400'
                              }`} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: Documentation Reading Area (6 Columns - ~70% width reading container) */}
        {currentItem ? (
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-6 sm:p-8 shadow-xs">
              
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-[#263244] flex-wrap">
                <span className="hover:text-slate-800 dark:hover:text-slate-200 font-medium">Semester VII</span>
                <span>/</span>
                <span className="hover:text-slate-800 dark:hover:text-slate-200 font-medium">{course.name}</span>
                <span>/</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentItem.unit.name}</span>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{currentItem.topic.name}</span>
              </div>

              {/* Topic Article Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentItem.topic.name}
                  </h1>

                  {/* Complete Checkbox Toggle */}
                  <button
                    onClick={() => onToggleTopicCompletion(currentItem.topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
                      completedTopics[currentItem.topic.id]
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${completedTopics[currentItem.topic.id] ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{completedTopics[currentItem.topic.id] ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{currentItem.unit.name}</span>
                  <span>•</span>
                  <span>{currentItem.unit.hours} Allotted Hours</span>
                  <span>•</span>
                  <span>Topic {currentItem.topicIndex + 1} of {currentItem.unit.topics.length}</span>
                </div>
              </div>

              {/* Top Previous / Next Topic Controls */}
              <div className="flex items-center justify-between py-2 mb-6 border-y border-slate-100 dark:border-[#263244] text-xs">
                <button
                  onClick={handlePrevTopic}
                  disabled={currentTopicIndex === 0}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:hover:text-slate-600 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Topic</span>
                </button>

                <span className="font-mono text-slate-400 text-[11px]">
                  {currentTopicIndex + 1} / {allCourseTopics.length}
                </span>

                <button
                  onClick={handleNextTopic}
                  disabled={currentTopicIndex === allCourseTopics.length - 1}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:hover:text-slate-600 font-medium transition-colors"
                >
                  <span>Next Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Documentation Reading Article Body (Max reading width 760px) */}
              <div className="article-content max-w-[760px] mx-auto space-y-6">
                
                {/* Section 1: Overview */}
                <section id="overview" className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                    {currentItem.topic.explanation ? currentItem.topic.explanation.slice(0, 220) + '...' : `An essential technical concept in ${course.name}.`}
                  </p>
                </section>

                {/* Callout Box: INFO */}
                <div className="callout callout-info flex items-start gap-3">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase tracking-wider mb-0.5">Syllabus Context</span>
                    <p className="m-0 text-sm">
                      This topic forms a vital foundation for university examination questions and practical lab assessments in SPPU B.E. Artificial Intelligence & Data Science.
                    </p>
                  </div>
                </div>

                {/* Section 2: Technical Explanation / Breakdown */}
                {currentItem.topic.explanation && (
                  <section id="explanation" className="space-y-4">
                    <h2 id="how-it-works">Core Concepts & Working</h2>
                    <div 
                      className="explanation-content leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(currentItem.topic.explanation) }}
                    />
                  </section>
                )}

                {/* Section 3: Visual Machine Learning Pipeline Diagram (where applicable) */}
                <section id="pipeline" className="space-y-3 pt-2">
                  <h2>System Process Flow</h2>
                  <div className="bg-[#0F1722] text-slate-200 border border-[#263244] rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed">
                    <div className="text-slate-400 mb-2"># Technical Pipeline Flow Diagram</div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-[#151D2B] border border-[#263244] rounded text-blue-400 font-bold">Input Data</span>
                      <span>→</span>
                      <span className="px-2.5 py-1 bg-[#151D2B] border border-[#263244] rounded text-emerald-400 font-bold">Feature Extraction</span>
                      <span>→</span>
                      <span className="px-2.5 py-1 bg-[#151D2B] border border-[#263244] rounded text-amber-400 font-bold">Model Training</span>
                      <span>→</span>
                      <span className="px-2.5 py-1 bg-[#151D2B] border border-[#263244] rounded text-purple-400 font-bold">Prediction Output</span>
                    </div>
                  </div>
                </section>

                {/* Section 4: Comparison Table */}
                <section id="comparison" className="space-y-3 pt-2">
                  <h2>Technical Comparison</h2>
                  <div className="overflow-x-auto">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>Aspect</th>
                          <th>Traditional Programming</th>
                          <th>Machine Learning</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-semibold">Input</td>
                          <td>Data + Hardcoded Rules</td>
                          <td>Data + Output Labels</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Output</td>
                          <td>Computed Answers</td>
                          <td>Learned Model / Rules</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Flexibility</td>
                          <td>Rigid logic updates</td>
                          <td>Adapts automatically to new data</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Section 5: Real-World Applications */}
                <section id="applications" className="space-y-3 pt-2">
                  <h2>Real-World Applications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-[#151D2B] border border-slate-200 dark:border-[#263244] rounded-lg space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white">🏥 Healthcare & Diagnostics</span>
                      <p className="text-slate-600 dark:text-slate-400">Automated medical imaging analysis and disease prediction models.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#151D2B] border border-slate-200 dark:border-[#263244] rounded-lg space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white">💰 Finance & Fraud Detection</span>
                      <p className="text-slate-600 dark:text-slate-400">Real-time credit card fraud detection and algorithmic trading systems.</p>
                    </div>
                  </div>
                </section>

                {/* Section 6: Key Takeaways */}
                <section id="takeaways" className="space-y-3 pt-2">
                  <h2>Key Takeaways</h2>
                  <div className="callout callout-tip">
                    <ul className="space-y-1.5 m-0 text-xs">
                      <li>• Understand the exact mathematical and algorithmic definition for university exams.</li>
                      <li>• Identify trade-offs between computational complexity and prediction accuracy.</li>
                      <li>• Review practical code implementation and library equivalents in Python/C++.</li>
                    </ul>
                  </div>
                </section>

              </div>

              {/* Bottom Previous / Next Topic Controls */}
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100 dark:border-[#263244] text-xs">
                <button
                  onClick={handlePrevTopic}
                  disabled={currentTopicIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#151D2B] border border-slate-200 dark:border-[#263244] rounded-lg text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-30 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Topic</span>
                </button>

                <button
                  onClick={handleNextTopic}
                  disabled={currentTopicIndex === allCourseTopics.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-30 transition-colors shadow-xs"
                >
                  <span>Next Topic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="lg:col-span-6 bg-white dark:bg-[#0F1722] rounded-xl p-8 border border-slate-200 dark:border-[#263244] text-center">
            <p className="text-slate-500">Select a topic from the left checklist to start reading.</p>
          </div>
        )}

        {/* RIGHT COLUMN: Sticky Resources Panel (3 Columns) */}
        {currentItem && (
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            
            {/* Card 1: Recommended Video Resource */}
            <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                RECOMMENDED VIDEO
              </h3>

              {firstVideo ? (
                <div className="space-y-2.5">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video group">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(firstVideo.url)}`}
                      title={firstVideo.title || currentItem.topic.name}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-2">
                      {firstVideo.title || currentItem.topic.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {firstVideo.channel || 'Recommended Channel'}
                    </p>
                  </div>

                  <a
                    href={firstVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF0033] hover:bg-[#D6002B] text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  Video reference coming soon.
                </div>
              )}
            </div>

            {/* Card 2: On This Page (In-page TOC Navigation) */}
            <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-4 space-y-2.5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                ON THIS PAGE
              </h3>
              <nav className="space-y-1 text-xs">
                <a href="#overview" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • Overview
                </a>
                <a href="#explanation" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • Core Concepts & Working
                </a>
                <a href="#pipeline" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • System Process Flow
                </a>
                <a href="#comparison" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • Technical Comparison
                </a>
                <a href="#applications" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • Real-World Applications
                </a>
                <a href="#takeaways" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors">
                  • Key Takeaways
                </a>
              </nav>
            </div>

            {/* Card 3: Syllabus Reference */}
            <div className="bg-white dark:bg-[#0F1722] rounded-xl border border-slate-200 dark:border-[#263244] p-4 space-y-2 text-xs shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                SYLLABUS REFERENCE
              </h3>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <p><strong className="text-slate-900 dark:text-white font-semibold">Course:</strong> {course.code} {course.name}</p>
                <p><strong className="text-slate-900 dark:text-white font-semibold">Unit:</strong> {currentItem.unit.name}</p>
                <p><strong className="text-slate-900 dark:text-white font-semibold">Topic:</strong> {currentItem.topicIndex + 1} of {currentItem.unit.topics.length}</p>
                <p><strong className="text-slate-900 dark:text-white font-semibold">Hours:</strong> {currentItem.unit.hours} Hours</p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

// Helper to convert simple Markdown text to HTML safely for topic explanations
function formatMarkdown(text: string): string {
  if (!text) return '';
  let html = text
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-[#0F1722] text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto my-3 border border-[#263244]"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">$1</code>')
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold text-slate-900 dark:text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-slate-900 dark:text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="my-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">');

  return `<p class="my-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${html}</p>`;
}
