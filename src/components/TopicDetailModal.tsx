import React from 'react';
import type { Topic } from '../types/syllabus';
import { X, Play, ExternalLink, BookOpen, Video } from 'lucide-react';

interface TopicDetailModalProps {
  topic: Topic | null;
  unitName: string | null;
  courseName: string | null;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  unitName,
  courseName,
  onClose
}) => {
  if (!topic) return null;

  const video = topic.videos[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white rounded-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {courseName} • {unitName}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {topic.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close topic explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Responsive Layout: Desktop 2-column, Mobile 1-column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Markdown Explanation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Concept & Syllabus Explanation</span>
              </div>

              <div 
                className="explanation-content text-slate-800 space-y-4"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(topic.explanation) }}
              />
            </div>

            {/* Right Column: Recommended YouTube Video Resource */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Recommended Video Resource</span>
              </div>

              {video && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 shadow-xs sticky top-4">
                  {/* Video Thumbnail Box */}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video rounded-lg bg-slate-900 overflow-hidden group cursor-pointer border border-slate-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-[11px] font-bold text-white truncate px-2 py-1 bg-black/60 rounded backdrop-blur-xs">
                      {topic.name}
                    </div>
                  </a>

                  {/* Video Info */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {video.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {video.channel}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>SPPU AI&DS Syllabus • 2020 Pattern</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

// Simple Markdown to HTML Formatter helper
function formatMarkdown(text: string): string {
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/---/g, '<hr />')
    .replace(/^- (.*$)/gim, '<li>$1</li>');

  // Wrap lists
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  // Clean multiple uls
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return html;
}
