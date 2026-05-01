import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import GlobalPrayerMap from '@/components/GlobalPrayerMap';
import { useGlobalPrayerMap } from '@/hooks/useGlobalPrayerMap';

const SectionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
});

const GlobalPrayerMapSection = () => {
  const { prayerCities, mapLoading, activeOnlineUsers } = useGlobalPrayerMap();

  return (
    <Container className="container-box" maxWidth="md">
      <SectionGrid>
        {/* ── D3 Global Prayer Map ──────────────────────────────────────── */}
        <GlobalPrayerMap
          activeUsers={activeOnlineUsers}
          cities={mapLoading ? undefined : prayerCities}
        />
      </SectionGrid>
    </Container>
  );
};

export default GlobalPrayerMapSection;
