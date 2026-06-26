import { Fragment } from 'react';
import type { CheatSheet } from '../types';

interface CheatSheetDisplayProps {
  sheet: CheatSheet;
  isDark: boolean;
}

/**
 * Converts **bold** and *italic* markers in plain text to React elements.
 * Supports newlines rendered as <br />.
 */
function renderCell(text: string) {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    // Split on **bold** first, then *italic* — order matters to avoid partial matches
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    const rendered = parts.map((p, pi) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={pi}>{p.slice(2, -2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*'))
        return <em key={pi}>{p.slice(1, -1)}</em>;
      return <span key={pi}>{p}</span>;
    });
    return (
      <span key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function CheatSheetDisplay({ sheet, isDark }: CheatSheetDisplayProps) {
  const colCount = sheet.columns.length;

  // ── Unified palette — high contrast on dark #1F1F1E ─────────────────────
  const wrapBg = isDark ? '#1F1F1E' : '#ffffff';  // much darker card
  const wrapBorder = isDark ? '#2E2E2D' : '#e2e8f0';
  const titleColor = isDark ? '#e4e4e7' : '#1e293b';  // same brightness as content
  const subtitleColor = isDark ? '#9ca3af' : '#64748b';

  // table — single surface, high-contrast text
  const theadBg = 'transparent';
  const thColor = isDark ? '#e4e4e7' : '#1e293b';  // match content brightness
  const thBorder = isDark ? '#3A3A39' : '#cbd5e1';
  const tdBorderColor = isDark ? '#323231' : '#e2e8f0';  // barely visible row lines
  const tdColorNorm = isDark ? '#e4e4e7' : '#374151';  // zinc-200 — bright & readable
  const trEvenBg = 'transparent';                                       // no alternating

  // section-title row — clear visual separation
  const secRowBg = 'transparent';
  const secTextColor = isDark ? '#e4e4e7' : '#0F0F0F';  // same as content — no dullness
  const secSepColor = isDark ? '#1F1F1E' : '#cbd5e1';   // subtle divider line

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{ border: `1px solid ${wrapBorder}`, background: wrapBg }}
    >
      {/* ── header ── */}
      <div
        className="px-6 pt-6 pb-4"
        style={{ borderBottom: `1px solid ${wrapBorder}` }}
      >
        <div className="flex items-start gap-3">
          {sheet.emoji && (
            <span className="text-3xl leading-none mt-0.5 select-none">{sheet.emoji}</span>
          )}
          <div>
            <h2
              className="text-2xl font-black tracking-tight leading-snug"
              style={{ color: titleColor }}
            >
              {sheet.title}
            </h2>
            {sheet.subtitle && (
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: subtitleColor }}
              >
                {sheet.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── table ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          {/* Column headers */}
          <colgroup>
            {sheet.columns.map((_, i) => (
              <col key={i} style={{ width: `${100 / colCount}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ background: theadBg }}>
              {sheet.columns.map((col, ci) => (
                <th
                  key={ci}
                  className="px-4 py-3 text-left text-sm font-bold tracking-wide"
                  style={{
                    color: thColor,
                    borderBottom: `2px solid ${thBorder}`,
                    borderRight: ci < colCount - 1 ? `1px solid ${thBorder}` : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sheet.rows.length === 0 && (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-6 text-center text-sm italic"
                  style={{ color: subtitleColor }}
                >
                  No rows added yet.
                </td>
              </tr>
            )}

            {sheet.rows.map((row, ri) => {
              if (row.isSectionTitle) {
                return (
                  <Fragment key={row.id}>
                    {(ri === 0 || !sheet.rows[ri - 1].isSectionTitle) && (
                      <tr style={{ height: '28px' }}>
                        <td
                          colSpan={colCount}
                          style={{
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderTop: `1px solid ${isDark ? '#1F1F1E' : '#cbd5e1'}`,
                            borderBottom: `1px solid ${isDark ? '#1F1F1E' : '#cbd5e1'}`,
                            background: isDark ? '#1F1F1E' : '#F6F8F9',
                          }}
                        />
                      </tr>
                    )}
                    <tr style={{ background: secRowBg }}>
                      <td
                        colSpan={colCount}
                        className="px-5"
                        style={{
                          paddingTop: '14px',
                          paddingBottom: '14px',
                          borderBottom: `1px solid ${tdBorderColor}`,
                          borderTop: `1px solid ${secSepColor}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            color: secTextColor,
                          }}
                        >
                          {renderCell(row.cells[0] ?? '')}
                        </span>
                      </td>
                    </tr>
                  </Fragment>
                );
              }

              const isEven = ri % 2 === 0;
              return (
                <tr
                  key={row.id}
                  style={{ background: isEven ? 'transparent' : trEvenBg }}
                  className="transition-colors hover:brightness-95"
                >
                  {sheet.columns.map((_, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-3 align-top text-sm leading-relaxed"
                      style={{
                        color: tdColorNorm,
                        borderBottom: `1px solid ${tdBorderColor}`,
                        borderRight: ci < colCount - 1 ? `1px solid ${tdBorderColor}` : undefined,
                        wordBreak: 'break-word',
                      }}
                    >
                      {renderCell(row.cells[ci] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
