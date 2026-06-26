import { examCategories as defaultCategories } from '../data/mockData';

const TEST_KEY_SEPARATOR = '::';

const buildTestKey = (categoryId: string, subjectId: string | undefined, testId: string) =>
  `${categoryId}${TEST_KEY_SEPARATOR}${subjectId ?? 'root'}${TEST_KEY_SEPARATOR}${testId}`;

const defaultTestKeys = new Set<string>();

defaultCategories.forEach((category) => {
  if (category.subjects && category.subjects.length > 0) {
    category.subjects.forEach((subject) => {
      subject.tests.forEach((test) => {
        defaultTestKeys.add(buildTestKey(category.id, subject.id, test.id));
      });
      subject.chapters?.forEach((chapter) => {
        chapter.tests.forEach((test) => {
          defaultTestKeys.add(buildTestKey(category.id, subject.id, test.id));
        });
      });
    });
  } else {
    category.tests?.forEach((test) => {
      defaultTestKeys.add(buildTestKey(category.id, undefined, test.id));
    });
  }
});

export const isDefaultTest = (
  categoryId: string,
  subjectId: string | undefined,
  testId: string
): boolean => defaultTestKeys.has(buildTestKey(categoryId, subjectId, testId));
