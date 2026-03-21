import adultExamOfConscience from '@/data/adultExamOfConscience.json';
import childExamOfConscience from '@/data/childExamOfConscience.json';
import teenExamOfConscience from '@/data/teenExamOfConscience.json';
import type {
  ExamDefinition,
  ExamQuestion,
  ExamSlug,
  Vocation,
} from '@/interfaces/examOfConscience';

const examMap: Record<ExamSlug, ExamDefinition> = {
  adult: {
    slug: 'adult',
    label: 'Adult Examination of Conscience',
    descriptionKey: 'forAdultsDescription',
    questions: adultExamOfConscience as ExamQuestion[],
  },

  teen: {
    slug: 'teen',
    label: 'Teen Examination of Conscience',
    descriptionKey: 'forTeensDescription',
    questions: teenExamOfConscience as ExamQuestion[],
  },
  child: {
    slug: 'child',
    label: 'Child Examination of Conscience',
    descriptionKey: 'forKidsDescription',
    questions: childExamOfConscience as ExamQuestion[],
  },
};

/** Get exam definition by slug. Returns undefined for invalid slugs. */
export const getExamBySlug = (slug: string): ExamDefinition | undefined =>
  examMap[slug as ExamSlug];

/** Get all exam definitions (for listing). */
export const getAllExams = (): ExamDefinition[] => Object.values(examMap);

/** Filter adult exam questions by vocation. */
export const filterByVocation = (
  questions: ExamQuestion[],
  vocation: Vocation,
): ExamQuestion[] =>
  questions.filter((q) => {
    if (!q.categories || q.categories.length === 0) return true;
    return q.categories.includes(vocation);
  });
