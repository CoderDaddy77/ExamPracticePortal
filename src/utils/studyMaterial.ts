import type { StudyMaterial, StudySection, Test } from '../types';

const buildSectionId = (index: number) => `study-${Date.now()}-${index}-${Math.random().toString(16).slice(2, 7)}`;

export const parseStudyMaterialInput = (rawText: string): StudySection[] => {
  // First try splitting by --- separator (new format)
  // If no --- found, fall back to splitting by double newlines (legacy format)
  const hasSeparators = rawText.includes('---');
  const blocks = hasSeparators
    ? rawText.split(/\n---\n/).map((block) => block.trim()).filter(Boolean)
    : rawText.split(/\n\s*\n/g).map((block) => block.trim()).filter(Boolean);

  if (blocks.length === 0) {
    return [];
  }

  return blocks.map((block, idx) => {
    const lines = block.split('\n');
    const firstLine = lines[0] || '';
    let title = `Note ${idx + 1}`;
    let contentLines = lines;

    // Check for :: separator in first line (Title :: ... format)
    if (firstLine.includes('::')) {
      const [rawTitle, ...rest] = firstLine.split('::');
      title = rawTitle.trim() || title;
      const remainder = rest.join('::').trim();
      // If there's text after :: on the same line, include it; otherwise use the remaining lines
      if (remainder) {
        contentLines = [remainder, ...lines.slice(1)].filter(Boolean);
      } else {
        // Title :: followed by newline, content starts from next line
        contentLines = lines.slice(1);
      }
    }

    const content = contentLines.map((l) => l.trim()).join('\n').trim();

    return {
      id: buildSectionId(idx),
      title,
      content: content || firstLine
    };
  });
};

export const sectionsToEditorText = (sections?: StudySection[]): string => {
  if (!sections || sections.length === 0) return '';
  return sections
    .map((section) => `${section.title} ::\n${section.content}`)
    .join('\n\n---\n\n');
};

export const upsertStudyMaterial = (_test: Test, sections: StudySection[]): StudyMaterial => ({
  sections: sections.map((section, idx) => ({
    ...section,
    id: section.id || buildSectionId(idx)
  })),
  lastUpdated: Date.now()
});

export const hasStudyMaterial = (test?: Test): boolean =>
  Boolean(
    (test?.studyMaterial?.sections && test.studyMaterial.sections.length > 0) ||
    (test?.studyMaterial?.cheatSheets && test.studyMaterial.cheatSheets.length > 0)
  );

