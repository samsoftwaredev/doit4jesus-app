import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

const Hero = () => {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Pray Every Day this Year
      </Typography>
      <Button variant="contained">
        <Link href="/app">Pray Rosary</Link>
      </Button>
    </Box>
  );
};

export default Hero;
