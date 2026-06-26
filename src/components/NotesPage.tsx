import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, ExternalLink, BookOpen, ChevronRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { notesData } from '../data/notesData';

interface NotesPageProps {
  isDark: boolean;
  onBack: () => void;
}

export function NotesPage({ isDark, onBack }: NotesPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catId = searchParams.get('cat');
  const subId = searchParams.get('sub');

  // Derive selected levels from URL params — no internal state needed
  const selectedCategory = useMemo(
    () => (catId ? notesData.find(c => c.id === catId) ?? null : null),
    [catId]
  );
  const selectedSubject = useMemo(
    () => (selectedCategory && subId ? selectedCategory.subjects.find(s => s.id === subId) ?? null : null),
    [selectedCategory, subId]
  );

  // Navigation: update URL params (React Router pushes to history automatically)
  const goToCategory = (id: string) => setSearchParams({ cat: id });
  const goToSubject = (catId: string, subId: string) => setSearchParams({ cat: catId, sub: subId });
  const goUp = () => {
    if (subId) { setSearchParams(catId ? { cat: catId } : {}); return; }
    if (catId) { setSearchParams({}); return; }
    onBack();
  };

  const bg = isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]';
  const card = isDark ? 'bg-[#1E1E1D] border-slate-700/60' : 'bg-white border-gray-200';
  const text = isDark ? 'text-slate-100' : 'text-gray-800';
  const muted = isDark ? 'text-slate-400' : 'text-gray-500';
  const backBtn = `inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'border-slate-700 bg-[#1E1E1D] text-slate-300 hover:bg-slate-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`;

  // ── LEVEL 3: Topics list ──────────────────────────────────────────────
  if (selectedCategory && selectedSubject) {
    return (
      <div className={`min-h-screen ${bg}`}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={goUp} className={backBtn}><ArrowLeft size={15} /> Back</button>
            <nav className="flex items-center gap-1 text-sm flex-wrap">
              <button onClick={() => setSearchParams({})} className={`hover:underline ${muted}`}>PDF Notes</button>
              <ChevronRight size={14} className={muted} />
              <button onClick={() => setSearchParams({ cat: selectedCategory.id })} className={`hover:underline ${muted}`}>{selectedCategory.name}</button>
              <ChevronRight size={14} className={muted} />
              <span className={`font-medium ${text}`}>{selectedSubject.name}</span>
            </nav>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              {selectedSubject.icon && <span className="text-xl">{selectedSubject.icon}</span>}
              <h1 className={`text-2xl font-bold ${text}`}>{selectedSubject.name}</h1>
            </div>
            <p className={`text-sm ${muted}`}>{selectedSubject.notes.length} topics</p>
          </div>

          <div className="flex flex-col gap-2">
            {selectedSubject.notes.map((note, idx) => {
              const isReady = !note.driveUrl.includes('your-link-here');
              return (
                <a
                  key={note.id}
                  href={isReady ? note.driveUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-150 ${
                    isReady
                      ? isDark
                        ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800 cursor-pointer'
                        : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                      : `${card} opacity-50 cursor-not-allowed`
                  }`}
                >
                  <span className={`text-xs font-mono w-5 shrink-0 ${muted}`}>{String(idx + 1).padStart(2, '0')}</span>
                  <FileText size={16} className={`shrink-0 ${muted}`} />
                  <span className={`flex-1 text-sm font-medium ${text}`}>{note.title}</span>
                  {note.description && <span className={`text-xs hidden sm:block ${muted}`}>{note.description}</span>}
                  {isReady
                    ? <ExternalLink size={13} className={`shrink-0 opacity-0 group-hover:opacity-50 transition-opacity ${muted}`} />
                    : <span className={`text-xs shrink-0 ${muted}`}>Soon</span>
                  }
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LEVEL 2: Subjects list ────────────────────────────────────────────
  if (selectedCategory) {
    return (
      <div className={`min-h-screen ${bg}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={goUp} className={backBtn}><ArrowLeft size={15} /> Back</button>
            <nav className="flex items-center gap-1 text-sm">
              <button onClick={() => setSearchParams({})} className={`hover:underline ${muted}`}>PDF Notes</button>
              <ChevronRight size={14} className={muted} />
              <span className={`font-medium ${text}`}>{selectedCategory.name}</span>
            </nav>
          </div>

          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-1 ${text}`}>{selectedCategory.name}</h1>
            <p className={`text-sm ${muted}`}>Select a subject to view topic-wise PDFs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedCategory.subjects.map((subject) => {
              const readyCount = subject.notes.filter(n => !n.driveUrl.includes('your-link-here')).length;
              return (
                <button
                  key={subject.id}
                  onClick={() => goToSubject(selectedCategory.id, subject.id)}
                  className={`group text-left flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${isDark ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${text}`}>{subject.name}</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>{subject.notes.length} topics · {readyCount} available</p>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${muted}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LEVEL 1: Exam categories ──────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>PDF Notes & Study Material</h1>
          <p className={`text-sm ${muted}`}>Topic-wise PDF notes organised by exam.</p>
        </div>

        {notesData.length === 0 ? (
          <div className={`rounded-xl border p-12 text-center ${card}`}>
            <BookOpen size={40} className={`mx-auto mb-3 ${muted}`} />
            <p className={muted}>No notes added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notesData.map((category) => {
              const totalTopics = category.subjects.reduce((s, sub) => s + sub.notes.length, 0);
              const totalSubjects = category.subjects.length;
              return (
                <button
                  key={category.id}
                  onClick={() => goToCategory(category.id)}
                  className={`group text-left p-5 rounded-xl border transition-all duration-150 ${isDark ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-xs font-medium uppercase tracking-wider ${muted}`}>{totalSubjects} subject{totalSubjects !== 1 ? 's' : ''}</p>
                    <ChevronRight size={15} className={`transition-transform group-hover:translate-x-0.5 ${muted}`} />
                  </div>
                  <h2 className={`text-lg font-semibold mb-0.5 ${text}`}>{category.name}</h2>
                  <p className={`text-xs ${muted}`}>{totalTopics} topics</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
