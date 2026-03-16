import { render } from '@testing-library/react';

import RosaryLevel from './RosaryLevel';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/utils/levels', () => ({
  levels: [
    { label: 'Beginner', color: '#cd7f32', icon: '/icon0.png' },
    { label: 'Warrior', color: '#c0c0c0', icon: '/icon1.png' },
  ],
}));

describe('RosaryLevel Component', () => {
  it('renders level icon for valid level', () => {
    const { getByAltText } = render(<RosaryLevel levelNum={0} />);
    expect(getByAltText('Beginner')).toBeInTheDocument();
  });

  it('returns null for undefined level', () => {
    const { container } = render(<RosaryLevel levelNum={99} />);
    expect(container.firstChild).toBeNull();
  });
});
