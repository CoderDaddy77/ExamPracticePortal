# 📚 Exam Practice Portal

> A full-stack exam preparation platform with AI-powered study material, mock tests, cheat sheets, and performance analytics — built for serious learners.

**🔗 Live Demo → [exam-practice-portal.web.app](https://exam-practice-portal.web.app)**

---

## ✨ Features

### 🎯 For Students
- **Mock Tests** — Timed practice tests with normal and realistic exam modes
- **Study Mode** — Chapter-wise notes, guided sections, and structured cheat sheets
- **Quick Quiz** — Random question pools from any category, subject, or chapter
- **Weak Areas Analyzer** — Visual analytics to identify and focus on weak topics
- **Bookmarks** — Save questions for later review with a dedicated bookmarked test mode
- **Performance Results** — Detailed score breakdown with marks, correct/incorrect/unattempted stats

### ⚙️ For Admins
- **Admin Panel** — Full CRUD for categories, subjects, chapters, and tests
- **Rich Text Editor** — Quill-based editor for writing formatted study notes with images
- **Cheat Sheet Builder** — Structured table-based cheat sheets (tenses, vocab tables, formulas)
- **Smart AI Import** — Paste Gemini/ChatGPT markdown tables and auto-convert to cheat sheets
- **URL-Persistent State** — Admin selections persist across page reloads via URL params
- **Content Reordering** — Control whether Notes or Cheat Sheets appear first for each test

### ☁️ Infrastructure
- **Firebase Auth** — Google Sign-In for admin access
- **Firestore** — Real-time cloud sync of all user content, results, and bookmarks
- **Firebase Hosting** — Production deployment with custom cache headers and SPA rewrites
- **Data Backup/Restore** — Export and import user data as JSON

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Vanilla CSS + Tailwind utility classes |
| Rich Text | Quill.js |
| Icons | Lucide React |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| Routing | React Router v6 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Auth and Firestore enabled

### Local Development

```bash
# Clone the repo
git clone https://github.com/CoderDaddy77/ExamPracticePortal.git
cd ExamPracticePortal

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Setup

Create a `.env` file in the project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Build & Deploy

```bash
# Production build
npm run build

# Deploy to Firebase Hosting
firebase login
firebase deploy --only hosting
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AdminPanel.tsx         # Full admin CRUD interface
│   ├── StudyMaterialPage.tsx  # Student study view (notes + cheat sheets)
│   ├── CheatSheetEditor.tsx   # Drag-and-drop cheat sheet builder
│   ├── CheatSheetDisplay.tsx  # Styled cheat sheet viewer
│   ├── TestPage.tsx           # Normal test mode
│   ├── RealisticTestPage.tsx  # Exam-mode test with strict controls
│   ├── ResultsPage.tsx        # Detailed score breakdown
│   ├── HomePage.tsx           # Landing + featured content
│   ├── ChapterPage.tsx        # Chapter-level navigation
│   ├── SubjectPage.tsx        # Subject-level navigation
│   └── ...
├── firebase/                  # Firestore read/write helpers
├── utils/                     # Parsing, scoring, default data utilities
├── types.ts                   # Full TypeScript interface definitions
└── App.tsx                    # Root router + global state
```

---

## 🎨 Design Highlights

- **Dark / Light mode** with smooth transitions
- **Glassmorphism cards** and gradient backgrounds
- **Micro-animations** on hover and interaction
- **Fully responsive** — works on mobile, tablet, and desktop
- **Skeleton loading** screens during Firebase auth resolution

---

## 📄 License

MIT — free to use, fork, and learn from.

---

<p align="center">Built with ❤️ by <a href="https://github.com/CoderDaddy77">CoderDaddy77</a></p>
