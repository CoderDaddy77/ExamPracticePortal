import type { ExamCategory } from '../types';
import { cuetPhysicsSubject } from './cuetPhysics';
import { cuetChemistrySubject } from './cuetChemistry';
import { cuetMathematicsSubject } from './cuetMathematics';
import { cuetEnglishSubject } from './cuetEnglish';
import { cuetGatSubject } from './cuetGAT';
import { uksscCategory } from './uksscCategory';
import { gkCategory } from './gkCategory';
import { currentAffairsCategory } from './currentAffairsCategory';
import { reasoningCategory } from './reasoningCategory';

// Increase this version whenever the bundled mock data structure/content changes.
export const DATA_VERSION = '2024-11-18';

export const examCategories: ExamCategory[] = [
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    icon: 'FileText',
    subjects: [
      {
        id: 'general-awareness',
        name: 'General Awareness',
        tests: [
          {
            id: 'test-1',
            name: 'Test 1 - General Awareness',
            questions: [
              {
                id: 'q1',
                question: 'Who is known as the Father of the Indian Constitution?',
                options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
                correctAnswer: 1
              },
              {
                id: 'q2',
                question: 'What is the capital of India?',
                options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'],
                correctAnswer: 2
              },
              {
                id: 'q3',
                question: 'Who was the first Prime Minister of India?',
                options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. B.R. Ambedkar'],
                correctAnswer: 1
              },
              {
                id: 'q4',
                question: 'Which river is known as the Ganga of the South?',
                options: ['Krishna', 'Godavari', 'Kaveri', 'Narmada'],
                correctAnswer: 1
              },
              {
                id: 'q5',
                question: 'What is the national animal of India?',
                options: ['Lion', 'Tiger', 'Elephant', 'Leopard'],
                correctAnswer: 1
              },
              {
                id: 'q6',
                question: 'In which year did India gain independence?',
                options: ['1945', '1946', '1947', '1948'],
                correctAnswer: 2
              },
              {
                id: 'q7',
                question: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                correctAnswer: 1
              },
              {
                id: 'q8',
                question: 'What is the largest ocean in the world?',
                options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
                correctAnswer: 3
              },
              {
                id: 'q9',
                question: 'Who discovered gravity?',
                options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'],
                correctAnswer: 1
              },
              {
                id: 'q10',
                question: 'What is the chemical symbol for water?',
                options: ['O2', 'H2O', 'CO2', 'HO2'],
                correctAnswer: 1
              },
              {
                id: 'q11',
                question: 'Which is the smallest country in the world?',
                options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
                correctAnswer: 1
              },
              {
                id: 'q12',
                question: 'What is the capital of Japan?',
                options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
                correctAnswer: 2
              },
              {
                id: 'q13',
                question: 'Which is the largest mammal in the world?',
                options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
                correctAnswer: 1
              },
              {
                id: 'q14',
                question: 'Who wrote the national anthem of India?',
                options: ['Bankim Chandra Chatterjee', 'Rabindranath Tagore', 'Mahatma Gandhi', 'Jawaharlal Nehru'],
                correctAnswer: 1
              },
              {
                id: 'q15',
                question: 'What is the currency of the United States?',
                options: ['Euro', 'Pound', 'Dollar', 'Yen'],
                correctAnswer: 2
              },
              {
                id: 'q16',
                question: 'Which is the largest desert in the world?',
                options: ['Sahara', 'Arabian', 'Gobi', 'Antarctica'],
                correctAnswer: 3
              },
              {
                id: 'q17',
                question: 'Who invented the telephone?',
                options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'],
                correctAnswer: 1
              },
              {
                id: 'q18',
                question: 'What is the highest mountain peak in the world?',
                options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
                correctAnswer: 2
              },
              {
                id: 'q19',
                question: 'Which country has the largest population?',
                options: ['India', 'China', 'United States', 'Indonesia'],
                correctAnswer: 1
              },
              {
                id: 'q20',
                question: 'What is the chemical symbol for gold?',
                options: ['Go', 'Gd', 'Au', 'Ag'],
                correctAnswer: 2
              },
              {
                id: 'q21',
                question: 'Which organ pumps blood in the human body?',
                options: ['Lungs', 'Brain', 'Heart', 'Liver'],
                correctAnswer: 2
              },
              {
                id: 'q22',
                question: 'How many continents are there in the world?',
                options: ['5', '6', '7', '8'],
                correctAnswer: 2
              },
              {
                id: 'q23',
                question: 'Which is the longest river in the world?',
                options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
                correctAnswer: 1
              },
              {
                id: 'q24',
                question: 'Who painted the Mona Lisa?',
                options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
                correctAnswer: 2
              },
              {
                id: 'q25',
                question: 'What is the capital of Australia?',
                options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
                correctAnswer: 2
              }
            ]
          }
        ]
      },
      {
        id: 'quantitative-aptitude',
        name: 'Quantitative Aptitude',
        tests: [
          {
            id: 'test-2',
            name: 'Test 1 - Quantitative Aptitude',
            questions: [
              {
                id: 'q1',
                question: 'What is 15% of 200?',
                options: ['25', '30', '35', '40'],
                correctAnswer: 1
              },
              {
                id: 'q2',
                question: 'If 3x + 5 = 20, what is x?',
                options: ['3', '4', '5', '6'],
                correctAnswer: 2
              },
              {
                id: 'q3',
                question: 'What is the value of √144?',
                options: ['10', '11', '12', '13'],
                correctAnswer: 2
              },
              {
                id: 'q4',
                question: 'A train travels 300 km in 4 hours. What is its speed?',
                options: ['60 km/h', '65 km/h', '70 km/h', '75 km/h'],
                correctAnswer: 3
              },
              {
                id: 'q5',
                question: 'What is 25% of 80?',
                options: ['15', '20', '25', '30'],
                correctAnswer: 1
              },
              {
                id: 'q6',
                question: 'If a:b = 3:4 and b = 12, what is a?',
                options: ['6', '8', '9', '10'],
                correctAnswer: 2
              },
              {
                id: 'q7',
                question: 'What is the simple interest on Rs. 5000 for 2 years at 5% per annum?',
                options: ['Rs. 400', 'Rs. 450', 'Rs. 500', 'Rs. 550'],
                correctAnswer: 2
              },
              {
                id: 'q8',
                question: 'The average of 5 numbers is 12. What is their sum?',
                options: ['48', '50', '60', '72'],
                correctAnswer: 2
              },
              {
                id: 'q9',
                question: 'What is 2/3 of 90?',
                options: ['45', '50', '55', '60'],
                correctAnswer: 3
              },
              {
                id: 'q10',
                question: 'If the selling price is Rs. 120 and profit is 20%, what is the cost price?',
                options: ['Rs. 90', 'Rs. 100', 'Rs. 110', 'Rs. 120'],
                correctAnswer: 1
              },
              {
                id: 'q11',
                question: 'What is the value of (2³)²?',
                options: ['16', '32', '64', '128'],
                correctAnswer: 2
              },
              {
                id: 'q12',
                question: 'A number when divided by 7 leaves remainder 3. If the number is 38, what is the quotient?',
                options: ['4', '5', '6', '7'],
                correctAnswer: 1
              },
              {
                id: 'q13',
                question: 'What is the LCM of 12 and 15?',
                options: ['30', '45', '60', '90'],
                correctAnswer: 2
              },
              {
                id: 'q14',
                question: 'If 5 workers can complete a job in 10 days, how many days will 10 workers take?',
                options: ['3 days', '4 days', '5 days', '6 days'],
                correctAnswer: 2
              },
              {
                id: 'q15',
                question: 'What is 30% of 250?',
                options: ['65', '70', '75', '80'],
                correctAnswer: 2
              },
              {
                id: 'q16',
                question: 'The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?',
                options: ['15', '18', '20', '25'],
                correctAnswer: 2
              },
              {
                id: 'q17',
                question: 'What is the area of a rectangle with length 8 cm and breadth 5 cm?',
                options: ['30 cm²', '35 cm²', '40 cm²', '45 cm²'],
                correctAnswer: 2
              },
              {
                id: 'q18',
                question: 'If x + 7 = 15, what is x?',
                options: ['6', '7', '8', '9'],
                correctAnswer: 2
              },
              {
                id: 'q19',
                question: 'What is 15% of 400?',
                options: ['50', '55', '60', '65'],
                correctAnswer: 2
              },
              {
                id: 'q20',
                question: 'A car travels 180 km in 3 hours. What is its speed?',
                options: ['50 km/h', '55 km/h', '60 km/h', '65 km/h'],
                correctAnswer: 2
              },
              {
                id: 'q21',
                question: 'What is the value of 5! (5 factorial)?',
                options: ['100', '110', '120', '130'],
                correctAnswer: 2
              },
              {
                id: 'q22',
                question: 'If the cost price is Rs. 80 and selling price is Rs. 100, what is the profit percentage?',
                options: ['20%', '25%', '30%', '35%'],
                correctAnswer: 1
              },
              {
                id: 'q23',
                question: 'What is the perimeter of a square with side 6 cm?',
                options: ['20 cm', '22 cm', '24 cm', '26 cm'],
                correctAnswer: 2
              },
              {
                id: 'q24',
                question: 'If 2x = 18, what is x?',
                options: ['7', '8', '9', '10'],
                correctAnswer: 2
              },
              {
                id: 'q25',
                question: 'What is 40% of 150?',
                options: ['50', '55', '60', '65'],
                correctAnswer: 2
              }
            ]
          }
        ]
      },
      {
        id: 'english',
        name: 'English',
        tests: []
      },
      {
        id: 'reasoning',
        name: 'Reasoning',
        tests: []
      }
    ],
    pdfs: [
      { id: 'pdf-1', name: 'SSC CHSL 2023 PYQ', year: 'Currently Not Available' },
      { id: 'pdf-2', name: 'SSC CHSL 2022 PYQ', year: 'Currently Not Available' }
    ]
  },
  {
    id: 'cuet',
    name: 'CUET',
    icon: 'GraduationCap',
    subjects: [
      {
        ...cuetPhysicsSubject
      },
      {
        ...cuetChemistrySubject
      },
      {
        ...cuetMathematicsSubject
      },
      {
        ...cuetEnglishSubject
      },
      {
        ...cuetGatSubject
      }
    ],
    pdfs: [
      { id: 'pdf-1', name: 'CUET 2024 PYQ', year: '2024' }
    ]
  },
  uksscCategory,
  gkCategory,
  currentAffairsCategory,
  reasoningCategory
];
