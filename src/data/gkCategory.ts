import type { ExamCategory } from '../types';

export const gkCategory: ExamCategory = {
  id: 'gk',
  name: 'General Knowledge',
  icon: 'BookOpen',
  tests: [
    {
      id: 'test-1',
      name: 'Test 1 - World GK',
      questions: [
        {
          id: 'gk-q1',
          question: 'Which is the smallest country in the world by area?',
          options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
          correctAnswer: 1
        },
        {
          id: 'gk-q2',
          question: 'What is the longest river in the world?',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          correctAnswer: 1
        },
        {
          id: 'gk-q3',
          question: 'Which ocean is the largest?',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
          correctAnswer: 3
        },
        {
          id: 'gk-q4',
          question: 'Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
          correctAnswer: 2
        },
        {
          id: 'gk-q5',
          question: 'What is the currency of Japan?',
          options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
          correctAnswer: 2
        },
        {
          id: 'gk-q6',
          question: 'Which is the largest desert in the world?',
          options: ['Sahara', 'Arabian', 'Gobi', 'Antarctica'],
          correctAnswer: 3
        },
        {
          id: 'gk-q7',
          question: 'Who was the first person to walk on the moon?',
          options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'],
          correctAnswer: 1
        },
        {
          id: 'gk-q8',
          question: 'Which is the deepest ocean trench?',
          options: ['Java Trench', 'Mariana Trench', 'Puerto Rico Trench', 'Japan Trench'],
          correctAnswer: 1
        },
        {
          id: 'gk-q9',
          question: 'What is the capital of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
          correctAnswer: 2
        },
        {
          id: 'gk-q10',
          question: 'Which is the largest mammal in the world?',
          options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
          correctAnswer: 1
        },
        {
          id: 'gk-q11',
          question: 'Who invented the telephone?',
          options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'],
          correctAnswer: 1
        },
        {
          id: 'gk-q12',
          question: 'Which is the largest island in the world?',
          options: ['Madagascar', 'Greenland', 'Borneo', 'New Guinea'],
          correctAnswer: 1
        },
        {
          id: 'gk-q13',
          question: 'What is the highest mountain peak in the world?',
          options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
          correctAnswer: 2
        },
        {
          id: 'gk-q14',
          question: 'Which country has the largest population?',
          options: ['India', 'China', 'United States', 'Indonesia'],
          correctAnswer: 0
        },
        {
          id: 'gk-q15',
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 1
        },
        {
          id: 'gk-q16',
          question: 'What is the smallest continent by land area?',
          options: ['Europe', 'Australia', 'Antarctica', 'South America'],
          correctAnswer: 1
        },
        {
          id: 'gk-q17',
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1
        },
        {
          id: 'gk-q18',
          question: 'What is the largest country by land area?',
          options: ['Canada', 'China', 'United States', 'Russia'],
          correctAnswer: 3
        },
        {
          id: 'gk-q19',
          question: 'Who discovered penicillin?',
          options: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur', 'Robert Koch'],
          correctAnswer: 1
        },
        {
          id: 'gk-q20',
          question: 'Which is the longest mountain range in the world?',
          options: ['Himalayas', 'Andes', 'Rocky Mountains', 'Alps'],
          correctAnswer: 1
        },
        {
          id: 'gk-q21',
          question: 'What is the capital of Canada?',
          options: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
          correctAnswer: 3
        },
        {
          id: 'gk-q22',
          question: 'Which is the largest coral reef system in the world?',
          options: ['Belize Barrier Reef', 'Great Barrier Reef', 'Red Sea Coral Reef', 'Florida Reef'],
          correctAnswer: 1
        },
        {
          id: 'gk-q23',
          question: 'Who developed the theory of relativity?',
          options: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Niels Bohr'],
          correctAnswer: 1
        },
        {
          id: 'gk-q24',
          question: 'What is the largest volcano in the world?',
          options: ['Mount Fuji', 'Mount Kilimanjaro', 'Mauna Loa', 'Mount Vesuvius'],
          correctAnswer: 2
        },
        {
          id: 'gk-q25',
          question: 'Which country is known as the Land of the Rising Sun?',
          options: ['China', 'Japan', 'Thailand', 'South Korea'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'test-2',
      name: 'India GK #1',
      studyMaterial: {
        sections: [
          {
            id: 'important-rivers',
            title: 'Important Rivers of India :: Detailed Notes',
            content: 'Ganga – Longest river in India.\nYamuna – Largest tributary of Ganga.\nGodavari – Longest river of South India → Known as DAKSHIN GANGA. Rises from Trimbakeshwar, Nashik (Maharashtra). Tributaries: Penganga, Wainganga, Wardha, Manjira.\nKaveri – Known as the GANGES OF SOUTH INDIA. Rises at Talakaveri in Brahmagiri Hill, Western Ghats (Karnataka). Flows through Karnataka and Tamil Nadu. Third-largest river in South India (after Godavari and Krishna). Drains into Bay of Bengal.\nKrishna – Second-longest in South India. Originates in Western Ghats near Mahabaleshwar. Flows through Maharashtra, Karnataka, Telangana, Andhra Pradesh. Tributaries: Ghatprabha, Malprabha, Tungabhadra, Bhima, Musi.\nNarmada & Tapi – Flow westwards into the Arabian Sea.\nBrahmaputra – Called Tsangpo in Tibet; forms Majuli Island.\n\n⚠️ CONFUSION ALERT:\n• Kaveri = Ganges of South India (cultural/religious significance)\n• Godavari = Dakshin Ganga (longest in South India)\n\nHow to Remember:\nNorth → Ganga, South → Godavari (longest), Kaveri (sacred), West → Narmada/Tapi.'
          },
          {
            id: 'important-lakes',
            title: 'Important Lakes :: Simple Points',
            content: 'Wular Lake – Largest freshwater lake.\nChilika Lake – Largest saltwater lake.\nLoktak Lake – World\'s only floating lake.\nDal Lake – Famous for houseboats.\n\nMemory Tip:\nFresh = Wular, Salt = Chilika, Floating = Loktak.'
          },
          {
            id: 'famous-cities-titles',
            title: 'Famous Cities & Their Titles',
            content: 'Jaipur – Pink City.\nUdaipur – City of Lakes.\nMysuru – City of Palaces.\nKolkata – City of Joy.\nRishikesh – Yoga Capital of the World.\n\nTrick:\nLakes → Udaipur, Palaces → Mysuru, Joy → Kolkata.'
          },
          {
            id: 'indian-states-features',
            title: 'Indian States – Special Features',
            content: 'Kerala – Highest literacy, Spice Garden of India.\nGujarat – Longest coastline, Cotton leader.\nUttar Pradesh – Highest population.\nRajasthan – Largest state by area.\nGoa – Smallest state by area.\nAssam – Largest tea producer.\nKarnataka – Largest coffee producer.\n\nTip:\nTea = Assam, Coffee = Karnataka, Spices = Kerala.'
          },
          {
            id: 'mountains-passes',
            title: 'Mountains & Passes – Quick Notes',
            content: 'Aravalli – Oldest mountain range of India.\nHimalayas – Youngest fold mountains; northern boundary.\nNathu La Pass (Sikkim) – India–China trade route.\nUmling La (Ladakh) – Highest motorable road.\n\nEasy Trick:\nOldest = Aravalli; Highest road = Ladakh (Umling La).'
          },
          {
            id: 'national-parks-wildlife',
            title: 'National Parks & Wildlife – Basic Points',
            content: 'Jim Corbett – First national park of India (Uttarakhand).\nKaziranga – Famous for one-horned rhinoceros (Assam).\nSundarbans – Largest mangrove forest; Bengal tigers.\nSilent Valley – Kerala; biodiversity hotspot.\n\nTip:\nRhino = Kaziranga, Tiger = Sundarbans, First = Corbett.'
          },
          {
            id: 'important-monuments',
            title: 'Important Monuments',
            content: 'Taj Mahal – Symbol of Love; Agra.\nIndia Gate – New Delhi; war memorial.\nGateway of India – Mumbai; built to welcome British royals.\nQutub Minar – Tallest brick minaret.'
          },
          {
            id: 'space-science',
            title: 'Space & Science – Simple Info',
            content: 'ISRO HQ – Bengaluru.\nFirst Indian satellite – Aryabhata (1975).\nApsara Reactor – India\'s first nuclear reactor (Mumbai).\nMissile Man – APJ Abdul Kalam.\n\nTrick:\nSpace = Bengaluru, Satellite = Aryabhata, Missile = Kalam.'
          },
          {
            id: 'lines-boundaries',
            title: 'Important Lines & Boundaries',
            content: 'Radcliffe Line – India–Pakistan border.\nMcMahon Line – India–China (Arunachal Pradesh).\n\nSimple Trick:\nR-P (Radcliffe–Pakistan), M-C (McMahon–China).'
          },
          {
            id: 'indian-economy',
            title: 'Indian Economy – Easy Facts',
            content: 'Coal – Main energy source of India.\nJharkhand – Biggest coal producer.\nMundra Port (Gujarat) – Largest port in India.'
          },
          {
            id: 'festivals-india',
            title: 'Festivals of India – Quick Notes',
            content: 'Diwali – Festival of Lights.\nHoli – Festival of Colors.\nOnam (Kerala) – Harvest festival.\nBihu (Assam) – Assamese festival.'
          },
          {
            id: 'constitution-polity',
            title: 'Basic Constitution & Polity Facts',
            content: 'Republic Day – 26 January 1950.\nIndependence Day – 15 August 1947.\nConstitution Day – 26 November.\nParliament – Located in New Delhi.'
          },
          {
            id: 'national-symbols',
            title: 'National Symbols',
            content: 'Elephant – National Heritage animal.\nBengal Tiger – National animal.\nPeacock – National bird.\nLotus – National flower.\nGanges Dolphin – National aquatic animal.\nSaka Calendar – National calendar.'
          },
          {
            id: 'revision-trick',
            title: 'Perfect Revision Trick (Very easy): "3-3-3 Rule"',
            content: 'Learn:\n3 Rivers → Ganga, Godavari, Narmada\n3 States → Kerala, Gujarat, Rajasthan\n3 Cities → Jaipur, Udaipur, Mysuru\n3 Parks → Corbett, Kaziranga, Sundarbans\n3 Symbols → Tiger, Peacock, Lotus\n\nIf you nail these, you automatically remember 60% GK.'
          }
        ],
        lastUpdated: Date.now()
      },
      questions: [
        {
          id: 'india-gk-1',

          question: 'Which river is known as the Sorrow of Bihar?',
          options: ['Ganga', 'Kosi', 'Yamuna', 'Son'],
          correctAnswer: 1,
          explanation: 'Kosi River causes frequent floods in Bihar, so it is called the Sorrow of Bihar.'
        },
        {
          id: 'india-gk-2',
          question: 'Which plateau is called the Roof of the World?',
          options: ['Tibetan Plateau', 'Deccan Plateau', 'Chota Nagpur Plateau', 'Ladakh Plateau'],
          correctAnswer: 0,
          explanation: 'The Tibetan Plateau is the highest and largest plateau, known as the Roof of the World.'
        },
        {
          id: 'india-gk-3',
          question: 'Where is ISRO headquarters located?',
          options: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi'],
          correctAnswer: 2,
          explanation: 'ISRO headquarters is located in Bengaluru, Karnataka.'
        },
        {
          id: 'india-gk-4',
          question: 'Tropic of Cancer passes through how many Indian states?',
          options: ['6', '7', '8', '9'],
          correctAnswer: 2,
          explanation: 'Tropic of Cancer passes through 9 Indian states.'
        },
        {
          id: 'india-gk-5',
          question: 'Which is the largest freshwater lake in India?',
          options: ['Dal Lake', 'Wular Lake', 'Chilika Lake', 'Pulicat Lake'],
          correctAnswer: 1,
          explanation: 'Wular Lake in Jammu & Kashmir is the largest freshwater lake of India.'
        },
        {
          id: 'india-gk-6',
          question: 'What is the southernmost tip of Indian mainland?',
          options: ['Indira Point', 'Kanyakumari', 'Rameswaram', 'Kovalam'],
          correctAnswer: 1,
          explanation: 'Kanyakumari is the southernmost point of Indian mainland.'
        },
        {
          id: 'india-gk-7',
          question: 'Which river is known as Dakshin Ganga?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Yamuna'],
          correctAnswer: 0,
          explanation: 'Godavari is the second longest river and is called the Dakshin Ganga.'
        },
        {
          id: 'india-gk-8',
          question: 'What is the largest saltwater lake in India?',
          options: ['Sambhar Lake', 'Wular Lake', 'Chilika Lake', 'Loktak Lake'],
          correctAnswer: 2,
          explanation: 'Chilika Lake in Odisha is the largest saltwater lagoon in India.'
        },
        {
          id: 'india-gk-9',
          question: 'Which is the only floating lake in the world?',
          options: ['Wular Lake', 'Loktak Lake', 'Dal Lake', 'Chilika Lake'],
          correctAnswer: 1,
          explanation: 'Loktak Lake in Manipur is the world\'s only floating lake.'
        },
        {
          id: 'india-gk-10',
          question: 'Where was India\'s first IIT established?',
          options: ['IIT Delhi', 'IIT Bombay', 'IIT Kharagpur', 'IIT Madras'],
          correctAnswer: 2,
          explanation: 'India\'s first IIT was established at Kharagpur in 1951.'
        },
        {
          id: 'india-gk-11',
          question: 'When is National Science Day celebrated in India?',
          options: ['15 August', '28 February', '5 June', '14 April'],
          correctAnswer: 1,
          explanation: 'National Science Day is celebrated on 28 February to honour Raman Effect discovery.'
        },
        {
          id: 'india-gk-12',
          question: 'Silent Valley National Park is located in which state?',
          options: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Odisha'],
          correctAnswer: 1,
          explanation: 'Silent Valley National Park is located in Kerala.'
        },
        {
          id: 'india-gk-13',
          question: 'What is the main source of energy in India?',
          options: ['Coal', 'Solar', 'Wind', 'Hydro'],
          correctAnswer: 0,
          explanation: 'Coal is still the major energy source used for electricity in India.'
        },
        {
          id: 'india-gk-14',
          question: 'Which line divides India and Pakistan?',
          options: ['McMahon Line', 'Radcliffe Line', 'Durand Line', 'Maginot Line'],
          correctAnswer: 1,
          explanation: 'Radcliffe Line was drawn in 1947 to divide India and Pakistan.'
        },
        {
          id: 'india-gk-15',
          question: 'How many states are there in India?',
          options: ['27', '28', '29', '30'],
          correctAnswer: 1,
          explanation: 'India has 28 states as of the current administrative division.'
        },
        {
          id: 'india-gk-16',
          question: 'Which is a tributary of the Ganga?',
          options: ['Narmada', 'Yamuna', 'Luni', 'Indus'],
          correctAnswer: 1,
          explanation: 'Yamuna is the largest tributary of the Ganga.'
        },
        {
          id: 'india-gk-17',
          question: 'Which is the longest river in India?',
          options: ['Godavari', 'Ganga', 'Yamuna', 'Brahmaputra'],
          correctAnswer: 1,
          explanation: 'Ganga is the longest river within India\'s boundaries.'
        },
        {
          id: 'india-gk-18',
          question: 'Which city is known as the City of Lakes?',
          options: ['Jaipur', 'Udaipur', 'Bhopal', 'Mysuru'],
          correctAnswer: 1,
          explanation: 'Udaipur in Rajasthan is famous for its artificial lakes, earning the name City of Lakes.'
        },
        {
          id: 'india-gk-19',
          question: 'Which Indian state has the longest coastline?',
          options: ['Tamil Nadu', 'Kerala', 'Gujarat', 'Andhra Pradesh'],
          correctAnswer: 2,
          explanation: 'Gujarat has the longest coastline in India.'
        },
        {
          id: 'india-gk-20',
          question: 'Highest mountain peak in India is?',
          options: ['Mount Everest', 'Nanda Devi', 'Kanchenjunga', 'Annapurna'],
          correctAnswer: 2,
          explanation: 'Kanchenjunga is the highest peak in India (though Everest is higher, it lies in Nepal).'
        },
        {
          id: 'india-gk-21',
          question: 'Which city is known as the Pink City of India?',
          options: ['Delhi', 'Jaipur', 'Jodhpur', 'Bikaner'],
          correctAnswer: 1,
          explanation: 'Jaipur\'s buildings were painted pink to welcome Prince Albert in 1876. Pink = hospitality → helps memory.'
        },
        {
          id: 'india-gk-22',
          question: 'Which state is known as the Spice Garden of India?',
          options: ['Kerala', 'Assam', 'Sikkim', 'Tamil Nadu'],
          correctAnswer: 0,
          explanation: 'Kerala grows cardamom, pepper, cloves — major spices → "Kitchen of Spices."'
        },
        {
          id: 'india-gk-23',
          question: 'Which is the longest highway in India?',
          options: ['NH 44', 'NH 27', 'NH 48', 'NH 19'],
          correctAnswer: 0,
          explanation: 'NH 44 runs from Kashmir to Kanyakumari → longest north-south route → remember "Top to Bottom = 44."'
        },
        {
          id: 'india-gk-24',
          question: 'Which river is the longest in South India?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Periyar'],
          correctAnswer: 0,
          explanation: 'Godavari is called "South Ganga" because of its length and importance.'
        },
        {
          id: 'india-gk-25',
          question: 'Where is the Indian Parliament located?',
          options: ['Hyderabad', 'New Delhi', 'Mumbai', 'Kolkata'],
          correctAnswer: 1,
          explanation: 'New Delhi is India\'s political capital where Parliament House (Sansad Bhavan) stands.'
        },
        {
          id: 'india-gk-26',
          question: 'Which festival is known as the Festival of Lights?',
          options: ['Holi', 'Diwali', 'Eid', 'Pongal'],
          correctAnswer: 1,
          explanation: 'Celebrated with diyas, lamps, and fireworks → lights everywhere → simple to recall.'
        },
        {
          id: 'india-gk-27',
          question: 'Which Indian state is the largest by area?',
          options: ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'],
          correctAnswer: 0,
          explanation: 'Largest desert + largest area → Rajasthan = "Raja-size state."'
        },
        {
          id: 'india-gk-28',
          question: 'Which city is known as the Silicon Valley of India?',
          options: ['Chennai', 'Bengaluru', 'Pune', 'Hyderabad'],
          correctAnswer: 1,
          explanation: 'India\'s IT hub → tech companies → innovation → hence "Silicon Valley of India."'
        },
        {
          id: 'india-gk-29',
          question: 'The national animal of India is?',
          options: ['Tiger', 'Lion', 'Elephant', 'Peacock'],
          correctAnswer: 0,
          explanation: 'Bengal Tiger represents strength and courage → chosen as national animal.'
        },
        {
          id: 'india-gk-30',
          question: 'Which monument is also called the Symbol of Love?',
          options: ['Hawa Mahal', 'Taj Mahal', 'India Gate', 'Red Fort'],
          correctAnswer: 1,
          explanation: 'Built by Shah Jahan for Mumtaz → world\'s most famous symbol of love.'
        },
        {
          id: 'india-gk-31',
          question: 'Who is known as the Missile Man of India?',
          options: ['APJ Abdul Kalam', 'Vikram Sarabhai', 'Homi Bhabha', 'CV Raman'],
          correctAnswer: 0,
          explanation: 'Key role in missile development (Agni, Prithvi) → hence "Missile Man."'
        },
        {
          id: 'india-gk-32',
          question: 'Which state is famous for the Sun Temple at Konark?',
          options: ['Odisha', 'Bihar', 'Gujarat', 'Tripura'],
          correctAnswer: 0,
          explanation: 'Konark Sun Temple shaped like a giant chariot → located in Odisha\'s Puri district.'
        },
        {
          id: 'india-gk-33',
          question: 'Which is the smallest state in India by area?',
          options: ['Sikkim', 'Goa', 'Tripura', 'Nagaland'],
          correctAnswer: 1,
          explanation: 'Small coastal state but rich tourism → easiest to remember as smallest by area.'
        },
        {
          id: 'india-gk-34',
          question: 'Which river is known as the Ganga of the South?',
          options: ['Godavari', 'Kaveri', 'Krishna', 'Mahanadi'],
          correctAnswer: 1,
          explanation: 'Kaveri\'s importance in southern culture = like Ganga in North → called South Ganga.'
        },
        {
          id: 'india-gk-35',
          question: 'Which state is the largest producer of tea in India?',
          options: ['Kerala', 'West Bengal', 'Assam', 'Karnataka'],
          correctAnswer: 2,
          explanation: 'Assam\'s tea gardens produce more than half of India\'s tea → world famous.'
        },
        {
          id: 'india-gk-36',
          question: 'India\'s national song "Vande Mataram" is written by?',
          options: ['Tagore', 'Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Subhas Chandra Bose'],
          correctAnswer: 1,
          explanation: '"Vande Mataram" appeared in his novel Anandamath.'
        },
        {
          id: 'india-gk-37',
          question: 'Where is the Gateway of India located?',
          options: ['Chennai', 'Mumbai', 'Kochi', 'Kolkata'],
          correctAnswer: 1,
          explanation: 'Gateway of India built to welcome British royals → iconic landmark of Mumbai.'
        },
        {
          id: 'india-gk-38',
          question: 'Which is the national aquatic animal of India?',
          options: ['Dolphin', 'Crocodile', 'Tortoise', 'Fish'],
          correctAnswer: 0,
          explanation: 'Ganges River Dolphin is endangered and symbolizes river ecosystem health.'
        },
        {
          id: 'india-gk-39',
          question: 'Which mountain range forms the northern boundary of India?',
          options: ['Aravalli', 'Himalayas', 'Western Ghats', 'Satpura'],
          correctAnswer: 1,
          explanation: 'Tallest mountains in the world → natural northern wall of India.'
        },
        {
          id: 'india-gk-40',
          question: 'Which state is known as the Land of Rising Sun in India?',
          options: ['Arunachal Pradesh', 'Nagaland', 'Manipur', 'Tripura'],
          correctAnswer: 0,
          explanation: 'India\'s far-east state → first to receive sunrise → "Land of Rising Sun."'
        },
        {
          id: 'india-gk-41',
          question: 'Which dam is the tallest dam in India?',
          options: ['Bhakra Dam', 'Tehri Dam', 'Hirakud Dam', 'Nagarjuna Sagar Dam'],
          correctAnswer: 1,
          explanation: 'Tehri Dam on Bhagirathi River is India\'s tallest dam at 260.5 meters.'
        },
        {
          id: 'india-gk-42',
          question: 'Who was the first Indian to go to space?',
          options: ['Kalpana Chawla', 'Rakesh Sharma', 'Sunita Williams', 'APJ Abdul Kalam'],
          correctAnswer: 1,
          explanation: 'Rakesh Sharma went to space in 1984 on the Soviet Soyuz T-11 mission.'
        },
        {
          id: 'india-gk-43',
          question: 'Which state is the largest producer of rubber in India?',
          options: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Assam'],
          correctAnswer: 2,
          explanation: 'Kerala produces over 90% of India\'s rubber due to ideal tropical climate.'
        },
        {
          id: 'india-gk-44',
          question: 'The Golden Temple is located in which city?',
          options: ['Amritsar', 'Chandigarh', 'Ludhiana', 'Delhi'],
          correctAnswer: 0,
          explanation: 'Golden Temple (Harmandir Sahib) is the holiest shrine in Sikhism located in Amritsar.'
        },
        {
          id: 'india-gk-45',
          question: 'Which is the highest peak in South India?',
          options: ['Ooty Peak', 'Anai Mudi', 'Dodda Betta', 'Mullayanagiri'],
          correctAnswer: 1,
          explanation: 'Anai Mudi in Kerala at 2,695 meters is the highest peak in South India.'
        },
        {
          id: 'india-gk-46',
          question: 'Who is known as the Iron Man of India?',
          options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel', 'Subhas Chandra Bose'],
          correctAnswer: 2,
          explanation: 'Sardar Patel united 562 princely states into India → called Iron Man.'
        },
        {
          id: 'india-gk-47',
          question: 'Which city is known as the Electronic City of India?',
          options: ['Chennai', 'Hyderabad', 'Bengaluru', 'Pune'],
          correctAnswer: 2,
          explanation: 'Bengaluru has a dedicated Electronic City industrial park → hub of IT and electronics.'
        },
        {
          id: 'india-gk-48',
          question: 'Which river is known as the Vridha Ganga?',
          options: ['Godavari', 'Kaveri', 'Krishna', 'Narmada'],
          correctAnswer: 0,
          explanation: 'Godavari is called Vridha Ganga (Old Ganga) due to its religious significance in South India.'
        },
        {
          id: 'india-gk-49',
          question: 'Which is the first hill station in India?',
          options: ['Shimla', 'Darjeeling', 'Ooty', 'Nainital'],
          correctAnswer: 0,
          explanation: 'Shimla was established as India\'s first hill station by the British in 1822.'
        },
        {
          id: 'india-gk-50',
          question: 'Which state has the highest number of tiger reserves?',
          options: ['Karnataka', 'Maharashtra', 'Madhya Pradesh', 'Assam'],
          correctAnswer: 2,
          explanation: 'Madhya Pradesh has 6 tiger reserves → called the Tiger State of India.'
        }
      ]
    },
    {
      id: 'test-3',
      name: 'India GK #2',
      studyMaterial: {
        sections: [
          {
            id: 'rivers-of-india',
            title: 'Important Rivers of India',
            content: 'Ganga – Longest river in India (within India).\nBrahmaputra – Called Tsangpo in Tibet; forms Majuli, the world\'s largest river island.\nGodavari – Longest river of South India → Dakshin Ganga.\nKaveri – Cultural river of South India → irrigates TN & Karnataka.\nNarmada – West-flowing river; forms Dhuandhar Falls.\nKrishna – Important for Maharashtra, Karnataka, Telangana, AP.\nYamuna – Largest tributary of Ganga.\n\n💡 Memory Trick: Ganga–North, Godavari–South, Narmada–West (NGN Rule).'
          },
          {
            id: 'states-titles',
            title: 'Important States & Their Titles',
            content: 'Kerala – Spice Garden of India; Highest Literacy; Largest Spice Producer.\nGujarat – Longest Coastline; Largest Cotton Producer; Home to Mundra Port.\nPunjab – Land of Five Rivers.\nRajasthan – Largest state by area; Contains Thar Desert.\nUttar Pradesh – Most populous; major wheat producer.\nAssam – Largest tea producer.\nKarnataka – Largest coffee producer.\nArunachal Pradesh – Land of Rising Sun.\n\n💡 If it\'s about tea → Assam; Coffee → Karnataka; Spices → Kerala.'
          },
          {
            id: 'geography-highlights',
            title: 'Indian Geography Highlights',
            content: 'Aravalli Range – Oldest mountain range (older than Himalayas).\nHimalayas – Northern boundary of India.\nThar Desert – Largest hot desert of India (Rajasthan).\nUmling La (Ladakh) – Highest motorable road in the world.\nSundarbans – Largest mangrove forest.\nWular Lake – Largest freshwater lake.\nChilika Lake – Largest saltwater lake.\nLoktak Lake – Only floating lake.\n\n💡 Floating = Lok(tak) → think "float-tak".'
          },
          {
            id: 'national-parks',
            title: 'Important National Parks & Biospheres',
            content: 'Jim Corbett NP – First national park & oldest tiger reserve.\nKaziranga NP – Famous for one-horned rhinoceros.\nNilgiri Biosphere – India\'s first biosphere reserve.\nSilent Valley NP (Kerala) – Biodiversity hotspot.\nSundarbans – Home of Royal Bengal tigers.\n\n💡 Corbett = First; Kaziranga = Rhino; Sundarbans = Tiger.'
          },
          {
            id: 'history-personalities',
            title: 'Indian History & Personalities',
            content: 'Indira Gandhi – First woman PM of India.\nAPJ Abdul Kalam – Missile Man of India.\nM.S. Swaminathan – Father of Green Revolution.\nBankim Chandra Chatterjee – Wrote Vande Mataram.\nRabindranath Tagore – Wrote Jana Gana Mana (national anthem).\n\n💡 Green Revolution → Swaminathan; Milk Revolution → Kurien; Space → Sarabhai.'
          },
          {
            id: 'space-science',
            title: 'Space & Science',
            content: 'ISRO HQ – Bengaluru.\nFirst satellite – Aryabhata (1975).\nApsara Reactor – First nuclear reactor (Mumbai).\nAgni Missile – Means "Fire".\n\n💡 If it\'s space or rockets → most answers point to Bengaluru or Kalam.'
          },
          {
            id: 'monuments-cities',
            title: 'Important Monuments & Cities',
            content: 'Taj Mahal – Symbol of Love.\nGateway of India – Mumbai.\nMysuru – City of Palaces.\nJaipur – Pink City.\nUdaipur – City of Lakes.\nRishikesh – Yoga Capital of the World.\nDhanbad – Coal Capital.\n\n💡 Cities with nicknames are always asked in exams—learn 1–2/day.'
          },
          {
            id: 'economy-resources',
            title: 'Indian Economy & Resources',
            content: 'Coal – Main energy source of India.\nJharkhand – Largest coal producer.\nMaharashtra/Gujarat – Major industrial hubs.\nKerala – Digital-first state and leader in social indicators.'
          },
          {
            id: 'national-symbols',
            title: 'National Symbols',
            content: 'National Animal – Tiger\nNational Heritage Animal – Elephant\nNational Aquatic Animal – Ganges Dolphin\nNational Bird – Peacock\nNational Calendar – Saka Calendar\n\n💡 Heritage → Elephant (grand + ancient). Aquatic → Dolphin (Ganges).'
          },
          {
            id: 'government-constitution',
            title: 'Government & Constitution',
            content: 'Republic Day – 26 January 1950 (constitution enforcement).\nFirst IIT – Kharagpur.\nParliament – New Delhi.\nRadcliffe Line – Dividing line between India & Pakistan.'
          },
          {
            id: 'ports-transport-dams',
            title: 'Ports, Transport & Dams',
            content: 'Mundra Port – India\'s largest port.\nHirakud Dam – Longest dam.\nTehri Dam – Tallest dam.\nHubli – Longest railway platform.\n\n💡 H for Himachal? No. H for Hirakud & Hubli → long.'
          },
          {
            id: 'memory-tips',
            title: 'Memory Techniques',
            content: '🔹 Use the "One Keyword One Memory" Technique\nGanga → Longest\nGodavari → South Ganga\nAravalli → Oldest\nSundarbans → Mangrove\nGujarat → Coastline\nKerala → Spice/Literacy\nAssam → Tea\nKarnataka → Coffee\nUdaipur → Lakes\n\n🔹 Make small stories\nExample:\n"A tiger swims in Sundarbans (mangrove), walks to Corbett (first NP), and drinks water from Godavari (Dakshin Ganga)."\n\n🔹 Use associations\nRising Sun → East → Arunachal Pradesh\nPink City → Jaipur → Buildings painted pink\nYoga → Rishikesh'
          }
        ],
        lastUpdated: Date.now()
      },
      questions: [
        {
          id: 'india-gk2-1',
          question: 'Which is the oldest mountain range in India?',
          options: ['Aravalli', 'Himalayas', 'Vindhya', 'Satpura'],
          correctAnswer: 0,
          explanation: 'Oldest; even older than Himalayas — remember "Aravalli = Ancient."'
        },
        {
          id: 'india-gk2-2',
          question: 'Which Indian state has the highest literacy rate?',
          options: ['Kerala', 'Goa', 'Mizoram', 'Tamil Nadu'],
          correctAnswer: 0,
          explanation: 'Highest literacy due to early education reforms & missionary schools.'
        },
        {
          id: 'india-gk2-3',
          question: 'The largest mangrove forest in India is?',
          options: ['Bhitarkanika', 'Sundarbans', 'Pichavaram', 'Coringa'],
          correctAnswer: 1,
          explanation: 'World\'s largest mangrove + Royal Bengal tigers = easy recall.'
        },
        {
          id: 'india-gk2-4',
          question: 'Who was the first woman Prime Minister of India?',
          options: ['Indira Gandhi', 'Sarojini Naidu', 'Pratibha Patil', 'Vijay Laxmi Pandit'],
          correctAnswer: 0,
          explanation: 'Only woman PM of India so far — unforgettable fact.'
        },
        {
          id: 'india-gk2-5',
          question: 'Which city is known as the Manchester of India?',
          options: ['Surat', 'Ahmedabad', 'Kanpur', 'Coimbatore'],
          correctAnswer: 1,
          explanation: 'Manchester = textile hub → Ahmedabad has largest mills.'
        },
        {
          id: 'india-gk2-6',
          question: 'What is the national heritage animal of India?',
          options: ['Tiger', 'Elephant', 'Lion', 'Camel'],
          correctAnswer: 1,
          explanation: 'Symbol of heritage, culture & strength — chosen as heritage animal.'
        },
        {
          id: 'india-gk2-7',
          question: 'Which Indian state is the largest producer of wheat?',
          options: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan'],
          correctAnswer: 2,
          explanation: 'Indo-Gangetic plains → ideal for wheat production.'
        },
        {
          id: 'india-gk2-8',
          question: 'Where is India\'s only active volcano located?',
          options: ['Nicobar', 'Barren Island', 'Lakshadweep', 'Minicoy'],
          correctAnswer: 1,
          explanation: 'India\'s only active volcano in Andamans.'
        },
        {
          id: 'india-gk2-9',
          question: 'Who discovered the sea route to India?',
          options: ['Columbus', 'Vasco da Gama', 'Magellan', 'Marco Polo'],
          correctAnswer: 1,
          explanation: 'Reached Calicut in 1498 — opening sea trade route.'
        },
        {
          id: 'india-gk2-10',
          question: 'Which river forms the Dhuandhar Falls?',
          options: ['Ganga', 'Godavari', 'Narmada', 'Yamuna'],
          correctAnswer: 2,
          explanation: 'Dhuandhar = misty waterfall in Jabalpur → Narmada flows there.'
        },
        {
          id: 'india-gk2-11',
          question: 'Which is the longest dam in India?',
          options: ['Hirakud Dam', 'Bhakra Nangal', 'Tehri Dam', 'Sardar Sarovar'],
          correctAnswer: 0,
          explanation: 'Longest earth dam in Odisha, across Mahanadi.'
        },
        {
          id: 'india-gk2-12',
          question: 'Which Indian state is known as the Land of Five Rivers?',
          options: ['Punjab', 'Haryana', 'Rajasthan', 'Gujarat'],
          correctAnswer: 0,
          explanation: 'Punjab = 5 rivers — name itself means "Panj (5) + Aab (water)."'
        },
        {
          id: 'india-gk2-13',
          question: 'Where is India\'s first nuclear reactor "Apsara" located?',
          options: ['Delhi', 'Kalpakkam', 'Mumbai', 'Kota'],
          correctAnswer: 2,
          explanation: 'Apsara was built in BARC, Trombay.'
        },
        {
          id: 'india-gk2-14',
          question: 'Which is the longest national waterway in India?',
          options: ['NW-1', 'NW-2', 'NW-5', 'NW-3'],
          correctAnswer: 0,
          explanation: 'Allahabad to Haldia → longest waterway (1,620 km).'
        },
        {
          id: 'india-gk2-15',
          question: 'Who is known as the Father of Green Revolution in India?',
          options: ['M.S. Swaminathan', 'Norman Borlaug', 'Varghese Kurien', 'APJ Abdul Kalam'],
          correctAnswer: 0,
          explanation: 'Green Revolution = high-yield wheat + irrigation + fertilizers.'
        },
        {
          id: 'india-gk2-16',
          question: 'Which pass connects India to China in Sikkim?',
          options: ['Nathu La', 'Shipki La', 'Jelep La', 'Zoji La'],
          correctAnswer: 0,
          explanation: 'India-China trade pass in Sikkim.'
        },
        {
          id: 'india-gk2-17',
          question: 'Largest coal-producing state of India?',
          options: ['Jharkhand', 'Odisha', 'Chhattisgarh', 'West Bengal'],
          correctAnswer: 0,
          explanation: 'Has most coal mines — especially Jharia & Bokaro.'
        },
        {
          id: 'india-gk2-18',
          question: 'Which state is the largest producer of cotton in India?',
          options: ['Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Rajasthan'],
          correctAnswer: 1,
          explanation: 'Dry climate = best for cotton; largest producer.'
        },
        {
          id: 'india-gk2-19',
          question: 'Which Indian river flows westward?',
          options: ['Ganga', 'Yamuna', 'Narmada', 'Brahmaputra'],
          correctAnswer: 2,
          explanation: 'One of few west-flowing rivers; empties into Arabian Sea.'
        },
        {
          id: 'india-gk2-20',
          question: 'Which city is known as the Yoga Capital of the World?',
          options: ['Haridwar', 'Rishikesh', 'Varanasi', 'Bodh Gaya'],
          correctAnswer: 1,
          explanation: 'World-famous yoga training destination.'
        },
        {
          id: 'india-gk2-21',
          question: 'Which Indian state has the highest population?',
          options: ['UP', 'Bihar', 'Maharashtra', 'MP'],
          correctAnswer: 0,
          explanation: 'Most populous state — over 20 crore people.'
        },
        {
          id: 'india-gk2-22',
          question: 'Where is India\'s highest road (Umling La Pass) located?',
          options: ['Ladakh', 'Sikkim', 'Uttarakhand', 'Himachal Pradesh'],
          correctAnswer: 0,
          explanation: 'Umling La at 19,024 ft → world\'s highest motorable road.'
        },
        {
          id: 'india-gk2-23',
          question: 'Which is the largest stadium in India?',
          options: ['Wankhede', 'Eden Gardens', 'Narendra Modi Stadium', 'Chinnaswamy'],
          correctAnswer: 2,
          explanation: 'World\'s largest cricket stadium — located in Ahmedabad.'
        },
        {
          id: 'india-gk2-24',
          question: 'Which state is famous for the Hornbill Festival?',
          options: ['Nagaland', 'Manipur', 'Assam', 'Mizoram'],
          correctAnswer: 0,
          explanation: 'Hornbill = famous tribal festival.'
        },
        {
          id: 'india-gk2-25',
          question: 'Which is the oldest tiger reserve in India?',
          options: ['Corbett', 'Kanha', 'Bandipur', 'Sariska'],
          correctAnswer: 0,
          explanation: 'India\'s first tiger reserve — named after Jim Corbett.'
        },
        {
          id: 'india-gk2-26',
          question: 'Which river is called the Lifeline of Madhya Pradesh?',
          options: ['Narmada', 'Son', 'Tapi', 'Betwa'],
          correctAnswer: 0,
          explanation: 'Flows across MP; major water source → lifeline.'
        },
        {
          id: 'india-gk2-27',
          question: 'Which state is the largest producer of spices?',
          options: ['Kerala', 'Karnataka', 'Rajasthan', 'Gujarat'],
          correctAnswer: 0,
          explanation: 'Spice heaven — pepper, cardamom, cinnamon.'
        },
        {
          id: 'india-gk2-28',
          question: 'India\'s first National Park is?',
          options: ['Jim Corbett NP', 'Kaziranga NP', 'Gir NP', 'Kanha NP'],
          correctAnswer: 0,
          explanation: 'India\'s oldest national park (1936).'
        },
        {
          id: 'india-gk2-29',
          question: 'Which state is known as the Land of Rising Sun?',
          options: ['Arunachal Pradesh', 'Assam', 'Sikkim', 'Nagaland'],
          correctAnswer: 0,
          explanation: 'Easternmost → first to see sunrise.'
        },
        {
          id: 'india-gk2-30',
          question: 'Which gas is most responsible for global warming?',
          options: ['Ozone', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correctAnswer: 1,
          explanation: 'Most responsible for greenhouse effect.'
        },
        {
          id: 'india-gk2-31',
          question: 'Where is India\'s biggest port located?',
          options: ['Kochi', 'Mumbai', 'Mundra', 'Chennai'],
          correctAnswer: 2,
          explanation: 'Largest private & cargo-handling port in India.'
        },
        {
          id: 'india-gk2-32',
          question: 'Which river is also known as Tsangpo in Tibet?',
          options: ['Indus', 'Brahmaputra', 'Sutlej', 'Chenab'],
          correctAnswer: 1,
          explanation: 'Called Tsangpo in Tibet → becomes Brahmaputra in India.'
        },
        {
          id: 'india-gk2-33',
          question: 'Which state is the largest producer of coffee in India?',
          options: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Assam'],
          correctAnswer: 1,
          explanation: 'Major coffee plantations in Coorg & Chikmagalur.'
        },
        {
          id: 'india-gk2-34',
          question: 'Which city is known as the City of Palaces?',
          options: ['Jaipur', 'Mysuru', 'Kolkata', 'Udaipur'],
          correctAnswer: 1,
          explanation: 'Famous palaces → especially Mysore Palace.'
        },
        {
          id: 'india-gk2-35',
          question: 'India\'s first satellite Aryabhata was launched in which year?',
          options: ['1975', '1977', '1979', '1980'],
          correctAnswer: 0,
          explanation: 'India\'s first satellite launched from USSR.'
        },
        {
          id: 'india-gk2-36',
          question: 'Which Indian city is known as the Oxford of the East?',
          options: ['Pune', 'Bangalore', 'Delhi', 'Varanasi'],
          correctAnswer: 0,
          explanation: 'Many educational institutions → Oxford of the East.'
        },
        {
          id: 'india-gk2-37',
          question: 'Which state has India\'s highest forest cover?',
          options: ['Arunachal Pradesh', 'Madhya Pradesh', 'Chhattisgarh', 'Odisha'],
          correctAnswer: 1,
          explanation: 'Largest forest area in square km.'
        },
        {
          id: 'india-gk2-38',
          question: 'Where is the UNESCO site "Nalanda University Ruins" located?',
          options: ['Bihar', 'UP', 'Odisha', 'West Bengal'],
          correctAnswer: 0,
          explanation: 'Ancient Nalanda → world\'s oldest university.'
        },
        {
          id: 'india-gk2-39',
          question: 'Which is India\'s first bio-reserve?',
          options: ['Nilgiri', 'Nandadevi', 'Sundarbans', 'Gulf of Mannar'],
          correctAnswer: 0,
          explanation: 'India\'s first biosphere reserve (1986).'
        },
        {
          id: 'india-gk2-40',
          question: 'Which river is known as Dakshin Ganga?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Mahanadi'],
          correctAnswer: 0,
          explanation: 'Longest river of South India → called Dakshin Ganga.'
        },
        {
          id: 'india-gk2-41',
          question: 'Which city is known as the Coal Capital of India?',
          options: ['Ranchi', 'Dhanbad', 'Bokaro', 'Jharia'],
          correctAnswer: 1,
          explanation: 'India\'s oldest & biggest coal mines are located here.'
        },
        {
          id: 'india-gk2-42',
          question: 'India\'s longest railway platform is located at?',
          options: ['Gorakhpur', 'Kharagpur', 'Hubli', 'Katni'],
          correctAnswer: 2,
          explanation: 'World\'s longest platform (~1.5 km).'
        },
        {
          id: 'india-gk2-43',
          question: 'What is the national calendar of India?',
          options: ['Vikram Samvat', 'Gregorian', 'Saka Calendar', 'Hijri'],
          correctAnswer: 2,
          explanation: 'Official national calendar used in govt communications.'
        },
        {
          id: 'india-gk2-44',
          question: 'Where is the headquarters of the Indian Navy?',
          options: ['Kochi', 'Visakhapatnam', 'Mumbai', 'Chennai'],
          correctAnswer: 2,
          explanation: 'Western Naval Command HQ — India\'s biggest naval base.'
        },
        {
          id: 'india-gk2-45',
          question: 'Which Indian missile is known as "Fire"?',
          options: ['Astra', 'Agni', 'Prithvi', 'Nag'],
          correctAnswer: 1,
          explanation: 'Agni = Fire in Sanskrit — fitting missile name.'
        },
        {
          id: 'india-gk2-46',
          question: 'Where is India\'s first Greenfield airport?',
          options: ['Hyderabad', 'Bengaluru', 'Kochi', 'Nagpur'],
          correctAnswer: 0,
          explanation: 'Shamshabad Airport → India\'s first modern greenfield airport.'
        },
        {
          id: 'india-gk2-47',
          question: 'Which river makes the Majuli Island?',
          options: ['Ganga', 'Godavari', 'Brahmaputra', 'Krishna'],
          correctAnswer: 2,
          explanation: 'Majuli = world\'s largest river island formed by Brahmaputra.'
        },
        {
          id: 'india-gk2-48',
          question: 'Which is the largest desert in India?',
          options: ['Thar', 'Ladakh Cold Desert', 'Rann of Kutch', 'Jaisalmer Desert'],
          correctAnswer: 0,
          explanation: 'India\'s largest hot desert across Rajasthan.'
        },
        {
          id: 'india-gk2-49',
          question: 'Which state leads in wind energy production?',
          options: ['Rajasthan', 'Tamil Nadu', 'Gujarat', 'Karnataka'],
          correctAnswer: 1,
          explanation: 'Maximum windmills — especially in Kanyakumari & Tirunelveli.'
        },
        {
          id: 'india-gk2-50',
          question: 'India\'s first digital state is?',
          options: ['Goa', 'Kerala', 'Maharashtra', 'Telangana'],
          correctAnswer: 1,
          explanation: 'Kerala implemented full digital governance → first digital state.'
        }
      ]
    },
    {
      id: 'test-4',
      name: 'India GK (Easy)',
      studyMaterial: {
        sections: [
          {
            id: 'india-easy-1',
            title: 'Brahmaputra River',
            content: 'Main river of Assam, flows across the state and supports transport, water, farming and is called the lifeline of Assam; remember Assam = Brahmaputra belt.'
          },
          {
            id: 'india-easy-2',
            title: 'Manipur (Jewel of India)',
            content: 'Called the Jewel of India because of its natural beauty, culture and forests; remember Manipur = Mini Pearl.'
          },
          {
            id: 'india-easy-3',
            title: 'Indian Army HQ',
            content: 'Located in New Delhi where all top operations and central command decisions take place; remember Army = Capital.'
          },
          {
            id: 'india-easy-4',
            title: 'Dibrugarh Tea City',
            content: 'Known as the Tea City of India because it is the main tea-trading and tea-growing hub of Assam; remember D for Dibrugarh = D for Dry Tea.'
          },
          {
            id: 'india-easy-5',
            title: 'Deccan Plateau',
            content: 'Largest plateau of India covering most of South India and rich in minerals; remember Deccan = Deck or base of India.'
          },
          {
            id: 'india-easy-6',
            title: 'West Bengal Border Length',
            content: 'West Bengal has the longest international border because it touches Bangladesh, Nepal and Bhutan; remember WB touches most neighbors.'
          },
          {
            id: 'india-easy-7',
            title: 'Marine National Park Gujarat',
            content: 'India\'s first marine national park is in Gujarat near Jamnagar with coral reefs and marine life; remember Gujarat = coastline king.'
          },
          {
            id: 'india-easy-8',
            title: 'Pennar River Gandikota',
            content: 'The Pennar River carved the Grand Canyon of India at Gandikota in Andhra Pradesh; remember Pennar = Pen carved canyon.'
          },
          {
            id: 'india-easy-9',
            title: 'Taj-ul-Masajid',
            content: 'India\'s largest mosque located in Bhopal known for its massive architecture; remember Taj = Big.'
          },
          {
            id: 'india-easy-10',
            title: 'Mars Red Planet',
            content: 'Called the Red Planet due to iron oxide giving a reddish color; remember Mars → Red wrapper like a Mars chocolate bar.'
          },
          {
            id: 'india-easy-11',
            title: 'Ganga–Brahmaputra Delta',
            content: 'Largest delta in the world formed by these two major rivers; remember largest rivers make largest delta.'
          },
          {
            id: 'india-easy-12',
            title: 'Statue of Unity Gujarat',
            content: 'World\'s tallest statue built in memory of Sardar Patel located in Gujarat; remember Patel = Gujarat.'
          },
          {
            id: 'india-easy-13',
            title: 'Space City Bengaluru',
            content: 'Bengaluru is the Space City because ISRO HQ and many space centers are there; remember Bengaluru = Rockets.'
          },
          {
            id: 'india-easy-14',
            title: 'Discovery of India Author',
            content: 'Jawaharlal Nehru wrote The Discovery of India while in prison; remember Nehru = books in jail.'
          },
          {
            id: 'india-easy-15',
            title: 'UP Sugarcane Leader',
            content: 'Uttar Pradesh produces the most sugarcane due to fertile plains and irrigation; remember UP = Uttar Production.'
          },
          {
            id: 'india-easy-16',
            title: 'Pratibha Patil',
            content: 'First woman President of India, served from 2007 to 2012; remember first woman = Patil.'
          },
          {
            id: 'india-easy-17',
            title: 'Jammu to Kanyakumari Train',
            content: 'Longest train route in India running from north to south; remember top to bottom = longest.'
          },
          {
            id: 'india-easy-18',
            title: 'Rann Utsav Gujarat',
            content: 'Famous festival held in the white desert of Kutch in Gujarat; remember white desert = white festival.'
          },
          {
            id: 'india-easy-19',
            title: 'UNESCO Headquarters',
            content: 'Located in Paris focusing on education, science and culture; remember Paris = culture capital.'
          },
          {
            id: 'india-easy-20',
            title: 'Photosynthesis Gas',
            content: 'Plants need carbon dioxide for photosynthesis; remember CO₂ = Carbon for Chlorophyll.'
          },
          {
            id: 'india-easy-21',
            title: 'West Bengal Rice Producer',
            content: 'West Bengal is India\'s largest rice-producing state due to heavy rainfall; remember Bengal = rice bowl.'
          },
          {
            id: 'india-easy-22',
            title: 'Mahanadi Sorrow of Odisha',
            content: 'Mahanadi is called the Sorrow of Odisha because it causes heavy floods historically; remember Maha-nadi = Maha floods.'
          },
          {
            id: 'india-easy-23',
            title: 'Howrah Station',
            content: 'Largest and busiest railway station in India located in Kolkata; remember H = Huge Howrah.'
          },
          {
            id: 'india-easy-24',
            title: 'Madurai Festival City',
            content: 'Known as the City of Festivals because of numerous temple festivals; remember Madurai = Many festivals.'
          },
          {
            id: 'india-easy-25',
            title: 'Spiti Valley',
            content: 'Deepest high-altitude valley in India located in Himachal Pradesh; remember Spiti = Split deep land.'
          },
          {
            id: 'india-easy-26',
            title: 'Kunchikal Falls Karnataka',
            content: 'India\'s highest waterfall located in Karnataka; remember Karnataka = king of waterfalls.'
          },
          {
            id: 'india-easy-27',
            title: 'Pushkar Fair Rajasthan',
            content: 'Famous camel and cultural fair held annually in Rajasthan; remember camels = Rajasthan.'
          },
          {
            id: 'india-easy-28',
            title: 'Bangladesh Currency Taka',
            content: 'Official currency is Taka; remember Bangladesh = Taka not Rupee.'
          },
          {
            id: 'india-easy-29',
            title: 'West Bengal Jute',
            content: 'Biggest jute-producing state due to fertile Ganga delta; remember Jute = J for Jute + J for Bengal.'
          },
          {
            id: 'india-easy-30',
            title: 'Khajuraho Temples Chandellas',
            content: 'Built by Chandella dynasty known for beautiful carvings; remember Ch → Chandella → Khajuraho.'
          },
          {
            id: 'india-easy-31',
            title: 'Phalodi Driest Place',
            content: 'One of India\'s driest and hottest places recording extremely high temperatures; remember Phalodi = Fire-lodi.'
          },
          {
            id: 'india-easy-32',
            title: 'Madras Regiment',
            content: 'Oldest regiment of the Indian Army formed in 1758; remember old name Madras = oldest regiment.'
          },
          {
            id: 'india-easy-33',
            title: 'Konkan Railway West Coast',
            content: 'Runs along the western coastal states including Maharashtra, Goa and Karnataka; remember Konkan = Coast.'
          },
          {
            id: 'india-easy-34',
            title: 'Arunachal Pradesh Orchid State',
            content: 'Known for 600+ orchid species; remember Arun-Orchid-al.'
          },
          {
            id: 'india-easy-35',
            title: 'Lucknow Chikankari',
            content: 'Lucknow is famous for chikankari hand embroidery; remember Lucknowi chikan = fashion.'
          },
          {
            id: 'india-easy-36',
            title: 'Bhakra Nangal on Sutlej',
            content: 'Major dam built on Sutlej River providing power and irrigation; remember Bhakra = Sutlej.'
          },
          {
            id: 'india-easy-37',
            title: 'Banyan National Tree',
            content: 'Chosen due to its longevity and widespread branches symbolizing life; remember huge umbrella tree = banyan.'
          },
          {
            id: 'india-easy-38',
            title: 'Siachen Glacier Battlefield',
            content: 'Highest battlefield in the world controlled by Indian Army; remember Siachen = sky height.'
          },
          {
            id: 'india-easy-39',
            title: 'Odisha Black Pagoda',
            content: 'Konark Sun Temple is called the Black Pagoda due to dark stone carvings; remember Sun Temple = black stone.'
          },
          {
            id: 'india-easy-40',
            title: 'Gujarat Salt Producer',
            content: 'India\'s largest salt-producing state especially the Rann of Kutch; remember white desert = white salt.'
          },
          {
            id: 'india-easy-41',
            title: 'Maharashtra Airports',
            content: 'Has the most airports due to many major cities like Mumbai, Pune, Nagpur; remember big state = many airports.'
          },
          {
            id: 'india-easy-42',
            title: 'Arundhati Roy Booker Winner',
            content: 'First Indian to win the Booker Prize for The God of Small Things; remember Arundhati = award winner.'
          },
          {
            id: 'india-easy-43',
            title: 'Lothal Maritime Museum',
            content: 'India\'s national maritime museum located at ancient Indus Valley port Lothal; remember oldest port = Lothal.'
          },
          {
            id: 'india-easy-44',
            title: 'Yamuna River Delhi',
            content: 'Main river flowing through Delhi used for water supply; remember Delhi\'s lifeline = Yamuna.'
          },
          {
            id: 'india-easy-45',
            title: 'Arabian Sea West of India',
            content: 'Lies west of India touching Gujarat, Maharashtra and Goa; remember Mumbai faces Arabian Sea.'
          },
          {
            id: 'india-easy-46',
            title: 'Jamshedpur Steel City',
            content: 'Called Steel City because it is home to Tata Steel; remember steel = Tata = Jamshedpur.'
          },
          {
            id: 'india-easy-47',
            title: 'Great Nicobar Largest Island',
            content: 'Largest island of India located in Nicobar group; remember Great = biggest.'
          },
          {
            id: 'india-easy-48',
            title: 'Pongal Tamil Nadu',
            content: 'Famous harvest festival of Tamil Nadu celebrated in January; remember Pongal = Tamil pots of milk.'
          },
          {
            id: 'india-easy-49',
            title: 'Bangladesh Longest Border',
            content: 'India\'s longest border is with Bangladesh due to large shared boundary; remember long border = Bangladesh.'
          },
          {
            id: 'india-easy-50',
            title: 'Indian Cobra National Reptile',
            content: 'Recognized as national reptile due to cultural importance and presence in Indian ecology; remember cobra in Indian culture = national reptile.'
          }
        ],
        lastUpdated: Date.now()
      },
      questions: [
        {
          id: 'india-easy-q1',
          question: 'Which river is known as the Lifeline of Assam?',
          options: ['Brahmaputra', 'Barak', 'Subansiri', 'Manas'],
          correctAnswer: 0,
          explanation: 'Main river of Assam, flows across the state and supports transport, water, farming; remember Assam = Brahmaputra belt.'
        },
        {
          id: 'india-easy-q2',
          question: 'Which state is called the Jewel of India?',
          options: ['Meghalaya', 'Manipur', 'Sikkim', 'Tripura'],
          correctAnswer: 1,
          explanation: 'Called the Jewel of India because of its natural beauty, culture and forests; remember Manipur = Mini Pearl.'
        },
        {
          id: 'india-easy-q3',
          question: 'Where is the headquarters of the Indian Army?',
          options: ['New Delhi', 'Pune', 'Jaipur', 'Lucknow'],
          correctAnswer: 0,
          explanation: 'Located in New Delhi where all top operations and central command decisions take place; remember Army = Capital.'
        },
        {
          id: 'india-easy-q4',
          question: 'Which city is known as the Tea City of India?',
          options: ['Siliguri', 'Guwahati', 'Dibrugarh', 'Darjeeling'],
          correctAnswer: 2,
          explanation: 'Known as the Tea City of India because it is the main tea-trading and tea-growing hub of Assam; remember D for Dibrugarh = D for Dry Tea.'
        },
        {
          id: 'india-easy-q5',
          question: 'What is the largest plateau in India?',
          options: ['Chota Nagpur Plateau', 'Malwa Plateau', 'Deccan Plateau', 'Ladakh Plateau'],
          correctAnswer: 2,
          explanation: 'Largest plateau of India covering most of South India and rich in minerals; remember Deccan = Deck or base of India.'
        },
        {
          id: 'india-easy-q6',
          question: 'Which Indian state has the longest international border?',
          options: ['Punjab', 'West Bengal', 'Rajasthan', 'Sikkim'],
          correctAnswer: 1,
          explanation: 'West Bengal has the longest international border because it touches Bangladesh, Nepal and Bhutan; remember WB touches most neighbors.'
        },
        {
          id: 'india-easy-q7',
          question: 'India\'s first marine national park is located in?',
          options: ['Odisha', 'Gujarat', 'Kerala', 'Tamil Nadu'],
          correctAnswer: 1,
          explanation: 'India\'s first marine national park is in Gujarat near Jamnagar with coral reefs and marine life; remember Gujarat = coastline king.'
        },
        {
          id: 'india-easy-q8',
          question: 'Which river flows through the Grand Canyon of India (Gandikota)?',
          options: ['Krishna', 'Kaveri', 'Pennar', 'Godavari'],
          correctAnswer: 2,
          explanation: 'The Pennar River carved the Grand Canyon of India at Gandikota in Andhra Pradesh; remember Pennar = Pen carved canyon.'
        },
        {
          id: 'india-easy-q9',
          question: 'Which is the biggest mosque in India?',
          options: ['Jama Masjid Delhi', 'Mecca Masjid', 'Taj-ul-Masajid', 'Fatehpuri Masjid'],
          correctAnswer: 2,
          explanation: 'India\'s largest mosque located in Bhopal known for its massive architecture; remember Taj = Big.'
        },
        {
          id: 'india-easy-q10',
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 1,
          explanation: 'Called the Red Planet due to iron oxide giving a reddish color; remember Mars → Red wrapper like a Mars chocolate bar.'
        },
        {
          id: 'india-easy-q11',
          question: 'Largest delta in the world is formed by which river system?',
          options: ['Ganga–Brahmaputra', 'Indus', 'Congo', 'Amazon'],
          correctAnswer: 0,
          explanation: 'Largest delta in the world formed by these two major rivers; remember largest rivers make largest delta.'
        },
        {
          id: 'india-easy-q12',
          question: 'Where is India\'s tallest statue, Statue of Unity, located?',
          options: ['UP', 'Gujarat', 'Maharashtra', 'MP'],
          correctAnswer: 1,
          explanation: 'World\'s tallest statue built in memory of Sardar Patel located in Gujarat; remember Patel = Gujarat.'
        },
        {
          id: 'india-easy-q13',
          question: 'Which city is known as the Space City of India?',
          options: ['Chennai', 'Bengaluru', 'Hyderabad', 'Thiruvananthapuram'],
          correctAnswer: 1,
          explanation: 'Bengaluru is the Space City because ISRO HQ and many space centers are there; remember Bengaluru = Rockets.'
        },
        {
          id: 'india-easy-q14',
          question: 'Who wrote the book Discovery of India?',
          options: ['Gandhi', 'Nehru', 'Tagore', 'Ambedkar'],
          correctAnswer: 1,
          explanation: 'Jawaharlal Nehru wrote The Discovery of India while in prison; remember Nehru = books in jail.'
        },
        {
          id: 'india-easy-q15',
          question: 'Which state is the largest producer of sugarcane in India?',
          options: ['UP', 'Bihar', 'Maharashtra', 'Karnataka'],
          correctAnswer: 0,
          explanation: 'Uttar Pradesh produces the most sugarcane due to fertile plains and irrigation; remember UP = Uttar Production.'
        },
        {
          id: 'india-easy-q16',
          question: 'First woman President of India was?',
          options: ['Pratibha Patil', 'Indira Gandhi', 'Sarojini Naidu', 'Annie Besant'],
          correctAnswer: 0,
          explanation: 'First woman President of India, served from 2007 to 2012; remember first woman = Patil.'
        },
        {
          id: 'india-easy-q17',
          question: 'The longest railway line in India runs between?',
          options: ['Jammu–Kanyakumari', 'Delhi–Guwahati', 'Mumbai–Howrah', 'Chennai–Amritsar'],
          correctAnswer: 0,
          explanation: 'Longest train route in India running from north to south; remember top to bottom = longest.'
        },
        {
          id: 'india-easy-q18',
          question: 'The famous "Rann Utsav" is held in which state?',
          options: ['Gujarat', 'Rajasthan', 'Maharashtra', 'MP'],
          correctAnswer: 0,
          explanation: 'Famous festival held in the white desert of Kutch in Gujarat; remember white desert = white festival.'
        },
        {
          id: 'india-easy-q19',
          question: 'Where is the headquarters of UNESCO?',
          options: ['Paris', 'London', 'Geneva', 'New York'],
          correctAnswer: 0,
          explanation: 'Located in Paris focusing on education, science and culture; remember Paris = culture capital.'
        },
        {
          id: 'india-easy-q20',
          question: 'Which gas is essential for photosynthesis?',
          options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'],
          correctAnswer: 2,
          explanation: 'Plants need carbon dioxide for photosynthesis; remember CO₂ = Carbon for Chlorophyll.'
        },
        {
          id: 'india-easy-q21',
          question: 'Which Indian state is the largest producer of rice?',
          options: ['Punjab', 'West Bengal', 'Odisha', 'Tamil Nadu'],
          correctAnswer: 1,
          explanation: 'West Bengal is India\'s largest rice-producing state due to heavy rainfall; remember Bengal = rice bowl.'
        },
        {
          id: 'india-easy-q22',
          question: 'Which river is called "Sorrow of Odisha"?',
          options: ['Mahanadi', 'Brahmani', 'Baitarani', 'Subarnarekha'],
          correctAnswer: 0,
          explanation: 'Mahanadi is called the Sorrow of Odisha because it causes heavy floods historically; remember Maha-nadi = Maha floods.'
        },
        {
          id: 'india-easy-q23',
          question: 'The largest railway station in India by area is?',
          options: ['Howrah', 'Gorakhpur', 'Kharagpur', 'Delhi'],
          correctAnswer: 0,
          explanation: 'Largest and busiest railway station in India located in Kolkata; remember H = Huge Howrah.'
        },
        {
          id: 'india-easy-q24',
          question: 'Which city is known as the City of Festivals?',
          options: ['Jaipur', 'Madurai', 'Pune', 'Hyderabad'],
          correctAnswer: 1,
          explanation: 'Known as the City of Festivals because of numerous temple festivals; remember Madurai = Many festivals.'
        },
        {
          id: 'india-easy-q25',
          question: 'Which is the deepest river valley in India?',
          options: ['Narmada Valley', 'Chenab Valley', 'Spiti Valley', 'Alaknanda Valley'],
          correctAnswer: 2,
          explanation: 'Deepest high-altitude valley in India located in Himachal Pradesh; remember Spiti = Split deep land.'
        },
        {
          id: 'india-easy-q26',
          question: 'Where is India\'s highest waterfall (Kunchikal Falls)?',
          options: ['Karnataka', 'Kerala', 'Meghalaya', 'Sikkim'],
          correctAnswer: 0,
          explanation: 'India\'s highest waterfall located in Karnataka; remember Karnataka = king of waterfalls.'
        },
        {
          id: 'india-easy-q27',
          question: 'Which state is famous for Pushkar Fair?',
          options: ['Punjab', 'Rajasthan', 'Gujarat', 'Haryana'],
          correctAnswer: 1,
          explanation: 'Famous camel and cultural fair held annually in Rajasthan; remember camels = Rajasthan.'
        },
        {
          id: 'india-easy-q28',
          question: 'What is the currency of Bangladesh?',
          options: ['Rupiah', 'Rupee', 'Taka', 'Dinar'],
          correctAnswer: 2,
          explanation: 'Official currency is Taka; remember Bangladesh = Taka not Rupee.'
        },
        {
          id: 'india-easy-q29',
          question: 'Which Indian state produces the most jute?',
          options: ['Bihar', 'West Bengal', 'Assam', 'Odisha'],
          correctAnswer: 1,
          explanation: 'Biggest jute-producing state due to fertile Ganga delta; remember Jute = J for Jute + J for Bengal.'
        },
        {
          id: 'india-easy-q30',
          question: 'Who built the Khajuraho Temples?',
          options: ['Chalukyas', 'Chandellas', 'Mauryas', 'Guptas'],
          correctAnswer: 1,
          explanation: 'Built by Chandella dynasty known for beautiful carvings; remember Ch → Chandella → Khajuraho.'
        },
        {
          id: 'india-easy-q31',
          question: 'Which is the driest place in India?',
          options: ['Leh', 'Phalodi', 'Jaisalmer', 'Mawsynram'],
          correctAnswer: 1,
          explanation: 'One of India\'s driest and hottest places recording extremely high temperatures; remember Phalodi = Fire-lodi.'
        },
        {
          id: 'india-easy-q32',
          question: 'Which is India\'s oldest regiment (Army)?',
          options: ['Sikh Regiment', 'Dogra Regiment', 'Madras Regiment', 'Rajput Regiment'],
          correctAnswer: 2,
          explanation: 'Oldest regiment of the Indian Army formed in 1758; remember old name Madras = oldest regiment.'
        },
        {
          id: 'india-easy-q33',
          question: 'The Konkan Railway runs along which coast?',
          options: ['East Coast', 'West Coast', 'Tamil Coast', 'Andhra Coast'],
          correctAnswer: 1,
          explanation: 'Runs along the western coastal states including Maharashtra, Goa and Karnataka; remember Konkan = Coast.'
        },
        {
          id: 'india-easy-q34',
          question: 'Which state is called the Orchid State of India?',
          options: ['Arunachal Pradesh', 'Assam', 'Mizoram', 'Sikkim'],
          correctAnswer: 0,
          explanation: 'Known for 600+ orchid species; remember Arun-Orchid-al.'
        },
        {
          id: 'india-easy-q35',
          question: 'Which Indian city is famous for chikankari work?',
          options: ['Agra', 'Lucknow', 'Jaipur', 'Surat'],
          correctAnswer: 1,
          explanation: 'Lucknow is famous for chikankari hand embroidery; remember Lucknowi chikan = fashion.'
        },
        {
          id: 'india-easy-q36',
          question: 'Which river is associated with Bhakra Nangal Dam?',
          options: ['Ganga', 'Sutlej', 'Chenab', 'Ravi'],
          correctAnswer: 1,
          explanation: 'Major dam built on Sutlej River providing power and irrigation; remember Bhakra = Sutlej.'
        },
        {
          id: 'india-easy-q37',
          question: 'The national tree of India is?',
          options: ['Banyan', 'Neem', 'Mango', 'Ashoka'],
          correctAnswer: 0,
          explanation: 'Chosen due to its longevity and widespread branches symbolizing life; remember huge umbrella tree = banyan.'
        },
        {
          id: 'india-easy-q38',
          question: 'The highest battlefield in the world is?',
          options: ['Dras', 'Siachen Glacier', 'Tawang', 'Kargil'],
          correctAnswer: 1,
          explanation: 'Highest battlefield in the world controlled by Indian Army; remember Siachen = sky height.'
        },
        {
          id: 'india-easy-q39',
          question: 'Which state is known as the Land of Black Pagoda?',
          options: ['Odisha', 'Assam', 'TN', 'Kerala'],
          correctAnswer: 0,
          explanation: 'Konark Sun Temple is called the Black Pagoda due to dark stone carvings; remember Sun Temple = black stone.'
        },
        {
          id: 'india-easy-q40',
          question: 'The largest salt-producing state in India is?',
          options: ['Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Tamil Nadu'],
          correctAnswer: 0,
          explanation: 'India\'s largest salt-producing state especially the Rann of Kutch; remember white desert = white salt.'
        },
        {
          id: 'india-easy-q41',
          question: 'Which Indian state has the maximum number of airports?',
          options: ['Maharashtra', 'UP', 'Gujarat', 'Kerala'],
          correctAnswer: 0,
          explanation: 'Has the most airports due to many major cities like Mumbai, Pune, Nagpur; remember big state = many airports.'
        },
        {
          id: 'india-easy-q42',
          question: 'The first Indian to win the Booker Prize was?',
          options: ['Arundhati Roy', 'Salman Rushdie', 'Kiran Desai', 'Vikram Seth'],
          correctAnswer: 0,
          explanation: 'First Indian to win the Booker Prize for The God of Small Things; remember Arundhati = award winner.'
        },
        {
          id: 'india-easy-q43',
          question: 'Where is India\'s national maritime museum?',
          options: ['Kochi', 'Mumbai', 'Lothal', 'Goa'],
          correctAnswer: 2,
          explanation: 'India\'s national maritime museum located at ancient Indus Valley port Lothal; remember oldest port = Lothal.'
        },
        {
          id: 'india-easy-q44',
          question: 'Which river flows through Delhi?',
          options: ['Chambal', 'Yamuna', 'Ganga', 'Betwa'],
          correctAnswer: 1,
          explanation: 'Main river flowing through Delhi used for water supply; remember Delhi\'s lifeline = Yamuna.'
        },
        {
          id: 'india-easy-q45',
          question: 'Which sea lies to the west of India?',
          options: ['Arabian Sea', 'Bay of Bengal', 'Red Sea', 'Caspian Sea'],
          correctAnswer: 0,
          explanation: 'Lies west of India touching Gujarat, Maharashtra and Goa; remember Mumbai faces Arabian Sea.'
        },
        {
          id: 'india-easy-q46',
          question: 'Which Indian city is known as Steel City?',
          options: ['Rourkela', 'Jamshedpur', 'Bhilai', 'Dhanbad'],
          correctAnswer: 1,
          explanation: 'Called Steel City because it is home to Tata Steel; remember steel = Tata = Jamshedpur.'
        },
        {
          id: 'india-easy-q47',
          question: 'What is the largest island of India?',
          options: ['Majuli', 'Great Nicobar', 'Little Andaman', 'Rameswaram'],
          correctAnswer: 1,
          explanation: 'Largest island of India located in Nicobar group; remember Great = biggest.'
        },
        {
          id: 'india-easy-q48',
          question: 'Which festival is famous in Tamil Nadu?',
          options: ['Pongal', 'Onam', 'Lohri', 'Bihu'],
          correctAnswer: 0,
          explanation: 'Famous harvest festival of Tamil Nadu celebrated in January; remember Pongal = Tamil pots of milk.'
        },
        {
          id: 'india-easy-q49',
          question: 'Which country does India share the longest border with?',
          options: ['Nepal', 'China', 'Bangladesh', 'Pakistan'],
          correctAnswer: 2,
          explanation: 'India\'s longest border is with Bangladesh due to large shared boundary; remember long border = Bangladesh.'
        },
        {
          id: 'india-easy-q50',
          question: 'Which is the national reptile of India?',
          options: ['Cobra', 'Turtle', 'Crocodile', 'Monitor Lizard'],
          correctAnswer: 0,
          explanation: 'Recognized as national reptile due to cultural importance and presence in Indian ecology; remember cobra in Indian culture = national reptile.'
        }
      ]
    }
  ],
  pdfs: []
};
