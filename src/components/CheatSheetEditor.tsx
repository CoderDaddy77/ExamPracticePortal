import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, Type, Minus, ChevronDown, ChevronUp, ClipboardPaste, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CheatSheet, CheatSheetRow } from '../types';

interface CheatSheetEditorProps {
  isDark: boolean;
  existingSheets: CheatSheet[];
  onChange: (sheets: CheatSheet[]) => void;
}

// ── tiny helper: render **bold** and *italic* inside preview ──────────────────
function richify(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}

// ── MARKDOWN PARSER ───────────────────────────────────────────────────────────
let _idCtr = 0;
const uid = () => `row-${Date.now()}-${_idCtr++}`;

function parseMarkdownToCheatSheet(md: string): CheatSheet | null {
  const lines = md.split('\n');
  let title = '';
  let subtitle = '';
  let emoji = '📋';
  let columns: string[] = [];
  const rows: CheatSheetRow[] = [];
  let seenSubtitle = false;
  let columnsLocked = false; // once columns set from first table header, don't override
  let afterSeparator = false; // true once we've seen the | --- | row
  let pendingHeader: string[] | null = null; // candidate column header row

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { afterSeparator = false; continue; }

    // H1 → cheat sheet title (take first)
    if (line.startsWith('# ') && !title) {
      const raw = line.slice(2).trim();
      // Grab leading emoji cluster (non-ASCII, up to 4 chars wide)
      const em = raw.match(/^([\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{FE00}-\u{FEFF}]+)/u);
      if (em) { emoji = em[1]; title = raw.slice(em[0].length).trim(); }
      else title = raw;
      continue;
    }

    // H2 / H3 → section-title row
    if (/^#{2,4}\s/.test(line)) {
      const text = line.replace(/^#{2,4}\s+/, '').trim();
      rows.push({ id: uid(), cells: [text], isSectionTitle: true });
      afterSeparator = false;
      pendingHeader = null;
      continue;
    }

    // Horizontal rule — skip
    if (/^[-*_]{3,}$/.test(line)) { afterSeparator = false; continue; }

    // Table row
    if (line.startsWith('|')) {
      const rawCells = line.split('|');
      const cells = rawCells.slice(1, rawCells.length - 1).map(c => c.trim());

      // Separator row  | --- | --- |
      if (cells.every(c => /^[-:\s]*$/.test(c) && c.length > 0)) {
        if (pendingHeader && !columnsLocked) {
          columns = pendingHeader;
          columnsLocked = true;
        }
        pendingHeader = null;
        afterSeparator = true;
        continue;
      }

      // Potential header / data row
      if (!columnsLocked) {
        // First non-separator table row → candidate column header
        pendingHeader = cells;
        continue;
      }

      // Columns are locked — is this a repeated header? Skip it.
      if (
        cells.length === columns.length &&
        cells.every((c, i) => c === columns[i])
      ) {
        // repeated header from next sub-table; next separator will be skipped
        pendingHeader = cells;
        afterSeparator = false;
        continue;
      }

      if (!afterSeparator) continue; // shouldn't happen, but guard

      // ── Real data row ──
      const normalised = Array.from({ length: columns.length }, (_, i) => cells[i] ?? '');
      rows.push({ id: uid(), cells: normalised, isSectionTitle: false });
      continue;
    }

    afterSeparator = false;

    // Numbered list item (like "1. **Bold:** text") → section-title span row
    if (/^\d+\.\s/.test(line)) {
      rows.push({ id: uid(), cells: [line], isSectionTitle: true });
      continue;
    }

    // Bold-formatted line (no heading prefix) → use as subtitle once
    if (!seenSubtitle && line.includes('**') && !line.startsWith('#')) {
      subtitle = line.replace(/\*\*/g, '').trim();
      seenSubtitle = true;
    }
  }

  if (!title && columns.length === 0) return null;

  return {
    id: `cs-import-${Date.now()}`,
    title: title || 'Imported Cheat Sheet',
    subtitle,
    emoji,
    columns: columns.length > 0 ? columns : ['Content'],
    rows,
  };
}

// ── Smart Import Panel ────────────────────────────────────────────────────────
interface ImportPanelProps {
  isDark: boolean;
  onImport: (sheet: CheatSheet) => void;
}

function ImportPanel({ isDark, onImport }: ImportPanelProps) {
  const [open, setOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = () => {
    if (!pasteText.trim()) {
      setStatus('err');
      setErrMsg('Paste Something! 😄');
      return;
    }
    const result = parseMarkdownToCheatSheet(pasteText);
    if (!result) {
      setStatus('err');
      setErrMsg("Markdown doesn't have table format. Try again!");
      return;
    }
    onImport(result);
    setStatus('ok');
    setPasteText('');
    setTimeout(() => {
      setOpen(false);
      setStatus('idle');
    }, 1200);
  };

  const btnBase = `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all`;

  return (
    <div
      className={`rounded-xl border-2 mb-4 overflow-hidden transition-colors ${isDark
          ? 'border-slate-700/60 bg-slate-900/20'
          : 'border-slate-200 bg-slate-50/60'
        }`}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setStatus('idle'); }}
        className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors ${open
            ? isDark ? 'bg-slate-800/60' : 'bg-slate-100/80'
            : isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/50'
          }`}
      >
        <div className="flex items-center gap-2.5">
          <ClipboardPaste size={17} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              ⚡ Smart Import — Gemini / Copy-Paste from AI
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Paste Markdown table → auto-import in one click
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'ok' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 animate-pulse">
              <CheckCircle2 size={14} /> Imported!
            </span>
          )}
          {open
            ? <ChevronUp size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            : <ChevronDown size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3">
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Paste the output from AI. Markdown tables (<code className={`px-1 rounded ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>| col | col |</code>) automatically parse ho jayenge.
          </p>

          <textarea
            ref={textareaRef}
            value={pasteText}
            onChange={e => { setPasteText(e.target.value); setStatus('idle'); }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleParse(); }}
            placeholder={`# 🕰️ THE TENSES CHEAT SHEET\n\n**Base Kaam:** Write (V1), Wrote (V2)\n\n### 🟢 1. PRESENT TENSE\n| Tense | Formula | Example | Desi Logic |\n| --- | --- | --- | --- |\n| Simple | V1 | I write. | Routine |`}
            rows={9}
            className={`w-full p-3 border rounded-xl text-xs font-mono focus:outline-none resize-y transition-colors ${isDark
                ? 'bg-[#0f1117] border-slate-700 text-slate-300 focus:border-emerald-500 placeholder-slate-600'
                : 'bg-white border-gray-200 text-gray-800 focus:border-emerald-500 placeholder-gray-300'
              } ${status === 'err' ? (isDark ? '!border-red-500/60' : '!border-red-400') : ''}`}
          />

          {status === 'err' && (
            <p className={`text-xs mt-1.5 flex items-center gap-1 text-red-400`}>
              <AlertCircle size={12} /> {errMsg}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <button
              type="button"
              onClick={handleParse}
              className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700 shadow-md`}
            >
              <Sparkles size={15} />
              Parse &amp; Import
              <span className={`text-xs opacity-70`}>(Ctrl+Enter)</span>
            </button>
            <button
              type="button"
              onClick={() => { setPasteText(''); setStatus('idle'); textareaRef.current?.focus(); }}
              className={`${btnBase} ${isDark ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Clear
            </button>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              Import karne ke baad neeche editor mein edit bhi kar sakte ho ✏️
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper functions ──────────────────────────────────────────────────────────
const emptySheet = (): CheatSheet => ({
  id: `cs-${Date.now()}`,
  title: '',
  subtitle: '',
  emoji: '📋',
  columns: ['Column 1', 'Column 2', 'Column 3'],
  rows: [],
});

const emptyRow = (colCount: number): CheatSheetRow => ({
  id: uid(),
  cells: Array(colCount).fill(''),
  isSectionTitle: false,
});

const sectionRow = (): CheatSheetRow => ({
  id: uid(),
  cells: [''],
  isSectionTitle: true,
});

// ── Single sheet editor panel ─────────────────────────────────────────────────
interface SingleEditorProps {
  sheet: CheatSheet;
  isDark: boolean;
  index: number;
  totalSheets: number;
  onChange: (updated: CheatSheet) => void;
  onDelete: () => void;
}

function SingleSheetEditor({ sheet, isDark, index, totalSheets, onChange, onDelete }: SingleEditorProps) {
  const [open, setOpen] = useState(true);

  const input = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${isDark
      ? 'bg-[#1E1E1D] border-slate-600 text-slate-100 focus:border-indigo-400 placeholder-slate-500'
      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
    }`;

  const updateColumns = (raw: string) => {
    const cols = raw.split(',').map(c => c.trim()).filter(Boolean);
    const newCols = cols.length > 0 ? cols : ['Column 1'];
    const colCount = newCols.length;
    const rows = sheet.rows.map(r => ({
      ...r,
      cells: r.isSectionTitle
        ? r.cells
        : Array.from({ length: colCount }, (_, i) => r.cells[i] ?? ''),
    }));
    onChange({ ...sheet, columns: newCols, rows });
  };

  const addDataRow = () => onChange({ ...sheet, rows: [...sheet.rows, emptyRow(sheet.columns.length)] });
  const addSectionRow = () => onChange({ ...sheet, rows: [...sheet.rows, sectionRow()] });
  const updateRow = (rowId: string, updated: CheatSheetRow) =>
    onChange({ ...sheet, rows: sheet.rows.map(r => r.id === rowId ? updated : r) });
  const deleteRow = (rowId: string) =>
    onChange({ ...sheet, rows: sheet.rows.filter(r => r.id !== rowId) });

  const moveRow = (rowId: string, dir: -1 | 1) => {
    const idx = sheet.rows.findIndex(r => r.id === rowId);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= sheet.rows.length) return;
    const rows = [...sheet.rows];
    [rows[idx], rows[next]] = [rows[next], rows[idx]];
    onChange({ ...sheet, rows });
  };

  const card = `rounded-xl border-2 mb-3 overflow-hidden transition-colors ${isDark ? 'border-slate-700 bg-[#1F1F1E]' : 'border-indigo-100 bg-indigo-50/40'
    }`;
  const sectionLabel = isDark ? 'text-slate-300' : 'text-gray-700';

  return (
    <div className={card}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${open
            ? isDark ? 'bg-indigo-900/20' : 'bg-indigo-100/60'
            : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-indigo-100/30'
          }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{sheet.emoji || '📋'}</span>
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
              {sheet.title || `Cheat Sheet ${index + 1}`}
            </p>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {sheet.columns.length} columns · {sheet.rows.length} rows
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {totalSheets > 1 && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
              title="Delete this cheat sheet"
            >
              <Trash2 size={15} />
            </button>
          )}
          {open
            ? <ChevronUp size={16} className={isDark ? 'text-slate-400' : 'text-gray-400'} />
            : <ChevronDown size={16} className={isDark ? 'text-slate-400' : 'text-gray-400'} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3 space-y-4">
          {/* Title / Subtitle / Emoji */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] gap-3 items-end">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${sectionLabel}`}>Emoji</label>
              <input value={sheet.emoji ?? ''} onChange={e => onChange({ ...sheet, emoji: e.target.value })}
                placeholder="📋" className={`${input} w-16 text-center text-lg`} maxLength={4} />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${sectionLabel}`}>Title *</label>
              <input value={sheet.title} onChange={e => onChange({ ...sheet, title: e.target.value })}
                placeholder="e.g. THE TENSES CHEAT SHEET" className={input} />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${sectionLabel}`}>Subtitle (optional)</label>
              <input value={sheet.subtitle ?? ''} onChange={e => onChange({ ...sheet, subtitle: e.target.value })}
                placeholder="e.g. Base Kaam: Write (V1), Wrote (V2)…" className={input} />
            </div>
          </div>

          {/* Columns */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${sectionLabel}`}>
              Column Headers <span className={`font-normal ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>(comma-separated)</span>
            </label>
            <input value={sheet.columns.join(', ')} onChange={e => updateColumns(e.target.value)}
              placeholder="e.g. Tense Name, Formula, One Example, Desi Logic" className={input} />
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              Current: {sheet.columns.map((c, i) =>
                <span key={i} className={`inline-block px-1.5 py-0.5 rounded text-xs mr-1 mt-0.5 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-white text-gray-600 border border-gray-200'}`}>{c}</span>
              )}
            </p>
          </div>

          {/* Rows */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${sectionLabel}`}>
              Rows <span className={`font-normal ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>(use **text** for bold, *text* for italic)</span>
            </label>

            {sheet.rows.length === 0 && (
              <p className={`text-xs italic mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                No rows yet — click "Add Row" or "Add Section Header" below.
              </p>
            )}

            <div className="space-y-2">
              {sheet.rows.map((row, rowIdx) => (
                <div
                  key={row.id}
                  className={`rounded-lg border p-3 ${row.isSectionTitle
                      ? isDark ? 'border-slate-600/50 bg-slate-800/40' : 'border-slate-200 bg-slate-100/60'
                      : isDark ? 'border-slate-700 bg-[#1E1E1D]' : 'border-gray-200 bg-white'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Move handle */}
                    <div className="flex flex-col gap-0.5 mt-1.5 flex-shrink-0">
                      <button type="button" onClick={() => moveRow(row.id, -1)} disabled={rowIdx === 0}
                        className={`p-0.5 rounded transition-colors disabled:opacity-25 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`} title="Move up">
                        <ChevronUp size={12} />
                      </button>
                      <GripVertical size={12} className={isDark ? 'text-slate-600' : 'text-gray-300'} />
                      <button type="button" onClick={() => moveRow(row.id, 1)} disabled={rowIdx === sheet.rows.length - 1}
                        className={`p-0.5 rounded transition-colors disabled:opacity-25 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`} title="Move down">
                        <ChevronDown size={12} />
                      </button>
                    </div>

                    {/* Cell inputs */}
                    <div className="flex-1 min-w-0">
                      {row.isSectionTitle ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold text-sm">§</span>
                          <input value={row.cells[0] ?? ''}
                            onChange={e => updateRow(row.id, { ...row, cells: [e.target.value] })}
                            placeholder="e.g. 1. PRESENT TENSE (Jo abhi ka time hai)"
                            className={`${input} font-semibold`} />
                        </div>
                      ) : (
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${sheet.columns.length}, 1fr)` }}>
                          {sheet.columns.map((col, ci) => (
                            <div key={ci}>
                              <p className={`text-xs mb-0.5 truncate ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{col}</p>
                              <textarea
                                value={row.cells[ci] ?? ''}
                                onChange={e => {
                                  const cells = [...row.cells];
                                  cells[ci] = e.target.value;
                                  updateRow(row.id, { ...row, cells });
                                }}
                                placeholder={`${col}…`}
                                rows={2}
                                className={`${input} resize-none leading-snug`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button type="button" onClick={() => deleteRow(row.id)}
                      className={`p-1.5 mt-0.5 rounded-lg flex-shrink-0 transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}
                      title="Delete row">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add row buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button type="button" onClick={addDataRow}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/40 hover:bg-indigo-600/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'}`}>
                <Plus size={14} /> Add Row
              </button>
              <button type="button" onClick={addSectionRow}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700/30 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}>
                <Minus size={14} /> Add Section Header
              </button>
            </div>
          </div>

          {/* Live preview */}
          {sheet.rows.length > 0 && sheet.columns.length > 0 && (
            <details className="mt-2">
              <summary className={`text-xs cursor-pointer select-none font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Preview (first 3 rows)
              </summary>
              <div className="mt-2 overflow-x-auto rounded-lg border text-xs" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(224,231,255,0.7)' }}>
                      {sheet.columns.map((c, i) => (
                        <th key={i} className={`px-3 py-2 text-left font-semibold border-b ${isDark ? 'text-indigo-300 border-slate-700' : 'text-indigo-700 border-indigo-200'}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.rows.slice(0, 3).map(row =>
                      row.isSectionTitle ? (
                        <tr key={row.id} style={{ background: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.5)' }}>
                          <td colSpan={sheet.columns.length} className={`px-3 py-2 font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            § {richify(row.cells[0] ?? '')}
                          </td>
                        </tr>
                      ) : (
                        <tr key={row.id}>
                          {sheet.columns.map((_, ci) => (
                            <td key={ci} className={`px-3 py-2 border-t align-top ${isDark ? 'text-slate-300 border-slate-700/50' : 'text-gray-700 border-gray-100'}`}>
                              {richify(row.cells[ci] ?? '')}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main exported editor ──────────────────────────────────────────────────────
export function CheatSheetEditor({ isDark, existingSheets, onChange }: CheatSheetEditorProps) {
  const [sheets, setSheets] = useState<CheatSheet[]>(() =>
    existingSheets && existingSheets.length > 0 ? existingSheets : [emptySheet()]
  );

  useEffect(() => {
    if (existingSheets && existingSheets.length > 0) {
      setSheets(existingSheets);
    } else {
      setSheets([emptySheet()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(existingSheets)]);

  const update = (updated: CheatSheet[]) => {
    setSheets(updated);
    onChange(updated);
  };

  const addSheet = () => update([...sheets, emptySheet()]);
  const deleteSheet = (id: string) => {
    const filtered = sheets.filter(s => s.id !== id);
    update(filtered.length > 0 ? filtered : [emptySheet()]);
  };
  const updateSheet = (id: string, updated: CheatSheet) =>
    update(sheets.map(s => s.id === id ? updated : s));

  // Called by ImportPanel — prepend imported sheet (or replace blank placeholder)
  const handleImport = (parsed: CheatSheet) => {
    const isCurrentEmpty = sheets.length === 1 && !sheets[0].title && sheets[0].rows.length === 0;
    update(isCurrentEmpty ? [parsed] : [parsed, ...sheets]);
  };

  return (
    <div>
      {/* ⚡ Smart Import at the top */}
      <ImportPanel isDark={isDark} onImport={handleImport} />

      {/* Manual editors */}
      {sheets.map((sheet, idx) => (
        <SingleSheetEditor
          key={sheet.id}
          sheet={sheet}
          isDark={isDark}
          index={idx}
          totalSheets={sheets.length}
          onChange={updated => updateSheet(sheet.id, updated)}
          onDelete={() => deleteSheet(sheet.id)}
        />
      ))}

      <button
        type="button"
        onClick={addSheet}
        className={`w-full mt-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${isDark
            ? 'border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-300'
            : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-600'
          }`}
      >
        <Plus size={15} />
        Add Another Cheat Sheet
      </button>

      <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
        <Type size={11} className="inline mr-1" />
        Tip: Use <code className="px-1 py-0.5 rounded" style={{ background: isDark ? '#1e293b' : '#f1f5f9' }}>**bold**</code> and{' '}
        <code className="px-1 py-0.5 rounded" style={{ background: isDark ? '#1e293b' : '#f1f5f9' }}>*italic*</code> inside cells.
      </p>
    </div>
  );
}
