import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ChevronRight, FileText, ArrowLeft } from 'lucide-react';
import type { ExamCategory } from '../types';
import { hasStudyMaterial } from '../utils/studyMaterial';

interface StudyModePageProps {
  categories: ExamCategory[];
  isDark: boolean;
  onBack: () => void;
  onStudySelect: (categoryId: string, subjectId: string | undefined, testId: string) => void;
}

interface StudyTestEntry {
  id: string;
  name: string;
  entryCount: number;
  lastUpdated: number;
  subjectId?: string;
}

interface StudySubjectBucket {
  id: string;
  name: string;
  tests: StudyTestEntry[];
}

interface StudyCategoryGroup {
  id: string;
  name: string;
  subjectBuckets: StudySubjectBucket[];
  rootTests: StudyTestEntry[];
  totalItems: number;
}

export function StudyModePage({ categories, isDark, onBack, onStudySelect }: StudyModePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catId = searchParams.get('cat');
  const subId = searchParams.get('sub');

  const bg = isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]';
  const text = isDark ? 'text-slate-100' : 'text-gray-800';
  const muted = isDark ? 'text-slate-400' : 'text-gray-500';
  const backBtn = `inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'border-slate-700 bg-[#1E1E1D] text-slate-300 hover:bg-slate-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`;

  const studyCategories: StudyCategoryGroup[] = useMemo(() => {
    return categories
      .map((category) => {
        const subjectBuckets: StudySubjectBucket[] = (category.subjects ?? [])
          .map((subject) => {
            // Tests with study material
            const allTests = [
              ...(subject.tests || []),
              ...(subject.chapters?.flatMap((c) => c.tests) || [])
            ];
            const testEntries: StudyTestEntry[] = allTests
              .filter(hasStudyMaterial)
              .map((test) => ({
                id: test.id,
                name: test.name,
                entryCount: test.studyMaterial?.sections.length || 0,
                lastUpdated: test.studyMaterial?.lastUpdated || 0,
                subjectId: subject.id,
              }));

            // Chapters with notes
            const chapterEntries: StudyTestEntry[] = (subject.chapters || [])
              .filter(ch => (ch.notes?.sections?.length ?? 0) > 0 || (ch.notes?.cheatSheets?.length ?? 0) > 0)
              .map(ch => ({
                id: `__chapterNotes__${ch.id}`,
                name: `📝 ${ch.name}`,
                entryCount: ch.notes?.sections?.length || 0,
                lastUpdated: ch.notes?.lastUpdated || 0,
                subjectId: subject.id,
              }));

            const tests = [...chapterEntries, ...testEntries];
            if (!tests.length) return null;
            return { id: subject.id, name: subject.name, tests };
          })
          .filter((b): b is StudySubjectBucket => b !== null);

        const rootTests: StudyTestEntry[] =
          category.tests?.filter(hasStudyMaterial).map((test) => ({
            id: test.id,
            name: test.name,
            entryCount: test.studyMaterial?.sections.length || 0,
            lastUpdated: test.studyMaterial?.lastUpdated || 0,
          })) || [];

        const totalItems = subjectBuckets.reduce((s, b) => s + b.tests.length, 0) + rootTests.length;
        if (totalItems === 0) return null;
        return { id: category.id, name: category.name, subjectBuckets, rootTests, totalItems };
      })
      .filter((g): g is StudyCategoryGroup => Boolean(g));
  }, [categories]);

  // Derive levels from URL — no internal state, React Router manages history
  const selectedCategory = useMemo(
    () => (catId ? studyCategories.find(c => c.id === catId) ?? null : null),
    [catId, studyCategories]
  );
  const selectedSubject = useMemo(() => {
    if (!selectedCategory || !subId) return null;
    if (subId === '__root__') {
      return selectedCategory.rootTests.length > 0
        ? { id: '__root__', name: 'General Tests', tests: selectedCategory.rootTests }
        : null;
    }
    return selectedCategory.subjectBuckets.find(s => s.id === subId) ?? null;
  }, [selectedCategory, subId]);

  // Navigation helpers
  const goToCategory = (id: string) => setSearchParams({ cat: id });
  const goToSubject = (catId: string, subId: string) => setSearchParams({ cat: catId, sub: subId });
  const goUp = () => {
    if (subId) { setSearchParams(catId ? { cat: catId } : {}); return; }
    if (catId) { setSearchParams({}); return; }
    onBack();
  };

  // Clears any active text selection before a button/link click so the
  // click event is never suppressed by the browser's selection state.
  const clearSelectionOnInteractive = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"]') && window.getSelection()?.toString()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  // ── LEVEL 3: Tests in a subject ──────────────────────────────────────
  if (selectedCategory && selectedSubject) {
    return (
      <div className={`min-h-screen ${bg}`} onMouseDown={clearSelectionOnInteractive}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={goUp} className={backBtn}><ArrowLeft size={15} /> Back</button>
            <nav className="flex items-center gap-1 text-sm flex-wrap">
              <button onClick={() => setSearchParams({})} className={`hover:underline ${muted}`}>Study Mode</button>
              <ChevronRight size={14} className={muted} />
              <button onClick={() => setSearchParams({ cat: selectedCategory.id })} className={`hover:underline ${muted}`}>{selectedCategory.name}</button>
              <ChevronRight size={14} className={muted} />
              <span className={`font-medium ${text}`}>{selectedSubject.name}</span>
            </nav>
          </div>

          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-1 ${text}`}>{selectedSubject.name}</h1>
            <p className={`text-sm ${muted}`}>{selectedSubject.tests.length} module{selectedSubject.tests.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="flex flex-col gap-2">
            {selectedSubject.tests.map((item) => (
              <button
                key={item.id}
                onClick={() => onStudySelect(selectedCategory.id, item.subjectId, item.id)}
                className={`group text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 ${
                  isDark ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FileText size={16} className={`shrink-0 ${muted}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${text}`}>{item.name}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>
                    {item.entryCount} note{item.entryCount !== 1 ? 's' : ''}
                    {item.lastUpdated ? ` · ${new Date(item.lastUpdated).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-lg border shrink-0 transition-colors ${
                  isDark ? 'border-slate-600 text-slate-300 group-hover:bg-slate-700' : 'border-gray-200 text-gray-600 group-hover:bg-gray-100'
                }`}>
                  Open →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LEVEL 2: Subjects in a category ──────────────────────────────────
  if (selectedCategory) {
    const allBuckets: StudySubjectBucket[] = [
      ...selectedCategory.subjectBuckets,
      ...(selectedCategory.rootTests.length > 0
        ? [{ id: '__root__', name: 'General Tests', tests: selectedCategory.rootTests }]
        : [])
    ];

    return (
      <div className={`min-h-screen ${bg}`} onMouseDown={clearSelectionOnInteractive}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={goUp} className={backBtn}><ArrowLeft size={15} /> Back</button>
            <nav className="flex items-center gap-1 text-sm">
              <button onClick={() => setSearchParams({})} className={`hover:underline ${muted}`}>Study Mode</button>
              <ChevronRight size={14} className={muted} />
              <span className={`font-medium ${text}`}>{selectedCategory.name}</span>
            </nav>
          </div>

          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-1 ${text}`}>{selectedCategory.name}</h1>
            <p className={`text-sm ${muted}`}>Select a subject to browse study modules</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allBuckets.map((subject) => (
              <button
                key={subject.id}
                onClick={() => goToSubject(selectedCategory.id, subject.id)}
                className={`group text-left flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${isDark ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${text}`}>{subject.name}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>{subject.tests.length} module{subject.tests.length !== 1 ? 's' : ''}</p>
                </div>
                <ChevronRight size={16} className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${muted}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LEVEL 1: Exam categories ──────────────────────────────────────────
  return (
    <div className={`min-h-screen py-8 px-4 ${bg}`} onMouseDown={clearSelectionOnInteractive}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-1 ${text}`}>Study Mode Library</h1>
          <p className={`text-sm ${muted}`}>Curated notes and study sheets, organised by exam.</p>
        </div>

        {studyCategories.length === 0 ? (
          <div className={`rounded-2xl border-2 border-dashed p-10 text-center ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <BookOpen size={40} className={`mx-auto mb-4 ${muted}`} />
            <h2 className={`text-lg font-semibold mb-2 ${text}`}>No study material yet</h2>
            <p className={muted}>Enable Study Mode for any test via the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => goToCategory(category.id)}
                className={`group text-left p-5 rounded-xl border transition-all duration-150 ${isDark ? 'bg-[#1E1E1D] border-slate-700/60 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xs font-medium uppercase tracking-wider ${muted}`}>{category.totalItems} module{category.totalItems !== 1 ? 's' : ''}</p>
                  <ChevronRight size={15} className={`transition-transform group-hover:translate-x-0.5 ${muted}`} />
                </div>
                <h2 className={`text-lg font-semibold mb-0.5 ${text}`}>{category.name}</h2>
                <p className={`text-xs ${muted}`}>
                  {category.subjectBuckets.length} subject{category.subjectBuckets.length !== 1 ? 's' : ''}
                  {category.rootTests.length > 0 && ` · ${category.rootTests.length} general`}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
