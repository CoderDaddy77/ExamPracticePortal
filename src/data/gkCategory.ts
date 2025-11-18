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
          correctAnswer: 1
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
      name: 'India GK#1',
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
          correctAnswer: 3,
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
        }
      ]
    },
    {
      id: 'test-3',
      name: 'India GK #2',
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
    }
  ],
  pdfs: []
};
