import enAdultExamOfConscience from '@/data/en.adultExamOfConscience.json';
import enChildExamOfConscience from '@/data/en.childExamOfConscience.json';
import enTeenExamOfConscience from '@/data/en.teenExamOfConscience.json';
import esAdultExamOfConscience from '@/data/es.adultExamOfConscience.json';
import esChildExamOfConscience from '@/data/es.childExamOfConscience.json';
import esTeenExamOfConscience from '@/data/es.teenExamOfConscience.json';
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
    questions: {
      en: enAdultExamOfConscience as ExamQuestion[],
      es: esAdultExamOfConscience as ExamQuestion[],
    },
  },
  teen: {
    slug: 'teen',
    label: 'Teen Examination of Conscience',
    descriptionKey: 'forTeensDescription',
    questions: {
      en: enTeenExamOfConscience as ExamQuestion[],
      es: esTeenExamOfConscience as ExamQuestion[],
    },
  },
  child: {
    slug: 'child',
    label: 'Child Examination of Conscience',
    descriptionKey: 'forKidsDescription',
    questions: {
      en: enChildExamOfConscience as ExamQuestion[],
      es: esChildExamOfConscience as ExamQuestion[],
    },
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
    if (!q.category || q.category.length === 0) return true;
    return q.category.includes(vocation);
  });
