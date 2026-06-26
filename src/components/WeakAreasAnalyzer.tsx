import { useMemo, useState } from 'react';
import {
  ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2,
  Target, BarChart3, RefreshCcw, Trophy, Zap, BookOpen, ChevronDown, ChevronUp
} from 'lucide-react';
import type { ExamCategory, TestResult, Question } from '../types';

interface WeakAreasAnalyzerProps {
  categories: ExamCategory[];
  results: TestResult[];
  isDark: boolean;
  onBack: () => void;
  onRetryTest: (categoryId: string, subjectId: string | undefined, testId: string) => void;
  onRetryWrongQuestions: (wrongQuestions: Question[], testName: string) => void;
}

interface AreaStat {
  key: string;
  categoryId: string;
  categoryName: string;
  subjectId?: string;
  subjectName?: string;
  testId: string;
  testName: string;
  attempts: number;
  correct: number;
  total: number;
  accuracy: number;
  lastAttemptTs: number;
}

interface GroupedStat {
  groupKey: string;
  groupLabel: string;
  categoryId: string;
  subjectId?: string;
  subjectName?: string;
  accuracy: number;
  attempts: number;
  correct: number;
  total: number;
  tests: AreaStat[];
}

function getAccuracyColor(acc: number, isDark: boolean): string {
  if (acc < 40) return isDark ? 'text-red-400' : 'text-red-600';
  if (acc < 60) return isDark ? 'text-orange-400' : 'text-orange-600';
  if (acc < 75) return isDark ? 'text-yellow-400' : 'text-yellow-600';
  return isDark ? 'text-emerald-400' : 'text-emerald-600';
}

function getBarColor(acc: number): string {
  if (acc < 40) return 'bg-red-500';
  if (acc < 60) return 'bg-orange-500';
  if (acc < 75) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function getBadge(acc: number, isDark: boolean): { label: string; cls: string } {
  if (acc < 40) return {
    label: '⚠ Weak',
    cls: isDark ? 'bg-red-900/40 text-red-300 border-red-700/60' : 'bg-red-100 text-red-700 border-red-200'
  };
  if (acc < 60) return {
    label: '↗ Improving',
    cls: isDark ? 'bg-orange-900/40 text-orange-300 border-orange-700/60' : 'bg-orange-100 text-orange-700 border-orange-200'
  };
  if (acc < 75) return {
    label: '~ Average',
    cls: isDark ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700/60' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };
  return {
    label: '✓ Strong',
    cls: isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };
}

function AccuracyBar({ value, isDark }: { value: number; isDark: boolean }) {
  return (
    <div className={`relative h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${getBarColor(value)}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
      {/* Threshold markers */}
      <div className="absolute top-0 left-[40%] h-full w-px bg-white/40" />
      <div className="absolute top-0 left-[60%] h-full w-px bg-white/40" />
      <div className="absolute top-0 left-[75%] h-full w-px bg-white/40" />
    </div>
  );
}

export function WeakAreasAnalyzer({
  categories,
  results,
  isDark,
  onBack,
  onRetryTest,
  onRetryWrongQuestions,
}: WeakAreasAnalyzerProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'accuracy' | 'attempts' | 'name'>('accuracy');
  const [filterMin, setFilterMin] = useState<number>(0);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Build a lookup: testId -> { categoryId, categoryName, subjectId, subjectName, testName }
  const testMeta = useMemo(() => {
    const map = new Map<string, { categoryId: string; categoryName: string; subjectId?: string; subjectName?: string; testName: string }>();
    categories.forEach(cat => {
      cat.tests?.forEach(t => map.set(t.id, { categoryId: cat.id, categoryName: cat.name, testName: t.name }));
      cat.subjects?.forEach(sub => {
        sub.tests.forEach(t => map.set(t.id, { categoryId: cat.id, categoryName: cat.name, subjectId: sub.id, subjectName: sub.name, testName: t.name }));
        sub.chapters?.forEach(ch => {
          ch.tests.forEach(t => map.set(t.id, { categoryId: cat.id, categoryName: cat.name, subjectId: sub.id, subjectName: sub.name, testName: t.name }));
        });
      });
    });
    return map;
  }, [categories]);

  // Build wrong-question list for a given test (from last attempt)
  const getWrongQuestions = (testId: string, categoryId: string): Question[] => {
    // Find the test object
    let testQuestions: Question[] = [];
    for (const cat of categories) {
      if (cat.id !== categoryId) continue;
      const direct = cat.tests?.find(t => t.id === testId);
      if (direct) { testQuestions = direct.questions; break; }
      for (const sub of cat.subjects ?? []) {
        const inSub = sub.tests.find(t => t.id === testId);
        if (inSub) { testQuestions = inSub.questions; break; }
        for (const ch of sub.chapters ?? []) {
          const inCh = ch.tests.find(t => t.id === testId);
          if (inCh) { testQuestions = inCh.questions; break; }
        }
        if (testQuestions.length) break;
      }
      if (testQuestions.length) break;
    }
    if (!testQuestions.length) return [];
    // Get the last attempt for this test
    const lastResult = [...results]
      .filter(r => r.testId === testId && r.categoryId === categoryId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (!lastResult) return [];
    return testQuestions.filter(
      (q, idx) => lastResult.answers[idx] !== null && lastResult.answers[idx] !== q.correctAnswer
    );
  };

  // Aggregate per-test stats
  const areaStats = useMemo((): AreaStat[] => {
    const map = new Map<string, { correct: number; total: number; attempts: number; lastTs: number }>();
    results.forEach(r => {
      if (r.categoryId === 'bookmarked') return;
      const key = `${r.categoryId}::${r.testId}`;
      const existing = map.get(key) || { correct: 0, total: 0, attempts: 0, lastTs: 0 };
      map.set(key, {
        correct: existing.correct + r.score,
        total: existing.total + r.total,
        attempts: existing.attempts + 1,
        lastTs: Math.max(existing.lastTs, r.timestamp),
      });
    });

    const stats: AreaStat[] = [];
    map.forEach((v, key) => {
      const [categoryId, testId] = key.split('::');
      const meta = testMeta.get(testId);
      if (!meta || v.total === 0) return;
      stats.push({
        key,
        categoryId,
        categoryName: meta.categoryName,
        subjectId: meta.subjectId,
        subjectName: meta.subjectName,
        testId,
        testName: meta.testName,
        attempts: v.attempts,
        correct: v.correct,
        total: v.total,
        accuracy: (v.correct / v.total) * 100,
        lastAttemptTs: v.lastTs,
      });
    });

    return stats;
  }, [results, testMeta]);

  // Group by subject (or category if no subject)
  const grouped = useMemo((): GroupedStat[] => {
    const map = new Map<string, { label: string; categoryId: string; subjectId?: string; subjectName?: string; tests: AreaStat[] }>();

    areaStats.forEach(stat => {
      const groupKey = stat.subjectId
        ? `${stat.categoryId}::${stat.subjectId}`
        : `${stat.categoryId}::root`;
      const label = stat.subjectId
        ? `${stat.categoryName} › ${stat.subjectName}`
        : stat.categoryName;
      if (!map.has(groupKey)) {
        map.set(groupKey, { label, categoryId: stat.categoryId, subjectId: stat.subjectId, subjectName: stat.subjectName, tests: [] });
      }
      map.get(groupKey)!.tests.push(stat);
    });

    const groups: GroupedStat[] = [];
    map.forEach((v, groupKey) => {
      const totalCorrect = v.tests.reduce((s, t) => s + t.correct, 0);
      const totalQ = v.tests.reduce((s, t) => s + t.total, 0);
      const totalAttempts = v.tests.reduce((s, t) => s + t.attempts, 0);
      groups.push({
        groupKey,
        groupLabel: v.label,
        categoryId: v.categoryId,
        subjectId: v.subjectId,
        subjectName: v.subjectName,
        accuracy: totalQ > 0 ? (totalCorrect / totalQ) * 100 : 0,
        attempts: totalAttempts,
        correct: totalCorrect,
        total: totalQ,
        tests: v.tests.sort((a, b) => a.accuracy - b.accuracy),
      });
    });

    // Sort
    return groups
      .filter(g => g.accuracy >= filterMin)
      .sort((a, b) => {
        if (sortBy === 'accuracy') return a.accuracy - b.accuracy;
        if (sortBy === 'attempts') return b.attempts - a.attempts;
        return a.groupLabel.localeCompare(b.groupLabel);
      });
  }, [areaStats, sortBy, filterMin]);

  const weakAreas = useMemo(() => grouped.filter(g => g.accuracy < 60), [grouped]);
  const strongAreas = useMemo(() => grouped.filter(g => g.accuracy >= 75), [grouped]);
  const overallAccuracy = useMemo(() => {
    const tot = areaStats.reduce((s, a) => s + a.total, 0);
    const cor = areaStats.reduce((s, a) => s + a.correct, 0);
    return tot > 0 ? (cor / tot) * 100 : 0;
  }, [areaStats]);

  const card = `rounded-2xl p-6 border ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`;
  const text = isDark ? 'text-slate-100' : 'text-gray-900';
  const subtext = isDark ? 'text-slate-400' : 'text-gray-500';

  if (results.length === 0) {
    return (
      <div className={`min-h-screen py-10 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'}`}>
        <div className="max-w-4xl mx-auto">
          
          <div className={`${card} text-center py-20`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <BarChart3 size={36} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${text}`}>No Test History Yet</h2>
            <p className={`${subtext} max-w-sm mx-auto`}>Take some tests first. This dashboard will automatically analyse your performance across all subjects and tests.</p>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start gap-3 mb-8">
          
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl sm:text-3xl font-bold ${text}`}>Weak Areas Analyzer</h1>
            <p className={`text-sm mt-0.5 ${subtext}`}>Aggregated across {results.length} test attempt{results.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Summary KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: 'Overall Accuracy', value: `${overallAccuracy.toFixed(1)}%`,
              icon: <Target size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600',
              bg: isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100',
            },
            {
              label: 'Topics Analysed', value: grouped.length,
              icon: <BarChart3 size={20} />, color: isDark ? 'text-purple-400' : 'text-purple-600',
              bg: isDark ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-100',
            },
            {
              label: 'Weak Areas', value: weakAreas.length,
              icon: <AlertTriangle size={20} />, color: isDark ? 'text-red-400' : 'text-red-600',
              bg: isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100',
            },
            {
              label: 'Strong Areas', value: strongAreas.length,
              icon: <Trophy size={20} />, color: isDark ? 'text-emerald-400' : 'text-emerald-600',
              bg: isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-100',
            },
          ].map(k => (
            <div key={k.label} className={`rounded-2xl p-5 border ${k.bg}`}>
              <div className={`mb-2 ${k.color}`}>{k.icon}</div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
              <div className={`text-xs mt-1 ${subtext}`}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Weak Areas Spotlight */}
        {weakAreas.length > 0 && (
          <div className={`${card} mb-6 border-red-500/30`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <AlertTriangle size={20} className={isDark ? 'text-red-400' : 'text-red-600'} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${text}`}>⚠ Focus Areas — Needs Improvement</h2>
                <p className={`text-xs ${subtext}`}>Below 60% accuracy — prioritise these first</p>
              </div>
            </div>
            <div className="space-y-3">
              {weakAreas.map(g => (
                <div key={g.groupKey} className={`rounded-xl p-4 border ${isDark ? 'bg-red-900/10 border-red-800/40' : 'bg-red-50/60 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <span className={`font-semibold text-sm ${text}`}>{g.groupLabel}</span>
                      <span className={`ml-2 text-xs ${subtext}`}>{g.attempts} attempt{g.attempts !== 1 ? 's' : ''} · {g.correct}/{g.total} correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${getAccuracyColor(g.accuracy, isDark)}`}>{g.accuracy.toFixed(1)}%</span>
                      <TrendingDown size={16} className={isDark ? 'text-red-400' : 'text-red-500'} />
                    </div>
                  </div>
                  <AccuracyBar value={g.accuracy} isDark={isDark} />
                  {/* Retry buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.tests.slice(0, 2).map(t => {
                      const wrongQs = getWrongQuestions(t.testId, t.categoryId);
                      return (
                        <div key={t.key} className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onRetryTest(t.categoryId, t.subjectId, t.testId)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? 'bg-red-900/30 border-red-700 text-red-300 hover:bg-red-800/40' : 'bg-white border-red-300 text-red-700 hover:bg-red-50'}`}
                          >
                            <RefreshCcw size={12} />
                            Retry: {t.testName} ({t.accuracy.toFixed(0)}%)
                          </button>
                          {wrongQs.length > 0 && (
                            <button
                              onClick={() => onRetryWrongQuestions(wrongQs, t.testName)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? 'bg-orange-900/30 border-orange-700 text-orange-300 hover:bg-orange-800/40' : 'bg-white border-orange-300 text-orange-700 hover:bg-orange-50'}`}
                            >
                              <RefreshCcw size={12} />
                              Wrong Only ({wrongQs.length}q)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className={`flex flex-wrap items-center gap-3 mb-5`}>
          <span className={`text-sm font-semibold ${subtext}`}>Sort by:</span>
          {(['accuracy', 'attempts', 'name'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${sortBy === s
                ? isDark ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-600 border-blue-600 text-white'
                : isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'accuracy' ? '↑ Accuracy' : s === 'attempts' ? '↓ Most Attempted' : 'A–Z'}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs ${subtext}`}>Min accuracy:</span>
            <select
              value={filterMin}
              onChange={e => setFilterMin(Number(e.target.value))}
              className={`text-xs rounded-lg px-2 py-1.5 border ${isDark ? 'bg-[#1E1E1D] border-slate-600 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              {[0, 25, 50, 75].map(v => <option key={v} value={v}>{v}%+</option>)}
            </select>
          </div>
        </div>

        {/* All Areas — grouped accordion */}
        <div className={`${card} mb-6`}>
          <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${text}`}>
            <BarChart3 size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            All Subject / Topic Breakdown
          </h2>

          {grouped.length === 0 ? (
            <p className={`text-sm ${subtext}`}>No data matching current filters.</p>
          ) : (
            <div className="space-y-3">
              {grouped.map(g => {
                const badge = getBadge(g.accuracy, isDark);
                const isOpen = expandedGroups.has(g.groupKey);
                return (
                  <div key={g.groupKey} className={`rounded-xl border overflow-hidden transition-all ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(g.groupKey)}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`font-semibold text-sm truncate ${text}`}>{g.groupLabel}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>{badge.label}</span>
                        </div>
                        <AccuracyBar value={g.accuracy} isDark={isDark} />
                        <div className={`flex gap-4 mt-2 text-xs ${subtext}`}>
                          <span>{g.attempts} attempt{g.attempts !== 1 ? 's' : ''}</span>
                          <span>{g.correct}/{g.total} correct</span>
                          <span>{g.tests.length} test{g.tests.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4 flex-shrink-0">
                        <span className={`text-xl font-bold ${getAccuracyColor(g.accuracy, isDark)}`}>{g.accuracy.toFixed(1)}%</span>
                        {g.accuracy < 60
                          ? <TrendingDown size={14} className={isDark ? 'text-red-400' : 'text-red-500'} />
                          : g.accuracy >= 75
                          ? <TrendingUp size={14} className={isDark ? 'text-emerald-400' : 'text-emerald-500'} />
                          : null
                        }
                        {isOpen ? <ChevronUp size={14} className={subtext} /> : <ChevronDown size={14} className={subtext} />}
                      </div>
                    </button>

                    {/* Expanded tests */}
                    {isOpen && (
                      <div className={`border-t px-4 pb-4 pt-3 space-y-3 ${isDark ? 'border-slate-700 bg-slate-900/20' : 'border-gray-100 bg-gray-50/60'}`}>
                        {g.tests.map(t => {
                          const tb = getBadge(t.accuracy, isDark);
                          return (
                            <div key={t.key} className={`rounded-lg p-3 border flex flex-col gap-2 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white border-gray-200'}`}>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <span className={`text-sm font-medium ${text}`}>{t.testName}</span>
                                  <span className={`ml-2 text-xs ${subtext}`}>{t.attempts} attempt{t.attempts !== 1 ? 's' : ''} · {t.correct}/{t.total}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${tb.cls}`}>{tb.label}</span>
                                  <span className={`text-sm font-bold ${getAccuracyColor(t.accuracy, isDark)}`}>{t.accuracy.toFixed(1)}%</span>
                                </div>
                              </div>
                              <AccuracyBar value={t.accuracy} isDark={isDark} />
                              <div className="flex justify-end gap-2 flex-wrap">
                                <button
                                  onClick={() => onRetryTest(t.categoryId, t.subjectId, t.testId)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? 'bg-blue-900/30 border-blue-700 text-blue-300 hover:bg-blue-800/40' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                                >
                                  <RefreshCcw size={12} /> Retry Test
                                </button>
                                {(() => {
                                  const wrongQs = getWrongQuestions(t.testId, t.categoryId);
                                  return wrongQs.length > 0 ? (
                                    <button
                                      onClick={() => onRetryWrongQuestions(wrongQs, t.testName)}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${isDark ? 'bg-orange-900/30 border-orange-700 text-orange-300 hover:bg-orange-800/40' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`}
                                    >
                                      <RefreshCcw size={12} /> Wrong Only ({wrongQs.length}q)
                                    </button>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Strong areas */}
        {strongAreas.length > 0 && (
          <div className={`${card} border-emerald-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                <Trophy size={20} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${text}`}>✓ Strong Areas — Keep it up!</h2>
                <p className={`text-xs ${subtext}`}>75%+ accuracy — you're doing great here</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strongAreas.map(g => (
                <div key={g.groupKey} className={`rounded-xl p-4 border ${isDark ? 'bg-emerald-900/10 border-emerald-800/40' : 'bg-emerald-50/60 border-emerald-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-sm ${text}`}>{g.groupLabel}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-bold ${getAccuracyColor(g.accuracy, isDark)}`}>{g.accuracy.toFixed(1)}%</span>
                      <TrendingUp size={14} className={isDark ? 'text-emerald-400' : 'text-emerald-500'} />
                    </div>
                  </div>
                  <AccuracyBar value={g.accuracy} isDark={isDark} />
                  <p className={`text-xs mt-2 ${subtext}`}>{g.attempts} attempt{g.attempts !== 1 ? 's' : ''} · {g.correct}/{g.total} correct</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className={`mt-6 rounded-xl p-4 border flex flex-wrap gap-4 text-xs ${isDark ? 'border-slate-700 bg-[#1E1E1D]' : 'border-gray-200 bg-white'}`}>
          <span className={`font-semibold ${subtext}`}>Legend:</span>
          {[
            { color: 'bg-red-500', label: '< 40% — Weak' },
            { color: 'bg-orange-500', label: '40–60% — Needs work' },
            { color: 'bg-yellow-500', label: '60–75% — Average' },
            { color: 'bg-emerald-500', label: '75%+ — Strong' },
          ].map(l => (
            <span key={l.label} className={`flex items-center gap-1.5 ${subtext}`}>
              <span className={`w-3 h-3 rounded-sm inline-block ${l.color}`} />
              {l.label}
            </span>
          ))}
          <span className={`flex items-center gap-1 ${subtext}`}>
            <Zap size={12} className="text-blue-400" /> Threshold markers at 40 / 60 / 75%
          </span>
          <span className={`flex items-center gap-1 ml-auto ${subtext}`}>
            <BookOpen size={12} /> Click any row to expand individual tests
          </span>
        </div>
      </div>
    </div>
  );
}
