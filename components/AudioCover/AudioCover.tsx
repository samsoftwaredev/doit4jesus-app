import { MouseEventHandler } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { Container } from "./AudioCover.style";
import { viewSize } from "@/interfaces/rosaryInterface";

interface Props {
  audioCover: string;
  title: string;
  description: string;
  onClick: MouseEventHandler<HTMLImageElement>;
  size?: viewSize;
  children?: React.ReactNode;
  controls?: React.ReactNode;
}

const AudioCover = ({
  audioCover,
  title,
  description,
  onClick,
  size = "md",
  children = null,
  controls = null,
}: Props) => {
  return (
    <Container size={size}>
      <Box className="rosary-header">
        <Typography className="rosary-title">{title}</Typography>
        <Typography className="rosary-description">{description}</Typography>
      </Box>
      <Image
        className="rosary-image"
        onClick={onClick}
        src={audioCover}
        alt="Rosary Audio Cover"
        sizes="100px"
      />
      {children && <Box className="rosary-content">{children}</Box>}
      <Box className="rosary-controls">{controls}</Box>
    </Container>
  );
};

export default AudioCover;
