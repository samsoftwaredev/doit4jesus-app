import { render, screen } from '@testing-library/react';

import ExamPage from './ExamPage';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

const mockChild = [
  {
    category: '',
    title: 'Obedience',
    commandment: '4',
    type: 'venial' as const,
    question: 'Did I disobey?',
    description: '',
    counsels: [],
    prevention: [],
    saints: [],
  },
];

const mockTeen = [
  {
    category: '',
    title: 'Faith',
    commandment: '',
    type: 'mortal' as const,
    question: 'Did I doubt?',
    description: '',
    counsels: [],
    prevention: [],
    saints: [],
  },
];

const mockAdult = [
  {
    category: 'married',
    title: 'Love',
    commandment: '',
    type: 'mortal' as const,
    question: 'Did I fail to love?',
    description: '',
    counsels: [],
    prevention: [],
    saints: [],
  },
];

jest.mock('@/services/examOfConscience', () => ({
  getExamBySlug: (slug: string) => {
    const exams: Record<string, unknown> = {
      child: {
        slug: 'child',
        label: 'Child Examination of Conscience',
        descriptionKey: 'forKidsDescription',
        questions: { en: mockChild, es: mockChild },
      },
      teen: {
        slug: 'teen',
        label: 'Teen Examination of Conscience',
        descriptionKey: 'forTeensDescription',
        questions: { en: mockTeen, es: mockTeen },
      },
      adult: {
        slug: 'adult',
        label: 'Adult Examination of Conscience',
        descriptionKey: 'forAdultsDescription',
        questions: { en: mockAdult, es: mockAdult },
      },
    };
    return exams[slug];
  },
  filterByVocation: jest.fn((questions: unknown[]) => questions),
}));

describe('ExamPage', () => {
  it('renders child exam page', () => {
    render(<ExamPage slug="child" />);
    expect(
      screen.getByText('Child Examination of Conscience'),
    ).toBeInTheDocument();
  });

  it('renders teen exam page', () => {
    render(<ExamPage slug="teen" />);
    expect(
      screen.getByText('Teen Examination of Conscience'),
    ).toBeInTheDocument();
  });

  it('renders adult exam page with vocation selection', () => {
    render(<ExamPage slug="adult" />);
    expect(
      screen.getByText('Adult Examination of Conscience'),
    ).toBeInTheDocument();
    expect(screen.getByText(/select/i)).toBeInTheDocument();
  });

  it('renders nothing for invalid slug', () => {
    const { container } = render(<ExamPage slug="invalid" />);
    expect(container.innerHTML).toBe('');
  });
});
