import { render, screen } from '@testing-library/react';

import BadgeShareCardPreview from './BadgeShareCardPreview';

jest.mock('@/utils/badgeShareCardGenerator', () => ({
  generateBadgeShareCard: jest.fn(),
}));

describe('BadgeShareCardPreview Component', () => {
  const mockData = {
    appName: 'DoIt4Jesus',
    badgeName: 'First Rosary',
    badgeDescription: 'Prayed your first rosary',
    verseReference: 'John 3:16',
    verseText: 'For God so loved the world...',
    earnedAtLabel: 'Earned on 1/1/2026',
    earnedByLabel: 'Earned by',
    userName: 'Test User',
    shareEncouragementLabel: 'Share this achievement!',
    shareMessage: 'I earned First Rosary!',
    colors: {
      backgroundStart: '#000',
      backgroundMid: '#333',
      backgroundEnd: '#666',
      halo: '#fff',
      shapeOverlay: '#999',
      border: '#aaa',
      accent: '#gold',
      title: '#fff',
      body: '#eee',
      muted: '#ccc',
      panel: '#222',
      panelStrong: '#444',
    },
  };

  it('renders a canvas element', () => {
    const { container } = render(<BadgeShareCardPreview data={mockData} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('calls generateBadgeShareCard with the data', () => {
    const {
      generateBadgeShareCard,
    } = require('@/utils/badgeShareCardGenerator');
    render(<BadgeShareCardPreview data={mockData} />);
    expect(generateBadgeShareCard).toHaveBeenCalled();
  });
});
