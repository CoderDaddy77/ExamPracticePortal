import { Monitor, FileText, ArrowLeft, BookOpen, Download, Lock } from 'lucide-react';
import type { Test } from '../types';
import { generateTestPdf } from '../utils/generateTestPdf';

interface TestModeSelectionProps {
  test: Test;
  categoryName: string;
  isDark: boolean;
  hasAttempted: boolean;
  onModeSelect: (mode: 'normal' | 'realistic') => void;
  onBack: () => void;
  onViewStudyMaterial?: () => void;
}

export function TestModeSelection({
  test,
  categoryName,
  isDark,
  hasAttempted,
  onModeSelect,
  onBack,
  onViewStudyMaterial
}: TestModeSelectionProps) {
  const hasStudyMaterial = Boolean(test.studyMaterial?.sections?.length);

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
      }`}>
      <div className="max-w-4xl mx-auto">
        

        <div className={`rounded-xl shadow-lg p-8 mb-6 ${isDark ? 'bg-[#1E1E1D] border border-slate-700' : 'bg-white'
          }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            {test.name}
          </h1>
          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{categoryName}</p>
          <div className={`rounded-lg p-4 mb-8 ${isDark ? 'bg-[#1E1E1D]' : 'bg-blue-50'
            }`}>
            <p className={isDark ? 'text-slate-200' : 'text-gray-700'}>
              <strong>{test.questions.length}</strong> Questions •
              <strong> {test.timeLimitMinutes || Math.max(30, test.questions.length)}</strong> Minutes
            </p>
          </div>
          {hasStudyMaterial && onViewStudyMaterial && (
            <div
              className={`rounded-lg border px-4 py-3 mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${isDark ? 'border-blue-900 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
                }`}
            >
              <div className={`${isDark ? 'text-slate-100' : 'text-gray-800'} flex items-center gap-2 text-sm`}>
                <BookOpen size={18} className={isDark ? 'text-blue-200' : 'text-blue-600'} />
                Study material is available for this test.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onViewStudyMaterial}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <BookOpen size={14} />
                  Open Study Mode
                </button>
              </div>
            </div>
          )}

          {/* Download Test Paper section */}
          <div
            className={`rounded-lg border px-4 py-3 mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between ${isDark ? 'border-green-900 bg-green-900/20' : 'border-green-200 bg-green-50'
              }`}
          >
            <div className={`${isDark ? 'text-slate-100' : 'text-gray-800'} flex items-center gap-2 text-sm`}>
              <Download size={18} className={isDark ? 'text-green-200' : 'text-green-600'} />
              {hasAttempted
                ? 'Download test paper with answers as PDF'
                : 'Complete this test at least once to unlock PDF download'}
            </div>
            <button
              onClick={() => generateTestPdf(test, { testName: test.name, categoryName })}
              disabled={!hasAttempted}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${hasAttempted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : isDark
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {hasAttempted ? <Download size={14} /> : <Lock size={14} />}
              {hasAttempted ? 'Download PDF' : 'Locked'}
            </button>
          </div>

          <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-slate-100' : 'text-gray-800'
            }`}>
            Choose Test Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Normal Mode */}
            <button
              onClick={() => onModeSelect('normal')}
              className={`border-2 rounded-xl p-8 hover:shadow-lg transition-all text-left group ${isDark ? 'bg-[#1E1E1D] border-blue-600 hover:border-blue-500'
                : 'bg-white border-blue-200 hover:border-blue-500'
                }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg transition-colors ${isDark ? 'bg-[#1E1E1D] group-hover:bg-slate-700'
                  : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                  <Monitor className={isDark ? 'text-blue-400' : 'text-blue-600'} size={32} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                  Normal Mode
                </h3>
              </div>
              <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                Simple and straightforward test experience. Perfect for quick practice sessions.
              </p>
              <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                <li>✓ Clean, simple interface</li>
                <li>✓ Easy navigation</li>
                <li>✓ Quick question review</li>
                <li>✓ Fast and lightweight</li>
              </ul>
            </button>

            {/* Realistic Mode */}
            <button
              onClick={() => onModeSelect('realistic')}
              className={`border-2 rounded-xl p-8 hover:shadow-lg transition-all text-left group ${isDark ? 'bg-[#1E1E1D] border-purple-600 hover:border-purple-500'
                : 'bg-white border-purple-200 hover:border-purple-500'
                }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg transition-colors ${isDark ? 'bg-[#1E1E1D] group-hover:bg-slate-700'
                  : 'bg-purple-100 group-hover:bg-purple-200'
                  }`}>
                  <FileText className={isDark ? 'text-purple-400' : 'text-purple-600'} size={32} />
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                  Realistic Mode
                </h3>
              </div>
              <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                Exam-like experience similar to competitive exam platforms. Best for exam preparation.
              </p>
              <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                <li>✓ Exam-like interface</li>
                <li>✓ Mark for Review feature</li>
                <li>✓ Question status palette</li>
                <li>✓ Fullscreen & Pause options</li>
                <li>✓ Question Paper view</li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

