// Notes & Study Materials Data
// Add your Google Drive PDF links here.
// To get a shareable link from Google Drive:
// Right-click file → Share → "Anyone with the link" → Copy link

export interface NoteItem {
  id: string;
  title: string;
  driveUrl: string; // Google Drive shareable link
  description?: string; // Optional short description
}

export interface NoteSubject {
  id: string;
  name: string;
  icon?: string; // emoji icon
  notes: NoteItem[];
}

export interface NoteCategory {
  id: string;
  name: string; // e.g. "CUET", "SSC CHSL"
  subjects: NoteSubject[];
}

export const notesData: NoteCategory[] = [
  {
    id: 'cuet',
    name: 'CUET',
    subjects: [
      {
        id: 'english',
        name: 'English',
        icon: '📖',
        notes: [
          
           {
            id: 'english-summary',
            title: 'English Summary',
            driveUrl: 'https://drive.google.com/file/d/12kVY_lVqr2_WoSzoFssz2ICCK950t341/view?usp=sharing', // <-- replace this
          },
          {
            id: 'antonym-synonym',
            title: 'Antonym and Synonym',
            driveUrl: 'https://drive.google.com/file/d/17kpMUtb-bIXLzCfh7VxtS1O-8H9h8uMD/view?usp=sharing',
          },
          {
            id: 'english-idioms',
            title: 'English Idioms',
            driveUrl: 'https://drive.google.com/file/d/1Ihmaf_THwlVJ6yosAJCeioQqsTsN1BVC/view?usp=sharing', // <-- replace this
          },
         
          {
            id: 'fill-blanks-clause',
            title: 'Fill in the Blanks & Clause Test',
            driveUrl: 'https://drive.google.com/file/d/1HBkVNGfbkUJHnTl0MpJpo0_YAHRptHeH/view?usp=sharing', // <-- replace this
          },
          {
            id: 'grammar-error',
            title: 'Grammar & Error Spotting',
            driveUrl: 'https://drive.google.com/file/d/13X6w70KuHA5XDwOTDOkyBZrLo0wEOVw6/view?usp=sharing', // <-- replace this
          },
          {
            id: 'guessing-word-meaning',
            title: 'Guessing Word Meaning Using Surrounding Words',
            driveUrl: 'https://drive.google.com/file/d/1Jq9W9JYyR4PAV3GEG6zNyNPZph43fZxG/view?usp=sharing', // <-- replace this
          },
          {
            id: 'one-word-substitution',
            title: 'One Word Substitution',
            driveUrl: 'https://drive.google.com/file/d/1bwQB1lYhlosmPxnrW7kEEr0F4evDwmsC/view?usp=sharing', // <-- replace this
          },
          {
            id: 'ordering',
            title: 'Ordering',
            driveUrl: 'https://drive.google.com/file/d/1PRLfjID5H3Wg64bqu8e-D_nxl9MGzeNF/view?usp=sharing', // <-- replace this
          },
          {
            id: 'phrasal-verbs',
            title: 'Phrasal Verbs',
            driveUrl: 'https://drive.google.com/file/d/1eX8BrHKU_tGiDlq9ABuNBoidKnGLVLlU/view?usp=sharing', // <-- replace this
          },
          {
            id: 'reading-comprehension',
            title: 'Reading Comprehension',
            driveUrl: 'https://drive.google.com/file/d/1EBJZ77AZvmjnWLTe5O4Jn7ft5iJqM6m-/view?usp=sharing', // <-- replace this
          },
        ],
      },
      // Add more subjects here (Physics, Chemistry, etc.) in the future
    ],
  },
  // Add more exam categories here (SSC CHSL, UKSSC, etc.) in the future
];
