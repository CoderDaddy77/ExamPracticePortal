import { ArrowLeft, CheckCircle2, BookOpen, Target, Clock3 } from 'lucide-react';
import textedLogo from '../texted-logo.png';

interface AboutPageProps {
  onBack: () => void;
  isDark: boolean;
}

export function AboutPage({ onBack, isDark }: AboutPageProps) {
  return (
    <div
      className={`min-h-screen py-10 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        

        <div
          className={`rounded-3xl shadow-xl p-7 sm:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center border ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white border-transparent'
            }`}
        >
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center rounded-2xl border overflow-hidden ${isDark ? 'bg-[#1F1F1E] border-slate-700' : 'bg-blue-50 border-blue-100'
                }`}
            >
              <img
                src={textedLogo}
                alt="Exam Practice Portal logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-500 font-semibold">Exam Practice Portal</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Practice with YOUR questions.</p>
              <a
                href="https://slashofficial.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  isDark
                    ? 'border-blue-700 bg-blue-900/30 text-blue-300 hover:bg-blue-800/50'
                    : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Portfolio
              </a>
            </div>
          </div>

          <div className="flex-1">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              About Exam Practice Portal
            </h1>
            <p className={`text-base sm:text-lg mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Exam Practice Portal is the only free platform that lets you <strong>add your own questions</strong> and build custom tests — so you practice exactly what you need, not a fixed question bank someone else decided for you.
              Attempt tests in an exam-like environment, track your performance, and keep improving on your schedule.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${isDark ? 'bg-blue-900/30 border border-blue-900/40' : 'bg-blue-50'
                    }`}
                >
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    Create custom tests & questions
                  </p>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                    Use the manage content panel to add your own subjects, tests, and questions so the
                    practice matches exactly what you are preparing for.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${isDark ? 'bg-indigo-900/30 border border-indigo-900/40' : 'bg-indigo-50'
                    }`}
                >
                  <Target size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    Real exam-like feel
                  </p>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                    Attempt tests in realistic mode with a strict timer and focused interface to
                    simulate the pressure of the actual exam.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${isDark ? 'bg-emerald-900/30 border border-emerald-900/40' : 'bg-emerald-50'
                    }`}
                >
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    Bookmark & revise tough questions
                  </p>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                    Bookmark questions from your test results and later attempt a dedicated test made
                    only from your bookmarked questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${isDark ? 'bg-amber-900/30 border border-amber-900/40' : 'bg-amber-50'
                    }`}
                >
                  <Clock3 size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                    Track performance over time
                  </p>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                    See your accuracy, total questions solved, time spent, and recent attempts right on
                    the dashboard so you always know how you are progressing.
                  </p>
                </div>
              </div>
            </div>

            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              No team. No VC funding. Built by one person Mr B — for students who want to
              practice smarter on their own terms. Whether it's CUET, SSC, GK, or your own custom syllabus,
              Exam Practice Portal turns your notes into a real test — free, forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
