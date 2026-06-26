import type { Test, Question } from '../types';

interface PdfOptions {
  testName: string;
  categoryName: string;
  showAnswers?: boolean;
}

/**
 * Generates a premium print-friendly HTML test paper and opens it in a new tab.
 * The page has a "Download PDF" button that triggers window.print() directly.
 */
export function generateTestPdf(test: Test, options: PdfOptions): void {
  const { testName, categoryName, showAnswers = true } = options;
  const questions = test.questions;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(testName)} — Test Paper</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --teal: #0d9488;
      --teal-dark: #0f766e;
      --amber: #d97706;
      --green: #16a34a;
      --text: #111827;
      --muted: #6b7280;
      --border: #e5e7eb;
      --surface: #f9fafb;
    }

    body {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      line-height: 1.75;
      color: var(--text);
      background-color: #F6F8F9;
      background-image: linear-gradient(to right, #F0F9F8 1px, transparent 1px), linear-gradient(to bottom, #F0F9F8 1px, transparent 1px);
      background-size: 20px 20px;
      font-size: 15px;
    }

    /* ─── Toolbar (hidden on print) ─── */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 1px 8px rgba(0,0,0,0.07);
    }
    .toolbar-left {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .toolbar-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 480px;
    }
    .toolbar-sub {
      font-size: 12px;
      color: var(--muted);
    }
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      background: linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      letter-spacing: 0.01em;
      box-shadow: 0 2px 8px rgba(13,148,136,0.35);
      transition: transform 0.1s, box-shadow 0.1s;
      font-family: inherit;
    }
    .btn-download:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(13,148,136,0.45);
    }
    .btn-download:active { transform: translateY(0); }
    .btn-download svg { width: 16px; height: 16px; flex-shrink: 0; }
    .kbd-hint {
      font-size: 11px;
      color: var(--muted);
      white-space: nowrap;
    }
    .kbd {
      display: inline-block;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 1px 5px;
      font-family: monospace;
      font-size: 11px;
    }

    /* ─── Page content ─── */
    .page {
      max-width: 860px;
      margin: 0 auto;
      padding: 32px 24px 60px;
    }

    /* ─── Header card ─── */
    .header-card {
      background: linear-gradient(135deg, #0d9488 0%, #047857 100%);
      color: #fff;
      border-radius: 16px;
      padding: 36px 40px;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    .header-card::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 180px; height: 180px;
      background: rgba(255,255,255,0.06);
      border-radius: 50%;
    }
    .header-card::after {
      content: '';
      position: absolute;
      bottom: -60px; left: 60px;
      width: 240px; height: 240px;
      background: rgba(255,255,255,0.04);
      border-radius: 50%;
    }
    .header-badge {
      display: inline-block;
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 999px;
      padding: 3px 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 14px;
    }
    .header-title {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 6px;
      line-height: 1.3;
    }
    .header-category {
      font-size: 15px;
      opacity: 0.85;
      margin-bottom: 20px;
    }
    .header-meta {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .header-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      opacity: 0.9;
    }
    .header-meta-item strong { font-weight: 700; }

    /* ─── Question blocks ─── */
    .question-block {
      background: #F6F8F9;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 22px 24px;
      margin-bottom: 18px;
      page-break-inside: avoid;
      transition: box-shadow 0.15s;
    }
    .question-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
    }
    .question-number {
      background: linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%);
      color: #fff;
      min-width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .question-text {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      flex: 1;
      line-height: 1.65;
    }
    .question-text img, .option-text img, .explanation-text img {
      max-width: 100%;
      max-height: 320px;
      height: auto;
      border-radius: 8px;
      margin: 8px 0;
      display: block;
      object-fit: contain;
    }

    /* ─── Options ─── */
    .options { padding-left: 48px; }
    .option-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 8px;
      margin-bottom: 4px;
    }
    .option-row.correct {
      background: #dcfce7;
      border: 1px solid #86efac;
    }
    .option-label {
      font-weight: 700;
      color: #374151;
      min-width: 24px;
      flex-shrink: 0;
      font-size: 14px;
    }
    .option-row.correct .option-label { color: var(--green); }
    .option-text { color: #374151; flex: 1; font-size: 14px; }
    .option-row.correct .option-text { color: #15803d; font-weight: 500; }

    /* ─── Answer section ─── */
    .answer-section {
      margin: 12px 0 0 48px;
      padding: 12px 16px;
      background: linear-gradient(90deg, #d1fae5 0%, #ecfdf5 100%);
      border-left: 4px solid var(--green);
      border-radius: 0 8px 8px 0;
    }
    .answer-label {
      font-size: 12px;
      font-weight: 700;
      color: #15803d;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }
    .answer-text { font-size: 14px; color: #166534; font-weight: 600; }

    /* ─── Explanation ─── */
    .explanation {
      margin: 10px 0 0 48px;
      padding: 12px 16px;
      background: linear-gradient(90deg, #fef9c3 0%, #fffbeb 100%);
      border-left: 4px solid var(--amber);
      border-radius: 0 8px 8px 0;
    }
    .explanation-label {
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .explanation-text { font-size: 13px; color: #78350f; line-height: 1.6; }

    /* ─── Footer ─── */
    .footer {
      margin-top: 48px;
      text-align: center;
      font-size: 11px;
      color: var(--muted);
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }

    /* ─── Print styles ─── */
    @media print {
      .toolbar { display: none !important; }
      body { background: #fff; font-size: 13px; }
      .page { padding: 16px 12px 40px; }
      .header-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .question-block { border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 14px; }
      .answer-section { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .explanation { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .option-row.correct { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Toolbar (hidden in print) -->
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="toolbar-title">${escapeHtml(testName)}</div>
      <div class="toolbar-sub">${escapeHtml(categoryName)} &nbsp;·&nbsp; ${questions.length} questions</div>
    </div>
    <div class="toolbar-right">
      <span class="kbd-hint">or press <span class="kbd">Ctrl</span> + <span class="kbd">P</span></span>
      <button class="btn-download" onclick="window.print()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v13M7 11l5 5 5-5"/><rect x="3" y="18" width="18" height="3" rx="1.5"/>
        </svg>
        Download PDF
      </button>
    </div>
  </div>

  <!-- Page content -->
  <div class="page">

    <!-- Header card -->
    <div class="header-card">
      <div class="header-badge">📋 Test Paper</div>
      <div class="header-title">${escapeHtml(testName)}</div>
      <div class="header-category">${escapeHtml(categoryName)}</div>
      <div class="header-meta">
        <div class="header-meta-item">📝 <strong>${questions.length}</strong> questions</div>
        <div class="header-meta-item">📅 <strong>${date}</strong></div>
        ${showAnswers ? '<div class="header-meta-item">✅ <strong>Answers &amp; Explanations included</strong></div>' : ''}
      </div>
    </div>

    <!-- Questions -->
    ${questions.map((q, idx) => generateQuestionHtml(q, idx, showAnswers)).join('')}

    <div class="footer">Generated from <strong>Exam Practice Portal</strong> &nbsp;·&nbsp; exam-practice-portal.web.app/</div>
  </div>

</body>
</html>`;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
}

/**
 * Check if a string contains HTML tags (rich content)
 */
function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Render as raw HTML if it has tags, otherwise escape as plain text.
 */
function renderContent(content: string): string {
  if (!content) return '';
  return isHtml(content) ? content : escapeHtml(content);
}

function generateQuestionHtml(question: Question, index: number, showAnswers: boolean): string {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const optionsHtml = question.options.map((opt, i) => {
    const isCorrect = showAnswers && i === question.correctAnswer;
    return `
    <div class="option-row${isCorrect ? ' correct' : ''}">
      <span class="option-label">${optionLabels[i]}.</span>
      <span class="option-text">${renderContent(opt)}${isCorrect ? ' ✓' : ''}</span>
    </div>`;
  }).join('');

  const answerHtml = showAnswers ? `
    <div class="answer-section">
      <div class="answer-label">✓ Correct Answer</div>
      <div class="answer-text">${optionLabels[question.correctAnswer]}. ${renderContent(question.options[question.correctAnswer])}</div>
    </div>` : '';

  const explanationHtml = showAnswers && question.explanation ? `
    <div class="explanation">
      <div class="explanation-label">💡 Explanation</div>
      <div class="explanation-text">${renderContent(question.explanation)}</div>
    </div>` : '';

  return `
    <div class="question-block">
      <div class="question-header">
        <div class="question-number">${index + 1}</div>
        <div class="question-text">${renderContent(question.question)}</div>
      </div>
      <div class="options">${optionsHtml}</div>
      ${answerHtml}
      ${explanationHtml}
    </div>`;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
