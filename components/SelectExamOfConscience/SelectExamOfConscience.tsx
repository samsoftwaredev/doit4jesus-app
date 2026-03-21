import { Box, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';

import { useLanguageContext } from '@/context/LanguageContext';
import adultExamOfConscience from '@/data/adultExamOfConscience.json';
import childExamOfConscience from '@/data/childExamOfConscience.json';
import teenExamOfConscience from '@/data/teenExamOfConscience.json';
import adultPraying from '@/public/assets/images/art/adultPraying.jpeg';
import kidPraying from '@/public/assets/images/art/kidPraying.jpeg';
import teenPraying from '@/public/assets/images/art/teenPraying.jpeg';

const ExamCard = styled(Card)({
  borderRadius: '10px',
  transition: 'transform 300ms',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.01)',
  },
});

const ExamImage = styled(Image)({
  width: '100%',
  height: 'auto',
});

const ExamTitle = styled(Typography)({
  whiteSpace: 'nowrap',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const ExamDescription = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

interface Props {
  onExamSelected?: (exam: string) => void;
}

const SelectExamOfConscience = ({ onExamSelected }: Props) => {
  const { t } = useLanguageContext();
  const exams = [
    {
      type: 'adults',
      slug: 'adult',
      label: t.forAdults,
      value: adultExamOfConscience,
      image: adultPraying,
      description: t.forAdultsDescription,
    },

    {
      type: 'teens',
      slug: 'teen',
      label: t.forTeens,
      value: teenExamOfConscience,
      image: teenPraying,
      description: t.forTeensDescription,
    },
    {
      type: 'kids',
      slug: 'child',
      label: t.forKids,
      value: childExamOfConscience,
      image: kidPraying,
      description: t.forKidsDescription,
    },
  ];

  return (
    <>
      <Typography my={2} color="text.primary" variant="h5">
        {t.selectExamination}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {exams.map(({ type, slug, label, description, image }) => (
          <ExamCard
            key={type}
            sx={{ textDecoration: 'none' }}
            // @ts-expect-error MUI polymorphic component prop
            component={Link}
            href={`/app/confession/exam/${slug}`}
            onClick={onExamSelected ? () => onExamSelected(type) : undefined}
          >
            <ExamImage src={image} alt={label} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <ExamTitle variant="h5">{label}</ExamTitle>
                <ExamDescription variant="subtitle1">
                  {description}
                </ExamDescription>
              </CardContent>
            </Box>
          </ExamCard>
        ))}
      </Box>
    </>
  );
};

export default SelectExamOfConscience;
