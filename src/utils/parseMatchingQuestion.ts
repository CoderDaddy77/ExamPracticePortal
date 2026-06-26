/**
 * Parses a "Match the Following" question string into structured List I / List II data.
 *
 * Supports two input formats:
 *   1. Parenthesised inline:
 *      "... List I (A. X, B. Y) List II (1. a, 2. b)"
 *   2. Pipe-delimited inline items (used in the question editor):
 *      detected by presence of "List I" AND "List II" anywhere in the string.
 *
 * Returns null if the question does not look like a matching question.
 */

export interface MatchingData {
  /** The stem before "List I" */
  stem: string;
  listI: { label: string; text: string }[];
  listII: { label: string; text: string }[];
}

// Captures content between parentheses after "List I" / "List II"
const LIST_PATTERN =
  /List\s+I\s*\(([^)]+)\)\s*List\s+II\s*\(([^)]+)\)/i;

// Items like "A. some text", "1. some text", "(A) text", "(1) text"
const ITEM_RE = /([A-Da-d1-4])[.)]\s*([^,]+?)(?=\s*,\s*[A-Da-d1-4][.)]|$)/g;

function extractItems(raw: string): { label: string; text: string }[] {
  const items: { label: string; text: string }[] = [];
  let m: RegExpExecArray | null;
  ITEM_RE.lastIndex = 0;
  while ((m = ITEM_RE.exec(raw)) !== null) {
    items.push({ label: m[1].toUpperCase(), text: m[2].trim() });
  }
  return items;
}

export function parseMatchingQuestion(questionText: string): MatchingData | null {
  // Strip any HTML tags before processing
  const plain = questionText.replace(/<[^>]*>/g, '').trim();

  const match = LIST_PATTERN.exec(plain);
  if (!match) return null;

  const listIRaw = match[1];
  const listIIRaw = match[2];

  const listI = extractItems(listIRaw);
  const listII = extractItems(listIIRaw);

  if (listI.length === 0 || listII.length === 0) return null;

  // Stem = everything before "List I"
  const stemEnd = plain.search(/List\s+I\s*\(/i);
  const stem = stemEnd > 0 ? plain.substring(0, stemEnd).trim() : '';

  return { stem, listI, listII };
}
