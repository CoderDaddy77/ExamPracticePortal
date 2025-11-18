import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, HelpCircle, Lock } from 'lucide-react';
import type { ExamCategory, Question, Test } from '../types';
import { examCategories as defaultCategories } from '../data/mockData';

const TEST_KEY_SEPARATOR = '::';

const buildTestKey = (categoryId: string, subjectId: string | undefined, testId: string) =>
  `${categoryId}${TEST_KEY_SEPARATOR}${subjectId ?? 'root'}${TEST_KEY_SEPARATOR}${testId}`;

const defaultTestKeys = new Set<string>();

defaultCategories.forEach((category) => {
  if (category.subjects && category.subjects.length > 0) {
    category.subjects.forEach((subject) => {
      subject.tests.forEach((test) => {
        defaultTestKeys.add(buildTestKey(category.id, subject.id, test.id));
      });
    });
  } else {
    category.tests?.forEach((test) => {
      defaultTestKeys.add(buildTestKey(category.id, undefined, test.id));
    });
  }
});

const isDefaultTest = (categoryId: string, subjectId: string | undefined, testId: string) =>
  defaultTestKeys.has(buildTestKey(categoryId, subjectId, testId));

interface AdminPanelProps {
  categories: ExamCategory[];
  isDark: boolean;
  onSave: (categories: ExamCategory[]) => void;
  onBack: () => void;
}

export function AdminPanel({ categories, isDark, onSave, onBack }: AdminPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [questionsText, setQuestionsText] = useState('');
  const [answersText, setAnswersText] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSaveQuestions = () => {
    if (!selectedCategory || !selectedTest) {
      alert('Please select a category and test first');
      return;
    }

    const questionLines = questionsText.trim().split('\n').filter(line => line.trim());
    const answerLines = answersText.trim().split('\n').filter(line => line.trim());

    if (questionLines.length === 0) {
      alert('Please enter at least one question');
      return;
    }

    const questions: Question[] = [];

    for (let i = 0; i < questionLines.length; i++) {
      const qLine = questionLines[i].trim();

      const parts = qLine.split('|').map(p => p.trim());

      if (parts.length < 5) {
        alert(`Question ${i + 1} is not formatted correctly. Each line should have: Question | Option A | Option B | Option C | Option D`);
        return;
      }

      const question = parts[0];
      const options = [parts[1], parts[2], parts[3], parts[4]];

      let correctAnswer = 0;
      let explanation: string | undefined = undefined;
      
      if (answerLines[i]) {
        const answerLine = answerLines[i].trim();
        // Check if answer has explanation in format: A|reason text
        if (answerLine.includes('|')) {
          const answerParts = answerLine.split('|').map(p => p.trim());
          const answerStr = answerParts[0].toUpperCase();
          explanation = answerParts.slice(1).join('|').trim(); // Join in case reason has | in it
          
          if (answerStr === 'A' || answerStr === '0') correctAnswer = 0;
          else if (answerStr === 'B' || answerStr === '1') correctAnswer = 1;
          else if (answerStr === 'C' || answerStr === '2') correctAnswer = 2;
          else if (answerStr === 'D' || answerStr === '3') correctAnswer = 3;
        } else {
          // Just answer without explanation
          const answerStr = answerLine.toUpperCase();
          if (answerStr === 'A' || answerStr === '0') correctAnswer = 0;
          else if (answerStr === 'B' || answerStr === '1') correctAnswer = 1;
          else if (answerStr === 'C' || answerStr === '2') correctAnswer = 2;
          else if (answerStr === 'D' || answerStr === '3') correctAnswer = 3;
        }
      }

      questions.push({
        id: `q${Date.now()}_${i}`,
        question,
        options,
        correctAnswer,
        ...(explanation && { explanation })
      });
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory) {
        // If category has subjects (new structure)
        if (cat.subjects && selectedSubject) {
          return {
            ...cat,
            subjects: cat.subjects.map(subject => {
              if (subject.id === selectedSubject) {
                return {
                  ...subject,
                  tests: subject.tests.map((test: Test) => {
                    if (test.id === selectedTest) {
                      return {
                        ...test,
                        questions: [...test.questions, ...questions]
                      };
                    }
                    return test;
                  })
                };
              }
              return subject;
            })
          };
        } else if (cat.tests) {
          // Old structure: tests directly in category
          return {
            ...cat,
            tests: cat.tests.map((test: Test) => {
              if (test.id === selectedTest) {
                return {
                  ...test,
                  questions: [...test.questions, ...questions]
                };
              }
              return test;
            })
          };
        }
      }
      return cat;
    });

    onSave(updatedCategories);
    setQuestionsText('');
    setAnswersText('');
    alert(`Successfully added ${questions.length} questions!`);
  };

  const handleDeleteTest = (categoryId: string, testId: string, subjectId?: string) => {
    if (isDefaultTest(categoryId, subjectId, testId)) {
      alert('Default tests cannot be deleted.');
      return;
    }
    if (!confirm('Are you sure you want to delete this test?')) return;

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        // If deleting from a subject
        if (cat.subjects && subjectId) {
          return {
            ...cat,
            subjects: cat.subjects.map(subject => {
              if (subject.id === subjectId) {
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

    onSave(updatedCategories);
  };

  const handleAddTest = (categoryId: string, subjectId?: string) => {
    const testName = prompt('Enter test name:');
    if (!testName) return;

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        // If adding to a subject
        if (cat.subjects && subjectId) {
          return {
            ...cat,
            subjects: cat.subjects.map(subject => {
              if (subject.id === subjectId) {
                return {
                  ...subject,
                  tests: [...subject.tests, {
                    id: `test-${Date.now()}`,
                    name: testName,
                    questions: []
                  }]
                };
              }
              return subject;
            })
          };
        } else if (cat.tests) {
          // Old structure: tests directly in category
          return {
            ...cat,
            tests: [...cat.tests, {
              id: `test-${Date.now()}`,
              name: testName,
              questions: []
            }]
          };
        }
      }
      return cat;
    });

    onSave(updatedCategories);
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);
  const selectedSubjectObj = selectedCat?.subjects?.find(s => s.id === selectedSubject);
  
  // Get available tests: either from selected subject or directly from category
  const availableTests = selectedSubjectObj?.tests || selectedCat?.tests || [];

  return (
    <div className={`min-h-screen py-8 px-4 ${
      isDark ? 'bg-[#18191D]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm rounded-lg border transition-colors ${
            isDark
              ? 'border-slate-700 bg-[#212226] text-slate-200 hover:bg-slate-700/80'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className={`rounded-xl shadow-lg p-8 mb-6 ${
          isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-slate-100' : 'text-gray-800'
            }`}>
              Content Management
            </h1>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <HelpCircle size={20} />
              Help
            </button>
          </div>

          {showHelp && (
            <div
              className={`rounded-lg p-6 mb-6 border shadow-inner ${
                isDark
                  ? 'bg-[#11131A]/90 border-slate-700 text-slate-200'
                  : 'bg-blue-50 border-blue-200 text-gray-800'
              }`}
            >
              <h3 className="font-bold mb-3">How to Add Questions</h3>
              <ol
                className={`list-decimal list-inside space-y-2 mb-4 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}
              >
                <li>Select a category and test from the dropdown</li>
                <li>
                  In the Questions box, enter one question per line in this format:
                  <br />
                  <code
                    className={`inline-block mt-1 px-2 py-1 rounded text-sm border ${
                      isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'
                    }`}
                  >
                    Question text | Option A | Option B | Option C | Option D
                  </code>
                </li>
                <li>
                  In the Answers box, enter the correct answer for each question (A, B, C, or D). You can
                  optionally add an explanation using format:
                  <code
                    className={`inline-block mt-1 px-1 rounded text-xs border ${
                      isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'
                    }`}
                  >
                    A|because this is the reason...
                  </code>
                </li>
                <li>Click Save Questions</li>
              </ol>
              <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <strong>Example Questions:</strong>
              </p>
              <code
                className={`block p-3 rounded text-sm mb-2 border ${
                  isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'
                }`}
              >
                What is the capital of France? | London | Paris | Berlin | Madrid
                <br />
                Who wrote Romeo and Juliet? | Charles Dickens | William Shakespeare | Jane Austen | Mark Twain
              </code>
              <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <strong>Example Answers (with optional explanations):</strong>
              </p>
              <code
                className={`block p-3 rounded text-sm border ${
                  isDark ? 'bg-[#0c0f16] border-slate-600 text-slate-100' : 'bg-white border-blue-200'
                }`}
              >
                B
                <br />
                B|Because Paris is the capital city of France
                <br />
                A|This is the correct answer because...
              </code>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubject('');
                  setSelectedTest('');
                }}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                  isDark
                    ? 'bg-[#212226] border-slate-600 text-slate-100 focus:border-blue-500'
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
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedTest('');
                  }}
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                    isDark
                      ? 'bg-[#212226] border-slate-600 text-slate-100 focus:border-blue-500'
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

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Select Test</label>
              <div className="flex gap-2">
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className={`flex-1 p-3 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                    isDark
                      ? 'bg-[#212226] border-slate-600 text-slate-100 focus:border-blue-500'
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
                  onClick={() => selectedCategory && handleAddTest(selectedCategory, selectedSubject || undefined)}
                  disabled={!selectedCategory || (selectedCat?.subjects && selectedCat.subjects.length > 0 && !selectedSubject)}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Questions (one per line)
              </label>
              <textarea
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                placeholder="Question | Option A | Option B | Option C | Option D"
                className={`w-full h-64 p-4 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                  isDark
                    ? 'bg-[#212226] border-slate-600 text-slate-100 focus:border-blue-500'
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
                className={`w-full h-64 p-4 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                  isDark
                    ? 'bg-[#212226] border-slate-600 text-slate-100 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleSaveQuestions}
            disabled={!selectedCategory || !selectedTest}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Questions
          </button>
        </div>

        <div className={`rounded-xl shadow-lg p-8 ${
          isDark ? 'bg-[#212226] border-slate-700' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-slate-100' : 'text-gray-800'
          }`}>
            Manage Tests
          </h2>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className={`border-2 rounded-lg p-4 ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <h3
                  className={`font-bold text-lg mb-3 break-words break-all ${
                    isDark ? 'text-slate-100' : 'text-gray-800'
                  }`}
                >
                  {category.name}
                </h3>
                
                {/* If category has subjects */}
                {category.subjects && category.subjects.length > 0 ? (
                  <div className="space-y-4">
                    {category.subjects.map(subject => (
                      <div key={subject.id} className="ml-4 border-l-2 border-blue-300 pl-4">
                        <h4
                          className={`font-semibold mb-2 break-words break-all ${
                            isDark ? 'text-slate-200' : 'text-gray-700'
                          }`}
                        >
                          {subject.name}
                        </h4>
                        <div className="space-y-2">
                          {subject.tests.length > 0 ? (
                            subject.tests.map((test: Test) => (
                                <div
                                  key={test.id}
                                  className={`grid md:grid-cols-[1fr_auto] gap-3 p-3 rounded ${
                                    isDark ? 'bg-[#212226]' : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <p
                                      className={`font-semibold break-words break-all ${
                                        isDark ? 'text-slate-200' : 'text-gray-700'
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
                                    className={`p-2 rounded transition-colors justify-self-end ${
                                      isDark
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
                ) : (
                  /* Old structure: tests directly in category */
                  <div className="space-y-2">
                    {category.tests && category.tests.length > 0 ? (
                      category.tests.map((test: Test) => (
                        <div
                          key={test.id}
                          className={`grid md:grid-cols-[1fr_auto] gap-3 p-3 rounded ${
                            isDark ? 'bg-[#212226]' : 'bg-gray-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <p
                              className={`font-semibold break-words break-all ${
                                isDark ? 'text-slate-200' : 'text-gray-700'
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
                            className={`p-2 rounded transition-colors justify-self-end ${
                              isDark
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
      </div>
    </div>
  );
}
