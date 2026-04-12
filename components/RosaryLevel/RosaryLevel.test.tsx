import { render } from '@testing-library/react';

import RosaryLevel from './RosaryLevel';

jest.mock('@/context/LevelsContext', () => ({
  useLevelsContext: () => ({
    levels: [
      {
        label: 'Beginner',
        color: '#cd7f32',
        image: '/icon0.png',
        value: 'serpent_crusher',
      },
      {
        label: 'Warrior',
        color: '#c0c0c0',
        image: '/icon1.png',
        value: 'rosary_warrior',
      },
    ],
    getCurrentLevel: jest.fn(),
  }),
}));

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: () => ({
    t: {
      levelDescSerpentCrusher: 'Serpent Crusher description',
      levelDescDefault: 'Default description',
    },
  }),
}));

describe('RosaryLevel Component', () => {
  it('renders level icon for valid level', () => {
    const { getAllByAltText } = render(<RosaryLevel levelNum={0} />);
    expect(getAllByAltText('Beginner')[0]).toBeInTheDocument();
  });

  it('returns null for undefined level', () => {
    const { container } = render(<RosaryLevel levelNum={99} />);
    expect(container.firstChild).toBeNull();
  });
});
