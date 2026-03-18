import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

import { CountdownDate, YouTubeSubscribe } from '@/components';
import { NAV_APP_LINKS } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { DataEvent } from '@/interfaces';

const EventGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoRows: '350px',
  gap: '1em 1em',
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});

const MainCard = styled(Card)({
  gridColumnStart: 1,
  gridColumnEnd: 2,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px',
  transition: 'transform 300ms',
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.01)',
  },
  '@media (min-width: 768px)': {
    gridColumnStart: 1,
    gridColumnEnd: 3,
    flexDirection: 'row',
  },
});

const EventCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px',
  transition: 'transform 300ms',
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.01)',
  },
});

const CardImage = styled(Box)({
  backgroundSize: 'cover',
  backgroundPosition: 'center top',
  width: '100%',
  height: '350px',
});

const EventTitle = styled(Typography)({
  fontSize: '1.2em',
  whiteSpace: 'nowrap',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const DateLabel = styled(Typography)({
  position: 'absolute',
  textAlign: 'right',
  fontSize: '0.9em',
});

const MainDescription = styled(Typography)({
  marginTop: '1em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  '@media (min-width: 768px)': {
    WebkitLineClamp: 4,
    marginTop: '2em',
  },
});

const Description = styled(Typography)({
  marginTop: '1em',
  fontSize: '1em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const EventDetails = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  height: 'auto',
}));

const MainEventDetails = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  height: 'auto',
  '@media (min-width: 768px)': {
    width: '60%',
  },
  '@media (min-width: 1024px)': {
    width: '50%',
  },
}));

interface Props {
  events: DataEvent[] | null;
}

const AllEventSection = ({ events }: Props) => {
  const { t } = useLanguageContext();
  if (events === null) return <p>{t.noEvents}</p>;

  return (
    <Container className="container-box" maxWidth="lg">
      <EventGrid>
        {events.map(
          ({ title, description, startedAt, slug, pictureUrl }, index) => {
            const CardComponent = index === 0 ? MainCard : EventCard;
            const DetailsComponent =
              index === 0 ? MainEventDetails : EventDetails;
            const DescComponent = index === 0 ? MainDescription : Description;
            return (
              <CardComponent
                key={title}
                // @ts-expect-error MUI polymorphic component prop
                component={Link}
                href={`${NAV_APP_LINKS.event.link}/${slug}`}
              >
                <CardImage style={{ backgroundImage: `url(${pictureUrl})` }} />
                {startedAt && (
                  <DateLabel variant="h6">
                    <CountdownDate targetTime={new Date(startedAt)} />
                  </DateLabel>
                )}
                <DetailsComponent>
                  <CardContent>
                    <EventTitle variant="h4">{title}</EventTitle>
                    <DescComponent fontWeight="light">
                      {description}
                    </DescComponent>
                    <Box>{index === 0 && <YouTubeSubscribe />}</Box>
                  </CardContent>
                </DetailsComponent>
              </CardComponent>
            );
          },
        )}
      </EventGrid>
    </Container>
  );
};

export default AllEventSection;
