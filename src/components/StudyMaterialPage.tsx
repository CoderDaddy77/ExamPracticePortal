import { BookOpen, Play, Pencil, Lock, Table2 } from 'lucide-react';
import type { Test } from '../types';
import { CheatSheetDisplay } from './CheatSheetDisplay';

interface StudyMaterialPageProps {
  test: Test;
  categoryName: string;
  subjectName?: string;
  isDark: boolean;
  onBack: () => void;
  onStartTest?: () => void;
  onEditTest?: () => void;
  isDefaultTest?: boolean;
}

export function StudyMaterialPage({
  test,
  categoryName,
  subjectName,
  isDark,
  onBack,
  onStartTest,
  onEditTest,
  isDefaultTest = false
}: StudyMaterialPageProps) {
  const sections = test.studyMaterial?.sections || [];
  const cheatSheets = test.studyMaterial?.cheatSheets || [];
  // Respect the order saved by admin (cheatSheetsFirst flag)
  const cheatSheetsFirst = test.studyMaterial?.cheatSheetsFirst ?? false;

  const clearSelectionOnInteractive = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"]') && window.getSelection()?.toString()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div
      className={`h-[calc(100vh-52px)] overflow-y-auto py-8 px-4 ${isDark ? 'bg-[#1F1F1E] dark-scrollbar' : 'bg-gradient-to-br from-amber-50 to-white realistic-scrollbar'}`}
      onMouseDown={clearSelectionOnInteractive}
    >
      <div className="max-w-4xl mx-auto">

        <div className={`rounded-2xl shadow-xl p-8 mb-8 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>Study Mode</p>
              <h1 className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{test.name}</h1>
              <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-sm`}>
                {categoryName}
                {subjectName ? ` • ${subjectName}` : ''}
              </p>
              {test.studyMaterial?.lastUpdated && (
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  Updated on {new Date(test.studyMaterial.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Edit Notes button — only shown when onEditTest is provided (logged-in admin) */}
              {(onEditTest || isDefaultTest) && (
                <button
                  onClick={isDefaultTest ? undefined : onEditTest}
                  disabled={isDefaultTest}
                  title={isDefaultTest ? 'Default test study material cannot be edited' : 'Edit in Admin Panel'}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${isDefaultTest
                    ? isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'border-slate-600 text-slate-200 hover:bg-slate-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {isDefaultTest ? <Lock size={14} /> : <Pencil size={15} />}
                  {isDefaultTest ? 'Locked' : 'Edit Notes'}
                </button>
              )}
              {onStartTest && (
                <button
                  onClick={onStartTest}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Play size={16} />
                  Start Test
                </button>
              )}
            </div>
          </div>
          <div
            className={`mt-6 rounded-xl p-4 flex items-center gap-3 ${isDark ? 'bg-[#1F1F1E] border border-slate-700' : 'bg-amber-50 border border-amber-200'}`}
          >
            <BookOpen className={isDark ? 'text-amber-200' : 'text-amber-600'} size={28} />
            <div>
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                {sections.length > 0 && `${sections.length} guided note${sections.length !== 1 ? 's' : ''}`}
                {sections.length > 0 && cheatSheets.length > 0 && ' · '}
                {cheatSheets.length > 0 && (
                  <span className={isDark ? 'text-indigo-300' : 'text-indigo-600'}>
                    {cheatSheets.length} cheat sheet{cheatSheets.length !== 1 ? 's' : ''}
                  </span>
                )}
                {sections.length === 0 && cheatSheets.length === 0 && 'No content yet'}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {sections.length > 0 && 'Expand each card to see explanations, solved examples, or question-answer pairs.'}
                {cheatSheets.length > 0 && ' Scroll down to view the cheat sheet tables.'}
              </p>
            </div>
          </div>
        </div>

        {sections.length === 0 && cheatSheets.length === 0 ? (
          <div
            className={`rounded-2xl border-2 border-dashed p-10 text-center ${isDark ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-600'}`}
          >
            <p className="text-lg font-semibold mb-2">Study material is not available yet.</p>
            <p className="text-sm">Add study notes or cheat sheets from the Admin Panel to unlock this space.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cheatSheetsFirst ? (
              <>
                {/* Cheat Sheets first (admin-configured order) */}
                {cheatSheets.length > 0 && (
                  <>
                    {cheatSheets.map((sheet) => (
                      <CheatSheetDisplay key={sheet.id} sheet={sheet} isDark={isDark} />
                    ))}
                    {sections.length > 0 && (
                      <div className="flex items-center gap-3 mt-6 mb-2">
                        <BookOpen size={18} className={isDark ? 'text-amber-300' : 'text-amber-600'} />
                        <h2 className={`text-base font-bold tracking-wide ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                          Study Notes
                        </h2>
                        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      </div>
                    )}
                  </>
                )}
                {sections.map((section, idx) => (
                  <SectionCard key={section.id || `${section.title}-${idx}`} section={section} idx={idx} isDark={isDark} />
                ))}
              </>
            ) : (
              <>
                {/* Notes first (default) */}
                {sections.map((section, idx) => (
                  <SectionCard key={section.id || `${section.title}-${idx}`} section={section} idx={idx} isDark={isDark} />
                ))}
                {cheatSheets.length > 0 && (
                  <>
                    {sections.length > 0 && (
                      <div className="flex items-center gap-3 mt-6 mb-2">
                        <Table2 size={18} className={isDark ? 'text-indigo-400' : 'text-indigo-500'} />
                        <h2 className={`text-base font-bold tracking-wide ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                          Cheat Sheets
                        </h2>
                        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      </div>
                    )}
                    {cheatSheets.map((sheet) => (
                      <CheatSheetDisplay key={sheet.id} sheet={sheet} isDark={isDark} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Extracted section card to avoid repeated inline styles ────────────────────
function SectionCard({
  section,
  idx,
  isDark,
}: {
  section: { id: string; title: string; content: string };
  idx: number;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${isDark ? 'border-[#2D2D2C] bg-[#1F1F1E]' : 'border-gray-200 bg-white'}`}
    >
      <div>
        <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {idx + 1}
        </p>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-50' : 'text-gray-900'}`}>
          {section.title}
        </h3>
      </div>
      <div
        className={`mt-3 text-base leading-relaxed study-content ${isDark ? 'text-slate-100' : 'text-gray-700'}`}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
      <style>{`
        .study-content img { max-width:100%; height:auto; max-height:600px; border-radius:8px; margin:12px auto; object-fit:contain; display:block; }
        .study-content p { margin-bottom:12px; }
        .study-content strong { font-weight:600; }
        .study-content em { font-style:italic; }
        .study-content ul, .study-content ol { margin-left:24px; margin-bottom:12px; }
        .study-content li { margin-bottom:6px; }
        .study-content a { color:${isDark ? '#60a5fa' : '#3b82f6'}; text-decoration:underline; }
        .study-content h1,.study-content h2,.study-content h3 { font-weight:600; margin-top:24px; margin-bottom:12px; padding-bottom:8px; color:${isDark ? '#e2e8f0' : '#1e293b'}; border-bottom:2px solid ${isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.2)'}; }
        .study-content h1 { font-size:1.5rem; }
        .study-content h2 { font-size:1.3rem; }
        .study-content h3 { font-size:1.1rem; }
        .study-content hr { border:none; border-top:2px solid ${isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.3)'}; margin:24px 0; }
        .study-content blockquote { border-left:4px solid ${isDark ? '#475569' : '#cbd5e1'}; background:${isDark ? 'rgba(51,65,85,0.4)' : 'rgba(241,245,249,0.8)'}; color:${isDark ? '#cbd5e1' : '#475569'}; padding:10px 16px; margin:12px 0; border-radius:0 6px 6px 0; }
        .study-content mark { background:${isDark ? 'rgba(234,179,8,0.25)' : 'rgba(253,224,71,0.5)'}; color:${isDark ? '#fde68a' : '#78350f'}; padding:0 3px; border-radius:3px; }
        .study-content table { width:100%; border-collapse:collapse; margin:16px 0; font-size:0.9rem; }
        .study-content th { background:${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(219,234,254,0.8)'}; color:${isDark ? '#bfdbfe' : '#1e40af'}; font-weight:600; padding:8px 12px; border:1px solid ${isDark ? '#334155' : '#cbd5e1'}; text-align:left; }
        .study-content td { padding:8px 12px; border:1px solid ${isDark ? '#334155' : '#cbd5e1'}; color:${isDark ? '#cbd5e1' : '#374151'}; }
        .study-content tr:nth-child(even) td { background:${isDark ? 'rgba(30,41,59,0.5)' : 'rgba(248,250,252,0.8)'}; }
        .study-content code { background:${isDark ? 'rgba(15,23,42,0.7)' : 'rgba(241,245,249,0.9)'}; color:${isDark ? '#7dd3fc' : '#0369a1'}; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.875em; }
        .study-content pre { background:${isDark ? 'rgba(15,23,42,0.7)' : 'rgba(241,245,249,0.9)'}; color:${isDark ? '#e2e8f0' : '#1e293b'}; padding:16px; border-radius:8px; overflow-x:auto; margin:12px 0; }
      `}</style>
    </div>
  );
}
