import { render, screen } from '@testing-library/react';

import SelectExamOfConscience from './SelectExamOfConscience';

describe('SelectExamOfConscience Component', () => {
  it('renders three exam cards', () => {
    render(<SelectExamOfConscience />);
    expect(screen.getByText('For Kids')).toBeInTheDocument();
    expect(screen.getByText('For Teens')).toBeInTheDocument();
    expect(screen.getByText('For Adults')).toBeInTheDocument();
  });

  it('renders the selection heading', () => {
    render(<SelectExamOfConscience />);
    expect(
      screen.getByText('Select conscience examination:'),
    ).toBeInTheDocument();
  });

  it('renders links to dedicated exam pages', () => {
    render(<SelectExamOfConscience />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/app/confession/exam/child');
    expect(hrefs).toContain('/app/confession/exam/teen');
    expect(hrefs).toContain('/app/confession/exam/adult');
  });
});
