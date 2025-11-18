import type { ExamCategory } from '../types';

export const reasoningCategory: ExamCategory = {
  id: 'reasoning',
  name: 'Reasoning',
  icon: 'Brain',
  tests: [
    {
      id: 'test-1',
      name: 'Test 1 - Logical Reasoning',
      questions: [
        {
          id: 'reasoning-q1',
          question: 'If all roses are flowers and some flowers are red, which statement must be true?',
          options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
          correctAnswer: 3
        },
        {
          id: 'reasoning-q2',
          question: 'Complete the series: 2, 6, 12, 20, 30, ?',
          options: ['40', '42', '44', '46'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q3',
          question: 'If CAT is coded as 3120, how is DOG coded?',
          options: ['4157', '4156', '4158', '4159'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q4',
          question: 'A is taller than B, B is taller than C. Who is the shortest?',
          options: ['A', 'B', 'C', 'Cannot be determined'],
          correctAnswer: 2
        },
        {
          id: 'reasoning-q5',
          question: 'Find the odd one out: Apple, Banana, Carrot, Orange',
          options: ['Apple', 'Banana', 'Carrot', 'Orange'],
          correctAnswer: 2
        },
        {
          id: 'reasoning-q6',
          question: 'If 2 + 3 = 10, 3 + 4 = 21, then 4 + 5 = ?',
          options: ['30', '32', '34', '36'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q7',
          question: 'Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?',
          options: ['Sister', 'Mother', 'Aunt', 'Grandmother'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q8',
          question: 'Complete the series: AB, DE, GH, JK, ?',
          options: ['MN', 'LM', 'NO', 'OP'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q9',
          question: 'If RED is coded as 6, BLUE is coded as 10, then GREEN is coded as?',
          options: ['12', '14', '16', '18'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q10',
          question: 'A man walks 5 km north, then turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?',
          options: ['3 km', '5 km', '8 km', '10 km'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q11',
          question: 'Which number should replace the question mark: 2, 6, 12, 20, 30, ?',
          options: ['40', '42', '44', '46'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q12',
          question: 'If MANGO = 41315, then ORANGE = ?',
          options: ['619157', '619147', '619167', '619137'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q13',
          question: 'In a certain code, COMPUTER is written as DPNQVSU. How is KEYBOARD written in that code?',
          options: ['LFZCPBSE', 'LFZCPBSF', 'LFAZCPSE', 'LFZACPSE'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q14',
          question: 'A is the brother of B. C is the mother of B. D is the father of C. How is A related to D?',
          options: ['Grandson', 'Son', 'Brother', 'Nephew'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q15',
          question: 'Find the missing number: 3, 8, 15, 24, 35, ?',
          options: ['46', '48', '50', '52'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q16',
          question: 'If all squares are rectangles and some rectangles are circles, which statement must be true?',
          options: ['All squares are circles', 'Some squares are circles', 'No squares are circles', 'Cannot be determined'],
          correctAnswer: 3
        },
        {
          id: 'reasoning-q17',
          question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
          options: ['0°', '7.5°', '15°', '30°'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q18',
          question: 'If STUDENT = 123456, then TEACHER = ?',
          options: ['561234', '562134', '561324', '561432'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q19',
          question: 'Complete the analogy: Eye is to Sight as Ear is to ?',
          options: ['Sound', 'Hearing', 'Music', 'Voice'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q20',
          question: 'In a row of 25 students, A is 15th from the left and B is 10th from the right. How many students are between A and B?',
          options: ['0', '1', '2', '3'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q21',
          question: 'If 1 = 5, 2 = 10, 3 = 15, then 5 = ?',
          options: ['20', '25', '30', '1'],
          correctAnswer: 3
        },
        {
          id: 'reasoning-q22',
          question: 'Find the odd one out: 16, 25, 36, 49, 64',
          options: ['16', '25', '36', '49'],
          correctAnswer: 1
        },
        {
          id: 'reasoning-q23',
          question: 'A man is facing north. He turns 90° clockwise, then 180° anticlockwise, then 270° clockwise. Which direction is he facing now?',
          options: ['North', 'South', 'East', 'West'],
          correctAnswer: 2
        },
        {
          id: 'reasoning-q24',
          question: 'If today is Friday, what day will be after 61 days?',
          options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
          correctAnswer: 0
        },
        {
          id: 'reasoning-q25',
          question: 'Complete the series: 1, 4, 9, 16, 25, ?',
          options: ['30', '32', '36', '49'],
          correctAnswer: 2
        }
      ]
    }
  ],
  pdfs: []
};
