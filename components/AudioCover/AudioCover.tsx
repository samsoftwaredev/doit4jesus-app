import { MouseEventHandler } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { Container } from "./AudioCover.style";
import { INTERFACE_VIEW_SIZE } from "@/constants/interfaces";

interface Props {
  title: string;
  description: string;
  onClick: MouseEventHandler<HTMLImageElement>;
  audioCover?: string | null;
  size?: INTERFACE_VIEW_SIZE;
  children?: React.ReactNode;
  controls?: React.ReactNode;
}

const AudioCover = ({
  title,
  description,
  onClick,
  size = INTERFACE_VIEW_SIZE.MEDIUM,
  audioCover = null,
  children = null,
  controls = null,
}: Props) => {
  return (
    <Container size={size}>
      <Box className="rosary-header">
        <Typography className="rosary-title">{title}</Typography>
        <Typography className="rosary-description">{description}</Typography>
      </Box>
      {audioCover && (
        <Image
          className="rosary-image"
          onClick={onClick}
          src={audioCover}
          alt="Rosary Audio Cover"
          sizes="100px"
        />
      )}
      {children && <Box className="rosary-content">{children}</Box>}
      <Box className="rosary-controls">{controls}</Box>
    </Container>
  );
};

export default AudioCover;
