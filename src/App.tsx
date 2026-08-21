import { useState, useMemo, useEffect } from 'react';
import { syllabusData } from './data/syllabusData';
import type { Topic } from './types/syllabus';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { SubjectView } from './components/SubjectView';
import { SearchResultsView } from './components/SearchResultsView';
import { InfoModal } from './components/InfoModal';
import { ChevronRight, Home } from 'lucide-react';

export function App() {
  const [selectedSemId, setSelectedSemId] = useState<string | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>('417521'); // Default to Machine Learning matching screenshot
  const [initialTopicId, setInitialTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Info Modal state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  
  // Mobile Sidebar Drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Dark Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('sppu_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sppu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sppu_theme', 'light');
    }
  }, [isDarkMode]);

  // Topic Completion Checklist State (Persisted in localStorage)
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sppu_completed_topics');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopics(prev => {
      const updated = { ...prev, [topicId]: !prev[topicId] };
      try {
        localStorage.setItem('sppu_completed_topics', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save completion state:', e);
      }
      return updated;
    });
  };

  // Helper to find selected course object
  const selectedCourse = useMemo(() => {
    if (!selectedCourseCode) return null;
    for (const sem of syllabusData) {
      const found = sem.courses.find(c => c.code === selectedCourseCode);
      if (found) return found;
    }
    return null;
  }, [selectedCourseCode]);

  const handleSelectCourse = (code: string) => {
    setSelectedCourseCode(code);
    setInitialTopicId(null);
    setSearchQuery('');
  };

  const handleSearchSelectTopic = (topic: Topic, _unitName: string, _courseName: string, courseCode: string) => {
    setSelectedCourseCode(courseCode);
    setInitialTopicId(topic.id);
    setSearchQuery('');
  };

  const handleHomeClick = () => {
    setSelectedCourseCode(null);
    setSelectedSemId(null);
    setInitialTopicId(null);
    setSearchQuery('');
  };

  const handleSelectSem = (semId: string | null) => {
    setSelectedSemId(semId);
    setSelectedCourseCode(null);
    setInitialTopicId(null);
    setSearchQuery('');
  };

  // Filter semesters if semester filter is active
  const displayedSemesters = useMemo(() => {
    if (!selectedSemId) return syllabusData;
    return syllabusData.filter(s => s.id === selectedSemId);
  }, [selectedSemId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Header Bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        selectedSem={selectedSemId}
        onSelectSem={handleSelectSem}
        onHomeClick={handleHomeClick}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full">
        
        {/* Left Sidebar Navigation */}
        <Sidebar
          semesters={syllabusData}
          selectedCourseCode={selectedCourseCode}
          onSelectCourse={handleSelectCourse}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onGoToDashboard={handleHomeClick}
          onFocusSearch={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-16">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto transition-colors">
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {selectedSemId && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  {selectedSemId === 'sem7' ? 'Semester VII' : 'Semester VIII'}
                </span>
              </>
            )}

            {selectedCourse && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[11px] shrink-0 font-bold">
                  {selectedCourse.code}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {selectedCourse.name}
                </span>
              </>
            )}

            {searchQuery && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Search Results
                </span>
              </>
            )}
          </div>

          {/* Dynamic View Rendering */}
          {searchQuery.trim().length > 0 ? (
            <SearchResultsView
              query={searchQuery}
              semesters={syllabusData}
              onSelectTopic={handleSearchSelectTopic}
              onSelectCourse={handleSelectCourse}
            />
          ) : selectedCourse ? (
            <SubjectView
              course={selectedCourse}
              completedTopics={completedTopics}
              onToggleTopicCompletion={toggleTopicCompletion}
              initialTopicId={initialTopicId}
            />
          ) : (
            <HomeView
              semesters={displayedSemesters}
              completedTopics={completedTopics}
              onSelectSem={handleSelectSem}
              onSelectCourse={handleSelectCourse}
            />
          )}

        </main>

      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

    </div>
  );
}

export default App;
