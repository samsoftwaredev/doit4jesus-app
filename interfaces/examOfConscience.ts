/** Slugs used in exam routes: /app/confession/exam/:slug */
export type ExamSlug = 'child' | 'teen' | 'adult';

/** Sin severity classification. */
export type SinType = 'mortal' | 'venial';

/** A single question in an examination of conscience. */
export interface ExamQuestion {
  categories: string[];
  title: string;
  commandment: string;
  type: SinType;
  question: string;
  description: string;
  counsels: string[];
  prevention: string[];
  saints: string[];
}

/** Metadata + questions for one exam type. */
export interface ExamDefinition {
  slug: ExamSlug;
  label: string;
  descriptionKey: string;
  questions: ExamQuestion[];
}

/** Vocation filter for the adult exam. */
export type Vocation = 'married' | 'single' | 'religious';

/** Valid exam slugs for runtime validation. */
export const VALID_EXAM_SLUGS: readonly ExamSlug[] = [
  'child',
  'teen',
  'adult',
] as const;

export const isValidExamSlug = (value: string): value is ExamSlug =>
  VALID_EXAM_SLUGS.includes(value as ExamSlug);
