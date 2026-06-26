import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, HelpCircle, Lock, BookOpen, Clock, Eye, EyeOff, FolderPlus, Type, Wand2, ChevronDown, ChevronUp, Table2 } from 'lucide-react';
import type { ExamCategory, Question, Test, Chapter, CheatSheet, StudyMaterial } from '../types';
import { examCategories as defaultCategories } from '../data/mockData';
import { upsertStudyMaterial } from '../utils/studyMaterial';
import { ModalAlert } from './ModalAlert';
import { RichTextEditor } from './RichTextEditor';
import { VisualQuestionEditor } from './VisualQuestionEditor';
import { CheatSheetEditor } from './CheatSheetEditor';

type ModalType = 'info' | 'success' | 'warning' | 'confirm' | 'error';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
}

const TEST_KEY_SEPARATOR = '::';

const buildTestKey = (categoryId: string, subjectId: string | undefined, testId: string) =>
  `${categoryId}${TEST_KEY_SEPARATOR}${subjectId ?? 'root'}${TEST_KEY_SEPARATOR}${testId}`;

const defaultTestKeys = new Set<string>();

defaultCategories.forEach((category) => {
  if (category.subjects && category.subjects.length > 0) {
    category.subjects.forEach((subject) => {
      // Direct tests in subject
      subject.tests.forEach((test) => {
        defaultTestKeys.add(buildTestKey(category.id, subject.id, test.id));
      });
      // Tests in chapters
      subject.chapters?.forEach((chapter) => {
        chapter.tests.forEach((test) => {
          defaultTestKeys.add(buildTestKey(category.id, subject.id, test.id));
        });
      });
    });
  } else {
    category.tests?.forEach((test) => {
      defaultTestKeys.add(buildTestKey(category.id, undefined, test.id));
    });
  }
});

const questionsToEditorText = (questions: Question[]) => {
  return questions.map(q => {
    return `${q.question} | ${q.options[0]} | ${q.options[1]} | ${q.options[2]} | ${q.options[3]}`;
  }).join('\n');
};

const answersToEditorText = (questions: Question[]) => {
  return questions.map(q => {
    const answerKey = ['A', 'B', 'C', 'D'][q.correctAnswer];
    if (q.explanation) {
      return `${answerKey}|${q.explanation}`;
    }
    return answerKey;
  }).join('\n');
};

const isDefaultTest = (categoryId: string, subjectId: string | undefined, testId: string) =>
  defaultTestKeys.has(buildTestKey(categoryId, subjectId, testId));

// ── Help Panel (tabbed: Questions + Cheat Sheet AI prompt) ───────────────────
function HelpPanel({ isDark }: { isDark: boolean }) {
  const [tab, setTab] = useState<'questions' | 'cheatsheet'>('questions');
  const [copied, setCopied] = useState(false);

  const codeClass = `block p-3 rounded text-xs font-mono border leading-relaxed whitespace-pre-wrap ${isDark ? 'bg-[#0c0f16] border-slate-700 text-slate-200' : 'bg-white border-blue-200 text-gray-800'
    }`;

  const AI_PROMPT = `Mujhe ek cheat sheet chahiye [TOPIC] ke liye.
Output sirf markdown format mein do, koi extra explanation mat dena.

Format EXACTLY aisa hona chahiye:

# [emoji] TOPIC KA TITLE CAPS MEIN (One-Line Tagline)

**Base Concept:** [Ek line mein base concept explain karo]

### [emoji] 1. PEHLA SECTION NAME

| Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- |
| Row 1 data | data | data | data |
| Row 2 data | data | data | data |

### [emoji] 2. DOOSRA SECTION NAME

| Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- |
| Row data | data | data | data |

[Saare sections ke liye aisa karo...]

### [emoji] Extra Tips / Rules (optional)

1. **Rule 1 ka naam:** Rule ki explanation.
2. **Rule 2 ka naam:** Rule ki explanation.

---
Rules:
- Table headers har section ke liye same rakhna.
- Bold karna ho toh **text** use (double asterisk).
- Italic karna ho toh *text* use (single asterisk).
- Section headers ### se start honge.
- Numbered list items (1. 2. 3.) sirf extra rules/tips section mein use karo.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const panelBg = isDark ? 'bg-[#11131A]/90 border-slate-700' : 'bg-blue-50 border-blue-200';
  const tabActive = isDark ? 'bg-slate-700 text-white' : 'bg-white text-blue-700 shadow-sm';
  const tabInactive = isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-blue-600';

  return (
    <div className={`rounded-lg mb-6 border shadow-inner ${panelBg}`}>
      {/* Tab row */}
      <div className={`flex gap-1 p-3 pb-0 border-b ${isDark ? 'border-slate-700' : 'border-blue-200'}`}>
        <button
          type="button"
          onClick={() => setTab('questions')}
          className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${tab === 'questions' ? tabActive : tabInactive}`}
        >
          📝 Questions Guide
        </button>
        <button
          type="button"
          onClick={() => setTab('cheatsheet')}
          className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${tab === 'cheatsheet' ? tabActive : tabInactive}`}
        >
          📋 Cheat Sheet (AI Prompt)
        </button>
      </div>

      {/* Tab content */}
      <div className="p-5">
        {tab === 'questions' && (
          <>
            <h3 className="font-bold mb-3">How to Add Questions</h3>
            <ol className={`list-decimal list-inside space-y-2 mb-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              <li>Select a category and test from the dropdown</li>
              <li>
                In the Questions box, enter one question per line:
                <br />
                <code className={`inline-block mt-1 px-2 py-1 rounded text-xs border ${isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'}`}>
                  Question text | Option A | Option B | Option C | Option D
                </code>
              </li>
              <li>
                In the Answers box, enter the correct answer (A/B/C/D). Optional explanation:
                <code className={`inline-block mt-1 ml-2 px-1 rounded text-xs border ${isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'}`}>
                  A|because this is the reason...
                </code>
              </li>
              <li>Click <strong>Save Content</strong></li>
            </ol>
            <p className={`text-xs mb-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Example Questions:</p>
            <code className={`${codeClass} mb-3`}>
              {`What is the capital of France? | London | Paris | Berlin | Madrid\nWho wrote Romeo and Juliet? | Charles Dickens | William Shakespeare | Jane Austen | Mark Twain`}
            </code>
            <p className={`text-xs mb-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Example Answers:</p>
            <code className={codeClass}>
              {`B\nB|Because Paris is the capital city of France\nA|This is the correct answer because...`}
            </code>
          </>
        )}

        {tab === 'cheatsheet' && (
          <>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Neeche ka prompt <strong>copy karo</strong>, Gemini / ChatGPT mein paste karo, aur <code className={`px-1 rounded text-xs ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>[TOPIC]</code> replace karo apne topic se (e.g. <em>Tenses</em>, <em>Trigonometry Formulas</em>, <em>Indian History Dates</em>).
              <br />
              AI ka output directly <strong>⚡ Smart Import</strong> (Cheat Sheet Builder mein) paste kar do — ek click mein import ho jayega!
            </p>

            <div className="relative">
              <code className={`${codeClass} max-h-72 overflow-y-auto`}>{AI_PROMPT}</code>
              <button
                type="button"
                onClick={handleCopy}
                className={`absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${copied
                  ? 'bg-green-600 text-white'
                  : isDark ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                  }`}
              >
                {copied ? '✅ Copied!' : '📋 Copy Prompt'}
              </button>
            </div>

            <div className={`mt-4 rounded-lg p-3 text-xs space-y-1 ${isDark ? 'bg-slate-800/60 text-slate-400' : 'bg-white/80 text-gray-500 border border-blue-100'}`}>
              <p className="font-semibold mb-1">📌 Quick Tips:</p>
              <p>• <strong>[TOPIC]</strong> ki jagah apna topic likho — e.g. "Present Tense", "Quadratic Equations", "Mughal Empire"</p>
              <p>• Agar columns alag chahiye toh prompt mein likh do — e.g. "Columns: Term, Definition, Example"</p>
              <p>• AI ka output copy karo → Cheat Sheet Builder mein "<strong>⚡ Smart Import</strong>" click karo → paste karo → Done!</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface AdminPanelProps {
  categories: ExamCategory[];
  isDark: boolean;
  onSave: (categories: ExamCategory[]) => void;
  onBack: () => void;
  currentUser?: { uid: string } | null;
}

export function AdminPanel({ categories, isDark, onSave, onBack }: AdminPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [questionsText, setQuestionsText] = useState('');
  const [answersText, setAnswersText] = useState('');
  const [studyEnabled, setStudyEnabled] = useState(false);
  const [studyText, setStudyText] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [timeLimitInput, setTimeLimitInput] = useState('');
  const [showPreviousQuestions, setShowPreviousQuestions] = useState(false);
  const [editorMode, setEditorMode] = useState<'text' | 'visual'>('text');
  const [visualQuestions, setVisualQuestions] = useState<Question[]>([]);
  const [studyMaterialOpen, setStudyMaterialOpen] = useState(false);
  // Cheat sheet state
  const [cheatSheetEnabled, setCheatSheetEnabled] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);
  // Controls whether cheat sheets render ABOVE notes in the student view
  const [cheatSheetsFirst, setCheatSheetsFirst] = useState(false);


  // On mount: read URL params and restore selections (e.g. after redirect from study page or reload)
  useEffect(() => {
    const catParam = searchParams.get('category');
    const subParam = searchParams.get('subject');
    const chapParam = searchParams.get('chapter');
    const testParam = searchParams.get('test');
    if (catParam) {
      setSelectedCategory(catParam);
      if (subParam) {
        setSelectedSubject(subParam);
        if (chapParam) {
          setSelectedChapter(chapParam);
        }
      }
      if (testParam) {
        setSelectedTest(testParam);
      }
      // NOTE: do NOT clear params here — we want them to persist on reload
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with current selections so reload restores state
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubject)  params.subject  = selectedSubject;
    if (selectedChapter)  params.chapter  = selectedChapter;
    if (selectedTest)     params.test     = selectedTest;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedSubject, selectedChapter, selectedTest]);

  // Modal state for professional alerts
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Input modal state for creating new test
  const [inputModal, setInputModal] = useState<{
    isOpen: boolean;
    value: string;
    categoryId: string;
    subjectId?: string;
    chapterId?: string;
  }>({
    isOpen: false,
    value: '',
    categoryId: '',
    subjectId: undefined,
    chapterId: undefined
  });

  // Chapter modal state for creating new chapter
  const [chapterModal, setChapterModal] = useState<{
    isOpen: boolean;
    value: string;
    categoryId: string;
    subjectId: string;
  }>({
    isOpen: false,
    value: '',
    categoryId: '',
    subjectId: ''
  });

  const showModal = (title: string, message: string, type: ModalType = 'info', onConfirm?: () => void) => {
    setModal({ isOpen: true, title, message, type, onConfirm });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleSaveQuestions = () => {
    // If chapter mode (chapter selected, no test) → save as chapter notes
    if (selectedCategory && selectedChapterObj && !selectedTest && selectedChapter !== 'uncategorized') {
      const trimmedStudyText = studyText.trim();
      const shouldSaveStudy = studyEnabled && trimmedStudyText.length > 0;
      const validCheatSheets = cheatSheetEnabled
        ? cheatSheets.filter(cs => cs.title.trim() && cs.columns.length > 0)
        : [];
      if (!shouldSaveStudy && validCheatSheets.length === 0) {
        showModal('No Content', 'Please add some notes or cheat sheets before saving.', 'warning');
        return;
      }
      const notes: StudyMaterial = {
        sections: shouldSaveStudy ? (() => {
          const html = trimmedStudyText;
          if (!html || html.trim() === '<p><br></p>') return [];
          const secs: StudyMaterial['sections'] = [];
          const div = document.createElement('div');
          div.innerHTML = html;
          let cur = -1;
          Array.from(div.children).forEach(para => {
            const txt = para.textContent || '';
            if (txt.includes('::')) {
              const ci = txt.indexOf('::');
              const title = txt.substring(0, ci).trim();
              if (title) {
                const clone = para.cloneNode(true) as HTMLElement;
                const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
                let node: Node | null = walker.nextNode();
                let found = false;
                while (node && !found) {
                  const t = node.textContent || '';
                  const i = t.indexOf('::');
                  if (i !== -1) { node.textContent = t.substring(i + 2); found = true; }
                  else { node.textContent = ''; node = walker.nextNode(); }
                }
                secs.push({ id: `section-${secs.length}`, title, content: clone.innerHTML });
                cur++;
              }
            } else {
              if (cur === -1) { secs.push({ id: 'section-0', title: 'Notes', content: para.outerHTML }); cur = 0; }
              else secs[cur].content += para.outerHTML;
            }
          });
          return secs.length ? secs : [{ id: 'section-0', title: 'Notes', content: html }];
        })() : [],
        lastUpdated: Date.now(),
        ...(validCheatSheets.length > 0 ? { cheatSheets: validCheatSheets } : {}),
        cheatSheetsFirst,
      };
      const updatedCategories = categories.map(cat => {
        if (cat.id !== selectedCategory) return cat;
        return {
          ...cat,
          subjects: cat.subjects?.map(sub => {
            if (sub.id !== selectedSubject) return sub;
            return {
              ...sub,
              chapters: sub.chapters?.map(ch =>
                ch.id === selectedChapter ? { ...ch, notes } : ch
              )
            };
          })
        };
      });
      onSave(updatedCategories);
      showModal('Saved', 'Chapter notes saved successfully!', 'success');
      return;
    }

    if (!selectedCategory || !selectedTest) {
      showModal('Selection Required', 'Please select a category and test first.', 'warning');
      return;
    }

    // Get questions from either text mode or visual mode
    let questions: Question[] = [];
    let hasQuestionPayload = false;

    if (editorMode === 'visual') {
      // Visual mode — questions come from the visual editor
      questions = visualQuestions.filter(q => q.question.trim() && q.question !== '<p><br></p>');
      hasQuestionPayload = questions.length > 0;
    } else {
      // Text mode — parse from textarea
      const questionLines = questionsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);
      hasQuestionPayload = questionLines.length > 0;
      const answerLines = answersText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);

      if (hasQuestionPayload) {
        for (let i = 0; i < questionLines.length; i++) {
          const qLine = questionLines[i];
          const parts = qLine.split('|').map((p) => p.trim());

          if (parts.length < 5) {
            showModal('Format Error', `Question ${i + 1} is not formatted correctly. Each line should have: Question | Option A | Option B | Option C | Option D`, 'error');
            return;
          }

          const question = parts[0];
          const options = [parts[1], parts[2], parts[3], parts[4]];

          let correctAnswer = 0;
          let explanation: string | undefined = undefined;

          if (answerLines[i]) {
            const answerLine = answerLines[i];
            if (answerLine.includes('|')) {
              const answerParts = answerLine.split('|').map((p) => p.trim());
              const answerStr = answerParts[0].toUpperCase();
              explanation = answerParts.slice(1).join('|').trim();

              if (answerStr === 'A' || answerStr === '0') correctAnswer = 0;
              else if (answerStr === 'B' || answerStr === '1') correctAnswer = 1;
              else if (answerStr === 'C' || answerStr === '2') correctAnswer = 2;
              else if (answerStr === 'D' || answerStr === '3') correctAnswer = 3;
            } else {
              const answerStr = answerLine.toUpperCase();
              if (answerStr === 'A' || answerStr === '0') correctAnswer = 0;
              else if (answerStr === 'B' || answerStr === '1') correctAnswer = 1;
              else if (answerStr === 'C' || answerStr === '2') correctAnswer = 2;
              else if (answerStr === 'D' || answerStr === '3') correctAnswer = 3;
            }
          }

          // Preserve existing question ID if the question text matches (protects bookmarks)
          const existingId = selectedTestObj?.questions.find(q => q.question === question)?.id;

          questions.push({
            id: existingId ?? `q${Date.now()}_${i}`,
            question,
            options,
            correctAnswer,
            ...(explanation && { explanation })
          });
        }
      }
    }

    const trimmedStudyText = studyText.trim();
    const shouldSaveStudy = studyEnabled && trimmedStudyText.length > 0;

    // Validate cheat sheets: filter out empty ones
    const validCheatSheets = cheatSheetEnabled
      ? cheatSheets.filter(cs => cs.title.trim() && cs.columns.length > 0)
      : [];
    const shouldSaveCheatSheets = cheatSheetEnabled && validCheatSheets.length > 0;

    if (!hasQuestionPayload && !shouldSaveStudy && !shouldSaveCheatSheets) {
      showModal('No Content', 'Please add questions, study material, or cheat sheets before saving.', 'warning');
      return;
    }

    if (studyEnabled && !shouldSaveStudy) {
      showModal('Missing Content', 'Please add study material content or disable the Study Material toggle.', 'warning');
      return;
    }

    // Process time limit input
    let minutes: number | undefined;
    const trimmedTime = timeLimitInput.trim();
    if (trimmedTime.length > 0) {
      const parsed = Number(trimmedTime);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        showModal('Invalid Timer', 'Please enter a valid positive number of minutes (e.g., 45).', 'error');
        return;
      }
      minutes = Math.round(parsed);
    }

    // For rich text editor, parse HTML into sections based on :: OR headings
    const parseHtmlToSections = (html: string) => {
      if (!html || html.trim() === '<p><br></p>' || html.trim() === '') return [];

      const sections: { id: string; title: string; content: string }[] = [];
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Ensure we have paragraphs or block elements to iterate over
      if (tempDiv.childNodes.length > 0 && Array.from(tempDiv.childNodes).every(n => n.nodeType === Node.TEXT_NODE)) {
        tempDiv.innerHTML = `<p>${html}</p>`;
      }

      const paragraphs = Array.from(tempDiv.children);

      if (paragraphs.length === 0) {
        return [{
          id: 'section-0',
          title: 'Study Material',
          content: html
        }];
      }

      let currentSectionIndex = -1;

      paragraphs.forEach((para) => {
        const paraText = para.textContent || '';
        const fullContent = para.outerHTML;

        // Check if this paragraph is a section header (Title :: Content)
        if (paraText.includes('::')) {
          const colonIndex = paraText.indexOf('::');
          const title = paraText.substring(0, colonIndex).trim();

          if (title) {
            // New section
            currentSectionIndex++;
            let content = '';

            // We want to keep the content AFTER the ::, but also keep usage of HTML tags if present.
            // Since detecting where :: is inside HTML structure is complex, we will:
            // 1. Keep the full paragraph content
            // 2. But we need to remove the "Title ::" part visually or structurally?
            // The user wants strict "Title :: Content" format card creation.
            // If we just use the full paragraph as the first part of content, it will show "Title :: Content" inside the card too.
            // Ideally we strip it.

            // Simple robust approach: 
            // If the paragraph is simple text (no IMG tags inside), we strip the title.
            // If it has images, we just use the whole thing to be safe (or try to strip text node).

            if (para.querySelector('img')) {
              // Contains image, unsafe to strip string blindly. 
              // Just use the full content, user can delete title if duplicate.
              content = fullContent;
            } else {
              // Use DOM traversal to preserve HTML formatting while removing "Title ::"
              // Clone the node to avoid modifying the original paragraphs array references
              const clone = para.cloneNode(true) as HTMLElement;

              const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
              let currentNode: Node | null = walker.nextNode();
              let foundSeparator = false;

              while (currentNode && !foundSeparator) {
                const text = currentNode.textContent || '';
                const idx = text.indexOf('::');

                if (idx !== -1) {
                  // Found the split point. Keep text after "::"
                  currentNode.textContent = text.substring(idx + 2);
                  foundSeparator = true;
                } else {
                  // This node is part of the title/prefix, clear it
                  currentNode.textContent = '';
                  currentNode = walker.nextNode();
                }
              }

              // The content is the innerHTML of the modified clone
              // This preserves all tags (bold, italic) that were wrapped around the content
              content = clone.innerHTML;
            }

            sections.push({
              id: `section-${sections.length}`,
              title: title,
              content: content
            });
          }
        } else {
          // Not a header. Add to current section.
          if (currentSectionIndex === -1) {
            sections.push({
              id: `section-0`,
              title: 'Study Material',
              content: fullContent
            });
            currentSectionIndex = 0;
          } else {
            sections[currentSectionIndex].content += fullContent;
          }
        }
      });

      if (sections.length === 0) {
        return [{
          id: 'section-0',
          title: 'Study Material',
          content: html
        }];
      }

      return sections;
    };

    const studySections = shouldSaveStudy ? parseHtmlToSections(trimmedStudyText) : [];

    const getUpdatedTest = (test: Test, subjectId?: string) => {
      if (test.id !== selectedTest) return test;

      const isDefault = isDefaultTest(selectedCategory, subjectId, selectedTest);
      const shouldAppend = isDefault || !showPreviousQuestions;

      // Ensure we keep existing questions if appending/default mode
      // BUT if user explicitly edits default test and we enabled it (not currently supported fully for default),
      // the requirement says "default questions being read-only".
      // So we just take existing questions and append new ones.

      const finalQuestions = hasQuestionPayload
        ? (shouldAppend ? [...(test.questions || []), ...questions] : questions)
        : test.questions;

      // Build updated study material — merge sections + cheat sheets
      let updatedStudyMaterial = shouldAppend ? test.studyMaterial : undefined;
      if (studyEnabled && shouldSaveStudy) {
        updatedStudyMaterial = {
          ...(updatedStudyMaterial || { sections: [], lastUpdated: Date.now() }),
          sections: studySections,
          lastUpdated: Date.now(),
          cheatSheets: shouldSaveCheatSheets ? validCheatSheets : updatedStudyMaterial?.cheatSheets,
          cheatSheetsFirst,
        };
      } else if (shouldSaveCheatSheets) {
        updatedStudyMaterial = {
          sections: updatedStudyMaterial?.sections || [],
          lastUpdated: Date.now(),
          cheatSheets: validCheatSheets,
          cheatSheetsFirst,
        };
      } else if (!studyEnabled) {
        // If study material was disabled, clear sections but keep cheat sheets if they exist
        updatedStudyMaterial = shouldAppend ? test.studyMaterial : undefined;
      }

      return {
        ...test,
        questions: finalQuestions,
        studyMaterial: updatedStudyMaterial,
        timeLimitMinutes: minutes // Save time limit
      };
    };

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory) {
        // If category has subjects (new structure)
        if (cat.subjects && selectedSubject) {
          return {
            ...cat,
            subjects: cat.subjects.map(subject => {
              if (subject.id === selectedSubject) {
                // Update direct tests
                const updatedTests = subject.tests.map(test => getUpdatedTest(test, selectedSubject));

                // Update chapter tests
                const updatedChapters = subject.chapters?.map(chapter => ({
                  ...chapter,
                  tests: chapter.tests.map(test => getUpdatedTest(test, selectedSubject))
                }));

                return {
                  ...subject,
                  tests: updatedTests,
                  chapters: updatedChapters
                };
              }
              return subject;
            })
          };
        } else if (cat.tests) {
          // Old structure: tests directly in category
          return {
            ...cat,
            tests: cat.tests.map(test => getUpdatedTest(test, undefined))
          };
        }
      }
      return cat;
    });

    onSave(updatedCategories);
    if (editorMode === 'text' && hasQuestionPayload) {
      setQuestionsText('');
      setAnswersText('');
    }
    if (editorMode === 'visual' && hasQuestionPayload) {
      setVisualQuestions([]);
    }
    const savedItems = [
      hasQuestionPayload ? `${questions.length} question${questions.length > 1 ? 's' : ''}` : '',
      studyEnabled ? `${studySections.length} study entr${studySections.length > 1 ? 'ies' : 'y'}` : '',
      shouldSaveCheatSheets ? `${validCheatSheets.length} cheat sheet${validCheatSheets.length > 1 ? 's' : ''}` : ''
    ].filter(Boolean).join(' & ') || 'Changes';
    showModal('Saved Successfully', `${savedItems} saved to this test.`, 'success');
  };



  const handleDeleteTest = (categoryId: string, testId: string, subjectId?: string, chapterId?: string) => {
    console.log('[Admin Delete] Attempting to delete test:', testId, 'from category:', categoryId);

    if (isDefaultTest(categoryId, subjectId, testId)) {
      console.log('[Admin Delete] This is a default test, cannot delete');
      showModal('Cannot Delete', 'Default tests cannot be deleted.', 'error');
      return;
    }

    console.log('[Admin Delete] Showing confirmation modal');
    // Use ModalAlert instead of browser confirm
    showModal(
      'Delete Test',
      'Are you sure you want to delete this test? This action cannot be undone.',
      'warning',
      () => {
        console.log('[Admin Delete] User confirmed deletion, executing...');
        const updatedCategories = categories.map(cat => {
          if (cat.id === categoryId) {
            // If deleting from a subject
            if (cat.subjects && subjectId) {
              return {
                ...cat,
                subjects: cat.subjects.map(subject => {
                  if (subject.id === subjectId) {
                    // If deleting from a chapter
                    if (chapterId) {
                      return {
                        ...subject,
                        chapters: subject.chapters?.map(ch => {
                          if (ch.id === chapterId) {
                            return {
                              ...ch,
                              tests: ch.tests.filter(t => t.id !== testId)
                            };
                          }
                          return ch;
                        })
                      };
                    }
                    // Deleting from subject directly
                    return {
                      ...subject,
                      tests: subject.tests.filter((test: Test) => test.id !== testId)
                    };
                  }
                  return subject;
                })
              };
            } else if (cat.tests) {
              // Old structure: tests directly in category
              return {
                ...cat,
                tests: cat.tests.filter((test: Test) => test.id !== testId)
              };
            }
          }
          return cat;
        });

        console.log('[Admin Delete] Calling onSave with updated categories');
        onSave(updatedCategories);
        console.log('[Admin Delete] onSave completed');
      }
    );
  };

  const handleDeleteChapter = (categoryId: string, subjectId: string, chapterId: string) => {
    console.log('[Admin Delete] Attempting to delete chapter:', chapterId);

    // Only allow deletion of user-created chapters (those starting with 'ch-')
    if (!chapterId.startsWith('ch-')) {
      showModal('Cannot Delete', 'Only user-created chapters can be deleted.', 'error');
      return;
    }

    console.log('[Admin Delete] Showing confirmation modal for chapter');
    showModal(
      'Delete Chapter',
      'Are you sure you want to delete this chapter? All tests within it will also be deleted. This action cannot be undone.',
      'warning',
      () => {
        console.log('[Admin Delete] User confirmed chapter deletion, executing...');
        const updatedCategories = categories.map(cat => {
          if (cat.id === categoryId && cat.subjects) {
            return {
              ...cat,
              subjects: cat.subjects.map(subject => {
                if (subject.id === subjectId) {
                  return {
                    ...subject,
                    chapters: subject.chapters?.filter(ch => ch.id !== chapterId)
                  };
                }
                return subject;
              })
            };
          }
          return cat;
        });

        console.log('[Admin Delete] Calling onSave with updated categories (chapter deleted)');
        onSave(updatedCategories);
        console.log('[Admin Delete] Chapter deletion completed');
      }
    );
  };


  const handleAddTest = (categoryId: string, subjectId?: string, chapterId?: string) => {
    setInputModal({
      isOpen: true,
      value: '',
      categoryId,
      subjectId,
      chapterId: chapterId === 'uncategorized' ? undefined : chapterId
    });
  };

  const handleConfirmAddTest = () => {
    const testName = inputModal.value.trim();
    if (!testName) {
      showModal('Name Required', 'Please enter a name for the test.', 'warning');
      return;
    }

    const newTestId = `test-${Date.now()}`;
    const { categoryId, subjectId, chapterId } = inputModal;

    console.log('Adding test:', { testName, categoryId, subjectId, chapterId });

    const updatedCategories = categories.map(cat => {
      if (cat.id !== categoryId) return cat;

      // If adding to a subject
      if (cat.subjects && subjectId) {
        return {
          ...cat,
          subjects: cat.subjects.map(subject => {
            if (subject.id !== subjectId) return subject;

            // If adding to a specific chapter
            if (chapterId) {
              const currentChapters = subject.chapters || [];
              const chapterExists = currentChapters.some(ch => ch.id === chapterId);

              if (chapterExists) {
                return {
                  ...subject,
                  chapters: currentChapters.map(ch => {
                    if (ch.id === chapterId) {
                      return {
                        ...ch,
                        tests: [...ch.tests, {
                          id: newTestId,
                          name: testName,
                          questions: []
                        }]
                      };
                    }
                    return ch;
                  })
                };
              }
              console.error('Target chapter not found, cannot add test');
              return subject;
            }

            // If adding to subject directly (uncategorized)
            return {
              ...subject,
              tests: [...subject.tests, {
                id: newTestId,
                name: testName,
                questions: []
              }]
            };
          })
        };
      } else if (cat.tests) {
        // Old structure: tests directly in category
        return {
          ...cat,
          tests: [...cat.tests, {
            id: newTestId,
            name: testName,
            questions: []
          }]
        };
      }
      return cat;
    });

    onSave(updatedCategories);

    // Auto-select the newly created test
    setSelectedCategory(categoryId);
    if (subjectId) setSelectedSubject(subjectId);
    if (chapterId) setSelectedChapter(chapterId); // Ensure chapter stays selected
    setSelectedTest(newTestId);

    // Close input modal and show success
    setInputModal({ isOpen: false, value: '', categoryId: '', subjectId: undefined, chapterId: undefined });
    showModal('Test Created', `"${testName}" has been created successfully!`, 'success');
  };

  // Handle adding a new chapter
  const handleConfirmAddChapter = () => {
    const chapterName = chapterModal.value.trim();
    if (!chapterName) {
      showModal('Name Required', 'Please enter a chapter name.', 'warning');
      return;
    }

    const { categoryId, subjectId } = chapterModal;

    // Check for duplicate chapter name in the selected subject
    const category = categories.find(c => c.id === categoryId);
    const subject = category?.subjects?.find(s => s.id === subjectId);

    if (subject?.chapters?.some(ch => ch.name.toLowerCase() === chapterName.toLowerCase())) {
      showModal('Duplicate Name', 'A chapter with this name already exists in this subject.', 'warning');
      return;
    }

    const newChapterId = `ch-${Date.now()}`;

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId && cat.subjects) {
        return {
          ...cat,
          subjects: cat.subjects.map(subject => {
            if (subject.id === subjectId) {
              return {
                ...subject,
                chapters: [...(subject.chapters || []), {
                  id: newChapterId,
                  name: chapterName,
                  tests: []
                }]
              };
            }
            return subject;
          })
        };
      }
      return cat;
    });

    onSave(updatedCategories);

    // Auto-select the newly created chapter
    setSelectedChapter(newChapterId);

    // Close chapter modal and show success
    setChapterModal({ isOpen: false, value: '', categoryId: '', subjectId: '' });
    showModal('Chapter Created', `"${chapterName}" has been created successfully!`, 'success');
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);
  const selectedSubjectObj = selectedCat?.subjects?.find(s => s.id === selectedSubject);
  const selectedChapterObj = selectedSubjectObj?.chapters?.find(ch => ch.id === selectedChapter);

  // Available tests: from chapter if selected, otherwise from subject/category
  // Also include uncategorized tests from subject when a chapter is selected
  const getAvailableTests = (): Test[] => {
    if (selectedChapter === 'uncategorized') {
      // Show only direct tests from subject (uncategorized)
      return selectedSubjectObj?.tests || [];
    } else if (selectedChapterObj) {
      // Show tests from selected chapter
      return selectedChapterObj.tests || [];
    } else if (selectedSubjectObj) {
      // Show all tests: direct tests + tests from all chapters
      const directTests = selectedSubjectObj.tests || [];
      const chapterTests = selectedSubjectObj.chapters?.flatMap(ch => ch.tests) || [];
      return [...directTests, ...chapterTests];
    } else {
      return selectedCat?.tests || [];
    }
  };
  const availableTests = getAvailableTests();
  const selectedTestObj = availableTests.find((test) => test.id === selectedTest);
  const isCurrentTestDefault = selectedTest
    ? isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest)
    : false;

  useEffect(() => {
    if (selectedTestObj) {
      // Check if this is a default test
      const isDefault = isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest);

      // Load study material
      if (selectedTestObj.studyMaterial?.sections?.length) {
        setStudyEnabled(true);
        // Format sections as "Title :: Content" for the editor so they can be parsed back correctly
        const htmlContent = selectedTestObj.studyMaterial.sections.map(s => {
          let content = s.content || '';
          // Remove leading <p> if present to merge with title
          if (content.trim().startsWith('<p>')) {
            content = content.trim().substring(3);
          }
          // If content doesn't start with p, just prepend title
          return `<p><strong>${s.title}</strong> :: ${content}`;
        }).join('');

        setStudyText(htmlContent);
      } else {
        setStudyEnabled(false);
        setStudyText('');
      }

      // Load cheat sheets
      const existingSheets = selectedTestObj.studyMaterial?.cheatSheets;
      if (existingSheets && existingSheets.length > 0) {
        setCheatSheetEnabled(true);
        setCheatSheets(existingSheets);
      } else {
        setCheatSheetEnabled(false);
        setCheatSheets([]);
      }
      setCheatSheetsFirst(selectedTestObj.studyMaterial?.cheatSheetsFirst ?? false);

      // Load questions based on showPreviousQuestions toggle
      // For default tests, never show previous questions (can only ADD)
      // For user-created tests, show if toggle is enabled
      if (showPreviousQuestions && !isDefault && selectedTestObj.questions && selectedTestObj.questions.length > 0) {
        setQuestionsText(questionsToEditorText(selectedTestObj.questions));
        setAnswersText(answersToEditorText(selectedTestObj.questions));
      } else {
        setQuestionsText('');
        setAnswersText('');
      }
    } else {
      setStudyEnabled(false);
      setStudyText('');
      setQuestionsText('');
      setAnswersText('');
      setCheatSheetEnabled(false);
      setCheatSheets([]);
    }
    setTimeLimitInput(
      selectedTestObj?.timeLimitMinutes ? String(selectedTestObj.timeLimitMinutes) : ''
    );
  }, [selectedTestObj, selectedCategory, selectedSubject, selectedTest, showPreviousQuestions]);

  // Load chapter notes into shared editor state when chapter selected but no test
  useEffect(() => {
    if (selectedChapterObj && !selectedTest) {
      const notes = selectedChapterObj.notes;
      if (notes?.sections?.length) {
        const htmlContent = notes.sections.map(s => {
          let content = s.content || '';
          if (content.trim().startsWith('<p>')) content = content.trim().substring(3);
          return `<p><strong>${s.title}</strong> :: ${content}`;
        }).join('');
        setStudyEnabled(true);
        setStudyText(htmlContent);
        setStudyMaterialOpen(true);
      } else {
        setStudyEnabled(false);
        setStudyText('');
        setStudyMaterialOpen(true); // Always open so user sees the editor
      }
      const existingSheets = notes?.cheatSheets ?? [];
      if (existingSheets.length > 0) {
        setCheatSheetEnabled(true);
        setCheatSheets(existingSheets);
        setCheatSheetOpen(true);
      } else {
        setCheatSheetEnabled(false);
        setCheatSheets([]);
      }
      setCheatSheetsFirst(notes?.cheatSheetsFirst ?? false);
    }
  }, [selectedChapterObj?.id, selectedTest]);

  // Reset showPreviousQuestions when test changes
  useEffect(() => {
    setShowPreviousQuestions(false);
  }, [selectedTest]);

  return (
    <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-[#1F1F1E]' : 'bg-[#F6F8F9]'
      }`}>
      {/* Professional Modal */}
      <ModalAlert
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        isDark={isDark}
      />

      {/* Input Modal for Creating New Test */}
      {inputModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setInputModal({ ...inputModal, isOpen: false })}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all ${isDark
              ? 'bg-[#1E1F23] border border-slate-700'
              : 'bg-white'
              }`}
            style={{ animation: 'scaleIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className={`w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4`}>
              <Plus className="text-green-500" size={24} />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create New Test
            </h3>
            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Enter a name for the new test. You'll be able to add questions after creating it.
            </p>

            {/* Input Field */}
            <input
              type="text"
              value={inputModal.value}
              onChange={(e) => setInputModal({ ...inputModal, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmAddTest();
                if (e.key === 'Escape') setInputModal({ ...inputModal, isOpen: false });
              }}
              placeholder="Enter test name..."
              autoFocus
              className={`w-full px-4 py-3 mb-6 border-2 rounded-lg focus:outline-none ${isDark
                ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-green-500 placeholder-slate-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-green-500 placeholder-gray-400'
                }`}
            />

            {/* Actions */}
            {/* Timer buttons removed as per request - saved with main content */}
          </div>
        </div>
      )}

      {/* Chapter Modal for Creating New Chapter */}
      {chapterModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setChapterModal({ ...chapterModal, isOpen: false })}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all ${isDark
              ? 'bg-[#1E1F23] border border-slate-700'
              : 'bg-white'
              }`}
            style={{ animation: 'scaleIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className={`w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4`}>
              <FolderPlus className="text-purple-500" size={24} />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create New Chapter
            </h3>
            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Enter a name for the new chapter. You'll be able to add tests to it after creating.
            </p>

            {/* Input Field */}
            <input
              type="text"
              value={chapterModal.value}
              onChange={(e) => setChapterModal({ ...chapterModal, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmAddChapter();
                if (e.key === 'Escape') setChapterModal({ ...chapterModal, isOpen: false });
              }}
              placeholder="Enter chapter name..."
              autoFocus
              className={`w-full px-4 py-3 mb-6 border-2 rounded-lg focus:outline-none ${isDark
                ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-purple-500 placeholder-slate-500'
                : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 placeholder-gray-400'
                }`}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              {/* Clear button removed */}
              <button
                onClick={handleConfirmAddChapter}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Create Chapter
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">


        <div className={`rounded-xl shadow-lg p-8 mb-6 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'
              }`}>
              Content Management
            </h1>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark
                ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
            >
              <HelpCircle size={20} />
              Help
            </button>
          </div>

          {showHelp && (
            <HelpPanel isDark={isDark} />
          )}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="min-w-0">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubject('');
                  setSelectedTest('');
                }}
                className={`w-full max-w-full p-3 border-2 rounded-lg focus:outline-none cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap box-border ${isDark
                  ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
              >
                <option value="">Choose a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {selectedCat?.subjects && selectedCat.subjects.length > 0 && (
              <div className="min-w-0">
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                    setSelectedTest('');
                  }}
                  className={`w-full max-w-full p-3 border-2 rounded-lg focus:outline-none font-mono text-sm text-ellipsis overflow-hidden whitespace-nowrap box-border ${!selectedCategory
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                    } ${isDark
                      ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                    }`}
                  disabled={!selectedCategory}
                >
                  <option value="">Choose a subject...</option>
                  {selectedCat.subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Chapter Selector - show when subject is selected */}
            {selectedSubjectObj && (
              <div className="min-w-0">
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Select Chapter <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>(optional)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedChapter}
                    onChange={(e) => {
                      setSelectedChapter(e.target.value);
                      setSelectedTest('');
                    }}
                    className={`flex-1 max-w-full p-3 border-2 rounded-lg focus:outline-none font-mono text-sm text-ellipsis overflow-hidden whitespace-nowrap box-border cursor-pointer ${isDark
                      ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                      }`}
                  >
                    <option value="">All Tests</option>
                    {selectedSubjectObj.chapters?.map((chapter: Chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        📁 {chapter.name} ({chapter.tests.length} tests)
                      </option>
                    ))}
                    {selectedSubjectObj.tests.length > 0 && (
                      <option value="uncategorized">📄 Uncategorized ({selectedSubjectObj.tests.length} tests)</option>
                    )}
                  </select>
                  <button
                    onClick={() => setChapterModal({
                      isOpen: true,
                      value: '',
                      categoryId: selectedCategory,
                      subjectId: selectedSubject
                    })}
                    className="px-3 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                    title="Create new chapter"
                  >
                    <FolderPlus size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="min-w-0">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Test</label>
              <div className="flex gap-2">
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className={`flex-1 max-w-full p-3 border-2 rounded-lg focus:outline-none font-mono text-sm text-ellipsis overflow-hidden whitespace-nowrap box-border ${!selectedCategory || (selectedCat?.subjects && selectedCat.subjects.length > 0 && !selectedSubject)
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                    } ${isDark
                      ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                    }`}
                  disabled={!selectedCategory || (selectedCat?.subjects && selectedCat.subjects.length > 0 && !selectedSubject)}
                >
                  <option value="">Choose a test...</option>
                  {availableTests.map((test: Test) => (
                    <option key={test.id} value={test.id}>
                      {test.name} ({test.questions.length} questions)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedCategory && handleAddTest(selectedCategory, selectedSubject || undefined, selectedChapter || undefined)}
                  disabled={!selectedCategory || (selectedCat?.subjects && selectedCat.subjects.length > 0 && !selectedSubject)}
                  className="px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Show Previous Questions Toggle */}
          {selectedTest && selectedTestObj && selectedTestObj.questions.length > 0 && (
            <div
              className={`rounded-xl border-2 p-4 mb-6 ${isDark ? 'border-slate-700 bg-[#1F1F1E]' : 'border-amber-100 bg-amber-50'
                }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <label
                    className={`flex items-center gap-2 text-sm font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-gray-800'
                      }`}
                  >
                    {showPreviousQuestions ? <Eye size={18} className="text-amber-500" /> : <EyeOff size={18} className="text-amber-500" />}
                    Previous Questions
                    {isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest) && (
                      <Lock size={14} className="text-red-400 ml-1" />
                    )}
                  </label>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest)
                      ? 'Default test questions are locked. You can only add new questions.'
                      : ''}
                  </p>
                </div>
                <div className="flex items-center">
                  <label
                    className={`relative inline-flex items-center ${isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest)
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showPreviousQuestions}
                      onChange={(e) => setShowPreviousQuestions(e.target.checked)}
                      disabled={isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest)}
                    />
                    <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 ${isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}></div>
                    <span className={`ml-3 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'} ${isDefaultTest(selectedCategory, selectedSubject || undefined, selectedTest) ? 'opacity-50' : ''
                      }`}>
                      {showPreviousQuestions ? 'Edit' : 'Show'}
                    </span>
                  </label>
                </div>
              </div>
              {/* Question count info */}
              <div className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                This test has <strong>{selectedTestObj.questions.length}</strong> existing question{selectedTestObj.questions.length !== 1 ? 's' : ''}.
              </div>
            </div>
          )}


          {/* Editor Mode Toggle */}
          <div className={`flex items-center gap-2 mb-4 p-1 rounded-xl w-fit ${isDark ? 'bg-[#1F1F1E]' : 'bg-gray-100'}`}>
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${editorMode === 'visual'
                ? isDark
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-600 text-white shadow-md'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Wand2 size={16} />
              Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${editorMode === 'text'
                ? isDark
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-600 text-white shadow-md'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Type size={16} />
              Text Mode
            </button>
          </div>

          {editorMode === 'visual' ? (
            <div className="mb-6">
              <VisualQuestionEditor
                isDark={isDark}
                initialQuestions={showPreviousQuestions && selectedTestObj ? selectedTestObj.questions : undefined}
                onQuestionsChange={setVisualQuestions}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Questions (one per line)
                </label>
                <textarea
                  value={questionsText}
                  onChange={(e) => setQuestionsText(e.target.value)}
                  placeholder="Question | Option A | Option B | Option C | Option D"
                  className={`w-full h-64 p-4 border-2 rounded-lg focus:outline-none font-mono text-sm ${isDark
                    ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Answers (one per line: A, B, C, or D. Optional: A|explanation text)
                </label>
                <textarea
                  value={answersText}
                  onChange={(e) => setAnswersText(e.target.value)}
                  placeholder="A&#10;B&#10;C"
                  className={`w-full h-64 p-4 border-2 rounded-lg focus:outline-none font-mono text-sm ${isDark
                    ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                    }`}
                />
              </div>
            </div>
          )}

          <div
            className={`rounded-xl border-2 mb-6 overflow-hidden ${isDark ? 'border-slate-700 bg-[#1F1F1E]' : 'border-blue-100 bg-blue-50'}`}
          >
            {/* Collapsible Header */}
            <button
              type="button"
              onClick={() => !isCurrentTestDefault && setStudyMaterialOpen(o => !o)}
              className={`w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-5 text-left transition-colors ${isCurrentTestDefault
                ? isDark ? 'cursor-not-allowed' : 'cursor-not-allowed'
                : studyMaterialOpen
                  ? isDark ? 'bg-blue-900/20' : 'bg-blue-100'
                  : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-blue-100/60'
                }`}
            >
              <div className="flex items-start gap-3 flex-1">
                {isCurrentTestDefault
                  ? <Lock size={18} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                  : <BookOpen size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                }
                <div>
                  <p className={`text-sm font-semibold ${isCurrentTestDefault ? isDark ? 'text-slate-500' : 'text-gray-400' : isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                    Study Mode Material
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {isCurrentTestDefault
                      ? 'Default test study material is locked and cannot be modified.'
                      : 'Organize quick notes, Q&A pairs, or explanations learners can read before the test.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label
                  className={`relative inline-flex items-center ${(!selectedTest && !selectedChapterObj) || isCurrentTestDefault ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={studyEnabled}
                    onChange={(e) => {
                      setStudyEnabled(e.target.checked);
                      if (e.target.checked) setStudyMaterialOpen(true);
                    }}
                    disabled={(!selectedTest && !selectedChapterObj) || isCurrentTestDefault}
                  />
                  <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${((!selectedTest && !selectedChapterObj) || isCurrentTestDefault) ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  <span className={`ml-3 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'} ${((!selectedTest && !selectedChapterObj) || isCurrentTestDefault) ? 'opacity-50' : ''}`}>
                    Enable
                  </span>
                </label>
                {!isCurrentTestDefault && (
                  studyMaterialOpen
                    ? <ChevronUp size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                    : <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                )}
              </div>
            </button>

            {/* Collapsible Body */}
            {studyMaterialOpen && !isCurrentTestDefault && (
              <div className="px-5 pb-5 pt-3">
                {studyEnabled ? (
                  <>
                    <RichTextEditor
                      value={studyText}
                      onChange={setStudyText}
                      placeholder="Add study notes with Heading :: Content or images..."
                      isDark={isDark}
                    />
                    <p className={`text-xs mt-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <strong>✨ Rich Editor:</strong> Use the toolbar to format text, paste images directly (Ctrl+V), and create professional study notes.
                    </p>
                  </>
                ) : (
                  <p className={`text-sm py-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    Enable the toggle above to start adding study material for this test.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Cheat Sheet Builder ── */}
          <div
            className={`rounded-xl border-2 mb-6 overflow-hidden ${isDark ? 'border-slate-700 bg-[#1F1F1E]' : 'border-indigo-100 bg-indigo-50/30'
              }`}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => !isCurrentTestDefault && setCheatSheetOpen(o => !o)}
              className={`w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-5 text-left transition-colors ${isCurrentTestDefault
                ? 'cursor-not-allowed'
                : cheatSheetOpen
                  ? isDark ? 'bg-slate-800/50' : 'bg-slate-100/80'
                  : isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/50'
                }`}
            >
              <div className="flex items-start gap-3 flex-1">
                {isCurrentTestDefault
                  ? <Lock size={18} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                  : <Table2 size={18} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                }
                <div>
                  <p className={`text-sm font-semibold ${isCurrentTestDefault
                    ? isDark ? 'text-slate-500' : 'text-gray-400'
                    : isDark ? 'text-slate-200' : 'text-gray-800'
                    }`}>
                    Cheat Sheet Builder
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {isCurrentTestDefault
                      ? 'Default test cheat sheets cannot be modified.'
                      : 'Create structured table cheat sheets (e.g. Tense formulas, grammar rules, vocab tables).'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Reorder: swap notes above/below cheat sheets (admin-only) */}
                {!isCurrentTestDefault && (studyEnabled || cheatSheetEnabled) && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setCheatSheetsFirst(v => !v); }}
                    title={cheatSheetsFirst ? 'Cheatsheet is shown ABOVE notes — click to put Notes first' : 'Notes are shown ABOVE cheatsheet — click to put Cheatsheet first'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      cheatSheetsFirst
                        ? isDark ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : isDark ? 'bg-slate-700/40 border-slate-600 text-slate-300' : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    {cheatSheetsFirst ? '📊 Sheet ↑  📝 Notes ↓' : '📝 Notes ↑  📊 Sheet ↓'}
                  </button>
                )}
                {/* Enable toggle */}
                <label
                  className={`relative inline-flex items-center ${(!selectedTest && !selectedChapterObj) || isCurrentTestDefault ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cheatSheetEnabled}
                    onChange={e => {
                      setCheatSheetEnabled(e.target.checked);
                      if (e.target.checked) setCheatSheetOpen(true);
                    }}
                    disabled={(!selectedTest && !selectedChapterObj) || isCurrentTestDefault}
                  />
                  <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 ${((!selectedTest && !selectedChapterObj) || isCurrentTestDefault) ? 'opacity-50 cursor-not-allowed' : ''
                    }`} />
                  <span className={`ml-3 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'} ${((!selectedTest && !selectedChapterObj) || isCurrentTestDefault) ? 'opacity-50' : ''
                    }`}>
                    Enable
                  </span>
                </label>
                {!isCurrentTestDefault && (
                  cheatSheetOpen
                    ? <ChevronUp size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                    : <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                )}
              </div>
            </button>

            {/* Body */}
            {cheatSheetOpen && !isCurrentTestDefault && (
              <div className="px-5 pb-5 pt-3">
                {cheatSheetEnabled ? (
                  <CheatSheetEditor
                    isDark={isDark}
                    existingSheets={cheatSheets}
                    onChange={setCheatSheets}
                  />
                ) : (
                  <p className={`text-sm py-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    Enable the toggle above to start building cheat sheets for this test.
                  </p>
                )}
              </div>
            )}
          </div>


          <div
            className={`rounded-xl border-2 p-5 mb-6 ${isDark ? 'border-slate-700 bg-[#1F1F1E]' : 'border-purple-100 bg-purple-50'
              }`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <label
                  className={`flex items-center gap-2 text-sm font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-gray-800'
                    }`}
                >
                  <Clock size={18} className="text-purple-500" />
                  Custom Test Timer
                </label>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Set a specific time limit (in minutes) for this test. Leave blank to fall back to the
                  default 30 minutes or 1 minute per question, whichever is higher.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="e.g., 45"
                  value={timeLimitInput}
                  onChange={(e) => setTimeLimitInput(e.target.value)}
                  className={`w-32 px-3 py-2 border-2 rounded-lg focus:outline-none ${!selectedTest
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                    } ${isDark
                      ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-purple-400'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                    }`}
                  disabled={!selectedTest}
                />
              </div>
            </div>
          </div>
          {/* Timer buttons removed as per request - saved with main content */}
        </div>

        <button
          onClick={handleSaveQuestions}
          disabled={!selectedCategory || (!selectedTest && (!selectedChapterObj || selectedChapter === 'uncategorized'))}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {selectedChapterObj && !selectedTest ? 'Save Chapter Notes' : 'Save Content'}
        </button>
      </div>

      <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-[#1E1E1D] border-slate-700' : 'bg-white'
        }`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'
          }`}>
          Manage Tests
        </h2>

        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className={`border-2 rounded-lg p-4 ${isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
              <h3
                className={`font-bold text-lg mb-3 break-words break-all ${isDark ? 'text-slate-100' : 'text-gray-800'
                  }`}
              >
                {category.name}
              </h3>

              {/* If category has subjects */}
              {category.subjects && category.subjects.length > 0 ? (
                <div className="space-y-4">
                  {category.subjects.map(subject => (
                    <div key={subject.id} className="relative border-l-2 border-blue-300 pl-4 pr-14">
                      <h4
                        className={`font-semibold mb-2 break-words break-all ${isDark ? 'text-slate-200' : 'text-gray-700'
                          }`}
                      >
                        {subject.name}
                      </h4>
                      <div className="space-y-2">
                        {subject.tests.length > 0 ? (
                          subject.tests.map((test: Test) => (
                            <div
                              key={test.id}
                              className={`relative p-3 pr-12 rounded ${isDark ? 'bg-[#1E1E1D]' : 'bg-gray-50'
                                }`}
                            >
                              <div className="min-w-0">
                                <p
                                  className={`font-semibold break-words ${isDark ? 'text-slate-200' : 'text-gray-700'
                                    }`}
                                >
                                  {test.name}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                  ({test.questions.length} questions)
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteTest(category.id, test.id, subject.id)}
                                disabled={isDefaultTest(category.id, subject.id, test.id)}
                                className={`absolute right-2 top-3 p-2 rounded transition-colors ${isDark
                                  ? 'text-red-400 hover:bg-red-900/30'
                                  : 'text-red-600 hover:bg-red-50'
                                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                                title={
                                  isDefaultTest(category.id, subject.id, test.id)
                                    ? 'Default tests cannot be deleted'
                                    : 'Delete test'
                                }
                              >
                                {isDefaultTest(category.id, subject.id, test.id) ? (
                                  <Lock size={18} />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No tests yet</p>
                        )}
                      </div>

                      {/* Tests inside chapters */}
                      {subject.chapters?.map(chapter => (
                        <div key={chapter.id} className="relative mt-4 border-l-2 border-amber-300 pl-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h4
                              className={`font-semibold min-w-0 flex-1 ${isDark ? 'text-slate-200' : 'text-gray-700'
                                } flex items-center gap-2`}
                            >
                              <FolderPlus size={16} className="text-amber-500 flex-shrink-0" />
                              <span className="truncate">{chapter.name}</span>
                            </h4>
                            {chapter.id.startsWith('ch-') && (
                              <button
                                onClick={() => handleDeleteChapter(category.id, subject.id, chapter.id)}
                                className={`absolute right-2 top-2 p-2 rounded transition-colors z-10 ${isDark
                                  ? 'text-red-400 hover:bg-red-900/30'
                                  : 'text-red-600 hover:bg-red-50'
                                  }`}
                                title="Delete chapter and all its tests"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {chapter.tests.length > 0 ? (
                              chapter.tests.map((test: Test) => (
                                <div
                                  key={test.id}
                                  className={`relative p-3 pr-12 rounded ${isDark ? 'bg-[#1E1E1D]' : 'bg-gray-50'
                                    }`}
                                >
                                  <div className="min-w-0">
                                    <p
                                      className={`font-semibold break-words ${isDark ? 'text-slate-200' : 'text-gray-700'
                                        }`}
                                    >
                                      {test.name}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                      ({test.questions.length} questions)
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteTest(category.id, test.id, subject.id, chapter.id)}
                                    disabled={isDefaultTest(category.id, subject.id, test.id)}
                                    className={`absolute right-2 top-3 p-2 rounded transition-colors ${isDark
                                      ? 'text-red-400 hover:bg-red-900/30'
                                      : 'text-red-600 hover:bg-red-50'
                                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                                    title={
                                      isDefaultTest(category.id, subject.id, test.id)
                                        ? 'Default tests cannot be deleted'
                                        : 'Delete test'
                                    }
                                  >
                                    {isDefaultTest(category.id, subject.id, test.id) ? (
                                      <Lock size={18} />
                                    ) : (
                                      <Trash2 size={18} />
                                    )}
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No tests yet</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                /* Old structure: tests directly in category */
                <div className="space-y-2">
                  {category.tests && category.tests.length > 0 ? (
                    category.tests.map((test: Test) => (
                      <div
                        key={test.id}
                        className={`grid md:grid-cols-[1fr_auto] gap-3 p-3 rounded ${isDark ? 'bg-[#1E1E1D]' : 'bg-gray-50'
                          }`}
                      >
                        <div className="min-w-0">
                          <p
                            className={`font-semibold break-words break-all ${isDark ? 'text-slate-200' : 'text-gray-700'
                              }`}
                          >
                            {test.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            ({test.questions.length} questions)
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTest(category.id, test.id)}
                          disabled={isDefaultTest(category.id, undefined, test.id)}
                          className={`p-2 rounded transition-colors justify-self-end ${isDark
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          title={
                            isDefaultTest(category.id, undefined, test.id)
                              ? 'Default tests cannot be deleted'
                              : 'Delete test'
                          }
                        >
                          {isDefaultTest(category.id, undefined, test.id) ? (
                            <Lock size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No tests yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >

  );
}
