import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type { Question } from '../types';
import { RichTextEditor } from './RichTextEditor';

interface VisualQuestionEditorProps {
  isDark: boolean;
  initialQuestions?: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

interface QuestionDraft {
  id: string;
  question: string; // HTML content
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string; // HTML content
  collapsed: boolean;
}

const createEmptyDraft = (): QuestionDraft => ({
  id: `q${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  collapsed: false,
});

export function VisualQuestionEditor({ isDark, initialQuestions, onQuestionsChange }: VisualQuestionEditorProps) {
  const [drafts, setDrafts] = useState<QuestionDraft[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: [q.options[0] || '', q.options[1] || '', q.options[2] || '', q.options[3] || ''] as [string, string, string, string],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        collapsed: true,
      }));
    }
    return [createEmptyDraft()];
  });

  const updateDraft = (index: number, field: keyof QuestionDraft, value: any) => {
    const newDrafts = [...drafts];
    (newDrafts[index] as any)[field] = value;
    setDrafts(newDrafts);
    emitQuestions(newDrafts);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newDrafts = [...drafts];
    newDrafts[qIndex].options[optIndex] = value;
    setDrafts(newDrafts);
    emitQuestions(newDrafts);
  };

  const addQuestion = () => {
    // Collapse all existing, add new expanded
    const updated = drafts.map(d => ({ ...d, collapsed: true }));
    const newDraft = createEmptyDraft();
    setDrafts([...updated, newDraft]);
  };

  const removeQuestion = (index: number) => {
    if (drafts.length <= 1) return;
    const newDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(newDrafts);
    emitQuestions(newDrafts);
  };

  const toggleCollapse = (index: number) => {
    const newDrafts = [...drafts];
    newDrafts[index].collapsed = !newDrafts[index].collapsed;
    setDrafts(newDrafts);
  };

  const emitQuestions = (currentDrafts: QuestionDraft[]) => {
    const questions: Question[] = currentDrafts
      .filter(d => d.question.trim() || d.options.some(o => o.trim()))
      .map(d => ({
        id: d.id,
        question: d.question,
        options: [...d.options],
        correctAnswer: d.correctAnswer,
        ...(d.explanation.trim() && d.explanation !== '<p><br></p>' ? { explanation: d.explanation } : {}),
      }));
    onQuestionsChange(questions);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {drafts.length} question{drafts.length !== 1 ? 's' : ''}
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {/* Question Cards */}
      {drafts.map((draft, qIndex) => (
        <div
          key={draft.id}
          className={`rounded-xl border-2 overflow-hidden transition-all ${
            isDark
              ? 'bg-[#1e1f24] border-slate-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Card Header - Always visible */}
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none ${
              isDark ? 'bg-[#1E1E1D] hover:bg-[#2a2b30]' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => toggleCollapse(qIndex)}
          >
            <div className="flex items-center gap-3">
              <GripVertical size={16} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                {qIndex + 1}
              </div>
              <span className={`text-sm truncate max-w-[300px] ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {draft.question
                  ? draft.question.replace(/<[^>]*>/g, '').slice(0, 60) + (draft.question.length > 60 ? '...' : '')
                  : 'New Question'}
              </span>
              {draft.options.filter(o => o.trim()).length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  {draft.options.filter(o => o.trim()).length}/4 options
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {drafts.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeQuestion(qIndex); }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              )}
              {draft.collapsed ? (
                <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
              ) : (
                <ChevronUp size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
              )}
            </div>
          </div>

          {/* Card Body - Collapsible */}
          {!draft.collapsed && (
            <div className="p-4 space-y-5">
              {/* Question Text - Rich Editor */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Question Text
                </label>
                <RichTextEditor
                  value={draft.question}
                  onChange={(val) => updateDraft(qIndex, 'question', val)}
                  placeholder="Enter your question here... You can paste images, format text, add math symbols etc."
                  isDark={isDark}
                />
              </div>

              {/* Options */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Answer Options
                </label>
                <div className="space-y-3">
                  {draft.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-3">
                      {/* Correct answer radio */}
                      <button
                        type="button"
                        onClick={() => updateDraft(qIndex, 'correctAnswer', optIdx)}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                          draft.correctAnswer === optIdx
                            ? 'border-green-500 bg-green-500 text-white shadow-md shadow-green-500/20'
                            : isDark
                            ? 'border-slate-600 text-slate-400 hover:border-green-500/50'
                            : 'border-gray-300 text-gray-500 hover:border-green-500/50'
                        }`}
                        title={draft.correctAnswer === optIdx ? `${optionLabels[optIdx]} is correct` : `Mark ${optionLabels[optIdx]} as correct`}
                      >
                        {optionLabels[optIdx]}
                      </button>
                      {/* Option input */}
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(qIndex, optIdx, e.target.value)}
                        placeholder={`Option ${optionLabels[optIdx]}`}
                        className={`flex-1 px-4 py-2.5 rounded-lg border-2 text-sm transition-colors ${
                          draft.correctAnswer === optIdx
                            ? isDark
                              ? 'border-green-700 bg-green-900/20 text-green-300 focus:border-green-500'
                              : 'border-green-300 bg-green-50 text-green-800 focus:border-green-500'
                            : isDark
                            ? 'border-slate-600 bg-[#1E1E1D] text-slate-200 focus:border-blue-500'
                            : 'border-gray-200 bg-white text-gray-800 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                  Click the circle to mark the correct answer (green = correct). Unicode math symbols like √, π, ², ³, ÷ work directly.
                </p>
              </div>

              {/* Explanation - Rich Editor (collapsible) */}
              <details className="group">
                <summary className={`cursor-pointer text-sm font-semibold mb-2 select-none ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <span className="group-open:hidden">▶ Add Explanation (optional)</span>
                  <span className="hidden group-open:inline">▼ Explanation</span>
                </summary>
                <div className="mt-2">
                  <RichTextEditor
                    value={draft.explanation}
                    onChange={(val) => updateDraft(qIndex, 'explanation', val)}
                    placeholder="Explain the answer... You can paste images and format text."
                    isDark={isDark}
                  />
                </div>
              </details>
            </div>
          )}
        </div>
      ))}

      {/* Add More Button at Bottom */}
      <button
        type="button"
        onClick={addQuestion}
        className={`w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${
          isDark
            ? 'border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-900/10'
            : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <Plus size={16} className="inline mr-1" />
        Add Another Question
      </button>
    </div>
  );
}
