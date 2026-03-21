import { render, screen } from '@testing-library/react';

import ExamPage from './ExamPage';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock(
  '@/data/childExamOfConscience.json',
  () => [
    {
      categories: [],
      title: 'Obedience',
      commandment: '4',
      type: 'venial',
      question: 'Did I disobey?',
      description: '',
      counsels: [],
      prevention: [],
      saints: [],
    },
  ],
  { virtual: true },
);

jest.mock(
  '@/data/teenExamOfConscience.json',
  () => [
    {
      categories: [],
      title: 'Faith',
      commandment: '',
      type: 'mortal',
      question: 'Did I doubt?',
      description: '',
      counsels: [],
      prevention: [],
      saints: [],
    },
  ],
  { virtual: true },
);

jest.mock(
  '@/data/adultExamOfConscience.json',
  () => [
    {
      categories: ['married'],
      title: 'Love',
      commandment: '',
      type: 'mortal',
      question: 'Did I fail to love?',
      description: '',
      counsels: [],
      prevention: [],
      saints: [],
    },
  ],
  { virtual: true },
);

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
