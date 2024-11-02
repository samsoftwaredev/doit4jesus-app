import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import Image from 'next/image';

import adultExamOfConscience from '@/data/adultExamOfConscience.json';
import childExamOfConscience from '@/data/childExamOfConscience.json';
import teenExamOfConscience from '@/data/teenExamOfConscience.json';
import adultPraying from '@/public/assets/images/art/adultPraying.jpeg';
import kidPraying from '@/public/assets/images/art/kidPraying.jpeg';
import teenPraying from '@/public/assets/images/art/teenPraying.jpeg';

import styles from './SelectExamOfConscience.module.scss';

interface Props {
  onExamSelected: (exam: string) => void;
}

const SelectExamOfConscience = ({ onExamSelected }: Props) => {
  const exams = [
    {
      label: 'For Kids',
      value: childExamOfConscience,
      image: kidPraying,
      description:
        'This can assist children in developing a better understanding of themselves, their moral value, attitudes toward others and their relationship with God.',
    },
    {
      label: 'For Teens',
      value: teenExamOfConscience,
      image: teenPraying,
      description:
        'This examination enables teens to recognize and manage their emotions, actions, and attitudes as well as their personal relationship with the spiritual.',
    },
    {
      label: 'For Adults',
      value: adultExamOfConscience,
      image: adultPraying,
      description:
        'This exam encourages adults to question and analyze their thoughts and daily actions. This process promotes critical thinking skills, helping them approach situations with thoughtfulness, an analytical mindset, and faith.',
    },
  ];

  return (
    <>
      <Typography my={2} color="white" variant="h5">
        Select conscience examination:
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        className={styles.cardContainer}
      >
        {exams.map(({ label, description, image }) => (
          <Card
            key={label}
            sx={{ textDecoration: 'none' }}
            component={Link}
            onClick={() => onExamSelected(label)}
            className={styles.card}
          >
            <Image
              className={styles.image}
              src={image}
              alt="Mary holding the Holy Rosary"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography
                  component="div"
                  variant="h5"
                  className={styles.title}
                >
                  {label}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={styles.description}
                >
                  {description}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default SelectExamOfConscience;
