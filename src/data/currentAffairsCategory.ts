import type { ExamCategory } from '../types';

export const currentAffairsCategory: ExamCategory = {
  id: 'current-affairs',
  name: 'Current Affairs',
  icon: 'Newspaper',
  tests: [
    {
      id: 'test-1',
      name: 'Test 1 - November 2025',
      questions: [
        {
          id: 'ca-q1',
          question: 'Which country hosted the FIFA World Cup 2022?',
          options: ['Brazil', 'Qatar', 'Russia', 'South Africa'],
          correctAnswer: 1
        },
        {
          id: 'ca-q2',
          question: 'What is the name of India\'s first indigenous aircraft carrier?',
          options: ['INS Vikrant', 'INS Vikramaditya', 'INS Viraat', 'INS Vishal'],
          correctAnswer: 0
        },
        {
          id: 'ca-q3',
          question: 'Which organization is responsible for conducting elections in India?',
          options: ['Election Commission of India', 'Supreme Court', 'Parliament', 'President\'s Office'],
          correctAnswer: 0
        },
        {
          id: 'ca-q4',
          question: 'What is the full form of GST?',
          options: ['Goods and Services Tax', 'General Sales Tax', 'Government Service Tax', 'General Service Tax'],
          correctAnswer: 0
        },
        {
          id: 'ca-q5',
          question: 'Which Indian state has the longest coastline?',
          options: ['Tamil Nadu', 'Gujarat', 'Andhra Pradesh', 'Maharashtra'],
          correctAnswer: 1
        },
        {
          id: 'ca-q6',
          question: 'Who is the current Prime Minister of India (as of 2025)?',
          options: ['Rahul Gandhi', 'Narendra Modi', 'Amit Shah', 'Yogi Adityanath'],
          correctAnswer: 1
        },
        {
          id: 'ca-q7',
          question: 'Which country recently joined the BRICS group in 2024?',
          options: ['Argentina', 'Saudi Arabia', 'Egypt', 'All of the above'],
          correctAnswer: 3
        },
        {
          id: 'ca-q8',
          question: 'What is the name of India\'s latest space mission to the Sun?',
          options: ['Aditya-L1', 'Chandrayaan-3', 'Gaganyaan', 'Mangalyaan-2'],
          correctAnswer: 0
        },
        {
          id: 'ca-q9',
          question: 'Which Indian city hosted the G20 summit in 2023?',
          options: ['Mumbai', 'Delhi', 'New Delhi', 'Bangalore'],
          correctAnswer: 2
        },
        {
          id: 'ca-q10',
          question: 'The Ram Temple in Ayodhya was inaugurated in which year?',
          options: ['2023', '2024', '2025', '2022'],
          correctAnswer: 1
        },
        {
          id: 'ca-q11',
          question: 'Which technology company recently launched AI model "GPT-4"?',
          options: ['Google', 'Microsoft', 'OpenAI', 'Meta'],
          correctAnswer: 2
        },
        {
          id: 'ca-q12',
          question: 'Who won the 2023 ICC Cricket World Cup?',
          options: ['India', 'Australia', 'England', 'Pakistan'],
          correctAnswer: 1
        },
        {
          id: 'ca-q13',
          question: 'Which country became the first to land a rover on the far side of the Moon?',
          options: ['USA', 'Russia', 'China', 'India'],
          correctAnswer: 2
        },
        {
          id: 'ca-q14',
          question: 'What is the name of the new Indian Parliament building inaugurated in 2023?',
          options: ['Sansad Bhavan', 'Parliament Complex', 'Central Vista', 'Lok Sabha'],
          correctAnswer: 0
        },
        {
          id: 'ca-q15',
          question: 'Which Indian state recently implemented the Uniform Civil Code?',
          options: ['Uttar Pradesh', 'Gujarat', 'Uttarakhand', 'Maharashtra'],
          correctAnswer: 2
        },
        {
          id: 'ca-q16',
          question: 'The "Chandrayaan-3" mission successfully landed near which lunar region?',
          options: ['North Pole', 'South Pole', 'Equator', 'Far Side'],
          correctAnswer: 1
        },
        {
          id: 'ca-q17',
          question: 'Which country won the most medals in the 2024 Paris Olympics?',
          options: ['USA', 'China', 'Russia', 'France'],
          correctAnswer: 0
        },
        {
          id: 'ca-q18',
          question: 'What is the name of the new education policy implemented in India?',
          options: ['NEP 2020', 'NEP 2022', 'NEP 2023', 'NEP 2024'],
          correctAnswer: 0
        },
        {
          id: 'ca-q19',
          question: 'Which Indian city was declared as the first "World Heritage City" by UNESCO?',
          options: ['Jaipur', 'Varanasi', 'Ahmedabad', 'Delhi'],
          correctAnswer: 2
        },
        {
          id: 'ca-q20',
          question: 'The "Statue of Unity" is dedicated to which Indian leader?',
          options: ['Mahatma Gandhi', 'Sardar Patel', 'Jawaharlal Nehru', 'B.R. Ambedkar'],
          correctAnswer: 1
        },
        {
          id: 'ca-q21',
          question: 'Which country recently left the European Union in 2024?',
          options: ['France', 'Germany', 'Netherlands', 'None (Brexit already happened in 2020)'],
          correctAnswer: 3
        },
        {
          id: 'ca-q22',
          question: 'What is the name of the world\'s largest solar plant inaugurated in India?',
          options: ['Bhadla Solar Park', 'Pavagada Solar Park', 'Kurnool Solar Park', 'Rewa Solar Park'],
          correctAnswer: 0
        },
        {
          id: 'ca-q23',
          question: 'Which Indian satellite was launched for disaster management in 2023?',
          options: ['INSAT-3DS', 'RISAT-2B', 'GSAT-31', 'Cartosat-3'],
          correctAnswer: 0
        },
        {
          id: 'ca-q24',
          question: 'Who is the current President of the United States (as of 2025)?',
          options: ['Joe Biden', 'Donald Trump', 'Kamala Harris', 'Ron DeSantis'],
          correctAnswer: 0
        },
        {
          id: 'ca-q25',
          question: 'Which Indian state recently achieved 100% electrification of villages?',
          options: ['Kerala', 'Tamil Nadu', 'Gujarat', 'All states achieved this'],
          correctAnswer: 3
        }
      ]
    }
  ],
  pdfs: []
};
