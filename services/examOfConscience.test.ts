import {
  filterByVocation,
  getAllExams,
  getExamBySlug,
} from './examOfConscience';

describe('examOfConscience service', () => {
  describe('getExamBySlug', () => {
    it('returns the child exam for slug "child"', () => {
      const exam = getExamBySlug('child');
      expect(exam).toBeDefined();
      expect(exam!.slug).toBe('child');
      expect(exam!.label).toBe('Child Examination of Conscience');
      expect(exam!.questions.en.length).toBeGreaterThan(0);
    });

    it('returns the teen exam for slug "teen"', () => {
      const exam = getExamBySlug('teen');
      expect(exam).toBeDefined();
      expect(exam!.slug).toBe('teen');
      expect(exam!.questions.en.length).toBeGreaterThan(0);
    });

    it('returns the adult exam for slug "adult"', () => {
      const exam = getExamBySlug('adult');
      expect(exam).toBeDefined();
      expect(exam!.slug).toBe('adult');
      expect(exam!.questions.en.length).toBeGreaterThan(0);
    });

    it('returns undefined for an invalid slug', () => {
      expect(getExamBySlug('invalid')).toBeUndefined();
      expect(getExamBySlug('')).toBeUndefined();
    });
  });

  describe('getAllExams', () => {
    it('returns all three exam definitions', () => {
      const exams = getAllExams();
      expect(exams).toHaveLength(3);
      const slugs = exams.map((e) => e.slug);
      expect(slugs).toContain('child');
      expect(slugs).toContain('teen');
      expect(slugs).toContain('adult');
    });
  });

  describe('filterByVocation', () => {
    it('includes questions with empty categories for any vocation', () => {
      const questions = [
        {
          category: '',
          title: 'General',
          commandment: '',
          type: 'mortal' as const,
          question: 'A general question?',
          description: '',
          counsels: [],
          prevention: [],
          saints: [],
        },
      ];
      expect(filterByVocation(questions, 'married')).toHaveLength(1);
      expect(filterByVocation(questions, 'single')).toHaveLength(1);
    });

    it('filters questions by vocation category', () => {
      const questions = [
        {
          category: 'married',
          title: 'Marriage',
          commandment: '',
          type: 'mortal' as const,
          question: 'Married question?',
          description: '',
          counsels: [],
          prevention: [],
          saints: [],
        },
        {
          category: 'single',
          title: 'Single',
          commandment: '',
          type: 'mortal' as const,
          question: 'Single question?',
          description: '',
          counsels: [],
          prevention: [],
          saints: [],
        },
      ];
      const married = filterByVocation(questions, 'married');
      expect(married).toHaveLength(1);
      expect(married[0].title).toBe('Marriage');
    });
  });
});
