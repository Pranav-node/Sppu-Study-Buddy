import React, { useState, useMemo } from 'react';
import type { Course, Topic, Unit } from '../types/syllabus';
import { 
  ChevronDown, ChevronRight, ChevronLeft, Play, Clock, 
  CheckCircle, Circle, ExternalLink, Lightbulb, 
  Info, Heart, DollarSign, ShoppingCart, Truck
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



  return (
    <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Subject Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-blue-600 text-white font-mono font-bold text-xs rounded-md shadow-xs">
              {course.code}
            </span>
            <span className={`px-2.5 py-1 font-semibold text-xs rounded-md ${
              course.type === 'compulsory'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {course.type === 'compulsory' ? 'Compulsory Subject' : course.electiveGroup || 'Elective Subject'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Savitribai Phule Pune University
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {course.name}
          </h1>
        </div>

        {/* Progress Tracker Widget */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 sm:min-w-[260px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Syllabus Completion
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">
              {completedTopicsInCourseCount}/{totalTopicsInCourse} ({courseProgressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 3-Column Workspace (Matches Screenshot Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sub-Sidebar (Units & Topics Checklist) - 3 Columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            
            {/* Sub-Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                UNITS
              </h2>
            </div>

            {/* Units Accordion List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
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
                      className={`w-full text-left px-4 py-3.5 flex items-center justify-between transition-colors group ${
                        isCurrentUnit
                          ? 'bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 pr-2 min-w-0">
                        {/* Blue Active Dot Indicator */}
                        <div className="relative shrink-0 flex items-center justify-center">
                          {isCurrentUnit ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 ring-4 ring-blue-100 dark:ring-blue-950" />
                          ) : isAllUnitCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                          )}
                        </div>

                        <span className="font-semibold text-xs sm:text-sm truncate">
                          {unit.name}
                        </span>
                      </div>

                      <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Unit Topics Checklist (when expanded) */}
                    {isOpen && (
                      <div className="bg-slate-50/50 dark:bg-slate-900/60 p-2 space-y-1 border-t border-slate-100 dark:border-slate-800/60">
                        
                        <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <span>UNIT {index + 1} TOPICS</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400">
                            {unitCompletedCount}/{unit.topics.length} Done
                          </span>
                        </div>

                        {/* Interactive Topics Checklist */}
                        <div className="space-y-1">
                          {unit.topics.map((topic, tIdx) => {
                            const isTopicActive = topic.id === activeTopicId;
                            const isDone = completedTopics[topic.id] ?? false;

                            return (
                              <div
                                key={topic.id}
                                className={`group flex items-start gap-2.5 p-2 rounded-xl border text-xs transition-all ${
                                  isTopicActive
                                    ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-xs'
                                    : isDone
                                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                                      : 'bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                              >
                                {/* Checklist Checkbox Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleTopicCompletion(topic.id);
                                  }}
                                  className={`mt-0.5 shrink-0 rounded-md transition-colors focus:outline-hidden ${
                                    isTopicActive
                                      ? 'text-white hover:text-blue-100'
                                      : isDone
                                        ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                                        : 'text-slate-300 dark:text-slate-600 hover:text-blue-600'
                                  }`}
                                  title={isDone ? "Mark as unstudied" : "Mark topic as completed"}
                                  aria-label="Toggle completed state"
                                >
                                  {isDone ? (
                                    <CheckCircle className={`w-4 h-4 ${isTopicActive ? 'fill-white text-blue-600' : 'fill-emerald-500 text-white'}`} />
                                  ) : (
                                    <Circle className="w-4 h-4 stroke-[2]" />
                                  )}
                                </button>

                                {/* Topic Title Text (Selects topic for reading) */}
                                <button
                                  onClick={() => handleSelectTopic(unit.id, topic.id)}
                                  className="text-left flex-1 font-medium leading-snug line-clamp-2 focus:outline-hidden"
                                >
                                  <span className={isDone && !isTopicActive ? 'line-through opacity-75' : ''}>
                                    {tIdx + 1}. {topic.name}
                                  </span>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Unit Footer Info */}
                        <div className="pt-2 px-2 pb-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 mt-2">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {unit.hours} Hours
                          </span>
                          <span>•</span>
                          <span>{unit.topics.length} Topics</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Center Content Reading Pane (Columns 4-9 in 12-col grid) */}
        {currentItem ? (
          <div className="lg:col-span-6 space-y-6">
            
            {/* Reading Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
              
              {/* Top Sub Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate max-w-md">
                  <span className="text-blue-600 dark:text-blue-400 font-bold truncate">
                    {currentItem.unit.name}
                  </span>
                  <span>›</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold truncate">
                    {currentItem.topicIndex + 1}. {currentItem.topic.name}
                  </span>
                </div>

                {/* Prev / Next Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevTopic}
                    disabled={currentTopicIndex <= 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Topic</span>
                  </button>

                  <button
                    onClick={handleNextTopic}
                    disabled={currentTopicIndex >= allCourseTopics.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors shadow-xs"
                  >
                    <span>Next Topic</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Topic Header Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {currentItem.topic.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {currentItem.unit.hours} Hours
                  </span>
                  <span>•</span>
                  <span>Unit {currentItem.unitIndex + 1} Topic {currentItem.topicIndex + 1} of {currentItem.unit.topics.length}</span>
                  <span>•</span>
                  <button
                    onClick={() => onToggleTopicCompletion(currentItem.topic.id)}
                    className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                      completedTopics[currentItem.topic.id]
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {completedTopics[currentItem.topic.id] ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section 1: Overview (As in reference screenshot) */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Overview
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  This topic introduces the fundamental concepts of {currentItem.topic.name}, its theoretical foundation, real-world engineering applications, and practical importance in the SPPU AI&DS syllabus.
                </p>
              </div>

              {/* Section 2: Key Concepts Tags (As in reference screenshot) */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Key Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold rounded-lg">
                    {course.name}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-lg">
                    AI vs ML vs DS
                  </span>
                  <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold rounded-lg">
                    Real-Life Applications
                  </span>
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold rounded-lg">
                    Algorithmic Mechanics
                  </span>
                </div>
              </div>

              {/* Section 3: Structured Concept Content */}
              <div className="space-y-4 pt-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  What is {currentItem.topic.name}?
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {currentItem.topic.name} is a key component of Artificial Intelligence and Data Science that enables systems to ingest data, identify underlying patterns, make data-driven decisions, and optimize predictions automatically without being explicitly coded for every rule.
                </p>

                {/* Info Quote Callout Box (Matching reference screenshot) */}
                <div className="bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 rounded-xl p-4 flex gap-3 text-blue-900 dark:text-blue-200 text-xs sm:text-sm">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Arthur Samuel (1959): </span>
                    <span className="italic">"Field of study that gives computers the ability to learn without being explicitly programmed."</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Why is it used? (Checklist bullets matching screenshot) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Why is it used?
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 fill-blue-600 text-white dark:fill-blue-400 dark:text-slate-900" />
                    <span><strong>Automates</strong> learning from data and improves performance with experience over time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 fill-blue-600 text-white dark:fill-blue-400 dark:text-slate-900" />
                    <span><strong>Handles complex</strong>, large-scale, structured and unstructured datasets efficiently.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 fill-blue-600 text-white dark:fill-blue-400 dark:text-slate-900" />
                    <span><strong>Makes accurate</strong> predictions and intelligent decisions under uncertain conditions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 fill-blue-600 text-white dark:fill-blue-400 dark:text-slate-900" />
                    <span><strong>Helps solve</strong> real-world engineering problems efficiently across various industrial domains.</span>
                  </li>
                </ul>
              </div>

              {/* Section 5: Real-Life Applications Cards Grid (Matching reference screenshot) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Real-life Applications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                      <Heart className="w-4 h-4" />
                      <span>Healthcare</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Disease prediction, medical image analysis, genomic sequencing.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <DollarSign className="w-4 h-4" />
                      <span>Finance</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Fraud detection, algorithmic trading, credit risk assessment.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                      <ShoppingCart className="w-4 h-4" />
                      <span>E-Commerce</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Recommendation systems, price optimization, customer personalization.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <Truck className="w-4 h-4" />
                      <span>Transportation</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Autonomous vehicles, route optimization, predictive maintenance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6: Comparison Table (Matching reference screenshot) */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Comparison: ML vs Traditional Programming
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Aspect</th>
                        <th className="p-3">Traditional Programming</th>
                        <th className="p-3">Machine Learning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200">Approach</td>
                        <td className="p-3">Explicitly coded rules</td>
                        <td className="p-3">Learns patterns from data</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200">Adaptability</td>
                        <td className="p-3">Needs manual updates</td>
                        <td className="p-3">Improves with more data</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200">Data Dependence</td>
                        <td className="p-3">Low</td>
                        <td className="p-3">High</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200">Example</td>
                        <td className="p-3">Calculator program</td>
                        <td className="p-3">Spam email classifier</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Full Markdown Syllabus Content */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Detailed Syllabus Notes & Code Examples
                </h3>
                <div 
                  className="explanation-content text-slate-800 dark:text-slate-200 space-y-4"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(currentItem.topic.explanation) }}
                />
              </div>

            </div>

          </div>
        ) : (
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500">Select a topic from the left checklist to start reading.</p>
          </div>
        )}

        {/* Right Sticky Sidebar Pane (Columns 10-12 in 12-col grid) */}
        {currentItem && (
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            
            {/* Card 1: Recommended Video (Matching Screenshot) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs transition-colors">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recommended Video
              </h3>

              {currentItem.topic.videos[0] ? (
                <div className="space-y-3">
                  {/* YouTube Player Preview Thumbnail */}
                  <a
                    href={currentItem.topic.videos[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video rounded-xl bg-slate-950 overflow-hidden group cursor-pointer border border-slate-800"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-rose-600/30">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] font-bold rounded">
                      15:42
                    </div>
                  </a>

                  {/* Video Details */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                      What is Machine Learning? | ML vs AI vs Data Science
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Simplilearn ✓
                    </p>
                  </div>

                  <a
                    href={currentItem.topic.videos[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800/80 transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No video reference attached.</p>
              )}
            </div>

            {/* Card 2: Quick Links (Matching Screenshot) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs transition-colors">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Links
              </h3>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
                  className="w-full flex items-center justify-between py-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors border-b border-slate-100 dark:border-slate-800/60"
                >
                  <span>Definitions</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                  className="w-full flex items-center justify-between py-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors border-b border-slate-100 dark:border-slate-800/60"
                >
                  <span>ML vs Traditional Programming</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="w-full flex items-center justify-between py-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors border-b border-slate-100 dark:border-slate-800/60"
                >
                  <span>ML vs AI vs Data Science</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full flex items-center justify-between py-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors"
                >
                  <span>Learning Paradigms</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Card 3: Study Tip (Light Green Card Matching Screenshot) */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Study Tip</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                Understand the differences between AI, ML and Data Science clearly. These are the foundation for advanced topics.
              </p>
            </div>

            {/* Card 4: Syllabus Reference (Matching Screenshot) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs shadow-xs transition-colors">
              <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Syllabus Reference
              </h3>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <p><strong className="text-slate-800 dark:text-slate-200">Course:</strong> {course.code} {course.name}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Unit:</strong> {currentItem.unit.name}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Topic:</strong> {currentItem.topicIndex + 1} of {currentItem.unit.topics.length}</p>
                <p><strong className="text-slate-800 dark:text-slate-200 font-bold">Hours:</strong> {currentItem.unit.hours}</p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};


// Helper to convert simple Markdown text to HTML safely for topic explanations
function formatMarkdown(text: string): string {

  if (!text) return '';
  let html = text
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto my-3 border border-slate-800"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold text-slate-900 dark:text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-slate-900 dark:text-white mt-6 mb-3">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    // Italics
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>')
    // Bullet lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>')
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p class="my-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">');

  return `<p class="my-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${html}</p>`;
}

