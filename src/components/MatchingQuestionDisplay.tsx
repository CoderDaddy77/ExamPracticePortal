/**
 * MatchingQuestionDisplay
 * Renders a "Match the Following" question as a two-column grid
 * showing List I on the left and List II on the right — exactly
 * like a real exam paper.
 */
import { parseMatchingQuestion } from '../utils/parseMatchingQuestion';
import { RichContent } from './RichContent';

interface MatchingQuestionDisplayProps {
  /** Raw question string (may contain HTML or plain text) */
  questionText: string;
  /** Whether the dark theme is active */
  isDark?: boolean;
  /** CSS classes forwarded to the root element */
  className?: string;
}

export function MatchingQuestionDisplay({
  questionText,
  isDark = false,
  className = '',
}: MatchingQuestionDisplayProps) {
  const parsed = parseMatchingQuestion(questionText);

  // ----- Not a matching question — render normally -----
  if (!parsed) {
    return <RichContent content={questionText} as="div" className={className} />;
  }

  const { stem, listI, listII } = parsed;

  const maxRows = Math.max(listI.length, listII.length);

  const borderColor = isDark ? 'border-slate-600' : 'border-gray-300';
  const headerBg = isDark ? 'bg-slate-700 text-slate-100' : 'bg-[#e8f0fe] text-[#1a3a8a]';
  const rowBg = isDark ? 'bg-[#1e2030] text-slate-200' : 'bg-white text-gray-800';
  const altRowBg = isDark ? 'bg-[#252840] text-slate-200' : 'bg-[#f8f9ff] text-gray-800';
  const labelColor = isDark ? 'text-blue-400' : 'text-[#1a3a8a]';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Question stem */}
      {stem && (
        <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
          {stem}
        </p>
      )}

      {/* Two-column matching table */}
      <div
        className={`w-full overflow-hidden rounded-lg border-2 ${borderColor} shadow-sm`}
        role="table"
        aria-label="Match the following"
      >
        {/* Header row */}
        <div className={`grid grid-cols-2 ${headerBg}`} role="row">
          <div
            className={`px-4 py-2.5 font-bold text-sm tracking-wide border-r-2 ${borderColor}`}
            role="columnheader"
          >
            List I
          </div>
          <div
            className="px-4 py-2.5 font-bold text-sm tracking-wide"
            role="columnheader"
          >
            List II
          </div>
        </div>

        {/* Data rows */}
        {Array.from({ length: maxRows }).map((_, i) => {
          const left = listI[i];
          const right = listII[i];
          const bg = i % 2 === 0 ? rowBg : altRowBg;

          return (
            <div
              key={i}
              className={`grid grid-cols-2 border-t-2 ${borderColor} ${bg}`}
              role="row"
            >
              {/* List I cell */}
              <div
                className={`px-4 py-2.5 border-r-2 ${borderColor} flex items-start gap-2`}
                role="cell"
              >
                {left ? (
                  <>
                    <span className={`font-bold text-sm flex-shrink-0 w-6 ${labelColor}`}>
                      {left.label}.
                    </span>
                    <span className="text-sm leading-relaxed">{left.text}</span>
                  </>
                ) : null}
              </div>

              {/* List II cell */}
              <div
                className={`px-4 py-2.5 flex items-start gap-2`}
                role="cell"
              >
                {right ? (
                  <>
                    <span className={`font-bold text-sm flex-shrink-0 w-6 ${labelColor}`}>
                      {right.label}.
                    </span>
                    <span className="text-sm leading-relaxed">{right.text}</span>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
