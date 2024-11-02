import { Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

interface Props {
  title: string;
  description: string;
  onClick: MouseEventHandler<HTMLImageElement>;
  audioCover?: string | null;
  children?: React.ReactNode;
  controls?: React.ReactNode;
}

const AudioCover = ({
  title,
  description,
  onClick,
  audioCover = null,
  children = null,
  controls = null,
}: Props) => {
  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        flexDirection="column"
      >
        <Grid item textAlign="center">
          <Typography component="h5" color="primary">
            {description}
          </Typography>
        </Grid>
        {audioCover && (
          <div>
            <Image
              onClick={onClick}
              src={audioCover}
              alt="Rosary Audio Cover"
            />
          </div>
        )}
        <Grid item sx={{ minHeight: '300px', height: '100%', width: '90%' }}>
          {children}
        </Grid>
        <Grid textAlign="center" item>
          {controls}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AudioCover;
