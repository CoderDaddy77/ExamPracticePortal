import type { Question, TestPerformanceStats } from '../types';

export const CORRECT_MARKS = 5;
export const INCORRECT_PENALTY = 1;

export function evaluateTestPerformance(
  answers: (number | null)[],
  questions: Question[]
): TestPerformanceStats {
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  answers.forEach((answer, idx) => {
    if (answer === null || answer === undefined) {
      unattempted += 1;
      return;
    }
    if (answer === questions[idx].correctAnswer) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  });

  const marks = correct * CORRECT_MARKS - incorrect * INCORRECT_PENALTY;
  const totalMarks = questions.length * CORRECT_MARKS;

  return {
    correct,
    incorrect,
    unattempted,
    marks,
    totalMarks
  };
}

