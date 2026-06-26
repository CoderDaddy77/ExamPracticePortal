export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface StudySection {
  id: string;
  title: string;
  content: string;
}

// ── Cheat Sheet Types ─────────────────────────────────────────────────────────

export interface CheatSheetRow {
  id: string;
  cells: string[];          // one entry per column (plain text, supports **bold**)
  isSectionTitle?: boolean; // spans full width; rendered as a coloured divider row
}

export interface CheatSheet {
  id: string;
  title: string;            // e.g. "THE TENSES CHEAT SHEET (One-Example Formula)"
  subtitle?: string;        // e.g. "Base Kaam (Action): Write (V1), Wrote (V2)..."
  emoji?: string;           // optional leading emoji, e.g. "📋"
  columns: string[];        // column header names
  rows: CheatSheetRow[];
}

// ─────────────────────────────────────────────────────────────────────────────

export interface StudyMaterial {
  sections: StudySection[];
  lastUpdated: number;
  cheatSheets?: CheatSheet[]; // optional structured cheat sheets
  cheatSheetsFirst?: boolean;  // when true, cheat sheets render above notes
}

export interface Test {
  id: string;
  name: string;
  questions: Question[];
  studyMaterial?: StudyMaterial;
  timeLimitMinutes?: number;
}

export interface Chapter {
  id: string;
  name: string;
  tests: Test[];
  notes?: StudyMaterial;
}

export interface Subject {
  id: string;
  name: string;
  icon?: string;
  tests: Test[];
  chapters?: Chapter[];
}

export interface ExamCategory {
  id: string;
  name: string;
  icon: string;
  subjects?: Subject[]; // New: subjects for better organization
  tests?: Test[]; // Keep for backward compatibility
  pdfs: PDF[];
}

export interface PDF {
  id: string;
  name: string;
  year?: string;
  url?: string;
}

export interface TestPerformanceStats {
  correct: number;
  incorrect: number;
  unattempted: number;
  marks: number;
  totalMarks: number;
}

export interface TestResult {
  testId: string;
  categoryId: string;
  answers: (number | null)[];
  score: number;
  total: number;
  timestamp: number;
  mode?: 'normal' | 'realistic';
  markedForReview?: number[];
  durationSeconds?: number;
  marks?: number;
  totalMarks?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
}

export interface BookmarkedQuestion {
  id: string;
  categoryId: string;
  testId: string;
  questionId: string;
  questionText?: string; // stored for fallback resolution if question IDs change
  timestamp: number;
}