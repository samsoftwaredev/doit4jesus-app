import { render, screen } from '@testing-library/react';

import PageNotFound from './PageNotFound';

jest.mock('@/components/Templates', () => ({
  MainLayout: ({ children }: any) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe('PageNotFound Component', () => {
  it('renders default 404 title', () => {
    render(<PageNotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders default description', () => {
    render(<PageNotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<PageNotFound title="Oops" description="Nothing here" />);
    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders within MainLayout', () => {
    render(<PageNotFound />);
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});
