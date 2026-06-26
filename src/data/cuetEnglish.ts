import type { Subject, Chapter } from '../types';

const readingComprehensionChapter: Chapter = {
  id: 'reading-comprehension',
  name: 'Reading Comprehension',
  tests: [
    {
      id: 'eng-test-1',
      name: 'Test 1 - Basic English',
      questions: [
        {
          id: 'cuet-eng-q1',
          question: 'Choose the correct article: ___ apple a day keeps the doctor away.',
          options: ['A', 'An', 'The', 'No article'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q2',
          question: 'Fill in the blank: She ___ to school every day.',
          options: ['go', 'goes', 'gone', 'going'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q3',
          question: 'Synonym of "happy" is',
          options: ['sad', 'angry', 'joyful', 'tired'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q4',
          question: 'Antonym of "big" is',
          options: ['small', 'huge', 'wide', 'tall'],
          correctAnswer: 0
        },
        {
          id: 'cuet-eng-q5',
          question: 'Choose the correctly spelt word',
          options: ['Definately', 'Definetely', 'Definitely', 'Defanitely'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q6',
          question: 'Fill in the blank: They ___ playing cricket now.',
          options: ['is', 'are', 'was', 'be'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q7',
          question: 'The plural of "child" is',
          options: ['childs', 'childes', 'children', 'childrens'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q8',
          question: 'Choose the correct preposition: He is good ___ maths.',
          options: ['in', 'at', 'on', 'with'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q9',
          question: 'Change to past tense: I write a letter.',
          options: ['I written a letter.', 'I wrote a letter.', 'I have wrote a letter.', 'I was write a letter.'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q10',
          question: 'Choose the correct synonym for "Diligent":',
          options: ['Lazy', 'Hardworking', 'Careless', 'Slow'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q11',
          question: 'Identify the part of speech of the word "quickly" in the sentence: "She runs quickly."',
          options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
          correctAnswer: 3
        },
        {
          id: 'cuet-eng-q12',
          question: 'What is the antonym of "Ancient"?',
          options: ['Old', 'Modern', 'Ancient', 'Historical'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q13',
          question: 'Choose the correct article: "He is ___ honest person."',
          options: ['a', 'an', 'the', 'no article'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q14',
          question: 'Which sentence is in the passive voice?',
          options: ['The cat chased the mouse', 'The mouse was chased by the cat', 'The cat is chasing the mouse', 'The mouse chases the cat'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q15',
          question: 'What is the meaning of the idiom "Break the ice"?',
          options: ['To break something frozen', 'To initiate conversation', 'To stop talking', 'To make someone angry'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q16',
          question: 'Choose the correct prefix to complete the word: "__possible"',
          options: ['un-', 'in-', 'im-', 'il-'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q17',
          question: 'Which is a countable noun?',
          options: ['Water', 'Rice', 'Book', 'Information'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q18',
          question: 'What is the superlative form of "good"?',
          options: ['Gooder', 'More good', 'Best', 'Most good'],
          correctAnswer: 2
        },
        {
          id: 'cuet-eng-q19',
          question: 'Identify the correct sentence:',
          options: ["She don't like coffee", "She doesn't like coffee", "She didn't likes coffee", "She doesn't likes coffee"],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q20',
          question: 'What is the past participle of "write"?',
          options: ['Wrote', 'Written', 'Writing', 'Writes'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q21',
          question: 'Choose the correct conjunction: "I was tired ___ I continued working."',
          options: ['and', 'but', 'or', 'so'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q22',
          question: 'Which word is a homophone of "sea"?',
          options: ['See', 'Seal', 'Seek', 'Seem'],
          correctAnswer: 0
        },
        {
          id: 'cuet-eng-q23',
          question: 'What is the correct spelling?',
          options: ['Neccessary', 'Necessary', 'Necesary', 'Neccesary'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q24',
          question: 'Choose the correct preposition: "The book is ___ the table."',
          options: ['in', 'on', 'at', 'by'],
          correctAnswer: 1
        },
        {
          id: 'cuet-eng-q25',
          question: 'What type of sentence is "Please close the door"?',
          options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
          correctAnswer: 2
        }
      ]
    }
  ]
};

export const cuetEnglishSubject: Subject = {
  id: 'english',
  name: 'English',
  tests: [],
  chapters: [readingComprehensionChapter]
};
