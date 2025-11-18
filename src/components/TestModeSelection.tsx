import { Monitor, FileText, ArrowLeft } from 'lucide-react';
import type { Test } from '../types';

interface TestModeSelectionProps {
  test: Test;
  categoryName: string;
  isDark: boolean;
  onModeSelect: (mode: 'normal' | 'realistic') => void;
  onBack: () => void;
}

export function TestModeSelection({ test, categoryName, isDark, onModeSelect, onBack }: TestModeSelectionProps) {
  return (
    <div className={`min-h-screen py-8 px-4 ${
      isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm rounded-lg border transition-colors ${
            isDark
              ? 'border-slate-700 bg-[#212226] text-slate-200 hover:bg-slate-700/80'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className={`rounded-xl shadow-lg p-8 mb-6 ${
          isDark ? 'bg-[#212226] border border-slate-700' : 'bg-white'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
            {test.name}
          </h1>
          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{categoryName}</p>
          <div className={`rounded-lg p-4 mb-8 ${
            isDark ? 'bg-[#212226]' : 'bg-blue-50'
          }`}>
            <p className={isDark ? 'text-slate-200' : 'text-gray-700'}>
              <strong>{test.questions.length}</strong> Questions • 
              <strong> {Math.max(30, test.questions.length)}</strong> Minutes
            </p>
          </div>

          <h2 className={`text-2xl font-bold mb-6 text-center ${
            isDark ? 'text-slate-100' : 'text-gray-800'
          }`}>
            Choose Test Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Normal Mode */}
            <button
              onClick={() => onModeSelect('normal')}
              className={`border-2 rounded-xl p-8 hover:shadow-lg transition-all text-left group ${
                isDark ? 'bg-[#212226] border-blue-600 hover:border-blue-500'
                  : 'bg-white border-blue-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg transition-colors ${
                  isDark ? 'bg-[#212226] group-hover:bg-slate-700'
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
              className={`border-2 rounded-xl p-8 hover:shadow-lg transition-all text-left group ${
                isDark ? 'bg-[#212226] border-purple-600 hover:border-purple-500'
                  : 'bg-white border-purple-200 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg transition-colors ${
                  isDark ? 'bg-[#212226] group-hover:bg-slate-700'
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

