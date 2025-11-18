export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }
  
  export interface Test {
    id: string;
    name: string;
    questions: Question[];
  }

  export interface Subject {
    id: string;
    name: string;
    icon?: string;
    tests: Test[];
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
  }
  
  export interface TestResult {
    testId: string;
    categoryId: string;
    answers: number[];
    score: number;
    total: number;
    timestamp: number;
    mode?: 'normal' | 'realistic';
    markedForReview?: number[];
    durationSeconds?: number;
  }
  
  export interface BookmarkedQuestion {
    id: string;
    categoryId: string;
    testId: string;
    questionId: string;
    timestamp: number;
  }